import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:8000/api";

const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let accessToken = null;
let refreshPromise = null;
let unauthorizedHandler = () => {};

export function setHttpAccessToken(token) {
  accessToken = token;
}

export function clearHttpAccessToken() {
  accessToken = null;
}

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = typeof handler === "function" ? handler : () => {};
}

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = http
      .post("/auth/refresh/")
      .then((response) => {
        const newToken = response.data.access;
        setHttpAccessToken(newToken);
        return newToken;
      })
      .catch((error) => {
        clearHttpAccessToken();
        unauthorizedHandler();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

http.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const requestUrl = originalRequest?.url ?? "";

    const isRefreshRequest = requestUrl.includes("/auth/refresh/");
    const isLoginRequest = requestUrl.includes("/auth/login/");

    if (
      status !== 401 ||
      isRefreshRequest ||
      isLoginRequest ||
      originalRequest?._retry
    ) {
      throw error;
    }

    originalRequest._retry = true;

    const newToken = await refreshAccessToken();

    originalRequest.headers = originalRequest.headers ?? {};
    originalRequest.headers.Authorization = `Bearer ${newToken}`;

    return http(originalRequest);
  }
);

export default http;