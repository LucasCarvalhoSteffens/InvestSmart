from rest_framework.routers import DefaultRouter
from apps.assets.api.views import AssetViewSet

router = DefaultRouter()
router.register("", AssetViewSet, basename="assets")

urlpatterns = router.urls