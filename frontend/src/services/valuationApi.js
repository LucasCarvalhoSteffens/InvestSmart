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

export async function calculateBarsi(payload, accessToken) {
  const response = await api.post("/valuation/barsi/", payload, {
    headers: authHeaders(accessToken),
  });

  return response.data;
}

export async function calculateGraham(payload, accessToken) {
  const response = await api.post("/valuation/graham/", payload, {
    headers: authHeaders(accessToken),
  });

  return response.data;
}

export async function calculateProjected(payload, accessToken) {
  const response = await api.post("/valuation/projected/", payload, {
    headers: authHeaders(accessToken),
  });

  return response.data;
}