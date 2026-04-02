from rest_framework import serializers
from apps.assets.models import Asset


class AssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = ["id", "ticker", "name", "sector", "current_price", "created_at"]
        read_only_fields = ["id", "created_at"]