from dataclasses import dataclass
from datetime import timedelta
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP
from time import sleep

import yfinance as yf
from django.utils import timezone

from apps.assets.models import Asset, Dividend


MONEY_QUANTIZER = Decimal("0.01")
DECIMAL_QUANTIZER = Decimal("0.0001")
YIELD_QUANTIZER = Decimal("0.000001")
CACHE_MINUTES = 15
MAX_ATTEMPTS = 3


class MarketDataUnavailable(Exception):
    pass


@dataclass(frozen=True)
class MarketAssetData:
    asset: Asset
    ticker: str
    name: str
    sector: str
    current_price: Decimal
    currency: str
    lpa: Decimal | None
    vpa: Decimal | None
    annual_dividend: Decimal | None
    dividend_yield: Decimal | None
    payout_ratio: Decimal | None
    shares_outstanding: int | None
    dividends_last_12_months: list[dict]


def normalize_ticker(ticker: str) -> str:
    normalized = ticker.strip().upper()

    if not normalized:
        raise MarketDataUnavailable("Ticker não informado.")

    # Padrão B3 no Yahoo Finance: PETR4.SA, BBAS3.SA, TAEE11.SA
    if "." not in normalized and normalized[-1].isdigit():
        normalized = f"{normalized}.SA"

    return normalized


def decimal_or_none(value, quantizer=DECIMAL_QUANTIZER):
    if value is None:
        return None

    try:
        if value != value:
            return None

        return Decimal(str(value)).quantize(quantizer, rounding=ROUND_HALF_UP)
    except (InvalidOperation, TypeError, ValueError):
        return None


def normalize_yield(value):
    result = decimal_or_none(value, YIELD_QUANTIZER)

    if result is None:
        return None

    # Algumas fontes retornam 6 para 6%, outras retornam 0.06.
    if result > 1:
        result = result / Decimal("100")

    return result.quantize(YIELD_QUANTIZER, rounding=ROUND_HALF_UP)


def get_info(ticker_obj):
    try:
        return ticker_obj.get_info() or {}
    except Exception:
        try:
            return ticker_obj.info or {}
        except Exception:
            return {}


def get_fast_info(ticker_obj):
    try:
        return dict(ticker_obj.fast_info or {})
    except Exception:
        return {}


def get_current_price(ticker_obj, info):
    fast_info = get_fast_info(ticker_obj)

    candidates = [
        fast_info.get("last_price"),
        fast_info.get("lastPrice"),
        info.get("currentPrice"),
        info.get("regularMarketPrice"),
        info.get("previousClose"),
    ]

    for candidate in candidates:
        price = decimal_or_none(candidate, MONEY_QUANTIZER)
        if price is not None and price > 0:
            return price

    try:
        history = ticker_obj.history(period="5d", interval="1d")
        if history is not None and not history.empty:
            close = history["Close"].dropna().iloc[-1]
            price = decimal_or_none(close, MONEY_QUANTIZER)
            if price is not None and price > 0:
                return price
    except Exception:
        pass

    return None


def get_dividends_last_12_months(ticker_obj):
    try:
        dividends = ticker_obj.dividends
    except Exception:
        return []

    if dividends is None or dividends.empty:
        return []

    today = timezone.now().date()
    start_date = today - timedelta(days=365)

    result = []

    for index, value in dividends.items():
        payment_date = index.date() if hasattr(index, "date") else index

        if payment_date < start_date:
            continue

        dividend_value = decimal_or_none(value, DECIMAL_QUANTIZER)

        if dividend_value is not None and dividend_value > 0:
            result.append(
                {
                    "payment_date": payment_date,
                    "value": dividend_value,
                }
            )

    return result


def calculate_annual_dividend(dividends_last_12_months):
    total = sum(
        (item["value"] for item in dividends_last_12_months),
        Decimal("0.0000"),
    )

    if total <= 0:
        return None

    return total.quantize(DECIMAL_QUANTIZER, rounding=ROUND_HALF_UP)


