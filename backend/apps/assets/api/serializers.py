from rest_framework import serializers

from apps.assets.models import Asset, Dividend


class DividendSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dividend
        fields = [
            "id",
            "value",
            "payment_date",
            "created_at",
        ]
        read_only_fields = fields


class AssetSerializer(serializers.ModelSerializer):
    dividends = DividendSerializer(many=True, read_only=True)

    class Meta:
        model = Asset
        fields = [
            "id",
            "ticker",
            "name",
            "sector",
            "current_price",
            "currency",
            "lpa",
            "vpa",
            "annual_dividend",
            "dividend_yield",
            "payout_ratio",
            "shares_outstanding",
            "data_source",
            "last_sync_at",
            "dividends",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "currency",
            "lpa",
            "vpa",
            "annual_dividend",
            "dividend_yield",
            "payout_ratio",
            "shares_outstanding",
            "data_source",
            "last_sync_at",
            "dividends",
            "created_at",
            "updated_at",
        ]


class AssetSyncSerializer(serializers.Serializer):
    ticker = serializers.CharField(max_length=20)
    force_refresh = serializers.BooleanField(required=False, default=False)