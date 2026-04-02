from decimal import Decimal, InvalidOperation, ROUND_HALF_UP


class BarsiCalculator:
    def __init__(self, dividends_last_12_months, current_price, target_yield=0.06):
        self.dividends = dividends_last_12_months
        self.current_price = current_price
        self.target_yield = target_yield

    def calculate(self):
        try:
            dividends = [Decimal(str(dividend)) for dividend in self.dividends]
            current_price = Decimal(str(self.current_price))
            target_yield = Decimal(str(self.target_yield))
        except (InvalidOperation, TypeError, ValueError):
            raise ValueError("Os valores informados são inválidos.")

        if not dividends:
            raise ValueError("Informe ao menos um dividendo.")

        if any(dividend < 0 for dividend in dividends):
            raise ValueError("Os dividendos não podem ser negativos.")

        if current_price <= 0:
            raise ValueError("A cotação atual deve ser maior que zero.")

        if target_yield <= 0:
            raise ValueError("O dividend yield alvo deve ser maior que zero.")

        annual_dividend = sum(dividends)
        current_dividend_yield = annual_dividend / current_price
        price_ceiling = annual_dividend / target_yield
        margin = price_ceiling - current_price
        opportunity = price_ceiling > current_price
        status = "BUY" if opportunity else "DO NOT BUY"

        return {
            "method": "Barsi",
            "annual_dividend": annual_dividend.quantize(Decimal("0.0001"), rounding=ROUND_HALF_UP),
            "current_price": current_price.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP),
            "current_dividend_yield": current_dividend_yield.quantize(Decimal("0.0001"), rounding=ROUND_HALF_UP),
            "target_dividend_yield": target_yield.quantize(Decimal("0.0001"), rounding=ROUND_HALF_UP),
            "price_ceiling": price_ceiling.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP),
            "margin": margin.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP),
            "opportunity": opportunity,
            "status": status,
        }