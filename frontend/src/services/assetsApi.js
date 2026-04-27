import http from "./http";

export async function listAssets(accessToken) {
  const { data } = await http.get("/assets/", {
    headers: accessToken
      ? {
          Authorization: `Bearer ${accessToken}`,
        }
      : {},
  });

  return data;
}

export async function searchAssets(query, accessToken) {
  const { data } = await http.get("/assets/search/", {
    params: {
      q: query,
    },
    headers: accessToken
      ? {
          Authorization: `Bearer ${accessToken}`,
        }
      : {},
  });

  return data;
}

export async function syncAssetByTicker(ticker, accessToken, forceRefresh = false) {
  const { data } = await http.post(
    "/assets/sync/",
    {
      ticker,
      force_refresh: forceRefresh,
    },
    {
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : {},
    }
  );

  return data;
}