from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase

from apps.assets.models import Asset
from apps.portfolios.models import Portfolio, PortfolioItem, PortfolioItemAlert

User = get_user_model()


class PortfolioModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="lucas", password="12345678")
        self.asset = Asset.objects.create(
            ticker="WEGE3",
            name="WEG",
            sector="Industrial",
            current_price=Decimal("60.00"),
        )
        self.portfolio = Portfolio.objects.create(
            user=self.user,
            name="Dividendos",
            description="Carteira principal",
        )

    def test_portfolio_str(self):
        self.assertEqual(str(self.portfolio), "lucas - Dividendos")

    def test_portfolio_item_calculated_fields(self):
        item = PortfolioItem.objects.create(
            portfolio=self.portfolio,
            asset=self.asset,
            quantity=10,
            average_price=Decimal("50.00"),
            target_price=Decimal("58.00"),
        )

        self.assertEqual(str(item), "Dividendos - WEGE3")
        self.assertEqual(item.invested_amount, Decimal("500.00"))
        self.assertEqual(item.current_value, Decimal("600.00"))
        self.assertEqual(item.unrealized_gain, Decimal("100.00"))
        self.assertEqual(item.unrealized_gain_pct, Decimal("20.00"))
        self.assertFalse(item.is_below_target)
        self.assertEqual(item.distance_to_target, Decimal("-2.00"))

    def test_portfolio_totals(self):
        PortfolioItem.objects.create(
            portfolio=self.portfolio,
            asset=self.asset,
            quantity=10,
            average_price=Decimal("50.00"),
        )

        self.assertEqual(self.portfolio.total_items, 1)
        self.assertEqual(self.portfolio.total_invested, Decimal("500.00"))
        self.assertEqual(self.portfolio.total_current_value, Decimal("600.00"))
        self.assertEqual(self.portfolio.total_unrealized_gain, Decimal("100.00"))
        self.assertEqual(self.portfolio.total_unrealized_gain_pct, Decimal("20.00"))

    def test_alert_trigger_logic(self):
        item = PortfolioItem.objects.create(
            portfolio=self.portfolio,
            asset=self.asset,
            quantity=5,
            average_price=Decimal("45.00"),
        )

        alert = PortfolioItemAlert.objects.create(
            portfolio_item=item,
            alert_type=PortfolioItemAlert.AlertType.ABOVE_OR_EQUAL,
            threshold_price=Decimal("59.00"),
        )

        self.assertTrue(alert.should_trigger)
        self.assertEqual(str(alert), "WEGE3 - Preço maior ou igual - 59.00")

    def test_empty_portfolio_totals_are_zero(self):
        empty_portfolio = Portfolio.objects.create(
            user=self.user,
            name="Carteira Vazia",
            description="Sem itens",
        )

        self.assertEqual(empty_portfolio.total_items, 0)
        self.assertEqual(empty_portfolio.total_invested, Decimal("0.00"))
        self.assertEqual(empty_portfolio.total_current_value, Decimal("0.00"))
        self.assertEqual(empty_portfolio.total_unrealized_gain, Decimal("0.00"))
        self.assertEqual(empty_portfolio.total_unrealized_gain_pct, Decimal("0.00"))

    def test_portfolio_item_without_target_price_returns_false_and_none(self):
        item = PortfolioItem.objects.create(
            portfolio=self.portfolio,
            asset=self.asset,
            quantity=8,
            average_price=Decimal("52.00"),
            target_price=None,
        )

        self.assertFalse(item.is_below_target)
        self.assertIsNone(item.distance_to_target)

    def test_alert_below_or_equal_trigger_logic(self):
        item = PortfolioItem.objects.create(
            portfolio=self.portfolio,
            asset=self.asset,
            quantity=5,
            average_price=Decimal("45.00"),
        )

        alert = PortfolioItemAlert.objects.create(
            portfolio_item=item,
            alert_type=PortfolioItemAlert.AlertType.BELOW_OR_EQUAL,
            threshold_price=Decimal("61.00"),
        )

        self.assertTrue(alert.should_trigger)

    def test_inactive_alert_does_not_trigger(self):
        item = PortfolioItem.objects.create(
            portfolio=self.portfolio,
            asset=self.asset,
            quantity=5,
            average_price=Decimal("45.00"),
        )

        alert = PortfolioItemAlert.objects.create(
            portfolio_item=item,
            alert_type=PortfolioItemAlert.AlertType.ABOVE_OR_EQUAL,
            threshold_price=Decimal("59.00"),
            is_active=False,
        )

        self.assertFalse(alert.should_trigger)