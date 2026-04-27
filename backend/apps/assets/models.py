from decimal import Decimal

from django.db import models


class Asset(models.Model):
    ticker = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=150, blank=True, default="")
    sector = models.CharField(max_length=100, blank=True, default="")
    current_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal("0.00"),
    )

    currency = models.CharField(max_length=10, blank=True, default="BRL")
    lpa = models.DecimalField(max_digits=12, decimal_places=4, null=True, blank=True)
    vpa = models.DecimalField(max_digits=12, decimal_places=4, null=True, blank=True)
    annual_dividend = models.DecimalField(
        max_digits=12,
        decimal_places=4,
        null=True,
        blank=True,
    )
    dividend_yield = models.DecimalField(
        max_digits=8,
        decimal_places=6,
        null=True,
        blank=True,
        help_text="Dividend yield em formato decimal. Ex: 0.06 = 6%",
    )
    payout_ratio = models.DecimalField(
        max_digits=8,
        decimal_places=6,
        null=True,
        blank=True,
    )
    shares_outstanding = models.BigIntegerField(null=True, blank=True)

    data_source = models.CharField(max_length=50, blank=True, default="manual")
    last_sync_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["ticker"]
        verbose_name = "Ativo"
        verbose_name_plural = "Ativos"
        db_table = "assets_asset"

    def __str__(self):
        return self.ticker


class Dividend(models.Model):
    asset = models.ForeignKey(
        "assets.Asset",
        on_delete=models.CASCADE,
        related_name="dividends",
    )
    value = models.DecimalField(max_digits=12, decimal_places=4)
    payment_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-payment_date", "-created_at"]
        verbose_name = "Dividendo"
        verbose_name_plural = "Dividendos"
        db_table = "assets_dividend"
        constraints = [
            models.UniqueConstraint(
                fields=["asset", "payment_date"],
                name="unique_dividend_per_asset_date",
            )
        ]

    def __str__(self):
        return f"{self.asset.ticker} - {self.value}"