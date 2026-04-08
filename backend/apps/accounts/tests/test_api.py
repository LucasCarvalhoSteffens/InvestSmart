from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.accounts.services import REFRESH_COOKIE_NAME

User = get_user_model()


class AccountsAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="lucas",
            password="12345678",
            email="lucas@email.com",
        )
        self.login_url = reverse("api-login")
        self.refresh_url = reverse("api-refresh")
        self.logout_url = reverse("api-logout")
        self.me_url = reverse("api-me")

    def test_login_success(self):
        response = self.client.post(
            self.login_url,
            {"username": "lucas", "password": "12345678"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn(REFRESH_COOKIE_NAME, response.cookies)

    def test_login_invalid_credentials(self):
        response = self.client.post(
            self.login_url,
            {"username": "lucas", "password": "senha-errada"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data["detail"], "Usuário ou senha inválidos.")

    def test_login_invalid_payload(self):
        response = self.client.post(
            self.login_url,
            {"username": "", "password": ""},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_refresh_without_cookie(self):
        response = self.client.post(self.refresh_url, {}, format="json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data["detail"], "Refresh token não encontrado.")

    def test_refresh_with_valid_cookie(self):
        login_response = self.client.post(
            self.login_url,
            {"username": "lucas", "password": "12345678"},
            format="json",
        )
        refresh_cookie = login_response.cookies[REFRESH_COOKIE_NAME].value
        self.client.cookies[REFRESH_COOKIE_NAME] = refresh_cookie

        response = self.client.post(self.refresh_url, {}, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn(REFRESH_COOKIE_NAME, response.cookies)

    def test_me_requires_authentication(self):
        response = self.client.get(self.me_url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_authenticated(self):
        login_response = self.client.post(
            self.login_url,
            {"username": "lucas", "password": "12345678"},
            format="json",
        )
        access = login_response.data["access"]

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        response = self.client.get(self.me_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "lucas")
        self.assertEqual(response.data["email"], "lucas@email.com")

    def test_logout_authenticated(self):
        login_response = self.client.post(
            self.login_url,
            {"username": "lucas", "password": "12345678"},
            format="json",
        )
        access = login_response.data["access"]
        refresh_cookie = login_response.cookies[REFRESH_COOKIE_NAME].value

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        self.client.cookies[REFRESH_COOKIE_NAME] = refresh_cookie

        response = self.client.post(self.logout_url, {}, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["detail"], "Logout realizado com sucesso.")
        self.assertIn(REFRESH_COOKIE_NAME, response.cookies)