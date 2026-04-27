from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.assets.models import Asset
from apps.assets.services.yahoo_finance import (
    MarketDataUnavailable,
    fetch_from_yahoo,
    sync_asset_from_yahoo,
)
from apps.valuation.api.serializers import (
    BarsiInputSerializer,
    GrahamInputSerializer,
    ProjectedInputSerializer,
)
from apps.valuation.models import (
    BarsiAnalysis,
    GrahamAnalysis,
    ProjectedAnalysis,
)
from apps.valuation.services.barsi import BarsiCalculator
from apps.valuation.services.graham import calculate_graham_price
from apps.valuation.services.projected import calculate_projected_price


def get_required_value(input_value, market_value, field_name):
    value = input_value if input_value is not None else market_value

    if value is None:
        raise ValueError(
            f"Não foi possível obter {field_name} pela API. "
            f"Informe manualmente esse campo no payload."
        )

    return value


def build_source_data(data):
    return {
        "provider": "Yahoo Finance / yfinance",
        "ticker": data["ticker"],
        "data_source": "yfinance",
        "persisted": False,
    }


def get_market_data(ticker, persist=False, force_refresh=False):
    if persist:
        market_data = sync_asset_from_yahoo(
            ticker=ticker,
            force_refresh=force_refresh,
        )

        return {
            "asset": market_data.asset,
            "ticker": market_data.asset.ticker,
            "name": market_data.asset.name,
            "sector": market_data.asset.sector,
            "current_price": market_data.current_price,
            "currency": market_data.currency,
            "lpa": market_data.lpa,
            "vpa": market_data.vpa,
            "annual_dividend": market_data.annual_dividend,
            "dividend_yield": market_data.dividend_yield,
            "payout_ratio": market_data.payout_ratio,
            "shares_outstanding": market_data.shares_outstanding,
            "dividends_last_12_months": market_data.dividends_last_12_months,
            "persisted": True,
        }

    data = fetch_from_yahoo(ticker)
    data["asset"] = None
    data["persisted"] = False

    return data


def get_or_create_asset_if_needed(data, persist):
    if not persist:
        return None

    asset = data.get("asset")

    if asset is not None:
        return asset

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
        },
    )

    return asset


class GrahamCalculationAPIView(APIView):
    def post(self, request):
        serializer = GrahamInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        persist = serializer.validated_data["persist"]

        try:
            data = get_market_data(
                ticker=serializer.validated_data["ticker"],
                persist=persist,
                force_refresh=serializer.validated_data["force_refresh"],
            )

            lpa = get_required_value(
                serializer.validated_data.get("lpa"),
                data.get("lpa"),
                "LPA",
            )
            vpa = get_required_value(
                serializer.validated_data.get("vpa"),
                data.get("vpa"),
                "VPA",
            )

            fair_price = calculate_graham_price(lpa=lpa, vpa=vpa)

        except (ValueError, MarketDataUnavailable) as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        analysis_id = None
        created_at = None

        if persist:
            asset = get_or_create_asset_if_needed(data, persist=True)

            analysis = GrahamAnalysis.objects.create(
                asset=asset,
                lpa=lpa,
                vpa=vpa,
                fair_price=fair_price,
            )

            analysis_id = analysis.id
            created_at = analysis.created_at

        return Response(
            {
                "id": analysis_id,
                "asset": data["ticker"],
                "asset_name": data["name"],
                "lpa": lpa,
                "vpa": vpa,
                "fair_price": fair_price,
                "current_price": data["current_price"],
                "persisted": persist,
                "source": build_source_data(data),
                "created_at": created_at,
            },
            status=status.HTTP_200_OK,
        )


class ProjectedCalculationAPIView(APIView):
    def post(self, request):
        serializer = ProjectedInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        persist = serializer.validated_data["persist"]

        try:
            data = get_market_data(
                ticker=serializer.validated_data["ticker"],
                persist=persist,
                force_refresh=serializer.validated_data["force_refresh"],
            )

            dpa = get_required_value(
                serializer.validated_data.get("dpa"),
                data.get("annual_dividend"),
                "DPA/dividendo anual por ação",
            )
            average_dividend_yield = get_required_value(
                serializer.validated_data.get("average_dividend_yield"),
                data.get("dividend_yield"),
                "dividend yield médio",
            )

            result = calculate_projected_price(
                dpa=dpa,
                average_dividend_yield=average_dividend_yield,
            )

        except (ValueError, MarketDataUnavailable) as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        analysis_id = None
        created_at = None

        if persist:
            asset = get_or_create_asset_if_needed(data, persist=True)

            analysis = ProjectedAnalysis.objects.create(
                asset=asset,
                dpa=dpa,
                average_dividend_yield=average_dividend_yield,
                raw_price=result["raw_price"],
                price_ceiling=result["price_ceiling"],
            )

            analysis_id = analysis.id
            created_at = analysis.created_at

        return Response(
            {
                "id": analysis_id,
                "asset": data["ticker"],
                "asset_name": data["name"],
                "dpa": dpa,
                "average_dividend_yield": average_dividend_yield,
                "raw_price": result["raw_price"],
                "price_ceiling": result["price_ceiling"],
                "current_price": data["current_price"],
                "persisted": persist,
                "source": build_source_data(data),
                "created_at": created_at,
            },
            status=status.HTTP_200_OK,
        )


class BarsiCalculationAPIView(APIView):
    def post(self, request):
        serializer = BarsiInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        persist = serializer.validated_data["persist"]

        try:
            data = get_market_data(
                ticker=serializer.validated_data["ticker"],
                persist=persist,
                force_refresh=serializer.validated_data["force_refresh"],
            )

            dividends = serializer.validated_data.get("dividends")

            if not dividends:
                dividends = [
                    dividend["value"]
                    for dividend in data.get("dividends_last_12_months", [])
                ]

            if not dividends and data.get("annual_dividend"):
                dividends = [data["annual_dividend"]]

            if not dividends:
                raise ValueError(
                    "Não foi possível obter dividendos dos últimos 12 meses pela API. "
                    "Informe manualmente o campo dividends."
                )

            current_price = (
                serializer.validated_data.get("current_price")
                or data["current_price"]
            )

            result = BarsiCalculator(
                dividends_last_12_months=dividends,
                current_price=current_price,
                target_yield=serializer.validated_data["target_yield"],
            ).calculate()

        except (ValueError, MarketDataUnavailable) as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        analysis_id = None
        created_at = None

        if persist:
            asset = get_or_create_asset_if_needed(data, persist=True)

            analysis = BarsiAnalysis.objects.create(
                asset=asset,
                annual_dividend=result["annual_dividend"],
                current_price=result["current_price"],
                target_yield=result["target_dividend_yield"],
                price_ceiling=result["price_ceiling"],
                margin=result["margin"],
                opportunity=result["opportunity"],
            )

            analysis_id = analysis.id
            created_at = analysis.created_at

        return Response(
            {
                "id": analysis_id,
                "asset": data["ticker"],
                "asset_name": data["name"],
                "annual_dividend": result["annual_dividend"],
                "current_price": result["current_price"],
                "target_yield": result["target_dividend_yield"],
                "price_ceiling": result["price_ceiling"],
                "margin": result["margin"],
                "opportunity": result["opportunity"],
                "persisted": persist,
                "source": build_source_data(data),
                "created_at": created_at,
            },
            status=status.HTTP_200_OK,
        )