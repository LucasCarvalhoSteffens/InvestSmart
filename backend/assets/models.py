from django.db import models


class Asset(models.Model):

    ticker = models.CharField(max_length=10, unique=True)

    name = models.CharField(max_length=100)

    sector = models.CharField(max_length=100)

    current_price = models.DecimalField(max_digits=10, decimal_places=2)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.ticker


class Dividend(models.Model):

    asset = models.ForeignKey(
        Asset,
        on_delete=models.CASCADE,
        related_name="dividends"
    )

    value = models.DecimalField(max_digits=10, decimal_places=4)

    payment_date = models.DateField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.asset.ticker} - {self.value}"


class BarsiAnalysis(models.Model):

    asset = models.ForeignKey(
        Asset,
        on_delete=models.CASCADE,
        related_name="barsi_analysis"
    )

    annual_dividend = models.DecimalField(
        max_digits=10,
        decimal_places=4
    )

    current_price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    target_yield = models.DecimalField(
        max_digits=5,
        decimal_places=4,
        default=0.06
    )

    price_ceiling = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    margin = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    opportunity = models.BooleanField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Barsi Analysis - {self.asset.ticker}"