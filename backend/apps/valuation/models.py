from django.db import models


class BaseAnalysis(models.Model):
    asset = models.ForeignKey(
        "assets.Asset",
        on_delete=models.CASCADE,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True
        ordering = ["-created_at"]


class BarsiAnalysis(BaseAnalysis):
    asset = models.ForeignKey(
        "assets.Asset",
        on_delete=models.CASCADE,
        related_name="barsi_analyses",
    )
    annual_dividend = models.DecimalField(max_digits=10, decimal_places=4)
    current_price = models.DecimalField(max_digits=10, decimal_places=2)
    target_yield = models.DecimalField(max_digits=5, decimal_places=4, default=0.06)
    price_ceiling = models.DecimalField(max_digits=10, decimal_places=2)
    margin = models.DecimalField(max_digits=10, decimal_places=2)
    opportunity = models.BooleanField()

    class Meta(BaseAnalysis.Meta):
        verbose_name = "Análise Barsi"
        verbose_name_plural = "Análises Barsi"
        db_table = "assets_barsianalysis"

    def __str__(self):
        return f"Barsi Analysis - {self.asset.ticker}"


class GrahamAnalysis(BaseAnalysis):
    asset = models.ForeignKey(
        "assets.Asset",
        on_delete=models.CASCADE,
        related_name="graham_analyses",
    )
    lpa = models.DecimalField(max_digits=10, decimal_places=2)
    vpa = models.DecimalField(max_digits=10, decimal_places=2)
    fair_price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta(BaseAnalysis.Meta):
        verbose_name = "Análise Graham"
        verbose_name_plural = "Análises Graham"
        db_table = "assets_grahamanalysis"

    def __str__(self):
        return f"{self.asset.ticker} - Graham - {self.fair_price}"


class ProjectedAnalysis(BaseAnalysis):
    asset = models.ForeignKey(
        "assets.Asset",
        on_delete=models.CASCADE,
        related_name="projected_analyses",
    )
    dpa = models.DecimalField(max_digits=10, decimal_places=4)
    average_dividend_yield = models.DecimalField(max_digits=5, decimal_places=4)
    raw_price = models.DecimalField(max_digits=10, decimal_places=2)
    price_ceiling = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta(BaseAnalysis.Meta):
        verbose_name = "Análise Projetiva"
        verbose_name_plural = "Análises Projetivas"
        db_table = "assets_projectedanalysis"

    def __str__(self):
        return f"{self.asset.ticker} - Projetivo - {self.price_ceiling}"