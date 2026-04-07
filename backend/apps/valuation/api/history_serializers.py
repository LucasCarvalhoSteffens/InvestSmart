from rest_framework import serializers
from apps.valuation.models import BarsiAnalysis, GrahamAnalysis, ProjectedAnalysis

asset__ticker = "asset.ticker"

class GrahamAnalysisSerializer(serializers.ModelSerializer):
    asset_ticker = serializers.CharField(source=asset__ticker, read_only=True)

    class Meta:
        model = GrahamAnalysis
        fields = ["id", "asset", "asset_ticker", "lpa", "vpa", "fair_price", "created_at"]


class ProjectedAnalysisSerializer(serializers.ModelSerializer):
    asset_ticker = serializers.CharField(source=asset__ticker, read_only=True)

    class Meta:
        model = ProjectedAnalysis
        fields = ["id", "asset", "asset_ticker", "dpa", "average_dividend_yield", "raw_price", "price_ceiling", "created_at"]


class BarsiAnalysisSerializer(serializers.ModelSerializer):
    asset_ticker = serializers.CharField(source=asset__ticker, read_only=True)

    class Meta:
        model = BarsiAnalysis
        fields = ["id", "asset", "asset_ticker", "annual_dividend", "current_price", "target_yield", "price_ceiling", "margin", "opportunity", "created_at"]