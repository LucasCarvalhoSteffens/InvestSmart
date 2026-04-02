from decimal import Decimal, InvalidOperation, ROUND_HALF_UP


def mround(value, multiple):
    value = Decimal(str(value))
    multiple = Decimal(str(multiple))

    if multiple <= 0:
        raise ValueError("O múltiplo deve ser maior que zero.")

    quotient = (value / multiple).quantize(Decimal("1"), rounding=ROUND_HALF_UP)
    return (quotient * multiple).quantize(Decimal("0.01"))


def calculate_projected_price(dpa, average_dividend_yield):
    try:
        dpa = Decimal(str(dpa))
        average_dividend_yield = Decimal(str(average_dividend_yield))
    except (InvalidOperation, TypeError, ValueError):
        raise ValueError("Os valores informados devem ser numéricos.")

    if dpa <= 0:
        raise ValueError("O DPA deve ser maior que zero.")

    if average_dividend_yield <= 0:
        raise ValueError("O Dividend Yield médio deve ser maior que zero.")

    raw_price = dpa / average_dividend_yield
    price_ceiling = mround(raw_price, Decimal("0.8"))

    return {
        "raw_price": raw_price.quantize(Decimal("0.01")),
        "price_ceiling": price_ceiling,
    }