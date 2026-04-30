import http from "./http";

function buildAuthConfig(access, params) {
  const config = {};

  if (access) {
    config.headers = {
      Authorization: `Bearer ${access}`,
    };
  }

  if (params) {
    config.params = params;
  }

  return config;
}

export async function listAssets(access) {
  const { data } = await http.get("/assets/", buildAuthConfig(access));
  return data;
}

export async function searchAssets(query, access) {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const { data } = await http.get(
    "/assets/search/",
    buildAuthConfig(access, {
      q: query.trim(),
    }),
  );

  return data;
}

export async function syncAssetByTicker(ticker, access, forceRefresh = false) {
  const { data } = await http.post(
    "/assets/sync/",
    {
      ticker,
      force_refresh: forceRefresh,
    },
    buildAuthConfig(access),
  );

  return data;
}