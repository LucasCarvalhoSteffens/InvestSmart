from rest_framework import serializers

from apps.assets.services.yahoo_finance import MarketDataUnavailable, sync_asset_from_yahoo
from apps.assets.models import Asset
from apps.portfolios.models import Portfolio, PortfolioItem, PortfolioItemAlert


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
            "ticker",
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
    ticker = serializers.CharField(write_only=True, required=False)
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

    def validate(self, attrs):
        portfolio = attrs.get("portfolio", getattr(self.instance, "portfolio", None))
        ticker = attrs.pop("ticker", None)

        if ticker:
            try:
                market_data = sync_asset_from_yahoo(ticker)
                attrs["asset"] = market_data.asset
            except MarketDataUnavailable as exc:
                raise serializers.ValidationError({"ticker": str(exc)}) from exc

        asset = attrs.get("asset", getattr(self.instance, "asset", None))

        if asset is None:
            raise serializers.ValidationError(
                {"asset": "Informe um asset existente ou um ticker para buscar na API."}
            )
            
        quantity = attrs.get("quantity", getattr(self.instance, "quantity", None))
        average_price = attrs.get(
            "average_price",
            getattr(self.instance, "average_price", None),
        )
        target_price = attrs.get(
            "target_price",
            getattr(self.instance, "target_price", None),
        )

        if quantity is not None and quantity <= 0:
            raise serializers.ValidationError(
                {"quantity": "A quantidade deve ser maior que zero."}
            )

        if average_price is not None and average_price <= 0:
            raise serializers.ValidationError(
                {"average_price": "O preço médio deve ser maior que zero."}
            )

        if target_price is not None and target_price <= 0:
            raise serializers.ValidationError(
                {"target_price": "O preço teto deve ser maior que zero."}
            )

        if portfolio and asset:
            qs = PortfolioItem.objects.filter(portfolio=portfolio, asset=asset)
            if self.instance:
                qs = qs.exclude(pk=self.instance.pk)

            if qs.exists():
                raise serializers.ValidationError(
                    {"asset": "Este ativo já existe nesta carteira."}
                )

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