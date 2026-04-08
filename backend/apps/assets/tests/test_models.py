from decimal import Decimal

from django.test import TestCase

from apps.assets.models import Asset, Dividend


class AssetModelTests(TestCase):
    def test_asset_str(self):
        asset = Asset.objects.create(
            ticker="WEGE3",
            name="WEG",
            sector="Industrial",
            current_price=Decimal("50.00"),
        )

        self.assertEqual(str(asset), "WEGE3")

    def test_dividend_str(self):
        asset = Asset.objects.create(
            ticker="ITSA4",
            name="Itaúsa",
            sector="Financeiro",
            current_price=Decimal("10.00"),
        )
        dividend = Dividend.objects.create(
            asset=asset,
            value=Decimal("0.1234"),
            payment_date="2025-01-15",
        )

        self.assertEqual(str(dividend), "ITSA4 - 0.1234")