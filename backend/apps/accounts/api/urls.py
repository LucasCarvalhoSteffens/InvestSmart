from django.urls import path
from apps.accounts.api.views import (
    LoginAPIView,
    LogoutAPIView,
    MeAPIView,
    RefreshTokenAPIView,
)

urlpatterns = [
    path("login/", LoginAPIView.as_view(), name="api-login"),
    path("refresh/", RefreshTokenAPIView.as_view(), name="api-refresh"),
    path("logout/", LogoutAPIView.as_view(), name="api-logout"),
    path("me/", MeAPIView.as_view(), name="api-me"),
]