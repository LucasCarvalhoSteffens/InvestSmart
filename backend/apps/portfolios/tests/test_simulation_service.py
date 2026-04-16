from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase

from apps.assets.models import Asset
from apps.portfolios.models import Portfolio, PortfolioItem
from apps.portfolios.services.simulation import PortfolioSimulationService
from apps.valuation.models import BarsiAnalysis, GrahamAnalysis, ProjectedAnalysis

User = get_user_model()


class PortfolioSimulationServiceTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="lucas",
            password="12345678",
            email="lucas@email.com",
        )

        self.portfolio = Portfolio.objects.create(
            user=self.user,
            name="Carteira Principal",
            description="Carteira de testes",
        )

        self.asset_1 = Asset.objects.create(
            ticker="WEGE3",
            name="WEG",
            sector="Industrial",
            current_price=Decimal("59.90"),
        )
        self.asset_2 = Asset.objects.create(
            ticker="BBAS3",
            name="Banco do Brasil",
            sector="Financeiro",
            current_price=Decimal("27.50"),
        )
        self.asset_3 = Asset.objects.create(
            ticker="TAEE11",
            name="Taesa",
            sector="Energia",
            current_price=Decimal("34.00"),
        )

        self.item_1 = PortfolioItem.objects.create(
            portfolio=self.portfolio,
            asset=self.asset_1,
            quantity=10,
            average_price=Decimal("50.00"),
            target_price=Decimal("65.00"),
        )
        self.item_2 = PortfolioItem.objects.create(
            portfolio=self.portfolio,
            asset=self.asset_2,
            quantity=20,
            average_price=Decimal("24.00"),
        )
        self.item_3 = PortfolioItem.objects.create(
            portfolio=self.portfolio,
            asset=self.asset_3,
            quantity=5,
            average_price=Decimal("35.00"),
        )

        ProjectedAnalysis.objects.create(
            asset=self.asset_2,
            dpa=Decimal("2.4000"),
            average_dividend_yield=Decimal("0.0800"),
            raw_price=Decimal("30.00"),
            price_ceiling=Decimal("29.60"),
        )

        BarsiAnalysis.objects.create(
            asset=self.asset_3,
            annual_dividend=Decimal("2.0400"),
            current_price=Decimal("34.00"),
            target_yield=Decimal("0.0600"),
            price_ceiling=Decimal("34.00"),
            margin=Decimal("0.00"),
            opportunity=True,
        )

        GrahamAnalysis.objects.create(
            asset=self.asset_2,
            lpa=Decimal("5.20"),
            vpa=Decimal("44.10"),
            fair_price=Decimal("71.82"),
        )

    def test_should_simulate_portfolio_with_multiple_sources(self):
        result = PortfolioSimulationService().simulate(self.portfolio)

        self.assertEqual(result["summary"]["portfolio_id"], self.portfolio.id)
        self.assertEqual(result["summary"]["total_items"], 3)
        self.assertEqual(result["summary"]["covered_items"], 3)
        self.assertEqual(result["summary"]["uncovered_items"], 0)
        self.assertEqual(result["summary"]["opportunities_count"], 3)

        self.assertEqual(result["summary"]["total_invested"], Decimal("1155.00"))
        self.assertEqual(result["summary"]["total_current_value"], Decimal("1319.00"))
        self.assertEqual(result["summary"]["covered_current_value"], Decimal("1319.00"))
        self.assertEqual(result["summary"]["total_target_value"], Decimal("1412.00"))
        self.assertEqual(
            result["summary"]["total_estimated_return_value"],
            Decimal("93.00"),
        )
        self.assertEqual(
            result["summary"]["total_estimated_return_pct"],
            Decimal("7.05"),
        )

        wege3 = next(item for item in result["items"] if item["asset_ticker"] == "WEGE3")
        self.assertEqual(wege3["price_ceiling"], Decimal("65.00"))
        self.assertEqual(wege3["price_ceiling_source"], "manual")
        self.assertEqual(wege3["estimated_return_value"], Decimal("51.00"))
        self.assertTrue(wege3["is_opportunity"])

        bbas3 = next(item for item in result["items"] if item["asset_ticker"] == "BBAS3")
        self.assertEqual(bbas3["price_ceiling"], Decimal("29.60"))
        self.assertEqual(bbas3["price_ceiling_source"], "projected")
        self.assertEqual(bbas3["graham_fair_price"], Decimal("71.82"))
        self.assertEqual(bbas3["opportunity_value"], Decimal("42.00"))
        self.assertTrue(bbas3["is_opportunity"])

        taee11 = next(item for item in result["items"] if item["asset_ticker"] == "TAEE11")
        self.assertEqual(taee11["price_ceiling_source"], "barsi")
        self.assertEqual(taee11["estimated_return_value"], Decimal("0.00"))
        self.assertTrue(taee11["is_opportunity"])

    def test_should_return_null_metrics_when_item_has_no_reference_price(self):
        asset = Asset.objects.create(
            ticker="ABEV3",
            name="Ambev",
            sector="Consumo",
            current_price=Decimal("12.50"),
        )

        PortfolioItem.objects.create(
            portfolio=self.portfolio,
            asset=asset,
            quantity=10,
            average_price=Decimal("13.00"),
        )

        result = PortfolioSimulationService().simulate(self.portfolio)
        abev3 = next(item for item in result["items"] if item["asset_ticker"] == "ABEV3")

        self.assertIsNone(abev3["price_ceiling"])
        self.assertIsNone(abev3["price_ceiling_source"])
        self.assertIsNone(abev3["margin_to_ceiling"])
        self.assertIsNone(abev3["margin_to_ceiling_pct"])
        self.assertIsNone(abev3["estimated_return_value"])
        self.assertIsNone(abev3["estimated_return_pct"])
        self.assertEqual(abev3["opportunity_value"], Decimal("0.00"))
        self.assertFalse(abev3["is_opportunity"])

        self.assertEqual(result["summary"]["total_items"], 4)
        self.assertEqual(result["summary"]["covered_items"], 3)
        self.assertEqual(result["summary"]["uncovered_items"], 1)