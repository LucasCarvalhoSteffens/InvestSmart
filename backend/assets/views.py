from django.shortcuts import render, get_object_or_404, redirect
from .models import Asset
from .forms import AssetForm

def asset_list(request):
    assets = Asset.objects.all()
    return render(request, 'assets/asset_list.html', {'assets': assets})

def asset_create(request):
    form = AssetForm(request.POST or None)
    if form.is_valid():
        form.save()
        return redirect('asset_list')
    return render(request, 'assets/asset_form.html', {'form': form})

def asset_update(request, pk):
    asset = get_object_or_404(Asset, pk=pk)
    form = AssetForm(request.POST or None, instance=asset)
    if form.is_valid():
        form.save()
        return redirect('asset_list')
    return render(request, 'assets/asset_form.html', {'form': form})

def asset_delete(request, pk):
    asset = get_object_or_404(Asset, pk=pk)
    if request.method == "POST":
        asset.delete()
        return redirect('asset_list')
    return render(request, 'assets/asset_confirm_delete.html', {'asset': asset})
# Create your views here.
