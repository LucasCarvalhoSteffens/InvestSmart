from django.contrib import admin
from apps.valuation.models import BarsiAnalysis, GrahamAnalysis, ProjectedAnalysis


@admin.register(BarsiAnalysis)
class BarsiAnalysisAdmin(admin.ModelAdmin):
    list_display = ("asset", "annual_dividend", "current_price", "target_yield", "price_ceiling", "opportunity", "created_at")
    search_fields = ("asset__ticker",)
    list_filter = ("opportunity", "created_at")


@admin.register(GrahamAnalysis)
class GrahamAnalysisAdmin(admin.ModelAdmin):
    list_display = ("asset", "lpa", "vpa", "fair_price", "created_at")
    search_fields = ("asset__ticker",)
    list_filter = ("created_at",)


@admin.register(ProjectedAnalysis)
class ProjectedAnalysisAdmin(admin.ModelAdmin):
    list_display = ("asset", "dpa", "average_dividend_yield", "raw_price", "price_ceiling", "created_at")
    search_fields = ("asset__ticker",)
    list_filter = ("created_at",)