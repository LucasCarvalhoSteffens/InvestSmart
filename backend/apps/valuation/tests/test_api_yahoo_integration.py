from datetime import date
from decimal import Decimal
from unittest.mock import patch

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from apps.assets.models import Asset
from apps.valuation.models import BarsiAnalysis, GrahamAnalysis, ProjectedAnalysis

User = get_user_model()


def yahoo_payload():
    return {
        "ticker": "PETR4.SA",
        "name": "Petrobras",
        "sector": "Energy",
        "current_price": Decimal("30.00"),
        "currency": "BRL",
        "lpa": Decimal("5.0000"),
        "vpa": Decimal("20.0000"),
        "annual_dividend": Decimal("2.0000"),
        "dividend_yield": Decimal("0.080000"),
        "payout_ratio": Decimal("0.400000"),
        "shares_outstanding": 1000000,
        "dividends_last_12_months": [
            {
                "payment_date": date(2026, 1, 10),
                "value": Decimal("1.0000"),
            },
            {
                "payment_date": date(2026, 4, 10),
                "value": Decimal("1.0000"),
            },
        ],
    }


class ValuationYahooAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="lucas",
            email="lucas@email.com",
            password="12345678",
        )
        self.client.force_authenticate(user=self.user)

    @patch("apps.valuation.api.views.fetch_from_yahoo")
    def test_barsi_calculation_uses_api_without_persisting_asset(self, mock_fetch):
        mock_fetch.return_value = yahoo_payload()

        response = self.client.post(
            "/api/valuation/barsi/",
            {
                "ticker": "PETR4.SA",
                "target_yield": "0.0600",
                "persist": False,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["asset"], "PETR4.SA")
        self.assertFalse(response.data["persisted"])
        self.assertEqual(Asset.objects.count(), 0)
        self.assertEqual(BarsiAnalysis.objects.count(), 0)

    @patch("apps.valuation.api.views.fetch_from_yahoo")
    def test_graham_calculation_uses_api_without_persisting_asset(self, mock_fetch):
        mock_fetch.return_value = yahoo_payload()

        response = self.client.post(
            "/api/valuation/graham/",
            {
                "ticker": "PETR4.SA",
                "persist": False,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["asset"], "PETR4.SA")
        self.assertFalse(response.data["persisted"])
        self.assertEqual(Asset.objects.count(), 0)
        self.assertEqual(GrahamAnalysis.objects.count(), 0)

    @patch("apps.valuation.api.views.fetch_from_yahoo")
    def test_projected_calculation_uses_api_without_persisting_asset(self, mock_fetch):
        mock_fetch.return_value = yahoo_payload()

        response = self.client.post(
            "/api/valuation/projected/",
            {
                "ticker": "PETR4.SA",
                "persist": False,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["asset"], "PETR4.SA")
        self.assertFalse(response.data["persisted"])
        self.assertEqual(Asset.objects.count(), 0)
        self.assertEqual(ProjectedAnalysis.objects.count(), 0)