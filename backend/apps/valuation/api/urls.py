from django.urls import path
from apps.valuation.api.views import (
    BarsiCalculationAPIView,
    GrahamCalculationAPIView,
    ProjectedCalculationAPIView,
)
from apps.valuation.api.history_views import (
    BarsiHistoryAPIView,
    GrahamHistoryAPIView,
    ProjectedHistoryAPIView,
)

urlpatterns = [
    path("graham/", GrahamCalculationAPIView.as_view(), name="valuation-graham"),
    path("projected/", ProjectedCalculationAPIView.as_view(), name="valuation-projected"),
    path("barsi/", BarsiCalculationAPIView.as_view(), name="valuation-barsi"),

    path("graham/history/", GrahamHistoryAPIView.as_view(), name="valuation-graham-history"),
    path("projected/history/", ProjectedHistoryAPIView.as_view(), name="valuation-projected-history"),
    path("barsi/history/", BarsiHistoryAPIView.as_view(), name="valuation-barsi-history"),
]