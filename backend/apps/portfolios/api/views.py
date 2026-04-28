from django.db.models import Prefetch
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin, UpdateModelMixin
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet, ModelViewSet

from apps.portfolios.api.serializers import (
    PortfolioAlertEventSerializer,
    PortfolioItemAlertSerializer,
    PortfolioItemSerializer,
    PortfolioSerializer,
)
from apps.portfolios.models import (
    Portfolio,
    PortfolioAlertEvent,
    PortfolioItem,
    PortfolioItemAlert,
)
from apps.portfolios.services.alerts import PortfolioAlertService
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
        data = PortfolioSimulationService(portfolio).simulate()
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
    
class PortfolioAlertEventViewSet(
    ListModelMixin,
    RetrieveModelMixin,
    UpdateModelMixin,
    GenericViewSet,
):
    serializer_class = PortfolioAlertEventSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "patch", "head", "options", "post"]

    def get_queryset(self):
        queryset = (
            PortfolioAlertEvent.objects.filter(
                portfolio_item__portfolio__user=self.request.user,
            )
            .select_related(
                "portfolio_item",
                "portfolio_item__portfolio",
                "portfolio_item__asset",
            )
            .order_by("-created_at")
        )

        portfolio_id = self.request.query_params.get("portfolio_id")
        is_read = self.request.query_params.get("is_read")

        if portfolio_id:
            queryset = queryset.filter(portfolio_item__portfolio_id=portfolio_id)

        if is_read in ["true", "false"]:
            queryset = queryset.filter(is_read=is_read == "true")

        return queryset

    @action(detail=False, methods=["post"], url_path="check")
    def check(self, request):
        portfolio_id = request.data.get("portfolio_id")
        cooldown_hours = int(request.data.get("cooldown_hours", 24))
        force_refresh = bool(request.data.get("force_refresh", True))

        if portfolio_id:
            allowed = Portfolio.objects.filter(
                id=portfolio_id,
                user=request.user,
            ).exists()

            if not allowed:
                return Response(
                    {"detail": "Carteira não encontrada."},
                    status=status.HTTP_404_NOT_FOUND,
                )

        summary = PortfolioAlertService(
            force_refresh=force_refresh,
            cooldown_hours=cooldown_hours,
            portfolio_id=portfolio_id,
        ).run()

        return Response(
            {
                "checked_items": summary.checked_items,
                "created_events": summary.created_events,
                "skipped_items": summary.skipped_items,
                "failed_updates": summary.failed_updates,
            },
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=["patch"], url_path="mark-as-read")
    def mark_as_read(self, request, pk=None):
        alert_event = self.get_object()
        alert_event.is_read = True
        alert_event.save(update_fields=["is_read"])

        serializer = self.get_serializer(alert_event)
        return Response(serializer.data)