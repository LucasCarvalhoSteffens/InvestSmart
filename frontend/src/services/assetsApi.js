import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

function authHeaders(accessToken) {
  if (!accessToken) {
    return {};
  }

  return {
    Authorization: `Bearer ${accessToken}`,
  };
}

export async function listAssets(accessToken) {
  const response = await api.get("/assets/", {
    headers: authHeaders(accessToken),
  });

  return response.data;
}

export async function searchAssets(query, accessToken) {
  const response = await api.get("/assets/search/", {
    params: {
      q: query,
    },
    headers: authHeaders(accessToken),
  });

  return response.data;
}

export async function syncAssetByTicker(ticker, accessToken, forceRefresh = false) {
  const response = await api.post(
    "/assets/sync/",
    {
      ticker,
      force_refresh: forceRefresh,
    },
    {
      headers: authHeaders(accessToken),
    }
  );

  return response.data;
}