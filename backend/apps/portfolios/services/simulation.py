from decimal import Decimal, ROUND_HALF_UP


from apps.valuation.models import BarsiAnalysis, GrahamAnalysis, ProjectedAnalysis

MONEY_QUANTIZER = Decimal("0.01")
PERCENT_QUANTIZER = Decimal("0.01")
ZERO = Decimal("0.00")
HUNDRED = Decimal("100")


def quantize_money(value: Decimal) -> Decimal:
    return Decimal(value).quantize(MONEY_QUANTIZER, rounding=ROUND_HALF_UP)


def quantize_percent(value: Decimal) -> Decimal:
    return Decimal(value).quantize(PERCENT_QUANTIZER, rounding=ROUND_HALF_UP)


def percentage(part: Decimal, total: Decimal) -> Decimal:
    if total <= 0:
        return ZERO
    return quantize_percent((part / total) * HUNDRED)


class PortfolioSimulationService:

    def __init__(self, portfolio):
        self.portfolio = portfolio

    def simulate(self):
        portfolio = self.portfolio

        items = list(
            portfolio.items.select_related("asset").all()
        )

        asset_ids = [item.asset_id for item in items]

        projected_map = self._latest_by_asset(
            ProjectedAnalysis.objects.filter(asset_id__in=asset_ids)
        )
        barsi_map = self._latest_by_asset(
            BarsiAnalysis.objects.filter(asset_id__in=asset_ids)
        )
        graham_map = self._latest_by_asset(
            GrahamAnalysis.objects.filter(asset_id__in=asset_ids)
        )

        simulated_items = []

        covered_items = 0
        opportunities_count = 0

        total_current_value = Decimal("0.00")
        total_invested = Decimal("0.00")
        covered_current_value = Decimal("0.00")
        total_target_value = Decimal("0.00")
        total_estimated_return_value = Decimal("0.00")
        total_opportunity_value = Decimal("0.00")

        for item in items:
            quantity = Decimal(str(item.quantity))
            current_price = Decimal(str(item.current_price))
            invested_amount = Decimal(str(item.invested_amount))
            current_value = Decimal(str(item.current_value))

            total_invested += invested_amount
            total_current_value += current_value

            target_data = self._resolve_target(
                item=item,
                projected_map=projected_map,
                barsi_map=barsi_map,
                graham_map=graham_map,
            )

            price_ceiling = target_data["price_ceiling"]
            price_ceiling_source = target_data["price_ceiling_source"]
            graham_fair_price = target_data["graham_fair_price"]

            if price_ceiling is None:
                simulated_items.append(
                    {
                        "id": item.id,
                        "portfolio": item.portfolio_id,
                        "asset": item.asset_id,
                        "asset_ticker": item.asset.ticker,
                        "asset_name": item.asset.name,
                        "quantity": item.quantity,
                        "average_price": item.average_price,
                        "current_price": item.current_price,
                        "invested_amount": item.invested_amount,
                        "current_value": item.current_value,
                        "unrealized_gain": item.unrealized_gain,
                        "unrealized_gain_pct": item.unrealized_gain_pct,
                        "price_ceiling": None,
                        "price_ceiling_source": None,
                        "margin_to_ceiling": None,
                        "margin_to_ceiling_pct": None,
                        "estimated_return_value": None,
                        "estimated_return_pct": None,
                        "opportunity_value": Decimal("0.00"),
                        "is_opportunity": False,
                        "graham_fair_price": graham_fair_price,
                        "notes": item.notes,
                    }
                )
                continue

            covered_items += 1
            covered_current_value += current_value

            margin_to_ceiling = quantize_money(price_ceiling - current_price)
            margin_to_ceiling_pct = percentage(price_ceiling - current_price, current_price)

            target_position_value = quantize_money(price_ceiling * quantity)
            estimated_return_value = quantize_money(target_position_value - current_value)
            estimated_return_pct = percentage(estimated_return_value, current_value)

            is_opportunity = current_price <= price_ceiling
            opportunity_value = (
                quantize_money((price_ceiling - current_price) * quantity)
                if is_opportunity
                else Decimal("0.00")
            )

            if is_opportunity:
                opportunities_count += 1

            total_target_value += target_position_value
            total_estimated_return_value += estimated_return_value
            total_opportunity_value += opportunity_value

            simulated_items.append(
                {
                    "id": item.id,
                    "portfolio": item.portfolio_id,
                    "asset": item.asset_id,
                    "asset_ticker": item.asset.ticker,
                    "asset_name": item.asset.name,
                    "quantity": item.quantity,
                    "average_price": item.average_price,
                    "current_price": item.current_price,
                    "invested_amount": item.invested_amount,
                    "current_value": item.current_value,
                    "unrealized_gain": item.unrealized_gain,
                    "unrealized_gain_pct": item.unrealized_gain_pct,
                    "price_ceiling": price_ceiling,
                    "price_ceiling_source": price_ceiling_source,
                    "margin_to_ceiling": margin_to_ceiling,
                    "margin_to_ceiling_pct": margin_to_ceiling_pct,
                    "estimated_return_value": estimated_return_value,
                    "estimated_return_pct": estimated_return_pct,
                    "opportunity_value": opportunity_value,
                    "is_opportunity": is_opportunity,
                    "graham_fair_price": graham_fair_price,
                    "notes": item.notes,
                }
            )

        summary = {
            "portfolio_id": portfolio.id,
            "portfolio_name": portfolio.name,
            "total_items": len(items),
            "covered_items": covered_items,
            "uncovered_items": len(items) - covered_items,
            "coverage_by_count_pct": percentage(
                Decimal(str(covered_items)),
                Decimal(str(len(items))) if items else Decimal("0.00"),
            ),
            "coverage_by_value_pct": percentage(covered_current_value, total_current_value),
            "total_invested": quantize_money(total_invested),
            "total_current_value": quantize_money(total_current_value),
            "total_unrealized_gain": quantize_money(total_current_value - total_invested),
            "total_unrealized_gain_pct": percentage(
                total_current_value - total_invested,
                total_invested,
            ),
            "covered_current_value": quantize_money(covered_current_value),
            "total_target_value": quantize_money(total_target_value),
            "total_estimated_return_value": quantize_money(total_estimated_return_value),
            "total_estimated_return_pct": percentage(
                total_estimated_return_value,
                covered_current_value,
            ),
            "total_opportunity_value": quantize_money(total_opportunity_value),
            "opportunities_count": opportunities_count,
        }

        simulated_items.sort(
            key=lambda item: (
                item["price_ceiling"] is None,
                -(item["opportunity_value"] or Decimal("0.00")),
            )
        )

        return {
            "summary": summary,
            "items": simulated_items,
        }

    def _latest_by_asset(self, queryset):
        latest = {}
        for analysis in queryset.order_by("asset_id", "-created_at"):
            if analysis.asset_id not in latest:
                latest[analysis.asset_id] = analysis
        return latest

    def _resolve_target(self, item, projected_map, barsi_map, graham_map):
        if item.target_price is not None:
            return {
                "price_ceiling": item.target_price,
                "price_ceiling_source": "manual",
                "graham_fair_price": self._graham_price(item.asset_id, graham_map),
            }

        projected = projected_map.get(item.asset_id)
        if projected is not None:
            return {
                "price_ceiling": projected.price_ceiling,
                "price_ceiling_source": "projected",
                "graham_fair_price": self._graham_price(item.asset_id, graham_map),
            }

        barsi = barsi_map.get(item.asset_id)
        if barsi is not None:
            return {
                "price_ceiling": barsi.price_ceiling,
                "price_ceiling_source": "barsi",
                "graham_fair_price": self._graham_price(item.asset_id, graham_map),
            }

        return {
            "price_ceiling": None,
            "price_ceiling_source": None,
            "graham_fair_price": self._graham_price(item.asset_id, graham_map),
        }

    def _graham_price(self, asset_id, graham_map):
        graham = graham_map.get(asset_id)
        return graham.fair_price if graham is not None else None