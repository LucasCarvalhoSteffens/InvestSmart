from datetime import date
from decimal import Decimal
from types import SimpleNamespace
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.assets.models import Asset
from apps.valuation.models import BarsiAnalysis, GrahamAnalysis, ProjectedAnalysis

User = get_user_model()


def yahoo_payload(**overrides):
    payload = {
        "ticker": "BBAS3.SA",
        "name": "Banco do Brasil",
        "sector": "Financeiro",
        "current_price": Decimal("20.00"),
        "currency": "BRL",
        "lpa": Decimal("2.0000"),
        "vpa": Decimal("10.0000"),
        "annual_dividend": Decimal("4.0000"),
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
            {
                "payment_date": date(2026, 7, 10),
                "value": Decimal("1.0000"),
            },
            {
                "payment_date": date(2026, 10, 10),
                "value": Decimal("1.0000"),
            },
        ],
    }

    payload.update(overrides)

    return payload


def market_data_mock(asset, **overrides):
    payload = yahoo_payload(**overrides)

    return SimpleNamespace(
        asset=asset,
        ticker=payload["ticker"],
        name=payload["name"],
        sector=payload["sector"],
        current_price=payload["current_price"],
        currency=payload["currency"],
        lpa=payload["lpa"],
        vpa=payload["vpa"],
        annual_dividend=payload["annual_dividend"],
        dividend_yield=payload["dividend_yield"],
        payout_ratio=payload["payout_ratio"],
        shares_outstanding=payload["shares_outstanding"],
        dividends_last_12_months=payload["dividends_last_12_months"],
    )


class ValuationAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="lucas",
            password="12345678",
            email="lucas@email.com",
        )

        self.asset = Asset.objects.create(
            ticker="BBAS3.SA",
            name="Banco do Brasil",
            sector="Financeiro",
            current_price=Decimal("20.00"),
        )

        self.graham_url = reverse("valuation-graham")
        self.projected_url = reverse("valuation-projected")
        self.barsi_url = reverse("valuation-barsi")

    def authenticate(self):
        self.client.force_authenticate(user=self.user)

    def test_graham_requires_authentication(self):
        response = self.client.post(
            self.graham_url,
            {
                "ticker": "BBAS3.SA",
                "lpa": "2.00",
                "vpa": "10.00",
                "persist": False,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    @patch("apps.valuation.api.views.fetch_from_yahoo")
    def test_graham_success_without_persisting(self, mock_fetch):
        mock_fetch.return_value = yahoo_payload()

        self.authenticate()

        response = self.client.post(
            self.graham_url,
            {
                "ticker": "BBAS3.SA",
                "lpa": "2.00",
                "vpa": "10.00",
                "persist": False,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["asset"], "BBAS3.SA")
        self.assertEqual(str(response.data["fair_price"]), "21.21")
        self.assertFalse(response.data["persisted"])
        self.assertEqual(GrahamAnalysis.objects.count(), 0)

    @patch("apps.valuation.api.views.fetch_from_yahoo")
    def test_graham_success_using_api_values_without_persisting(self, mock_fetch):
        mock_fetch.return_value = yahoo_payload()

        self.authenticate()

        response = self.client.post(
            self.graham_url,
            {
                "ticker": "BBAS3.SA",
                "persist": False,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["asset"], "BBAS3.SA")
        self.assertEqual(str(response.data["lpa"]), "2.0000")
        self.assertEqual(str(response.data["vpa"]), "10.0000")
        self.assertEqual(str(response.data["fair_price"]), "21.21")
        self.assertEqual(GrahamAnalysis.objects.count(), 0)

    @patch("apps.valuation.api.views.fetch_from_yahoo")
    def test_graham_invalid_business_rule(self, mock_fetch):
        mock_fetch.return_value = yahoo_payload()

        self.authenticate()

        response = self.client.post(
            self.graham_url,
            {
                "ticker": "BBAS3.SA",
                "lpa": "0.00",
                "vpa": "10.00",
                "persist": False,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["detail"], "O LPA deve ser maior que zero.")
        self.assertEqual(GrahamAnalysis.objects.count(), 0)

    @patch("apps.valuation.api.views.sync_asset_from_yahoo")
    def test_graham_persist_true_saves_analysis(self, mock_sync):
        mock_sync.return_value = market_data_mock(self.asset)

        self.authenticate()

        response = self.client.post(
            self.graham_url,
            {
                "ticker": "BBAS3.SA",
                "lpa": "2.00",
                "vpa": "10.00",
                "persist": True,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["persisted"])
        self.assertEqual(GrahamAnalysis.objects.count(), 1)
        self.assertEqual(GrahamAnalysis.objects.first().asset, self.asset)

    def test_projected_requires_authentication(self):
        response = self.client.post(
            self.projected_url,
            {
                "ticker": "BBAS3.SA",
                "dpa": "2.4000",
                "average_dividend_yield": "0.0800",
                "persist": False,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    @patch("apps.valuation.api.views.fetch_from_yahoo")
    def test_projected_success_without_persisting(self, mock_fetch):
        mock_fetch.return_value = yahoo_payload()

        self.authenticate()

        response = self.client.post(
            self.projected_url,
            {
                "ticker": "BBAS3.SA",
                "dpa": "2.4000",
                "average_dividend_yield": "0.0800",
                "persist": False,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["asset"], "BBAS3.SA")
        self.assertEqual(str(response.data["raw_price"]), "30.00")
        self.assertEqual(str(response.data["price_ceiling"]), "30.40")
        self.assertFalse(response.data["persisted"])
        self.assertEqual(ProjectedAnalysis.objects.count(), 0)

    @patch("apps.valuation.api.views.fetch_from_yahoo")
    def test_projected_success_using_api_values_without_persisting(self, mock_fetch):
        mock_fetch.return_value = yahoo_payload(
            annual_dividend=Decimal("2.4000"),
            dividend_yield=Decimal("0.080000"),
        )

        self.authenticate()

        response = self.client.post(
            self.projected_url,
            {
                "ticker": "BBAS3.SA",
                "persist": False,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["asset"], "BBAS3.SA")
        self.assertEqual(str(response.data["dpa"]), "2.4000")
        self.assertEqual(str(response.data["average_dividend_yield"]), "0.080000")
        self.assertEqual(str(response.data["raw_price"]), "30.00")
        self.assertEqual(str(response.data["price_ceiling"]), "30.40")
        self.assertEqual(ProjectedAnalysis.objects.count(), 0)

    @patch("apps.valuation.api.views.fetch_from_yahoo")
    def test_projected_invalid_business_rule(self, mock_fetch):
        mock_fetch.return_value = yahoo_payload()

        self.authenticate()

        response = self.client.post(
            self.projected_url,
            {
                "ticker": "BBAS3.SA",
                "dpa": "2.4000",
                "average_dividend_yield": "0.0000",
                "persist": False,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data["detail"],
            "O Dividend Yield médio deve ser maior que zero.",
        )
        self.assertEqual(ProjectedAnalysis.objects.count(), 0)

    @patch("apps.valuation.api.views.sync_asset_from_yahoo")
    def test_projected_persist_true_saves_analysis(self, mock_sync):
        mock_sync.return_value = market_data_mock(self.asset)

        self.authenticate()

        response = self.client.post(
            self.projected_url,
            {
                "ticker": "BBAS3.SA",
                "dpa": "2.4000",
                "average_dividend_yield": "0.0800",
                "persist": True,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["persisted"])
        self.assertEqual(ProjectedAnalysis.objects.count(), 1)
        self.assertEqual(ProjectedAnalysis.objects.first().asset, self.asset)

    def test_barsi_requires_authentication(self):
        response = self.client.post(
            self.barsi_url,
            {
                "ticker": "BBAS3.SA",
                "current_price": "20.00",
                "target_yield": "0.0600",
                "dividends": [
                    "1.0000",
                    "1.0000",
                    "1.0000",
                    "1.0000",
                ],
                "persist": False,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    @patch("apps.valuation.api.views.fetch_from_yahoo")
    def test_barsi_success_without_persisting(self, mock_fetch):
        mock_fetch.return_value = yahoo_payload()

        self.authenticate()

        response = self.client.post(
            self.barsi_url,
            {
                "ticker": "BBAS3.SA",
                "current_price": "20.00",
                "target_yield": "0.0600",
                "dividends": [
                    "1.0000",
                    "1.0000",
                    "1.0000",
                    "1.0000",
                ],
                "persist": False,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["asset"], "BBAS3.SA")
        self.assertEqual(str(response.data["annual_dividend"]), "4.0000")
        self.assertEqual(str(response.data["price_ceiling"]), "66.67")
        self.assertTrue(response.data["opportunity"])
        self.assertFalse(response.data["persisted"])
        self.assertEqual(BarsiAnalysis.objects.count(), 0)

    @patch("apps.valuation.api.views.fetch_from_yahoo")
    def test_barsi_success_using_api_dividends_without_persisting(self, mock_fetch):
        mock_fetch.return_value = yahoo_payload()

        self.authenticate()

        response = self.client.post(
            self.barsi_url,
            {
                "ticker": "BBAS3.SA",
                "current_price": "20.00",
                "target_yield": "0.0600",
                "persist": False,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["asset"], "BBAS3.SA")
        self.assertEqual(str(response.data["annual_dividend"]), "4.0000")
        self.assertEqual(str(response.data["price_ceiling"]), "66.67")
        self.assertEqual(BarsiAnalysis.objects.count(), 0)

    @patch("apps.valuation.api.views.fetch_from_yahoo")
    def test_barsi_invalid_business_rule(self, mock_fetch):
        mock_fetch.return_value = yahoo_payload()

        self.authenticate()

        response = self.client.post(
            self.barsi_url,
            {
                "ticker": "BBAS3.SA",
                "current_price": "20.00",
                "target_yield": "0.0600",
                "dividends": [
                    "-1.0000",
                    "1.0000",
                    "1.0000",
                    "1.0000",
                ],
                "persist": False,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["detail"], "Os dividendos não podem ser negativos.")
        self.assertEqual(BarsiAnalysis.objects.count(), 0)

    @patch("apps.valuation.api.views.fetch_from_yahoo")
    def test_barsi_rejects_when_api_does_not_return_dividends(self, mock_fetch):
        mock_fetch.return_value = yahoo_payload(
            annual_dividend=None,
            dividends_last_12_months=[],
        )

        self.authenticate()

        response = self.client.post(
            self.barsi_url,
            {
                "ticker": "BBAS3.SA",
                "current_price": "20.00",
                "target_yield": "0.0600",
                "persist": False,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data["detail"],
            "Não foi possível obter dividendos dos últimos 12 meses pela API. "
            "Informe os dividendos manualmente.",
        )
        self.assertEqual(BarsiAnalysis.objects.count(), 0)

    @patch("apps.valuation.api.views.sync_asset_from_yahoo")
    def test_barsi_persist_true_saves_analysis(self, mock_sync):
        mock_sync.return_value = market_data_mock(self.asset)

        self.authenticate()

        response = self.client.post(
            self.barsi_url,
            {
                "ticker": "BBAS3.SA",
                "current_price": "20.00",
                "target_yield": "0.0600",
                "dividends": [
                    "1.0000",
                    "1.0000",
                    "1.0000",
                    "1.0000",
                ],
                "persist": True,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["persisted"])
        self.assertEqual(BarsiAnalysis.objects.count(), 1)
        self.assertEqual(BarsiAnalysis.objects.first().asset, self.asset)