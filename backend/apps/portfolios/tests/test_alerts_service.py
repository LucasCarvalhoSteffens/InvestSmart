from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase

from apps.assets.models import Asset
from apps.portfolios.models import (
    Portfolio,
    PortfolioAlertEvent,
    PortfolioItem,
)
from apps.portfolios.services.alerts import PortfolioAlertService
from apps.valuation.models import BarsiAnalysis, ProjectedAnalysis

User = get_user_model()


class PortfolioAlertServiceTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="lucas",
            email="lucas@email.com",
            password="12345678",
        )

        self.portfolio = Portfolio.objects.create(
            user=self.user,
            name="Carteira Principal",
        )

        self.asset = Asset.objects.create(
            ticker="BBAS3.SA",
            name="Banco do Brasil",
            sector="Financeiro",
            current_price=Decimal("27.50"),
        )

        self.item = PortfolioItem.objects.create(
            portfolio=self.portfolio,
            asset=self.asset,
            quantity=10,
            average_price=Decimal("24.00"),
        )

    def test_should_create_alert_when_price_is_below_or_equal_ceiling(self):
        ProjectedAnalysis.objects.create(
            asset=self.asset,
            dpa=Decimal("2.4000"),
            average_dividend_yield=Decimal("0.0800"),
            raw_price=Decimal("30.00"),
            price_ceiling=Decimal("29.60"),
        )

        summary = PortfolioAlertService(force_refresh=False).run()

        self.assertEqual(summary.checked_items, 1)
        self.assertEqual(summary.created_events, 1)

        event = PortfolioAlertEvent.objects.first()

        self.assertEqual(
            event.event_type,
            PortfolioAlertEvent.EventType.BELOW_OR_EQUAL_CEILING,
        )
        self.assertEqual(event.current_price, Decimal("27.50"))
        self.assertEqual(event.price_ceiling, Decimal("29.60"))
        self.assertEqual(event.price_ceiling_source, "projected")
        self.assertFalse(event.is_read)

    def test_should_create_alert_when_price_is_above_ceiling(self):
        BarsiAnalysis.objects.create(
            asset=self.asset,
            annual_dividend=Decimal("1.5000"),
            current_price=Decimal("27.50"),
            target_yield=Decimal("0.0600"),
            price_ceiling=Decimal("25.00"),
            margin=Decimal("-2.50"),
            opportunity=False,
        )

        summary = PortfolioAlertService(force_refresh=False).run()

        self.assertEqual(summary.created_events, 1)

        event = PortfolioAlertEvent.objects.first()

        self.assertEqual(
            event.event_type,
            PortfolioAlertEvent.EventType.ABOVE_CEILING,
        )
        self.assertEqual(event.current_price, Decimal("27.50"))
        self.assertEqual(event.price_ceiling, Decimal("25.00"))
        self.assertEqual(event.price_ceiling_source, "barsi")

    def test_should_not_duplicate_alert_inside_cooldown_window(self):
        self.item.target_price = Decimal("30.00")
        self.item.save(update_fields=["target_price"])

        service = PortfolioAlertService(force_refresh=False, cooldown_hours=24)

        first_summary = service.run()
        second_summary = service.run()

        self.assertEqual(first_summary.created_events, 1)
        self.assertEqual(second_summary.created_events, 0)
        self.assertEqual(PortfolioAlertEvent.objects.count(), 1)

    def test_should_skip_item_without_price_ceiling(self):
        summary = PortfolioAlertService(force_refresh=False).run()

        self.assertEqual(summary.checked_items, 1)
        self.assertEqual(summary.created_events, 0)
        self.assertEqual(summary.skipped_items, 1)
        self.assertEqual(PortfolioAlertEvent.objects.count(), 0)