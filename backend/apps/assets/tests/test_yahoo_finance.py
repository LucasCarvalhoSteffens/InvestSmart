from datetime import date
from decimal import Decimal
from unittest.mock import patch

import pandas as pd
from django.test import TestCase
from django.utils import timezone

from apps.assets.models import Asset, Dividend
from apps.assets.services import yahoo_finance
from apps.assets.services.yahoo_finance import MarketDataUnavailable


class FakeTicker:
    fast_info = {
        "last_price": 20.40,
    }

    def get_info(self):
        return {
            "longName": "Banco do Brasil S.A.",
            "sector": "Financial Services",
            "currency": "BRL",
            "trailingEps": 2.5,
            "bookValue": 10.25,
            "dividendYield": 0.08,
            "payoutRatio": 0.45,
            "sharesOutstanding": 1000000,
        }

    @property
    def dividends(self):
        index = pd.to_datetime(
            [
                date(2026, 1, 10),
                date(2026, 4, 10),
            ]
        )

        return pd.Series(
            [
                1.0,
                1.2,
            ],
            index=index,
        )


class EmptyTicker:
    fast_info = {}

    def get_info(self):
        return {}

    @property
    def dividends(self):
        return pd.Series(dtype="float64")

    def history(self, period="5d", interval="1d"):
        return pd.DataFrame()


def yahoo_payload():
    return {
        "ticker": "BBAS3.SA",
        "name": "Banco do Brasil S.A.",
        "sector": "Financial Services",
        "current_price": Decimal("20.40"),
        "currency": "BRL",
        "lpa": Decimal("2.5000"),
        "vpa": Decimal("10.2500"),
        "annual_dividend": Decimal("2.2000"),
        "dividend_yield": Decimal("0.080000"),
        "payout_ratio": Decimal("0.450000"),
        "shares_outstanding": 1000000,
        "dividends_last_12_months": [
            {
                "payment_date": date(2026, 1, 10),
                "value": Decimal("1.0000"),
            },
            {
                "payment_date": date(2026, 4, 10),
                "value": Decimal("1.2000"),
            },
        ],
    }


class YahooFinanceServiceTests(TestCase):
    def test_normalize_ticker_adds_sa_suffix_for_brazilian_stock(self):
        self.assertEqual(yahoo_finance.normalize_ticker("bbas3"), "BBAS3.SA")

    def test_normalize_ticker_keeps_existing_suffix(self):
        self.assertEqual(yahoo_finance.normalize_ticker("BBAS3.SA"), "BBAS3.SA")

    def test_decimal_or_none_returns_none_for_invalid_value(self):
        self.assertIsNone(yahoo_finance.decimal_or_none(None))
        self.assertIsNone(yahoo_finance.decimal_or_none("invalid"))

    def test_normalize_yield_converts_percentage_to_decimal(self):
        result = yahoo_finance.normalize_yield(8)

        self.assertEqual(result, Decimal("0.080000"))

    def test_calculate_annual_dividend_returns_total(self):
        dividends = [
            {"value": Decimal("1.0000")},
            {"value": Decimal("1.2000")},
        ]

        result = yahoo_finance.calculate_annual_dividend(dividends)

        self.assertEqual(result, Decimal("2.2000"))

    @patch("apps.assets.services.yahoo_finance.yf.Ticker", return_value=FakeTicker())
    def test_fetch_from_yahoo_returns_market_data(self, mock_ticker):
        result = yahoo_finance.fetch_from_yahoo("BBAS3")

        self.assertEqual(result["ticker"], "BBAS3.SA")
        self.assertEqual(result["name"], "Banco do Brasil S.A.")
        self.assertEqual(result["sector"], "Financial Services")
        self.assertEqual(result["current_price"], Decimal("20.40"))
        self.assertEqual(result["lpa"], Decimal("2.5000"))
        self.assertEqual(result["vpa"], Decimal("10.2500"))
        self.assertEqual(result["annual_dividend"], Decimal("2.2000"))
        self.assertEqual(result["dividend_yield"], Decimal("0.080000"))
        self.assertEqual(len(result["dividends_last_12_months"]), 2)

        mock_ticker.assert_called_once_with("BBAS3.SA")

    @patch("apps.assets.services.yahoo_finance.sleep", return_value=None)
    @patch("apps.assets.services.yahoo_finance.yf.Ticker", return_value=EmptyTicker())
    def test_fetch_from_yahoo_raises_when_price_is_unavailable(
        self,
        mock_ticker,
        mock_sleep,
    ):
        with self.assertRaises(MarketDataUnavailable):
            yahoo_finance.fetch_from_yahoo("BBAS3")

        self.assertEqual(mock_ticker.call_count, 3)

    @patch("apps.assets.services.yahoo_finance.fetch_from_yahoo")
    def test_sync_asset_from_yahoo_creates_asset_and_dividends(self, mock_fetch):
        mock_fetch.return_value = yahoo_payload()

        result = yahoo_finance.sync_asset_from_yahoo("BBAS3", force_refresh=True)

        self.assertEqual(result.asset.ticker, "BBAS3.SA")
        self.assertEqual(Asset.objects.count(), 1)
        self.assertEqual(Dividend.objects.count(), 2)

        asset = Asset.objects.first()
        self.assertEqual(asset.current_price, Decimal("20.40"))
        self.assertEqual(asset.data_source, "yfinance")

    @patch("apps.assets.services.yahoo_finance.fetch_from_yahoo")
    def test_sync_asset_from_yahoo_uses_cache_when_recent(self, mock_fetch):
        asset = Asset.objects.create(
            ticker="BBAS3.SA",
            name="Banco do Brasil",
            sector="Financial Services",
            current_price=Decimal("20.40"),
            currency="BRL",
            data_source="yfinance",
            last_sync_at=timezone.now(),
        )

        result = yahoo_finance.sync_asset_from_yahoo("BBAS3.SA")

        self.assertEqual(result.asset, asset)
        mock_fetch.assert_not_called()