class BarsiCalculator:

    def __init__(self, dividends_last_12_months, current_price, target_yield=0.06):
        self.dividends = dividends_last_12_months
        self.current_price = current_price
        self.target_yield = target_yield

    def calculate(self):

        annual_dividend = sum(self.dividends)

        dividend_yield_current = annual_dividend / self.current_price

        price_ceiling = annual_dividend / self.target_yield

        margin = price_ceiling - self.current_price

        opportunity = price_ceiling > self.current_price

        status = "BUY" if opportunity else "DO NOT BUY"

        return {
            "method": "Barsi",
            "annual_dividend": round(annual_dividend, 4),
            "current_price": self.current_price,
            "current_dividend_yield": round(dividend_yield_current, 4),
            "target_dividend_yield": self.target_yield,
            "price_ceiling": round(price_ceiling, 2),
            "margin": round(margin, 2),
            "opportunity": opportunity,
            "status": status
        }