from decimal import Decimal, ROUND_HALF_UP

from django.conf import settings
from django.db import models


MONEY_QUANTIZER = Decimal("0.01")
PERCENT_QUANTIZER = Decimal("0.01")


def quantize_money(value: Decimal) -> Decimal:
    return value.quantize(MONEY_QUANTIZER, rounding=ROUND_HALF_UP)


def quantize_percent(value: Decimal) -> Decimal:
    return value.quantize(PERCENT_QUANTIZER, rounding=ROUND_HALF_UP)


class Portfolio(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="portfolios",
    )
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at", "name"]
        verbose_name = "Carteira"
        verbose_name_plural = "Carteiras"
        db_table = "portfolios_portfolio"
        constraints = [
            models.UniqueConstraint(
                fields=["user", "name"],
                name="unique_portfolio_name_per_user",
            )
        ]

    def __str__(self) -> str:
        return f"{self.user.username} - {self.name}"

    @property
    def total_items(self) -> int:
        return self.items.count()

    @property
    def total_invested(self) -> Decimal:
        total = sum(
            (item.invested_amount for item in self.items.all()),
            Decimal("0.00"),
        )
        return quantize_money(total)

    @property
    def total_current_value(self) -> Decimal:
        total = sum(
            (item.current_value for item in self.items.all()),
            Decimal("0.00"),
        )
        return quantize_money(total)

    @property
    def total_unrealized_gain(self) -> Decimal:
        return quantize_money(self.total_current_value - self.total_invested)

    @property
    def total_unrealized_gain_pct(self) -> Decimal:
        if self.total_invested <= 0:
            return Decimal("0.00")

        pct = (self.total_unrealized_gain / self.total_invested) * Decimal("100")
        return quantize_percent(pct)


class PortfolioItem(models.Model):
    portfolio = models.ForeignKey(
        "portfolios.Portfolio",
        on_delete=models.CASCADE,
        related_name="items",
    )
    asset = models.ForeignKey(
        "assets.Asset",
        on_delete=models.CASCADE,
        related_name="portfolio_items",
    )
    quantity = models.PositiveIntegerField()
    average_price = models.DecimalField(max_digits=12, decimal_places=2)
    target_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
    )
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["portfolio__name", "asset__ticker"]
        verbose_name = "Item da Carteira"
        verbose_name_plural = "Itens da Carteira"
        db_table = "portfolios_portfolioitem"
        constraints = [
            models.UniqueConstraint(
                fields=["portfolio", "asset"],
                name="unique_asset_per_portfolio",
            )
        ]

    def __str__(self) -> str:
        return f"{self.portfolio.name} - {self.asset.ticker}"

    @property
    def current_price(self) -> Decimal:
        return self.asset.current_price

    @property
    def invested_amount(self) -> Decimal:
        total = Decimal(self.quantity) * self.average_price
        return quantize_money(total)

    @property
    def current_value(self) -> Decimal:
        total = Decimal(self.quantity) * self.asset.current_price
        return quantize_money(total)

    @property
    def unrealized_gain(self) -> Decimal:
        return quantize_money(self.current_value - self.invested_amount)

    @property
    def unrealized_gain_pct(self) -> Decimal:
        if self.invested_amount <= 0:
            return Decimal("0.00")

        pct = (self.unrealized_gain / self.invested_amount) * Decimal("100")
        return quantize_percent(pct)

    @property
    def is_below_target(self) -> bool:
        return self.target_price is not None and self.asset.current_price <= self.target_price

    @property
    def distance_to_target(self) -> Decimal | None:
        if self.target_price is None:
            return None
        return quantize_money(self.target_price - self.asset.current_price)


class PortfolioItemAlert(models.Model):
    class AlertType(models.TextChoices):
        BELOW_OR_EQUAL = "below_or_equal", "Preço menor ou igual"
        ABOVE_OR_EQUAL = "above_or_equal", "Preço maior ou igual"

    portfolio_item = models.ForeignKey(
        "portfolios.PortfolioItem",
        on_delete=models.CASCADE,
        related_name="alerts",
    )
    alert_type = models.CharField(
        max_length=20,
        choices=AlertType.choices,
    )
    threshold_price = models.DecimalField(max_digits=12, decimal_places=2)
    is_active = models.BooleanField(default=True)
    last_triggered_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Alerta do Item"
        verbose_name_plural = "Alertas do Item"
        db_table = "portfolios_portfolioitemalert"
        constraints = [
            models.UniqueConstraint(
                fields=["portfolio_item", "alert_type", "threshold_price"],
                name="unique_alert_per_item_type_threshold",
            )
        ]

    def __str__(self) -> str:
        return (
            f"{self.portfolio_item.asset.ticker} - "
            f"{self.get_alert_type_display()} - {self.threshold_price}"
        )

    @property
    def current_price(self) -> Decimal:
        return self.portfolio_item.asset.current_price

    @property
    def should_trigger(self) -> bool:
        if not self.is_active:
            return False

        if self.alert_type == self.AlertType.BELOW_OR_EQUAL:
            return self.current_price <= self.threshold_price

        if self.alert_type == self.AlertType.ABOVE_OR_EQUAL:
            return self.current_price >= self.threshold_price

        return False

class PortfolioAlertEvent(models.Model):
    class EventType(models.TextChoices):
        BELOW_OR_EQUAL_CEILING = (
            "below_or_equal_ceiling",
            "Preço abaixo ou igual ao preço teto",
        )
        ABOVE_CEILING = (
            "above_ceiling",
            "Preço acima do preço teto",
        )

    portfolio_item = models.ForeignKey(
        "portfolios.PortfolioItem",
        on_delete=models.CASCADE,
        related_name="alert_events",
    )
    event_type = models.CharField(
        max_length=40,
        choices=EventType.choices,
    )
    price_ceiling = models.DecimalField(max_digits=12, decimal_places=2)
    current_price = models.DecimalField(max_digits=12, decimal_places=2)
    price_ceiling_source = models.CharField(max_length=30, blank=True, default="")
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Evento de Alerta"
        verbose_name_plural = "Eventos de Alerta"
        db_table = "portfolios_portfolioalertevent"
        indexes = [
            models.Index(fields=["event_type", "created_at"]),
            models.Index(fields=["is_read", "created_at"]),
        ]

    def __str__(self) -> str:
        return f"{self.portfolio_item.asset.ticker} - {self.get_event_type_display()}"