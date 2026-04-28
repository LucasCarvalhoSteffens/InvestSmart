from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

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


def get_required_value(input_value, api_value, field_name):
    value = input_value if input_value is not None else api_value

    if value is None:
        raise ValueError(
            f"Não foi possível obter {field_name} pela API. "
            f"Informe esse campo manualmente."
        )

    return value


def get_market_data(ticker, persist=False, force_refresh=False):
    if persist:
        market_data = sync_asset_from_yahoo(
            ticker=ticker,
            force_refresh=force_refresh,
        )

        return {
            "asset": market_data.asset,
            "ticker": market_data.ticker,
            "name": market_data.name,
            "sector": market_data.sector,
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

    return {
        "asset": None,
        "ticker": data["ticker"],
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
        "dividends_last_12_months": data["dividends_last_12_months"],
        "persisted": False,
    }


def build_source_data(data):
    return {
        "provider": "Yahoo Finance / yfinance",
        "ticker": data["ticker"],
        "currency": data["currency"],
        "persisted": data["persisted"],
    }


class GrahamCalculationAPIView(APIView):
    def post(self, request):
        serializer = GrahamInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validated_data = serializer.validated_data
        persist = validated_data.get("persist", False)

        try:
            market_data = get_market_data(
                ticker=validated_data["ticker"],
                persist=persist,
                force_refresh=validated_data.get("force_refresh", False),
            )

            lpa = get_required_value(
                input_value=validated_data.get("lpa"),
                api_value=market_data.get("lpa"),
                field_name="LPA",
            )
            vpa = get_required_value(
                input_value=validated_data.get("vpa"),
                api_value=market_data.get("vpa"),
                field_name="VPA",
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
            analysis = GrahamAnalysis.objects.create(
                asset=market_data["asset"],
                lpa=lpa,
                vpa=vpa,
                fair_price=fair_price,
            )

            analysis_id = analysis.id
            created_at = analysis.created_at

        return Response(
            {
                "id": analysis_id,
                "asset": market_data["ticker"],
                "asset_name": market_data["name"],
                "current_price": market_data["current_price"],
                "lpa": lpa,
                "vpa": vpa,
                "fair_price": fair_price,
                "persisted": persist,
                "source": build_source_data(market_data),
                "created_at": created_at,
            },
            status=status.HTTP_200_OK,
        )


class ProjectedCalculationAPIView(APIView):
    def post(self, request):
        serializer = ProjectedInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validated_data = serializer.validated_data
        persist = validated_data.get("persist", False)

        try:
            market_data = get_market_data(
                ticker=validated_data["ticker"],
                persist=persist,
                force_refresh=validated_data.get("force_refresh", False),
            )

            dpa = get_required_value(
                input_value=validated_data.get("dpa"),
                api_value=market_data.get("annual_dividend"),
                field_name="DPA/dividendo anual por ação",
            )
            average_dividend_yield = get_required_value(
                input_value=validated_data.get("average_dividend_yield"),
                api_value=market_data.get("dividend_yield"),
                field_name="dividend yield médio",
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
            analysis = ProjectedAnalysis.objects.create(
                asset=market_data["asset"],
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
                "asset": market_data["ticker"],
                "asset_name": market_data["name"],
                "current_price": market_data["current_price"],
                "dpa": dpa,
                "average_dividend_yield": average_dividend_yield,
                "raw_price": result["raw_price"],
                "price_ceiling": result["price_ceiling"],
                "persisted": persist,
                "source": build_source_data(market_data),
                "created_at": created_at,
            },
            status=status.HTTP_200_OK,
        )


class BarsiCalculationAPIView(APIView):
    def post(self, request):
        serializer = BarsiInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validated_data = serializer.validated_data
        persist = validated_data.get("persist", False)

        try:
            market_data = get_market_data(
                ticker=validated_data["ticker"],
                persist=persist,
                force_refresh=validated_data.get("force_refresh", False),
            )

            dividends = validated_data.get("dividends")

            if not dividends:
                dividends = [
                    dividend["value"]
                    for dividend in market_data.get("dividends_last_12_months", [])
                ]

            if not dividends and market_data.get("annual_dividend") is not None:
                dividends = [market_data["annual_dividend"]]

            if not dividends:
                raise ValueError(
                    "Não foi possível obter dividendos dos últimos 12 meses pela API. "
                    "Informe os dividendos manualmente."
                )

            current_price = (
                validated_data.get("current_price")
                or market_data["current_price"]
            )

            result = BarsiCalculator(
                dividends_last_12_months=dividends,
                current_price=current_price,
                target_yield=validated_data["target_yield"],
            ).calculate()

        except (ValueError, MarketDataUnavailable) as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        analysis_id = None
        created_at = None

        if persist:
            analysis = BarsiAnalysis.objects.create(
                asset=market_data["asset"],
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
                "asset": market_data["ticker"],
                "asset_name": market_data["name"],
                "annual_dividend": result["annual_dividend"],
                "current_price": result["current_price"],
                "target_yield": result["target_dividend_yield"],
                "price_ceiling": result["price_ceiling"],
                "margin": result["margin"],
                "opportunity": result["opportunity"],
                "persisted": persist,
                "source": build_source_data(market_data),
                "created_at": created_at,
            },
            status=status.HTTP_200_OK,
        )