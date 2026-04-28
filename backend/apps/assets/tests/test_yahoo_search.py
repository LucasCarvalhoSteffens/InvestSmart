from unittest.mock import patch

from django.test import SimpleTestCase

from apps.assets.services.yahoo_search import search_assets


class FakeYahooSearch:
    def __init__(self, query, max_results=10, news_count=0):
        self.query = query
        self.max_results = max_results
        self.news_count = news_count
        self.quotes = [
            {
                "symbol": "PETR4.SA",
                "quoteType": "EQUITY",
                "longname": "Petróleo Brasileiro S.A. - Petrobras",
            },
            {
                "symbol": "PETR3.SA",
                "quoteType": "EQUITY",
                "shortname": "Petrobras ON",
            },
            {
                "symbol": "PETR4.SA",
                "quoteType": "EQUITY",
                "shortname": "Duplicado",
            },
            {
                "symbol": "AAPL",
                "quoteType": "EQUITY",
                "shortname": "Apple Inc.",
            },
            {
                "symbol": "BTC-USD",
                "quoteType": "CRYPTOCURRENCY",
                "shortname": "Bitcoin",
            },
        ]


class YahooSearchServiceTests(SimpleTestCase):
    @patch("apps.assets.services.yahoo_search.yf.Search", side_effect=FakeYahooSearch)
    def test_search_assets_returns_only_brazilian_assets_without_duplicates(
        self,
        mock_search,
    ):
        result = search_assets("PET", limit=10)

        self.assertEqual(len(result), 2)
        self.assertEqual(result[0]["ticker"], "PETR4.SA")
        self.assertEqual(result[0]["source"], "yfinance")
        self.assertEqual(result[1]["ticker"], "PETR3.SA")

        mock_search.assert_called_once()

    @patch("apps.assets.services.yahoo_search.yf.Search")
    def test_search_assets_returns_empty_list_when_query_is_too_short(
        self,
        mock_search,
    ):
        result = search_assets("P", limit=10)

        self.assertEqual(result, [])
        mock_search.assert_not_called()

    @patch("apps.assets.services.yahoo_search.yf.Search", side_effect=Exception("API error"))
    def test_search_assets_returns_empty_list_when_yahoo_fails(self, mock_search):
        result = search_assets("PET", limit=10)

        self.assertEqual(result, [])
        mock_search.assert_called_once()