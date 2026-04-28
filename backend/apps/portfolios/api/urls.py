from rest_framework.routers import DefaultRouter

from apps.portfolios.api.views import (
    PortfolioAlertEventViewSet,
    PortfolioItemAlertViewSet,
    PortfolioItemViewSet,
    PortfolioViewSet,
)

router = DefaultRouter()

# Registre rotas específicas primeiro
router.register("items", PortfolioItemViewSet, basename="portfolio-items")
router.register("alerts", PortfolioItemAlertViewSet, basename="portfolio-alerts")
router.register("alert-events", PortfolioAlertEventViewSet, basename="portfolio-alert-events")

# Prefixo vazio por último
router.register("", PortfolioViewSet, basename="portfolios")

urlpatterns = router.urls