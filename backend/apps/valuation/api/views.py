from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

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


class GrahamCalculationAPIView(APIView):
    def post(self, request):
        serializer = GrahamInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        asset = serializer.validated_data["asset"]

        try:
            fair_price = calculate_graham_price(
                lpa=serializer.validated_data["lpa"],
                vpa=serializer.validated_data["vpa"],
            )
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        analysis = GrahamAnalysis.objects.create(
            asset=asset,
            lpa=serializer.validated_data["lpa"],
            vpa=serializer.validated_data["vpa"],
            fair_price=fair_price,
        )

        return Response(
            {
                "id": analysis.id,
                "asset": asset.ticker,
                "lpa": analysis.lpa,
                "vpa": analysis.vpa,
                "fair_price": analysis.fair_price,
                "created_at": analysis.created_at,
            },
            status=status.HTTP_201_CREATED,
        )


class ProjectedCalculationAPIView(APIView):
    def post(self, request):
        serializer = ProjectedInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        asset = serializer.validated_data["asset"]

        try:
            result = calculate_projected_price(
                dpa=serializer.validated_data["dpa"],
                average_dividend_yield=serializer.validated_data["average_dividend_yield"],
            )
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        analysis = ProjectedAnalysis.objects.create(
            asset=asset,
            dpa=serializer.validated_data["dpa"],
            average_dividend_yield=serializer.validated_data["average_dividend_yield"],
            raw_price=result["raw_price"],
            price_ceiling=result["price_ceiling"],
        )

        return Response(
            {
                "id": analysis.id,
                "asset": asset.ticker,
                "dpa": analysis.dpa,
                "average_dividend_yield": analysis.average_dividend_yield,
                "raw_price": analysis.raw_price,
                "price_ceiling": analysis.price_ceiling,
                "created_at": analysis.created_at,
            },
            status=status.HTTP_201_CREATED,
        )


class BarsiCalculationAPIView(APIView):
    def post(self, request):
        serializer = BarsiInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        asset = serializer.validated_data["asset"]

        dividends = [
            serializer.validated_data["dividend_1"],
            serializer.validated_data["dividend_2"],
            serializer.validated_data["dividend_3"],
            serializer.validated_data["dividend_4"],
        ]

        try:
            result = BarsiCalculator(
                dividends_last_12_months=dividends,
                current_price=serializer.validated_data["current_price"],
                target_yield=serializer.validated_data["target_yield"],
            ).calculate()
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        analysis = BarsiAnalysis.objects.create(
            asset=asset,
            annual_dividend=result["annual_dividend"],
            current_price=result["current_price"],
            target_yield=result["target_dividend_yield"],
            price_ceiling=result["price_ceiling"],
            margin=result["margin"],
            opportunity=result["opportunity"],
        )

        return Response(
            {
                "id": analysis.id,
                "asset": asset.ticker,
                "annual_dividend": analysis.annual_dividend,
                "current_price": analysis.current_price,
                "target_yield": analysis.target_yield,
                "price_ceiling": analysis.price_ceiling,
                "margin": analysis.margin,
                "opportunity": analysis.opportunity,
                "created_at": analysis.created_at,
            },
            status=status.HTTP_201_CREATED,
        )