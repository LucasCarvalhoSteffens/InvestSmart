from decimal import Decimal, InvalidOperation
import math


def calculate_graham_price(lpa, vpa):
    """
    Graham Number:
    Preço Justo = sqrt(22.5 * LPA * VPA)

    Onde:
    - lpa: lucro por ação
    - vpa: valor patrimonial por ação
    """

    try:
        lpa = Decimal(str(lpa))
        vpa = Decimal(str(vpa))
    except (InvalidOperation, TypeError, ValueError):
        raise ValueError("Os valores informados devem ser numéricos.")

    if lpa <= 0:
        raise ValueError("O LPA deve ser maior que zero.")

    if vpa <= 0:
        raise ValueError("O VPA deve ser maior que zero.")

    result = Decimal(str(math.sqrt(Decimal("22.5") * lpa * vpa)))
    return result.quantize(Decimal("0.01"))