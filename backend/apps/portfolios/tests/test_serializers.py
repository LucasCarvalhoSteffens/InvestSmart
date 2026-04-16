from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIRequestFactory

from apps.assets.models import Asset
from apps.portfolios.api.serializers import (
    PortfolioItemAlertSerializer,
    PortfolioItemSerializer,
    PortfolioSerializer,
)
from apps.portfolios.models import Portfolio, PortfolioItem, PortfolioItemAlert

User = get_user_model()


class PortfolioSerializerTests(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()

        self.user = User.objects.create_user(
            username="lucas",
            password="12345678",
            email="lucas@email.com",
        )
        self.other_user = User.objects.create_user(
            username="maria",
            password="12345678",
            email="maria@email.com",
        )

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
        self.other_portfolio = Portfolio.objects.create(
            user=self.other_user,
            name="Outra carteira",
            description="Carteira da Maria",
        )

    def make_request(self, user):
        request = self.factory.get("/fake-url/")
        request.user = user
        return request

    def test_portfolio_serializer_trims_name(self):
        serializer = PortfolioSerializer(
            data={
                "name": "  Nova carteira  ",
                "description": "Teste",
            },
            context={"request": self.make_request(self.user)},
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertEqual(serializer.validated_data["name"], "Nova carteira")

    def test_portfolio_serializer_rejects_blank_name(self):
        serializer = PortfolioSerializer(
            data={
                "name": "   ",
                "description": "Teste",
            },
            context={"request": self.make_request(self.user)},
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("name", serializer.errors)

    def test_portfolio_serializer_rejects_duplicate_name_for_same_user(self):
        serializer = PortfolioSerializer(
            data={
                "name": "Dividendos",
                "description": "Duplicada",
            },
            context={"request": self.make_request(self.user)},
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("name", serializer.errors)

    def test_portfolio_serializer_allows_update_same_instance(self):
        serializer = PortfolioSerializer(
            instance=self.portfolio,
            data={
                "name": "Dividendos",
                "description": "Descrição atualizada",
            },
            context={"request": self.make_request(self.user)},
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_portfolio_item_serializer_limits_portfolio_queryset_to_authenticated_user(self):
        serializer = PortfolioItemSerializer(
            context={"request": self.make_request(self.user)}
        )

        portfolio_ids = list(
            serializer.fields["portfolio"].queryset.values_list("id", flat=True)
        )

        self.assertIn(self.portfolio.id, portfolio_ids)
        self.assertNotIn(self.other_portfolio.id, portfolio_ids)

    def test_portfolio_item_serializer_rejects_quantity_less_or_equal_zero(self):
        serializer = PortfolioItemSerializer(
            data={
                "portfolio": self.portfolio.id,
                "asset": self.asset.id,
                "quantity": 0,
                "average_price": "10.00",
                "target_price": "12.00",
                "notes": "",
            },
            context={"request": self.make_request(self.user)},
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("quantity", serializer.errors)

    def test_portfolio_item_serializer_rejects_average_price_less_or_equal_zero(self):
        serializer = PortfolioItemSerializer(
            data={
                "portfolio": self.portfolio.id,
                "asset": self.asset.id,
                "quantity": 10,
                "average_price": "0.00",
                "target_price": "12.00",
                "notes": "",
            },
            context={"request": self.make_request(self.user)},
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("average_price", serializer.errors)

    def test_portfolio_item_serializer_rejects_target_price_less_or_equal_zero(self):
        serializer = PortfolioItemSerializer(
            data={
                "portfolio": self.portfolio.id,
                "asset": self.asset.id,
                "quantity": 10,
                "average_price": "10.00",
                "target_price": "0.00",
                "notes": "",
            },
            context={"request": self.make_request(self.user)},
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("target_price", serializer.errors)

    def test_portfolio_item_serializer_allows_update_same_instance(self):
        item = PortfolioItem.objects.create(
            portfolio=self.portfolio,
            asset=self.asset,
            quantity=10,
            average_price=Decimal("50.00"),
            target_price=Decimal("58.00"),
        )

        serializer = PortfolioItemSerializer(
            instance=item,
            data={
                "portfolio": self.portfolio.id,
                "asset": self.asset.id,
                "quantity": 20,
                "average_price": "51.00",
                "target_price": "59.00",
                "notes": "Atualizado",
            },
            context={"request": self.make_request(self.user)},
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_alert_serializer_limits_portfolio_item_queryset_to_authenticated_user(self):
        item = PortfolioItem.objects.create(
            portfolio=self.portfolio,
            asset=self.asset,
            quantity=10,
            average_price=Decimal("50.00"),
        )
        other_item = PortfolioItem.objects.create(
            portfolio=self.other_portfolio,
            asset=self.asset,
            quantity=5,
            average_price=Decimal("45.00"),
        )

        serializer = PortfolioItemAlertSerializer(
            context={"request": self.make_request(self.user)}
        )

        item_ids = list(
            serializer.fields["portfolio_item"].queryset.values_list("id", flat=True)
        )

        self.assertIn(item.id, item_ids)
        self.assertNotIn(other_item.id, item_ids)

    def test_alert_serializer_rejects_threshold_price_less_or_equal_zero(self):
        item = PortfolioItem.objects.create(
            portfolio=self.portfolio,
            asset=self.asset,
            quantity=10,
            average_price=Decimal("50.00"),
        )

        serializer = PortfolioItemAlertSerializer(
            data={
                "portfolio_item": item.id,
                "alert_type": PortfolioItemAlert.AlertType.BELOW_OR_EQUAL,
                "threshold_price": "0.00",
                "is_active": True,
            },
            context={"request": self.make_request(self.user)},
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("threshold_price", serializer.errors)

    def test_alert_serializer_returns_triggered_now_field(self):
        item = PortfolioItem.objects.create(
            portfolio=self.portfolio,
            asset=self.asset,
            quantity=10,
            average_price=Decimal("50.00"),
        )
        alert = PortfolioItemAlert.objects.create(
            portfolio_item=item,
            alert_type=PortfolioItemAlert.AlertType.BELOW_OR_EQUAL,
            threshold_price=Decimal("61.00"),
            is_active=True,
        )

        serializer = PortfolioItemAlertSerializer(alert)

        self.assertTrue(serializer.data["triggered_now"])