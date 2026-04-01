from django.contrib import messages
from django.shortcuts import get_object_or_404, redirect, render
from .calculators.barsi_method import BarsiCalculator
from .calculators.graham_method import calculate_graham_price
from .calculators.projected_method import calculate_projected_price
from django.contrib.auth.decorators import login_required

from .forms import AssetForm, BarsiAnalysisForm, GrahamAnalysisForm, ProjectedAnalysisForm
from .models import Asset, BarsiAnalysis, GrahamAnalysis, ProjectedAnalysis

from .models import Asset, BarsiAnalysis, GrahamAnalysis


@login_required
def calculator_page(request):
    return render(request, "assets/calculator.html")
# -----------------------------
# CRUD DE ATIVOS
# -----------------------------

@login_required
def asset_list(request):
    assets = Asset.objects.all()
    return render(request, "assets/asset_list.html", {"assets": assets})

@login_required
def asset_create(request):
    form = AssetForm(request.POST or None)

    if form.is_valid():
        form.save()
        return redirect("asset_list")

    return render(request, "assets/asset_form.html", {"form": form})

@login_required
def asset_update(request, pk):
    asset = get_object_or_404(Asset, pk=pk)
    form = AssetForm(request.POST or None, instance=asset)

    if form.is_valid():
        form.save()
        return redirect("asset_list")

    return render(request, "assets/asset_form.html", {"form": form})

@login_required
def asset_delete(request, pk):
    asset = get_object_or_404(Asset, pk=pk)

    if request.method == "POST":
        asset.delete()
        return redirect("asset_list")

    return render(request, "assets/asset_confirm_delete.html", {"asset": asset})


# -----------------------------
# CALCULADORA BARSI
# -----------------------------

@login_required
def barsi_calculator_view(request):
    form = BarsiAnalysisForm(request.POST or None)
    result = None

    if request.method == "POST" and form.is_valid():
        asset = form.cleaned_data["asset"]
        current_price = form.cleaned_data["current_price"]
        target_yield = form.cleaned_data["target_yield"]

        dividends = [
            form.cleaned_data["dividend_1"],
            form.cleaned_data["dividend_2"],
            form.cleaned_data["dividend_3"],
            form.cleaned_data["dividend_4"],
        ]

        try:
            calculator = BarsiCalculator(
                dividends_last_12_months=dividends,
                current_price=current_price,
                target_yield=target_yield,
            )

            calculated_data = calculator.calculate()

            result = BarsiAnalysis.objects.create(
                asset=asset,
                annual_dividend=calculated_data["annual_dividend"],
                current_price=calculated_data["current_price"],
                target_yield=calculated_data["target_dividend_yield"],
                price_ceiling=calculated_data["price_ceiling"],
                margin=calculated_data["margin"],
                opportunity=calculated_data["opportunity"],
            )

            messages.success(request, "Cálculo do método Barsi realizado com sucesso.")

        except ValueError as exc:
            messages.error(request, str(exc))

    analyses = BarsiAnalysis.objects.select_related("asset").all()[:10]

    return render(
        request,
        "assets/barsi_calculator.html",
        {
            "form": form,
            "result": result,
            "analyses": analyses,
        },
    )


# -----------------------------
# CALCULADORA GRAHAM
# -----------------------------

@login_required
def graham_calculator_view(request):
    form = GrahamAnalysisForm(request.POST or None)
    result = None

    if request.method == "POST" and form.is_valid():
        asset = form.cleaned_data["asset"]
        lpa = form.cleaned_data["lpa"]
        vpa = form.cleaned_data["vpa"]

        try:
            fair_price = calculate_graham_price(
                lpa=lpa,
                vpa=vpa
            )

            result = GrahamAnalysis.objects.create(
                asset=asset,
                lpa=lpa,
                vpa=vpa,
                fair_price=fair_price
            )

            messages.success(request, "Cálculo de Graham realizado com sucesso.")

        except ValueError as exc:
            messages.error(request, str(exc))

    analyses = GrahamAnalysis.objects.select_related("asset").all()[:10]

    return render(
        request,
        "assets/graham_calculator.html",
        {
            "form": form,
            "result": result,
            "analyses": analyses,
        },
    )

@login_required
def projected_calculator_view(request):
    form = ProjectedAnalysisForm(request.POST or None)
    result = None

    if request.method == "POST" and form.is_valid():
        asset = form.cleaned_data["asset"]
        dpa = form.cleaned_data["dpa"]
        average_dividend_yield = form.cleaned_data["average_dividend_yield"]

        try:
            calculated_data = calculate_projected_price(
                dpa=dpa,
                average_dividend_yield=average_dividend_yield
            )

            result = ProjectedAnalysis.objects.create(
                asset=asset,
                dpa=dpa,
                average_dividend_yield=average_dividend_yield,
                raw_price=calculated_data["raw_price"],
                price_ceiling=calculated_data["price_ceiling"],
            )

            messages.success(request, "Cálculo do preço teto projetivo realizado com sucesso.")

        except ValueError as exc:
            messages.error(request, str(exc))

    analyses = ProjectedAnalysis.objects.select_related("asset").all()[:10]

    return render(
        request,
        "assets/projected_calculator.html",
        {
            "form": form,
            "result": result,
            "analyses": analyses,
        },
    )