from rest_framework import serializers
from apps.assets.models import Asset


class GrahamInputSerializer(serializers.Serializer):
    asset_id = serializers.PrimaryKeyRelatedField(queryset=Asset.objects.all(), source="asset")
    lpa = serializers.DecimalField(max_digits=10, decimal_places=2)
    vpa = serializers.DecimalField(max_digits=10, decimal_places=2)


class ProjectedInputSerializer(serializers.Serializer):
    asset_id = serializers.PrimaryKeyRelatedField(queryset=Asset.objects.all(), source="asset")
    dpa = serializers.DecimalField(max_digits=10, decimal_places=4)
    average_dividend_yield = serializers.DecimalField(max_digits=5, decimal_places=4)


class BarsiInputSerializer(serializers.Serializer):
    asset_id = serializers.PrimaryKeyRelatedField(queryset=Asset.objects.all(), source="asset")
    current_price = serializers.DecimalField(max_digits=10, decimal_places=2)
    target_yield = serializers.DecimalField(max_digits=5, decimal_places=4)
    dividend_1 = serializers.DecimalField(max_digits=10, decimal_places=4, required=False, default=0)
    dividend_2 = serializers.DecimalField(max_digits=10, decimal_places=4, required=False, default=0)
    dividend_3 = serializers.DecimalField(max_digits=10, decimal_places=4, required=False, default=0)
    dividend_4 = serializers.DecimalField(max_digits=10, decimal_places=4, required=False, default=0)