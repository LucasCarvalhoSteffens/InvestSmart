from django.contrib import messages
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.http import JsonResponse
from django.shortcuts import redirect, render
from django.views.decorators.http import require_GET, require_POST
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from .forms import LoginForm
from .services import (
    REFRESH_COOKIE_NAME,
    clear_refresh_cookie,
    generate_tokens_for_user,
    set_refresh_cookie,
)

User = get_user_model()


@require_GET
def login_page(request):
    if request.user.is_authenticated:
        return redirect("asset_list")

    form = LoginForm()
    return render(request, "accounts/login.html", {"form": form})


@require_POST
def login_submit(request):
    form = LoginForm(request.POST)

    if not form.is_valid():
        messages.error(request, "Dados inválidos.")
        return render(request, "accounts/login.html", {"form": form}, status=400)

    username = form.cleaned_data["username"]
    password = form.cleaned_data["password"]

    user = authenticate(request, username=username, password=password)

    if user is None:
        messages.error(request, "Usuário ou senha inválidos.")
        return render(request, "accounts/login.html", {"form": form}, status=401)

    login(request, user)

    tokens = generate_tokens_for_user(user)
    response = redirect("asset_list")

    response.set_cookie(
        "access_token",
        tokens["access"],
        httponly=False,
        secure=False,
        samesite="Lax",
        max_age=600,
    )
    set_refresh_cookie(response, tokens["refresh"])

    return response


@require_POST
def refresh_token_view(request):
    refresh_token = request.COOKIES.get(REFRESH_COOKIE_NAME)

    if not refresh_token:
        return JsonResponse({"detail": "Refresh token não encontrado."}, status=401)

    try:
        refresh = RefreshToken(refresh_token)
        user_id = refresh.get("user_id")
        user = User.objects.get(id=user_id)

        access = str(refresh.access_token)

        response = JsonResponse({"access": access}, status=200)

        refresh.blacklist()
        new_refresh = RefreshToken.for_user(user)
        set_refresh_cookie(response, str(new_refresh))

        return response

    except (TokenError, User.DoesNotExist):
        return JsonResponse({"detail": "Refresh token inválido ou expirado."}, status=401)


@require_POST
def logout_view(request):
    refresh_token = request.COOKIES.get(REFRESH_COOKIE_NAME)
    response = redirect("login")

    if refresh_token:
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError:
            pass

    logout(request)
    clear_refresh_cookie(response)
    response.delete_cookie("access_token")
    return response