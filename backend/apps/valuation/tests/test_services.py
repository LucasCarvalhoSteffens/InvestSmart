from decimal import Decimal

from django.test import SimpleTestCase, TestCase

from apps.assets.models import Asset
from apps.valuation.models import BarsiAnalysis, GrahamAnalysis, ProjectedAnalysis
from apps.valuation.services.barsi import BarsiCalculator
from apps.valuation.services.graham import calculate_graham_price
from apps.valuation.services.projected import calculate_projected_price, mround


class BarsiServiceTests(SimpleTestCase):
    def test_barsi_calculate_success(self):
        result = BarsiCalculator(
            dividends_last_12_months=[1, 1, 1, 1],
            current_price=20,
            target_yield=0.06,
        ).calculate()

        self.assertEqual(result["annual_dividend"], Decimal("4.0000"))
        self.assertEqual(result["current_price"], Decimal("20.00"))
        self.assertEqual(result["current_dividend_yield"], Decimal("0.2000"))
        self.assertEqual(result["target_dividend_yield"], Decimal("0.0600"))
        self.assertEqual(result["price_ceiling"], Decimal("66.67"))
        self.assertEqual(result["margin"], Decimal("46.67"))
        self.assertTrue(result["opportunity"])
        self.assertEqual(result["status"], "BUY")

    def test_barsi_raises_for_negative_dividend(self):
        with self.assertRaisesMessage(ValueError, "Os dividendos não podem ser negativos."):
            BarsiCalculator(
                dividends_last_12_months=[1, -1, 1, 1],
                current_price=20,
                target_yield=0.06,
            ).calculate()

    def test_barsi_raises_for_invalid_price(self):
        with self.assertRaisesMessage(ValueError, "A cotação atual deve ser maior que zero."):
            BarsiCalculator(
                dividends_last_12_months=[1, 1, 1, 1],
                current_price=0,
                target_yield=0.06,
            ).calculate()


class GrahamServiceTests(SimpleTestCase):
    def test_graham_calculate_success(self):
        fair_price = calculate_graham_price(lpa=2, vpa=10)

        self.assertEqual(fair_price, Decimal("21.21"))

    def test_graham_raises_for_invalid_lpa(self):
        with self.assertRaisesMessage(ValueError, "O LPA deve ser maior que zero."):
            calculate_graham_price(lpa=0, vpa=10)

    def test_graham_raises_for_invalid_vpa(self):
        with self.assertRaisesMessage(ValueError, "O VPA deve ser maior que zero."):
            calculate_graham_price(lpa=2, vpa=0)


class ProjectedServiceTests(SimpleTestCase):
    def test_mround_success(self):
        self.assertEqual(mround("30", "0.8"), Decimal("30.40"))

    def test_mround_raises_for_invalid_multiple(self):
        with self.assertRaisesMessage(ValueError, "O múltiplo deve ser maior que zero."):
            mround("30", "0")

    def test_projected_price_success(self):
        result = calculate_projected_price(dpa="2.4000", average_dividend_yield="0.08")

        self.assertEqual(result["raw_price"], Decimal("30.00"))
        self.assertEqual(result["price_ceiling"], Decimal("30.40"))

    def test_projected_price_raises_for_invalid_dpa(self):
        with self.assertRaisesMessage(ValueError, "O DPA deve ser maior que zero."):
            calculate_projected_price(dpa=0, average_dividend_yield="0.08")

    def test_projected_price_raises_for_invalid_dividend_yield(self):
        with self.assertRaisesMessage(ValueError, "O Dividend Yield médio deve ser maior que zero."):
            calculate_projected_price(dpa="2.40", average_dividend_yield=0)


class ValuationModelTests(TestCase):
    def setUp(self):
        self.asset = Asset.objects.create(
            ticker="ITSA4",
            name="Itaúsa",
            sector="Financeiro",
            current_price=Decimal("10.50"),
        )

    def test_barsi_analysis_str(self):
        analysis = BarsiAnalysis.objects.create(
            asset=self.asset,
            annual_dividend=Decimal("1.2000"),
            current_price=Decimal("10.50"),
            target_yield=Decimal("0.0600"),
            price_ceiling=Decimal("20.00"),
            margin=Decimal("9.50"),
            opportunity=True,
        )
        self.assertEqual(str(analysis), "Barsi Analysis - ITSA4")

    def test_graham_analysis_str(self):
        analysis = GrahamAnalysis.objects.create(
            asset=self.asset,
            lpa=Decimal("2.00"),
            vpa=Decimal("10.00"),
            fair_price=Decimal("21.21"),
        )
        self.assertEqual(str(analysis), "ITSA4 - Graham - 21.21")

    def test_projected_analysis_str(self):
        analysis = ProjectedAnalysis.objects.create(
            asset=self.asset,
            dpa=Decimal("2.4000"),
            average_dividend_yield=Decimal("0.0800"),
            raw_price=Decimal("30.00"),
            price_ceiling=Decimal("30.40"),
        )
        self.assertEqual(str(analysis), "ITSA4 - Projetivo - 30.40")