import http from "./http";

export async function listAssets(access) {
  const { data } = await http.get("/assets/", {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });

  return data;
}

export async function searchAssets(query, access) {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const { data } = await http.get("/assets/search/", {
    params: {
      q: query.trim(),
    },
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });

  return data;
}