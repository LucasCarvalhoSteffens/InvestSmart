from decimal import Decimal

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.assets.models import Asset
from apps.valuation.models import BarsiAnalysis, GrahamAnalysis, ProjectedAnalysis

User = get_user_model()


class ValuationAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="lucas", password="12345678")
        self.asset = Asset.objects.create(
            ticker="BBAS3",
            name="Banco do Brasil",
            sector="Financeiro",
            current_price=Decimal("30.00"),
        )

        self.graham_url = reverse("valuation-graham")
        self.projected_url = reverse("valuation-projected")
        self.barsi_url = reverse("valuation-barsi")

        self.graham_history_url = reverse("valuation-graham-history")
        self.projected_history_url = reverse("valuation-projected-history")
        self.barsi_history_url = reverse("valuation-barsi-history")

    def authenticate(self):
        self.client.force_authenticate(user=self.user)

    def test_graham_requires_authentication(self):
        response = self.client.post(
            self.graham_url,
            {"asset_id": self.asset.id, "lpa": "2.00", "vpa": "10.00"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_graham_calculation_success(self):
        self.authenticate()

        response = self.client.post(
            self.graham_url,
            {"asset_id": self.asset.id, "lpa": "2.00", "vpa": "10.00"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["asset"], "BBAS3")
        self.assertEqual(str(response.data["fair_price"]), "21.21")
        self.assertEqual(GrahamAnalysis.objects.count(), 1)

    def test_graham_calculation_invalid_value(self):
        self.authenticate()

        response = self.client.post(
            self.graham_url,
            {"asset_id": self.asset.id, "lpa": "0.00", "vpa": "10.00"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["detail"], "O LPA deve ser maior que zero.")

    def test_projected_calculation_success(self):
        self.authenticate()

        response = self.client.post(
            self.projected_url,
            {
                "asset_id": self.asset.id,
                "dpa": "2.4000",
                "average_dividend_yield": "0.0800",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["asset"], "BBAS3")
        self.assertEqual(str(response.data["raw_price"]), "30.00")
        self.assertEqual(str(response.data["price_ceiling"]), "30.40")
        self.assertEqual(ProjectedAnalysis.objects.count(), 1)

    def test_projected_calculation_invalid_value(self):
        self.authenticate()

        response = self.client.post(
            self.projected_url,
            {
                "asset_id": self.asset.id,
                "dpa": "2.4000",
                "average_dividend_yield": "0.0000",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data["detail"],
            "O Dividend Yield médio deve ser maior que zero.",
        )

    def test_barsi_calculation_success(self):
        self.authenticate()

        response = self.client.post(
            self.barsi_url,
            {
                "asset_id": self.asset.id,
                "current_price": "20.00",
                "target_yield": "0.0600",
                "dividend_1": "1.0000",
                "dividend_2": "1.0000",
                "dividend_3": "1.0000",
                "dividend_4": "1.0000",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["asset"], "BBAS3")
        self.assertEqual(str(response.data["annual_dividend"]), "4.0000")
        self.assertEqual(str(response.data["price_ceiling"]), "66.67")
        self.assertTrue(response.data["opportunity"])
        self.assertEqual(BarsiAnalysis.objects.count(), 1)

    def test_barsi_calculation_invalid_value(self):
        self.authenticate()

        response = self.client.post(
            self.barsi_url,
            {
                "asset_id": self.asset.id,
                "current_price": "20.00",
                "target_yield": "0.0600",
                "dividend_1": "-1.0000",
                "dividend_2": "1.0000",
                "dividend_3": "1.0000",
                "dividend_4": "1.0000",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["detail"], "Os dividendos não podem ser negativos.")

    def test_graham_history(self):
        self.authenticate()
        GrahamAnalysis.objects.create(
            asset=self.asset,
            lpa=Decimal("2.00"),
            vpa=Decimal("10.00"),
            fair_price=Decimal("21.21"),
        )

        response = self.client.get(self.graham_history_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["asset_ticker"], "BBAS3")

    def test_projected_history(self):
        self.authenticate()
        ProjectedAnalysis.objects.create(
            asset=self.asset,
            dpa=Decimal("2.4000"),
            average_dividend_yield=Decimal("0.0800"),
            raw_price=Decimal("30.00"),
            price_ceiling=Decimal("30.40"),
        )

        response = self.client.get(self.projected_history_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["asset_ticker"], "BBAS3")

    def test_barsi_history(self):
        self.authenticate()
        BarsiAnalysis.objects.create(
            asset=self.asset,
            annual_dividend=Decimal("4.0000"),
            current_price=Decimal("20.00"),
            target_yield=Decimal("0.0600"),
            price_ceiling=Decimal("66.67"),
            margin=Decimal("46.67"),
            opportunity=True,
        )

        response = self.client.get(self.barsi_history_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["asset_ticker"], "BBAS3")