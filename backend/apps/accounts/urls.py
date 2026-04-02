from django.urls import path
from . import views

urlpatterns = [
    path("login/", views.login_page, name="login"),
    path("login/submit/", views.login_submit, name="login_submit"),
    path("logout/", views.logout_view, name="logout"),
    path("token/refresh/", views.refresh_token_view, name="token_refresh"),
]