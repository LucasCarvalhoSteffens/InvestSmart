from decimal import Decimal

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.assets.models import Asset

User = get_user_model()


class AssetAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="lucas", password="12345678")
        self.asset = Asset.objects.create(
            ticker="WEGE3",
            name="WEG",
            sector="Industrial",
            current_price=Decimal("50.00"),
        )
        self.list_url = reverse("assets-list")
        self.detail_url = reverse("assets-detail", args=[self.asset.id])

    def authenticate(self):
        self.client.force_authenticate(user=self.user)

    def test_list_requires_authentication(self):
        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_assets(self):
        self.authenticate()

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["ticker"], "WEGE3")

    def test_create_asset(self):
        self.authenticate()

        payload = {
            "ticker": "VALE3",
            "name": "Vale",
            "sector": "Mineração",
            "current_price": "55.40",
        }
        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Asset.objects.count(), 2)
        self.assertTrue(Asset.objects.filter(ticker="VALE3").exists())

    def test_update_asset(self):
        self.authenticate()

        payload = {
            "ticker": "WEGE3",
            "name": "WEG Atualizada",
            "sector": "Industrial",
            "current_price": "52.00",
        }
        response = self.client.put(self.detail_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.asset.refresh_from_db()
        self.assertEqual(self.asset.name, "WEG Atualizada")
        self.assertEqual(self.asset.current_price, Decimal("52.00"))

    def test_delete_asset(self):
        self.authenticate()

        response = self.client.delete(self.detail_url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Asset.objects.filter(id=self.asset.id).exists())

    def test_create_asset_with_duplicate_ticker_returns_400(self):
        self.authenticate()

        payload = {
            "ticker": "WEGE3",
            "name": "Outra WEG",
            "sector": "Industrial",
            "current_price": "60.00",
        }
        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("ticker", response.data)