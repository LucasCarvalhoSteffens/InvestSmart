from rest_framework_simplejwt.tokens import RefreshToken

REFRESH_COOKIE_NAME = "refresh_token"

def generate_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }

def set_refresh_cookie(response, refresh_token):
    response.set_cookie(
        key=REFRESH_COOKIE_NAME,
        value=refresh_token,
        httponly=True,
        secure=False,  # muda para True em produção com HTTPS
        samesite="Lax",
        max_age=7 * 24 * 60 * 60,
        path="/accounts/",
    )

def clear_refresh_cookie(response):
    response.delete_cookie(
        key=REFRESH_COOKIE_NAME,
        path="/accounts/",
        samesite="Lax",
    )