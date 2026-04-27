from decimal import Decimal
from types import SimpleNamespace
from unittest.mock import patch

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from apps.assets.models import Asset

User = get_user_model()


class AssetYahooAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="lucas",
            email="lucas@email.com",
            password="12345678",
        )
        self.client.force_authenticate(user=self.user)

    @patch("apps.assets.api.views.search_assets")
    def test_search_assets_returns_suggestions(self, mock_search):
        mock_search.return_value = [
            {
                "ticker": "PETR4.SA",
                "name": "Petrobras",
                "source": "yfinance",
            }
        ]

        response = self.client.get("/api/assets/search/", {"q": "PET"})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]["ticker"], "PETR4.SA")
        mock_search.assert_called_once_with(query="PET", limit=10)

    @patch("apps.assets.api.views.search_assets")
    def test_search_assets_returns_empty_list_when_query_is_too_short(
        self,
        mock_search,
    ):
        response = self.client.get("/api/assets/search/", {"q": "P"})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])
        mock_search.assert_not_called()

    @patch("apps.assets.api.views.sync_asset_from_yahoo")
    def test_sync_asset_returns_persisted_asset(self, mock_sync):
        asset = Asset.objects.create(
            ticker="PETR4.SA",
            name="Petrobras",
            sector="Energy",
            current_price=Decimal("35.50"),
        )

        mock_sync.return_value = SimpleNamespace(asset=asset)

        response = self.client.post(
            "/api/assets/sync/",
            {
                "ticker": "PETR4",
                "force_refresh": True,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["ticker"], "PETR4.SA")
        mock_sync.assert_called_once_with(ticker="PETR4", force_refresh=True)