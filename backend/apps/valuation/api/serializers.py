from rest_framework import serializers


class BaseTickerSerializer(serializers.Serializer):
    ticker = serializers.CharField(max_length=20)
    force_refresh = serializers.BooleanField(required=False, default=False)
    persist = serializers.BooleanField(required=False, default=False)


class GrahamInputSerializer(BaseTickerSerializer):
    lpa = serializers.DecimalField(
        max_digits=12,
        decimal_places=4,
        required=False,
    )
    vpa = serializers.DecimalField(
        max_digits=12,
        decimal_places=4,
        required=False,
    )


class ProjectedInputSerializer(BaseTickerSerializer):
    dpa = serializers.DecimalField(
        max_digits=12,
        decimal_places=4,
        required=False,
    )
    average_dividend_yield = serializers.DecimalField(
        max_digits=8,
        decimal_places=6,
        required=False,
    )


class BarsiInputSerializer(BaseTickerSerializer):
    target_yield = serializers.DecimalField(
        max_digits=8,
        decimal_places=6,
        required=False,
        default="0.0600",
    )
    current_price = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        required=False,
    )
    dividends = serializers.ListField(
        child=serializers.DecimalField(max_digits=12, decimal_places=4),
        required=False,
        allow_empty=False,
    )