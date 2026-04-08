from decimal import Decimal

from django.test import SimpleTestCase

from apps.valuation.services.barsi import BarsiCalculator
from apps.valuation.services.graham import calculate_graham_price
from apps.valuation.services.projected import calculate_projected_price, mround


class BarsiServiceTests(SimpleTestCase):
    def test_calculate_success_with_opportunity(self):
        result = BarsiCalculator(
            dividends_last_12_months=[1, 1, 1, 1],
            current_price=20,
            target_yield=0.06,
        ).calculate()

        self.assertEqual(result["method"], "Barsi")
        self.assertEqual(result["annual_dividend"], Decimal("4.0000"))
        self.assertEqual(result["current_price"], Decimal("20.00"))
        self.assertEqual(result["current_dividend_yield"], Decimal("0.2000"))
        self.assertEqual(result["target_dividend_yield"], Decimal("0.0600"))
        self.assertEqual(result["price_ceiling"], Decimal("66.67"))
        self.assertEqual(result["margin"], Decimal("46.67"))
        self.assertTrue(result["opportunity"])
        self.assertEqual(result["status"], "BUY")

    def test_calculate_success_without_opportunity(self):
        result = BarsiCalculator(
            dividends_last_12_months=[0.10, 0.10, 0.10, 0.10],
            current_price=20,
            target_yield=0.06,
        ).calculate()

        self.assertEqual(result["annual_dividend"], Decimal("0.4000"))
        self.assertEqual(result["price_ceiling"], Decimal("6.67"))
        self.assertEqual(result["margin"], Decimal("-13.33"))
        self.assertFalse(result["opportunity"])
        self.assertEqual(result["status"], "DO NOT BUY")

    def test_raises_when_values_are_invalid(self):
        with self.assertRaisesMessage(ValueError, "Os valores informados são inválidos."):
            BarsiCalculator(
                dividends_last_12_months=["abc"],
                current_price=20,
                target_yield=0.06,
            ).calculate()

    def test_raises_when_dividends_list_is_empty(self):
        with self.assertRaisesMessage(ValueError, "Informe ao menos um dividendo."):
            BarsiCalculator(
                dividends_last_12_months=[],
                current_price=20,
                target_yield=0.06,
            ).calculate()

    def test_raises_when_any_dividend_is_negative(self):
        with self.assertRaisesMessage(ValueError, "Os dividendos não podem ser negativos."):
            BarsiCalculator(
                dividends_last_12_months=[1, -1, 1, 1],
                current_price=20,
                target_yield=0.06,
            ).calculate()

    def test_raises_when_current_price_is_zero_or_less(self):
        with self.assertRaisesMessage(ValueError, "A cotação atual deve ser maior que zero."):
            BarsiCalculator(
                dividends_last_12_months=[1, 1, 1, 1],
                current_price=0,
                target_yield=0.06,
            ).calculate()

    def test_raises_when_target_yield_is_zero_or_less(self):
        with self.assertRaisesMessage(ValueError, "O dividend yield alvo deve ser maior que zero."):
            BarsiCalculator(
                dividends_last_12_months=[1, 1, 1, 1],
                current_price=20,
                target_yield=0,
            ).calculate()


class GrahamServiceTests(SimpleTestCase):
    def test_calculate_graham_price_success(self):
        result = calculate_graham_price(2, 10)
        self.assertEqual(result, Decimal("21.21"))

    def test_raises_when_values_are_not_numeric(self):
        with self.assertRaisesMessage(ValueError, "Os valores informados devem ser numéricos."):
            calculate_graham_price("abc", 10)

    def test_raises_when_lpa_is_zero_or_less(self):
        with self.assertRaisesMessage(ValueError, "O LPA deve ser maior que zero."):
            calculate_graham_price(0, 10)

    def test_raises_when_vpa_is_zero_or_less(self):
        with self.assertRaisesMessage(ValueError, "O VPA deve ser maior que zero."):
            calculate_graham_price(2, 0)


class ProjectedServiceTests(SimpleTestCase):
    def test_mround_success(self):
        self.assertEqual(mround("30", "0.8"), Decimal("30.40"))

    def test_mround_raises_when_multiple_is_zero_or_less(self):
        with self.assertRaisesMessage(ValueError, "O múltiplo deve ser maior que zero."):
            mround("30", "0")

    def test_calculate_projected_price_success(self):
        result = calculate_projected_price("2.4000", "0.0800")

        self.assertEqual(result["raw_price"], Decimal("30.00"))
        self.assertEqual(result["price_ceiling"], Decimal("30.40"))

    def test_calculate_projected_price_raises_when_values_are_not_numeric(self):
        with self.assertRaisesMessage(ValueError, "Os valores informados devem ser numéricos."):
            calculate_projected_price("abc", "0.0800")

    def test_calculate_projected_price_raises_when_dpa_is_zero_or_less(self):
        with self.assertRaisesMessage(ValueError, "O DPA deve ser maior que zero."):
            calculate_projected_price("0", "0.0800")

    def test_calculate_projected_price_raises_when_dividend_yield_is_zero_or_less(self):
        with self.assertRaisesMessage(ValueError, "O Dividend Yield médio deve ser maior que zero."):
            calculate_projected_price("2.4000", "0")