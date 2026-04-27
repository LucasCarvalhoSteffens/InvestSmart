import yfinance as yf


def normalize_query(query: str) -> str:
    return query.strip().upper()


def is_brazilian_asset(symbol: str) -> bool:
    return symbol.upper().endswith(".SA")


def build_asset_result(ticker: str, name: str = "", source: str = "yfinance"):
    return {
        "ticker": ticker,
        "name": name or ticker,
        "source": source,
    }


def search_assets(query: str, limit: int = 10):
    normalized_query = normalize_query(query)

    if len(normalized_query) < 2:
        return []

    try:
        search = yf.Search(
            normalized_query,
            max_results=limit,
            news_count=0,
        )

        quotes = search.quotes or []
    except Exception:
        return []

    results = []
    seen = set()

    for quote in quotes:
        symbol = str(quote.get("symbol", "")).upper()

        if not symbol:
            continue

        if not is_brazilian_asset(symbol):
            continue

        quote_type = str(quote.get("quoteType", "")).upper()

        if quote_type and quote_type not in ["EQUITY", "ETF"]:
            continue

        if symbol in seen:
            continue

        seen.add(symbol)

        results.append(
            build_asset_result(
                ticker=symbol,
                name=quote.get("longname")
                or quote.get("shortname")
                or quote.get("name")
                or symbol,
            )
        )

    return results