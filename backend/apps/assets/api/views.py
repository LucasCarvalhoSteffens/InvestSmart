from rest_framework.viewsets import ModelViewSet
from apps.assets.models import Asset
from apps.assets.api.serializers import AssetSerializer


class AssetViewSet(ModelViewSet):
    queryset = Asset.objects.all().order_by("ticker")
    serializer_class = AssetSerializer