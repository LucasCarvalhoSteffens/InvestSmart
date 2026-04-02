from django.db import models


class Asset(models.Model):
    ticker = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)
    sector = models.CharField(max_length=100)
    current_price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

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
    value = models.DecimalField(max_digits=10, decimal_places=4)
    payment_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-payment_date", "-created_at"]
        verbose_name = "Dividendo"
        verbose_name_plural = "Dividendos"
        db_table = "assets_dividend"

    def __str__(self):
        return f"{self.asset.ticker} - {self.value}"