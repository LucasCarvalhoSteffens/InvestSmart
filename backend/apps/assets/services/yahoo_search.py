import yfinance as yf

from apps.assets.models import Asset


def normalize_query(query: str) -> str:
    return query.strip().upper()


def is_brazilian_stock(symbol: str) -> bool:
    return symbol.upper().endswith(".SA")


def build_asset_result(
    ticker: str,
    name: str = "",
    sector: str = "",
    source: str = "yfinance",
):
    return {
        "ticker": ticker,
        "name": name or ticker,
        "sector": sector or "Não informado",
        "source": source,
    }


def search_local_assets(query: str, limit: int = 5):
    assets = Asset.objects.filter(
        ticker__icontains=query
    ).order_by("ticker")[:limit]

    return [
        build_asset_result(
            ticker=asset.ticker,
            name=asset.name,
            sector=asset.sector,
            source="database",
        )
        for asset in assets
    ]


def search_yahoo_assets(query: str, limit: int = 10):
    normalized_query = normalize_query(query)

    if len(normalized_query) < 2:
        return []

    results = []

    try:
        search = yf.Search(
            normalized_query,
            max_results=limit,
            news_count=0,
        )

        quotes = search.quotes or []

        for quote in quotes:
            symbol = quote.get("symbol", "").upper()

            if not symbol:
                continue

            # Mantém foco em ações brasileiras da B3 no padrão Yahoo: PETR4.SA
            if not is_brazilian_stock(symbol):
                continue

            quote_type = quote.get("quoteType", "")

            if quote_type and quote_type.upper() not in ["EQUITY", "ETF"]:
                continue

            results.append(
                build_asset_result(
                    ticker=symbol,
                    name=quote.get("longname")
                    or quote.get("shortname")
                    or quote.get("name")
                    or symbol,
                    sector=quote.get("sector") or "Não informado",
                    source="yfinance",
                )
            )
    except Exception:
        return []

    return results


def search_assets(query: str, limit: int = 10):
    normalized_query = normalize_query(query)

    if len(normalized_query) < 2:
        return []

    local_results = search_local_assets(normalized_query, limit=5)
    yahoo_results = search_yahoo_assets(normalized_query, limit=limit)

    merged = []
    seen = set()

    for item in local_results + yahoo_results:
        ticker = item["ticker"]

        if ticker in seen:
            continue

        seen.add(ticker)
        merged.append(item)

        if len(merged) >= limit:
            break

    return merged