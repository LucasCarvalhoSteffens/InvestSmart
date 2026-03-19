from django.urls import path, include
from django.contrib import admin
from . import views

urlpatterns = [
    path('', views.asset_list, name='asset_list'),
    path('create/', views.asset_create, name='asset_create'),
    path('<int:pk>/update/', views.asset_update, name='asset_update'),
    path('<int:pk>/delete/', views.asset_delete, name='asset_delete'),
    path("calculator/", views.calculator_page, name="calculator_page"),

    # calculadora barsi
    path("barsi/", views.barsi_calculator_view, name="barsi_calculator"),
    # calculadora graham
    path("graham/", views.graham_calculator_view, name="graham_calculator"),
    # calculadora projetiva
    path("projected/", views.projected_calculator_view, name="projected_calculator"),
]