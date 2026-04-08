from django.contrib.auth import get_user_model
from django.http import HttpResponse
from django.test import SimpleTestCase, TestCase

from apps.accounts.services import (
    REFRESH_COOKIE_NAME,
    clear_refresh_cookie,
    generate_tokens_for_user,
    set_refresh_cookie,
)

User = get_user_model()


class AccountServiceTests(TestCase):
    def test_generate_tokens_for_user_returns_access_and_refresh(self):
        user = User.objects.create_user(
            username="lucas",
            password="12345678",
            email="lucas@email.com",
        )

        tokens = generate_tokens_for_user(user)

        self.assertIn("access", tokens)
        self.assertIn("refresh", tokens)
        self.assertTrue(tokens["access"])
        self.assertTrue(tokens["refresh"])


class CookieServiceTests(SimpleTestCase):
    def test_set_refresh_cookie(self):
        response = HttpResponse()

        set_refresh_cookie(response, "refresh-token-fake")

        self.assertIn(REFRESH_COOKIE_NAME, response.cookies)
        cookie = response.cookies[REFRESH_COOKIE_NAME]
        self.assertEqual(cookie.value, "refresh-token-fake")
        self.assertEqual(cookie["path"], "/api/auth/")
        self.assertTrue(cookie["httponly"])

    def test_clear_refresh_cookie(self):
        response = HttpResponse()
        set_refresh_cookie(response, "refresh-token-fake")

        clear_refresh_cookie(response)

        self.assertIn(REFRESH_COOKIE_NAME, response.cookies)
        self.assertEqual(response.cookies[REFRESH_COOKIE_NAME]["path"], "/api/auth/")