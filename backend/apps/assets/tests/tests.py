from decimal import Decimal
from django.test import SimpleTestCase
from .calculators.barsi_method import BarsiCalculator
from .calculators.graham_method import calculate_graham_price
from .calculators.projected_method import calculate_projected_price

class BarsiCalculatorTests(SimpleTestCase):
    def test_should_calculate_barsi_price_correctly(self):
        calculator = BarsiCalculator(
            dividends_last_12_months=[0.50, 0.60, 0.40, 0.50],
            current_price=30.00,
            target_yield=0.06,
        )

        result = calculator.calculate()

        self.assertEqual(result["annual_dividend"], Decimal("2.0000"))
        self.assertEqual(result["price_ceiling"], Decimal("33.33"))
        self.assertEqual(result["margin"], Decimal("3.33"))
        self.assertTrue(result["opportunity"])
        self.assertEqual(result["status"], "BUY")

    def test_should_raise_error_when_price_is_zero(self):
        calculator = BarsiCalculator(
            dividends_last_12_months=[0.50, 0.60],
            current_price=0,
            target_yield=0.06,
        )

        with self.assertRaises(ValueError):
            calculator.calculate()

    def test_should_raise_error_when_target_yield_is_zero(self):
        calculator = BarsiCalculator(
            dividends_last_12_months=[0.50, 0.60],
            current_price=30,
            target_yield=0,
        )

        with self.assertRaises(ValueError):
            calculator.calculate()

    def test_should_raise_error_when_dividend_is_negative(self):
        calculator = BarsiCalculator(
            dividends_last_12_months=[0.50, -0.10],
            current_price=30,
            target_yield=0.06,
        )

        with self.assertRaises(ValueError):
            calculator.calculate()

class BarsiViewTests(TestCase):
    def setUp(self):
        self.asset = Asset.objects.create(
            ticker="BBAS3",
            name="Banco do Brasil",
            sector="Financeiro",
            current_price=Decimal("30.00")
        )

    def test_should_render_barsi_page(self):
        response = self.client.get(reverse("barsi_calculator"))
        self.assertEqual(response.status_code, 200)

    def test_should_create_barsi_analysis(self):
        response = self.client.post(
            reverse("barsi_calculator"),
            {
                "asset": self.asset.id,
                "current_price": "30.00",
                "dividend_1": "0.50",
                "dividend_2": "0.60",
                "dividend_3": "0.40",
                "dividend_4": "0.50",
                "target_yield": "0.06",
            }
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(BarsiAnalysis.objects.count(), 1)

        analysis = BarsiAnalysis.objects.first()
        self.assertEqual(analysis.asset, self.asset)
        self.assertEqual(analysis.price_ceiling, Decimal("33.33"))

class GrahamCalculatorTests(SimpleTestCase):
    def test_should_calculate_fair_price_correctly(self):
        result = calculate_graham_price(
            lpa=Decimal("6.00"),
            vpa=Decimal("20.00")
        )
        self.assertEqual(result, Decimal("51.96"))

    def test_should_raise_error_when_lpa_is_zero(self):
        with self.assertRaises(ValueError):
            calculate_graham_price(
                lpa=Decimal("0.00"),
                vpa=Decimal("20.00")
            )

    def test_should_raise_error_when_vpa_is_zero(self):
        with self.assertRaises(ValueError):
            calculate_graham_price(
                lpa=Decimal("6.00"),
                vpa=Decimal("0.00")
            )

from decimal import Decimal
from django.test import SimpleTestCase

from .calculators.projected_method import calculate_projected_price


class ProjectedCalculatorTests(SimpleTestCase):
    def test_should_calculate_projected_price_correctly(self):
        result = calculate_projected_price(
            dpa=Decimal("6.40"),
            average_dividend_yield=Decimal("0.08")
        )

        self.assertEqual(result["raw_price"], Decimal("80.00"))
        self.assertEqual(result["price_ceiling"], Decimal("80.00"))

    def test_should_round_to_nearest_point_eight(self):
        result = calculate_projected_price(
            dpa=Decimal("6.50"),
            average_dividend_yield=Decimal("0.08")
        )

        self.assertEqual(result["raw_price"], Decimal("81.25"))
        self.assertEqual(result["price_ceiling"], Decimal("81.60"))

    def test_should_raise_error_when_dpa_is_zero(self):
        with self.assertRaises(ValueError):
            calculate_projected_price(
                dpa=Decimal("0.00"),
                average_dividend_yield=Decimal("0.08")
            )

    def test_should_raise_error_when_dividend_yield_is_zero(self):
        with self.assertRaises(ValueError):
            calculate_projected_price(
                dpa=Decimal("6.40"),
                average_dividend_yield=Decimal("0.00")
            )