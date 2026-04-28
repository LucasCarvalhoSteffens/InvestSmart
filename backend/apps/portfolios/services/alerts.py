from dataclasses import dataclass
from datetime import timedelta
from decimal import Decimal

from django.db import transaction
from django.utils import timezone

from apps.assets.services.yahoo_finance import (
    MarketDataUnavailable,
    sync_asset_from_yahoo,
)
from apps.portfolios.models import PortfolioAlertEvent, PortfolioItem
from apps.valuation.models import BarsiAnalysis, ProjectedAnalysis


@dataclass(frozen=True)
class AlertExecutionSummary:
    checked_items: int
    created_events: int
    skipped_items: int
    failed_updates: int


class PortfolioAlertService:
    def __init__(
        self,
        *,
        force_refresh: bool = True,
        cooldown_hours: int = 24,
        portfolio_id: int | None = None,
    ):
        self.force_refresh = force_refresh
        self.cooldown_hours = cooldown_hours
        self.portfolio_id = portfolio_id

    def run(self) -> AlertExecutionSummary:
        items = self._get_items()
        created_events = 0
        skipped_items = 0
        failed_updates = 0

        for item in items:
            if self.force_refresh:
                try:
                    sync_asset_from_yahoo(item.asset.ticker, force_refresh=True)
                    item.asset.refresh_from_db()
                except MarketDataUnavailable:
                    failed_updates += 1
                    continue

            target_data = self._resolve_price_ceiling(item)

            if target_data["price_ceiling"] is None:
                skipped_items += 1
                continue

            event = self._evaluate_item(
                item=item,
                price_ceiling=target_data["price_ceiling"],
                price_ceiling_source=target_data["price_ceiling_source"],
            )

            if event is not None:
                created_events += 1

        return AlertExecutionSummary(
            checked_items=len(items),
            created_events=created_events,
            skipped_items=skipped_items,
            failed_updates=failed_updates,
        )

    def _get_items(self):
        queryset = (
            PortfolioItem.objects.select_related(
                "portfolio",
                "portfolio__user",
                "asset",
            )
            .filter(portfolio__user__is_active=True)
            .order_by("portfolio_id", "asset__ticker")
        )

        if self.portfolio_id is not None:
            queryset = queryset.filter(portfolio_id=self.portfolio_id)

        return list(queryset)

    def _resolve_price_ceiling(self, item: PortfolioItem) -> dict:
        if item.target_price is not None:
            return {
                "price_ceiling": item.target_price,
                "price_ceiling_source": "manual",
            }

        projected = (
            ProjectedAnalysis.objects.filter(asset=item.asset)
            .order_by("-created_at")
            .first()
        )

        if projected is not None:
            return {
                "price_ceiling": projected.price_ceiling,
                "price_ceiling_source": "projected",
            }

        barsi = (
            BarsiAnalysis.objects.filter(asset=item.asset)
            .order_by("-created_at")
            .first()
        )

        if barsi is not None:
            return {
                "price_ceiling": barsi.price_ceiling,
                "price_ceiling_source": "barsi",
            }

        return {
            "price_ceiling": None,
            "price_ceiling_source": "",
        }

    @transaction.atomic
    def _evaluate_item(
        self,
        *,
        item: PortfolioItem,
        price_ceiling: Decimal,
        price_ceiling_source: str,
    ) -> PortfolioAlertEvent | None:
        current_price = item.asset.current_price

        if current_price <= price_ceiling:
            event_type = PortfolioAlertEvent.EventType.BELOW_OR_EQUAL_CEILING
            message = (
                f"{item.asset.ticker} está em R$ {current_price}, "
                f"abaixo ou igual ao preço teto de R$ {price_ceiling}. "
                "Pode ser uma oportunidade dentro dos critérios definidos."
            )
        else:
            event_type = PortfolioAlertEvent.EventType.ABOVE_CEILING
            message = (
                f"{item.asset.ticker} está em R$ {current_price}, "
                f"acima do preço teto de R$ {price_ceiling}. "
                "O ativo está fora da margem de segurança definida."
            )

        if self._has_recent_event(
            item=item,
            event_type=event_type,
            price_ceiling=price_ceiling,
        ):
            return None

        return PortfolioAlertEvent.objects.create(
            portfolio_item=item,
            event_type=event_type,
            current_price=current_price,
            price_ceiling=price_ceiling,
            price_ceiling_source=price_ceiling_source,
            message=message,
        )

    def _has_recent_event(
        self,
        *,
        item: PortfolioItem,
        event_type: str,
        price_ceiling: Decimal,
    ) -> bool:
        since = timezone.now() - timedelta(hours=self.cooldown_hours)

        return PortfolioAlertEvent.objects.filter(
            portfolio_item=item,
            event_type=event_type,
            price_ceiling=price_ceiling,
            created_at__gte=since,
        ).exists()