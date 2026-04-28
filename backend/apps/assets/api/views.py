from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from apps.assets.api.serializers import AssetSerializer, AssetSyncSerializer
from apps.assets.models import Asset
from apps.assets.services.yahoo_finance import (
    MarketDataUnavailable,
    sync_asset_from_yahoo,
)
from apps.assets.services.yahoo_search import search_assets


class AssetViewSet(ModelViewSet):
    queryset = Asset.objects.prefetch_related("dividends").all().order_by("ticker")
    serializer_class = AssetSerializer

    @action(detail=False, methods=["get"], url_path="search")
    def search(self, request):
        query = request.query_params.get("q", "").strip()

        if len(query) < 2:
            return Response([])

        results = search_assets(query=query, limit=10)

        return Response(results)

    @action(detail=False, methods=["post"], url_path="sync")
    def sync(self, request):
        serializer = AssetSyncSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            market_data = sync_asset_from_yahoo(
                ticker=serializer.validated_data["ticker"],
                force_refresh=serializer.validated_data["force_refresh"],
            )
        except MarketDataUnavailable as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        output = self.get_serializer(market_data.asset)

        return Response(output.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"], url_path="refresh")
    def refresh(self, request, pk=None):
        asset = self.get_object()

        try:
            market_data = sync_asset_from_yahoo(
                ticker=asset.ticker,
                force_refresh=True,
            )
        except MarketDataUnavailable as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        output = self.get_serializer(market_data.asset)

        return Response(output.data, status=status.HTTP_200_OK)