def get_cached_market_data(asset: Asset) -> MarketAssetData:
    dividends = [
        {
            "payment_date": dividend.payment_date,
            "value": dividend.value,
        }
        for dividend in asset.dividends.all()
    ]

    return MarketAssetData(
        asset=asset,
        ticker=asset.ticker,
        name=asset.name,
        sector=asset.sector,
        current_price=asset.current_price,
        currency=asset.currency,
        lpa=asset.lpa,
        vpa=asset.vpa,
        annual_dividend=asset.annual_dividend,
        dividend_yield=asset.dividend_yield,
        payout_ratio=asset.payout_ratio,
        shares_outstanding=asset.shares_outstanding,
        dividends_last_12_months=dividends,
    )


def should_use_cache(asset: Asset | None, force_refresh: bool) -> bool:
    if force_refresh or asset is None or asset.last_sync_at is None:
        return False

    cache_limit = timezone.now() - timedelta(minutes=CACHE_MINUTES)
    return asset.last_sync_at >= cache_limit


def fetch_from_yahoo(ticker: str) -> dict:
    normalized_ticker = normalize_ticker(ticker)
    last_error = None

    for attempt in range(1, MAX_ATTEMPTS + 1):
        try:
            ticker_obj = yf.Ticker(normalized_ticker)
            info = get_info(ticker_obj)
            current_price = get_current_price(ticker_obj, info)

            if current_price is None:
                raise MarketDataUnavailable(
                    f"Não foi possível obter cotação para {normalized_ticker}."
                )

            dividends = get_dividends_last_12_months(ticker_obj)
            annual_dividend = calculate_annual_dividend(dividends)

            dividend_yield = normalize_yield(info.get("dividendYield"))

            if dividend_yield is None and annual_dividend and current_price > 0:
                dividend_yield = (annual_dividend / current_price).quantize(
                    YIELD_QUANTIZER,
                    rounding=ROUND_HALF_UP,
                )

            return {
                "ticker": normalized_ticker,
                "name": info.get("longName")
                or info.get("shortName")
                or normalized_ticker,
                "sector": info.get("sector") or "Não informado",
                "current_price": current_price,
                "currency": info.get("currency") or "BRL",
                "lpa": decimal_or_none(info.get("trailingEps"), DECIMAL_QUANTIZER),
                "vpa": decimal_or_none(info.get("bookValue"), DECIMAL_QUANTIZER),
                "annual_dividend": annual_dividend,
                "dividend_yield": dividend_yield,
                "payout_ratio": normalize_yield(info.get("payoutRatio")),
                "shares_outstanding": info.get("sharesOutstanding"),
                "dividends_last_12_months": dividends,
            }
        except Exception as exc:
            last_error = exc

            if attempt < MAX_ATTEMPTS:
                sleep(2 + attempt)

    raise MarketDataUnavailable(
        f"Falha ao consultar dados do Yahoo Finance para {normalized_ticker}: {last_error}"
    )


def sync_asset_from_yahoo(ticker: str, force_refresh: bool = False) -> MarketAssetData:
    normalized_ticker = normalize_ticker(ticker)
    asset = Asset.objects.filter(ticker=normalized_ticker).first()

    if should_use_cache(asset, force_refresh):
        return get_cached_market_data(asset)

    data = fetch_from_yahoo(normalized_ticker)

    asset, _ = Asset.objects.update_or_create(
        ticker=data["ticker"],
        defaults={
            "name": data["name"],
            "sector": data["sector"],
            "current_price": data["current_price"],
            "currency": data["currency"],
            "lpa": data["lpa"],
            "vpa": data["vpa"],
            "annual_dividend": data["annual_dividend"],
            "dividend_yield": data["dividend_yield"],
            "payout_ratio": data["payout_ratio"],
            "shares_outstanding": data["shares_outstanding"],
            "data_source": "yfinance",
            "last_sync_at": timezone.now(),
        },
    )

    for dividend in data["dividends_last_12_months"]:
        Dividend.objects.update_or_create(
            asset=asset,
            payment_date=dividend["payment_date"],
            defaults={
                "value": dividend["value"],
            },
        )

    return get_cached_market_data(asset)