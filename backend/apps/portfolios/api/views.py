from django.db.models import Prefetch
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from apps.portfolios.api.serializers import (
    PortfolioItemAlertSerializer,
    PortfolioItemSerializer,
    PortfolioSerializer,
)
from apps.portfolios.models import Portfolio, PortfolioItem, PortfolioItemAlert
from apps.portfolios.services.simulation import PortfolioSimulationService


class PortfolioViewSet(ModelViewSet):
    serializer_class = PortfolioSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        items_queryset = PortfolioItem.objects.select_related("asset").prefetch_related(
            "alerts"
        )
        return (
            Portfolio.objects.filter(user=self.request.user)
            .prefetch_related(Prefetch("items", queryset=items_queryset))
            .order_by("-updated_at", "name")
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["get"], url_path="simulation")
    def simulation(self, request, pk=None):
        portfolio = self.get_object()
        data = PortfolioSimulationService().simulate(portfolio)
        return Response(data)


class PortfolioItemViewSet(ModelViewSet):
    serializer_class = PortfolioItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = (
            PortfolioItem.objects.filter(portfolio__user=self.request.user)
            .select_related("portfolio", "asset")
            .prefetch_related("alerts")
            .order_by("portfolio__name", "asset__ticker")
        )
        portfolio_id = self.request.query_params.get("portfolio_id")
        if portfolio_id:
            queryset = queryset.filter(portfolio_id=portfolio_id)
        return queryset


class PortfolioItemAlertViewSet(ModelViewSet):
    serializer_class = PortfolioItemAlertSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = (
            PortfolioItemAlert.objects.filter(portfolio_item__portfolio__user=self.request.user)
            .select_related("portfolio_item", "portfolio_item__asset")
            .order_by("-created_at")
        )
        portfolio_item_id = self.request.query_params.get("portfolio_item_id")
        if portfolio_item_id:
            queryset = queryset.filter(portfolio_item_id=portfolio_item_id)

        portfolio_id = self.request.query_params.get("portfolio_id")
        if portfolio_id:
            queryset = queryset.filter(portfolio_item__portfolio_id=portfolio_id)

        return queryset