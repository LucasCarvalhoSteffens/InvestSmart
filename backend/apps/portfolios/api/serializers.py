from rest_framework import serializers

from apps.assets.services.yahoo_finance import MarketDataUnavailable, sync_asset_from_yahoo
from apps.assets.models import Asset
from apps.portfolios.models import (
    Portfolio,
    PortfolioAlertEvent,
    PortfolioItem,
    PortfolioItemAlert,
)


class PortfolioItemAlertSerializer(serializers.ModelSerializer):
    asset_ticker = serializers.CharField(
        source="portfolio_item.asset.ticker",
        read_only=True,
    )
    current_price = serializers.DecimalField(
        source="portfolio_item.asset.current_price",
        max_digits=10,
        decimal_places=2,
        read_only=True,
    )
    triggered_now = serializers.SerializerMethodField()

    class Meta:
        model = PortfolioItemAlert
        fields = [
            "id",
            "portfolio_item",
            "asset_ticker",
            "alert_type",
            "threshold_price",
            "current_price",
            "is_active",
            "triggered_now",
            "last_triggered_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "asset_ticker",
            "current_price",
            "triggered_now",
            "last_triggered_at",
            "created_at",
            "updated_at",
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        request = self.context.get("request")

        if request and request.user.is_authenticated:
            self.fields["portfolio_item"].queryset = PortfolioItem.objects.filter(
                portfolio__user=request.user
            )

    def get_triggered_now(self, obj):
        return obj.should_trigger

    def validate_threshold_price(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "O preço de disparo deve ser maior que zero."
            )

        return value

class PortfolioItemSerializer(serializers.ModelSerializer):
    ticker = serializers.CharField(write_only=True, required=False, allow_blank=True)

    asset = serializers.PrimaryKeyRelatedField(
        queryset=Asset.objects.all(),
        required=False,
        allow_null=True,
    )
    asset_ticker = serializers.CharField(source="asset.ticker", read_only=True)
    asset_name = serializers.CharField(source="asset.name", read_only=True)
    current_price = serializers.DecimalField(
        source="asset.current_price",
        max_digits=10,
        decimal_places=2,
        read_only=True,
    )
    invested_amount = serializers.SerializerMethodField()
    current_value = serializers.SerializerMethodField()
    unrealized_gain = serializers.SerializerMethodField()
    unrealized_gain_pct = serializers.SerializerMethodField()
    is_below_target = serializers.SerializerMethodField()
    distance_to_target = serializers.SerializerMethodField()
    alerts = PortfolioItemAlertSerializer(many=True, read_only=True)

    class Meta:
        model = PortfolioItem
        fields = [
            "id",
            "portfolio",
            "asset",
            "asset_ticker",
            "asset_name",
            "quantity",
            "average_price",
            "target_price",
            "current_price",
            "invested_amount",
            "current_value",
            "unrealized_gain",
            "unrealized_gain_pct",
            "is_below_target",
            "distance_to_target",
            "notes",
            "alerts",
            "created_at",
            "updated_at",
            "ticker",
        ]
        read_only_fields = [
            "id",
            "asset_ticker",
            "asset_name",
            "current_price",
            "invested_amount",
            "current_value",
            "unrealized_gain",
            "unrealized_gain_pct",
            "is_below_target",
            "distance_to_target",
            "alerts",
            "created_at",
            "updated_at",
        ]
        validators = []

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["asset"].queryset = Asset.objects.all()

        request = self.context.get("request")
        if request and request.user.is_authenticated:
            self.fields["portfolio"].queryset = Portfolio.objects.filter(
                user=request.user
            )

    def get_invested_amount(self, obj):
        return obj.invested_amount

    def get_current_value(self, obj):
        return obj.current_value

    def get_unrealized_gain(self, obj):
        return obj.unrealized_gain

    def get_unrealized_gain_pct(self, obj):
        return obj.unrealized_gain_pct

    def get_is_below_target(self, obj):
        return obj.is_below_target

    def get_distance_to_target(self, obj):
        return obj.distance_to_target

    def _resolve_asset_from_ticker(self, attrs):
        ticker = attrs.pop("ticker", None)

        if not ticker:
            return attrs
        
        ticker = str(ticker).strip().split(" - ")[0].split(" ")[0].upper()

        if not ticker:
            return attrs

        try:
            market_data = sync_asset_from_yahoo(ticker)
            attrs["asset"] = market_data.asset
        except MarketDataUnavailable as exc:
            raise serializers.ValidationError({"ticker": str(exc)}) from exc

        return attrs


    def _validate_required_asset(self, attrs):
        asset = attrs.get("asset", getattr(self.instance, "asset", None))

        if asset is None:
            raise serializers.ValidationError(
                {"asset": "Informe um asset existente ou um ticker para buscar na API."}
            )

        return asset


    def _validate_positive_value(self, field_name, value, message):
        if value is not None and value <= 0:
            raise serializers.ValidationError({field_name: message})


    def _validate_positive_fields(self, attrs):
        quantity = attrs.get("quantity", getattr(self.instance, "quantity", None))
        average_price = attrs.get(
            "average_price",
            getattr(self.instance, "average_price", None),
        )
        target_price = attrs.get(
            "target_price",
            getattr(self.instance, "target_price", None),
        )

        self._validate_positive_value(
            field_name="quantity",
            value=quantity,
            message="A quantidade deve ser maior que zero.",
        )

        self._validate_positive_value(
            field_name="average_price",
            value=average_price,
            message="O preço médio deve ser maior que zero.",
        )

        self._validate_positive_value(
            field_name="target_price",
            value=target_price,
            message="O preço teto deve ser maior que zero.",
        )


    def _validate_unique_asset_in_portfolio(self, portfolio, asset):
        if not portfolio or not asset:
            return

        queryset = PortfolioItem.objects.filter(
            portfolio=portfolio,
            asset=asset,
        )

        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError(
                {"asset": "Este ativo já existe nesta carteira."}
            )


    def validate(self, attrs):
        attrs = self._resolve_asset_from_ticker(attrs)

        portfolio = attrs.get("portfolio", getattr(self.instance, "portfolio", None))
        asset = self._validate_required_asset(attrs)

        self._validate_positive_fields(attrs)
        self._validate_unique_asset_in_portfolio(portfolio, asset)

        return attrs


class PortfolioSerializer(serializers.ModelSerializer):
    items = PortfolioItemSerializer(many=True, read_only=True)
    total_items = serializers.SerializerMethodField()
    total_invested = serializers.SerializerMethodField()
    total_current_value = serializers.SerializerMethodField()
    total_unrealized_gain = serializers.SerializerMethodField()
    total_unrealized_gain_pct = serializers.SerializerMethodField()

    class Meta:
        model = Portfolio
        fields = [
            "id",
            "name",
            "description",
            "total_items",
            "total_invested",
            "total_current_value",
            "total_unrealized_gain",
            "total_unrealized_gain_pct",
            "items",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "total_items",
            "total_invested",
            "total_current_value",
            "total_unrealized_gain",
            "total_unrealized_gain_pct",
            "items",
            "created_at",
            "updated_at",
        ]

    def get_total_items(self, obj):
        return obj.total_items

    def get_total_invested(self, obj):
        return obj.total_invested

    def get_total_current_value(self, obj):
        return obj.total_current_value

    def get_total_unrealized_gain(self, obj):
        return obj.total_unrealized_gain

    def get_total_unrealized_gain_pct(self, obj):
        return obj.total_unrealized_gain_pct

    def validate_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("O nome da carteira é obrigatório.")
        return value.strip()

    def validate(self, attrs):
        request = self.context.get("request")
        name = attrs.get("name", getattr(self.instance, "name", None))

        if request and request.user.is_authenticated and name:
            qs = Portfolio.objects.filter(user=request.user, name=name)
            if self.instance:
                qs = qs.exclude(pk=self.instance.pk)

            if qs.exists():
                raise serializers.ValidationError(
                    {"name": "Você já possui uma carteira com este nome."}
                )

        return attrs
    
class PortfolioAlertEventSerializer(serializers.ModelSerializer):
    portfolio = serializers.IntegerField(source="portfolio_item.portfolio_id", read_only=True)
    portfolio_name = serializers.CharField(
        source="portfolio_item.portfolio.name",
        read_only=True,
    )
    asset_ticker = serializers.CharField(
        source="portfolio_item.asset.ticker",
        read_only=True,
    )
    asset_name = serializers.CharField(
        source="portfolio_item.asset.name",
        read_only=True,
    )

    class Meta:
        model = PortfolioAlertEvent
        fields = [
            "id",
            "portfolio",
            "portfolio_name",
            "portfolio_item",
            "asset_ticker",
            "asset_name",
            "event_type",
            "current_price",
            "price_ceiling",
            "price_ceiling_source",
            "message",
            "is_read",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "portfolio",
            "portfolio_name",
            "portfolio_item",
            "asset_ticker",
            "asset_name",
            "event_type",
            "current_price",
            "price_ceiling",
            "price_ceiling_source",
            "message",
            "created_at",
        ]