import http from "./http";

export async function listAssets(access) {
  const { data } = await http.get("/assets/", {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });
  return data;
}