from django.contrib import admin

from apps.portfolios.models import Portfolio, PortfolioItem, PortfolioItemAlert


@admin.register(Portfolio)
class PortfolioAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "user", "created_at", "updated_at")
    search_fields = ("name", "user__username", "user__email")
    list_filter = ("created_at", "updated_at")


@admin.register(PortfolioItem)
class PortfolioItemAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "portfolio",
        "asset",
        "quantity",
        "average_price",
        "target_price",
        "created_at",
    )
    search_fields = (
        "portfolio__name",
        "portfolio__user__username",
        "asset__ticker",
        "asset__name",
    )
    list_filter = ("created_at", "updated_at")


@admin.register(PortfolioItemAlert)
class PortfolioItemAlertAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "portfolio_item",
        "alert_type",
        "threshold_price",
        "is_active",
        "last_triggered_at",
        "created_at",
    )
    search_fields = (
        "portfolio_item__portfolio__name",
        "portfolio_item__asset__ticker",
    )
    list_filter = ("alert_type", "is_active", "created_at")