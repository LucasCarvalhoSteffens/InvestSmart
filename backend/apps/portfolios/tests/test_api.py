from decimal import Decimal

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.assets.models import Asset
from apps.portfolios.models import Portfolio, PortfolioItem, PortfolioItemAlert
from apps.valuation.models import BarsiAnalysis, GrahamAnalysis, ProjectedAnalysis

User = get_user_model()


class PortfolioAPITests(APITestCase):
    def setUp(self):
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

        self.asset_1 = Asset.objects.create(
            ticker="BBAS3",
            name="Banco do Brasil",
            sector="Financeiro",
            current_price=Decimal("27.50"),
        )
        self.asset_2 = Asset.objects.create(
            ticker="WEGE3",
            name="WEG",
            sector="Industrial",
            current_price=Decimal("59.90"),
        )

        self.portfolio = Portfolio.objects.create(
            user=self.user,
            name="Carteira Principal",
            description="Minha carteira",
        )
        self.other_portfolio = Portfolio.objects.create(
            user=self.other_user,
            name="Carteira da Maria",
        )

        self.portfolios_url = reverse("portfolios-list")
        self.items_url = reverse("portfolio-items-list")
        self.alerts_url = reverse("portfolio-alerts-list")

    def authenticate(self):
        self.client.force_authenticate(user=self.user)

    def test_list_portfolios_requires_authentication(self):
        response = self.client.get(self.portfolios_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_only_returns_authenticated_user_portfolios(self):
        self.authenticate()
        response = self.client.get(self.portfolios_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "Carteira Principal")

    def test_create_portfolio(self):
        self.authenticate()
        payload = {
            "name": "FIIs",
            "description": "Carteira de fundos imobiliários",
        }

        response = self.client.post(self.portfolios_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Portfolio.objects.filter(user=self.user).count(), 2)
        self.assertTrue(Portfolio.objects.filter(user=self.user, name="FIIs").exists())

    def test_create_portfolio_item(self):
        self.authenticate()
        payload = {
            "portfolio": self.portfolio.id,
            "asset": self.asset_1.id,
            "quantity": 10,
            "average_price": "20.00",
            "target_price": "30.00",
            "notes": "Primeira posição",
        }

        response = self.client.post(self.items_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(PortfolioItem.objects.count(), 1)
        self.assertEqual(response.data["asset_ticker"], "BBAS3")
        self.assertEqual(str(response.data["invested_amount"]), "200.00")
        self.assertEqual(str(response.data["current_value"]), "275.00")
        self.assertEqual(str(response.data["unrealized_gain"]), "75.00")
        self.assertTrue(response.data["is_below_target"])

    def test_cannot_add_same_asset_twice_to_same_portfolio(self):
        self.authenticate()
        PortfolioItem.objects.create(
            portfolio=self.portfolio,
            asset=self.asset_1,
            quantity=10,
            average_price=Decimal("20.00"),
        )

        payload = {
            "portfolio": self.portfolio.id,
            "asset": self.asset_1.id,
            "quantity": 5,
            "average_price": "21.00",
        }

        response = self.client.post(self.items_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("asset", response.data)

    def test_cannot_create_item_in_other_users_portfolio(self):
        self.authenticate()
        payload = {
            "portfolio": self.other_portfolio.id,
            "asset": self.asset_2.id,
            "quantity": 5,
            "average_price": "50.00",
        }

        response = self.client.post(self.items_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("portfolio", response.data)

    def test_create_alert_for_portfolio_item(self):
        self.authenticate()
        item = PortfolioItem.objects.create(
            portfolio=self.portfolio,
            asset=self.asset_2,
            quantity=4,
            average_price=Decimal("52.00"),
        )

        payload = {
            "portfolio_item": item.id,
            "alert_type": PortfolioItemAlert.AlertType.ABOVE_OR_EQUAL,
            "threshold_price": "59.00",
            "is_active": True,
        }

        response = self.client.post(self.alerts_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(PortfolioItemAlert.objects.count(), 1)
        self.assertEqual(response.data["asset_ticker"], "WEGE3")
        self.assertTrue(response.data["triggered_now"])

    def test_filter_items_by_portfolio_id(self):
        self.authenticate()

        second_portfolio = Portfolio.objects.create(
            user=self.user,
            name="Carteira Secundária",
            description="Outra carteira",
        )

        item_1 = PortfolioItem.objects.create(
            portfolio=self.portfolio,
            asset=self.asset_1,
            quantity=10,
            average_price=Decimal("20.00"),
        )
        item_2 = PortfolioItem.objects.create(
            portfolio=second_portfolio,
            asset=self.asset_2,
            quantity=8,
            average_price=Decimal("50.00"),
        )

        response = self.client.get(self.items_url, {"portfolio_id": second_portfolio.id})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["id"], item_2.id)
        self.assertNotEqual(response.data[0]["id"], item_1.id)

    def test_filter_alerts_by_portfolio_item_id(self):
        self.authenticate()

        item_1 = PortfolioItem.objects.create(
            portfolio=self.portfolio,
            asset=self.asset_1,
            quantity=10,
            average_price=Decimal("20.00"),
        )
        item_2 = PortfolioItem.objects.create(
            portfolio=self.portfolio,
            asset=self.asset_2,
            quantity=8,
            average_price=Decimal("50.00"),
        )

        alert_1 = PortfolioItemAlert.objects.create(
            portfolio_item=item_1,
            alert_type=PortfolioItemAlert.AlertType.BELOW_OR_EQUAL,
            threshold_price=Decimal("25.00"),
        )
        PortfolioItemAlert.objects.create(
            portfolio_item=item_2,
            alert_type=PortfolioItemAlert.AlertType.ABOVE_OR_EQUAL,
            threshold_price=Decimal("65.00"),
        )

        response = self.client.get(self.alerts_url, {"portfolio_item_id": item_1.id})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["id"], alert_1.id)

    def test_filter_alerts_by_portfolio_id(self):
        self.authenticate()

        second_portfolio = Portfolio.objects.create(
            user=self.user,
            name="Longo Prazo",
            description="Carteira 2",
        )

        item_1 = PortfolioItem.objects.create(
            portfolio=self.portfolio,
            asset=self.asset_1,
            quantity=10,
            average_price=Decimal("20.00"),
        )
        item_2 = PortfolioItem.objects.create(
            portfolio=second_portfolio,
            asset=self.asset_2,
            quantity=5,
            average_price=Decimal("21.00"),
        )

        PortfolioItemAlert.objects.create(
            portfolio_item=item_1,
            alert_type=PortfolioItemAlert.AlertType.BELOW_OR_EQUAL,
            threshold_price=Decimal("24.00"),
        )
        alert_2 = PortfolioItemAlert.objects.create(
            portfolio_item=item_2,
            alert_type=PortfolioItemAlert.AlertType.ABOVE_OR_EQUAL,
            threshold_price=Decimal("30.00"),
        )

        response = self.client.get(self.alerts_url, {"portfolio_id": second_portfolio.id})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["id"], alert_2.id)
    
    def test_get_portfolio_simulation(self):
        self.authenticate()

        item_1 = PortfolioItem.objects.create(
            portfolio=self.portfolio,
            asset=self.asset_1,
            quantity=10,
            average_price=Decimal("20.00"),
            target_price=Decimal("30.00"),
        )
        item_2 = PortfolioItem.objects.create(
            portfolio=self.portfolio,
            asset=self.asset_2,
            quantity=5,
            average_price=Decimal("50.00"),
        )

        ProjectedAnalysis.objects.create(
            asset=self.asset_2,
            dpa=Decimal("2.4000"),
            average_dividend_yield=Decimal("0.0600"),
            raw_price=Decimal("40.00"),
            price_ceiling=Decimal("65.00"),
        )

        GrahamAnalysis.objects.create(
            asset=self.asset_2,
            lpa=Decimal("5.20"),
            vpa=Decimal("44.10"),
            fair_price=Decimal("71.82"),
        )

        response = self.client.get(
            reverse("portfolios-simulation", args=[self.portfolio.id])
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["summary"]["portfolio_id"], self.portfolio.id)
        self.assertEqual(response.data["summary"]["total_items"], 2)
        self.assertEqual(response.data["summary"]["covered_items"], 2)
        self.assertEqual(response.data["summary"]["opportunities_count"], 2)

        first = response.data["items"][0]
        self.assertIn("asset_ticker", first)
        self.assertIn("price_ceiling", first)
        self.assertIn("estimated_return_value", first)
        self.assertIn("is_opportunity", first)

        bbas3 = next(item for item in response.data["items"] if item["asset_ticker"] == "BBAS3")
        self.assertEqual(str(bbas3["price_ceiling"]), "30.00")
        self.assertEqual(bbas3["price_ceiling_source"], "manual")
        self.assertTrue(bbas3["is_opportunity"])

        wege3 = next(item for item in response.data["items"] if item["asset_ticker"] == "WEGE3")
        self.assertEqual(str(wege3["price_ceiling"]), "65.00")
        self.assertEqual(wege3["price_ceiling_source"], "projected")
        self.assertEqual(str(wege3["graham_fair_price"]), "71.82")

    def test_simulation_requires_authentication(self):
        response = self.client.get(
            reverse("portfolios-simulation", args=[self.portfolio.id])
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_cannot_access_other_users_portfolio_simulation(self):
        item = PortfolioItem.objects.create(
            portfolio=self.other_portfolio,
            asset=self.asset_1,
            quantity=10,
            average_price=Decimal("20.00"),
            target_price=Decimal("30.00"),
        )

        self.authenticate()

        response = self.client.get(
            reverse("portfolios-simulation", args=[self.other_portfolio.id])
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_simulation_returns_null_fields_when_item_has_no_analysis_and_no_manual_target(self):
        self.authenticate()

        PortfolioItem.objects.create(
            portfolio=self.portfolio,
            asset=self.asset_1,
            quantity=10,
            average_price=Decimal("20.00"),
        )

        response = self.client.get(
            reverse("portfolios-simulation", args=[self.portfolio.id])
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["summary"]["total_items"], 1)
        self.assertEqual(response.data["summary"]["covered_items"], 0)
        self.assertEqual(response.data["summary"]["uncovered_items"], 1)

        item = response.data["items"][0]
        self.assertIsNone(item["price_ceiling"])
        self.assertIsNone(item["price_ceiling_source"])
        self.assertIsNone(item["estimated_return_value"])
        self.assertFalse(item["is_opportunity"])

    def test_simulation_uses_barsi_when_no_manual_or_projected_target_exists(self):
        self.authenticate()

        PortfolioItem.objects.create(
            portfolio=self.portfolio,
            asset=self.asset_1,
            quantity=10,
            average_price=Decimal("20.00"),
        )

        BarsiAnalysis.objects.create(
            asset=self.asset_1,
            annual_dividend=Decimal("1.6500"),
            current_price=Decimal("27.50"),
            target_yield=Decimal("0.0600"),
            price_ceiling=Decimal("28.00"),
            margin=Decimal("0.50"),
            opportunity=True,
        )

        response = self.client.get(
            reverse("portfolios-simulation", args=[self.portfolio.id])
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        item = response.data["items"][0]
        self.assertEqual(str(item["price_ceiling"]), "28.00")
        self.assertEqual(item["price_ceiling_source"], "barsi")
        self.assertTrue(item["is_opportunity"])