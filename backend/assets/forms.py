from django import forms
from .models import Asset


class LoginForm(forms.Form):
    username = forms.CharField(label="Usuário", max_length=150)
    password = forms.CharField(label="Senha", widget=forms.PasswordInput)

class BarsiAnalysisForm(forms.Form):
    asset = forms.ModelChoiceField(
        queryset=Asset.objects.all(),
        label="Ativo"
    )
    current_price = forms.DecimalField(
        max_digits=10,
        decimal_places=2,
        min_value=0.01,
        label="Cotação Atual"
    )
    dividend_1 = forms.DecimalField(
        max_digits=10,
        decimal_places=4,
        min_value=0,
        initial=0,
        label="Dividendo 1"
    )
    dividend_2 = forms.DecimalField(
        max_digits=10,
        decimal_places=4,
        min_value=0,
        initial=0,
        label="Dividendo 2"
    )
    dividend_3 = forms.DecimalField(
        max_digits=10,
        decimal_places=4,
        min_value=0,
        initial=0,
        label="Dividendo 3"
    )
    dividend_4 = forms.DecimalField(
        max_digits=10,
        decimal_places=4,
        min_value=0,
        initial=0,
        label="Dividendo 4"
    )
    target_yield = forms.DecimalField(
        max_digits=5,
        decimal_places=4,
        min_value=0.0001,
        initial=0.06,
        label="Dividend Yield Alvo (ex.: 0.06 para 6%)"
    )



class GrahamAnalysisForm(forms.Form):
    asset = forms.ModelChoiceField(
        queryset=Asset.objects.all(),
        label="Ativo"
    )
    lpa = forms.DecimalField(
        max_digits=10,
        decimal_places=2,
        min_value=0.01,
        label="Lucro por Ação (LPA)"
    )
    vpa = forms.DecimalField(
        max_digits=10,
        decimal_places=2,
        min_value=0.01,
        label="Valor Patrimonial por Ação (VPA)"
    )


class ProjectedAnalysisForm(forms.Form):
    asset = forms.ModelChoiceField(
        queryset=Asset.objects.all(),
        label="Ativo"
    )
    dpa = forms.DecimalField(
        max_digits=10,
        decimal_places=4,
        min_value=0.0001,
        label="DPA"
    )
    average_dividend_yield = forms.DecimalField(
        max_digits=5,
        decimal_places=4,
        min_value=0.0001,
        label="Dividend Yield Médio (ex.: 0.08 para 8%)"
    )


class AssetForm(forms.ModelForm):
    class Meta:
        model = Asset
        fields = "__all__"