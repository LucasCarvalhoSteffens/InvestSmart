from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

import json

from .models import Asset, BarsiAnalysis
from .forms import AssetForm
from .calculators.barsi_method import BarsiCalculator


# -----------------------------
# CRUD DE ATIVOS
# -----------------------------

def asset_list(request):
    assets = Asset.objects.all()
    return render(request, "assets/asset_list.html", {"assets": assets})


def asset_create(request):
    form = AssetForm(request.POST or None)

    if form.is_valid():
        form.save()
        return redirect("asset_list")

    return render(request, "assets/asset_form.html", {"form": form})


def asset_update(request, pk):
    asset = get_object_or_404(Asset, pk=pk)

    form = AssetForm(request.POST or None, instance=asset)

    if form.is_valid():
        form.save()
        return redirect("asset_list")

    return render(request, "assets/asset_form.html", {"form": form})


def asset_delete(request, pk):
    asset = get_object_or_404(Asset, pk=pk)

    if request.method == "POST":
        asset.delete()
        return redirect("asset_list")

    return render(request, "assets/asset_confirm_delete.html", {"asset": asset})


# -----------------------------
# CALCULADORA BARSI
# -----------------------------

@csrf_exempt
def barsi_calculator(request):

    if request.method == "GET":
        return render(request, "assets/calculator.html")

    if request.method == "POST":

        data = json.loads(request.body)

        ticker = data["ticker"]
        price = data["price"]
        dividends = data["dividends"]

        calculator = BarsiCalculator(dividends, price)
        result = calculator.calculate()

        # busca ou cria o asset
        asset, created = Asset.objects.get_or_create(
            ticker=ticker,
            defaults={
                "name": ticker,
                "sector": "Unknown",
                "current_price": price
            }
        )

        # salva análise
        analysis = BarsiAnalysis.objects.create(
            asset=asset,
            current_price=price,
            annual_dividend=result["annual_dividend"],
            price_ceiling=result["price_ceiling"],
            margin=result["margin"],
            opportunity=result["opportunity"],
        )

        result["analysis_id"] = analysis.id

        return JsonResponse(result)

    return JsonResponse({"error": "Método não permitido"}, status=400)