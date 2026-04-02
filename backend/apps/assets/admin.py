from django.contrib import admin
from apps.assets.models import Asset, Dividend


@admin.register(Asset)
class AssetAdmin(admin.ModelAdmin):
    list_display = ("ticker", "name", "sector", "current_price", "created_at")
    search_fields = ("ticker", "name", "sector")


@admin.register(Dividend)
class DividendAdmin(admin.ModelAdmin):
    list_display = ("asset", "value", "payment_date", "created_at")
    search_fields = ("asset__ticker",)
    list_filter = ("payment_date",)