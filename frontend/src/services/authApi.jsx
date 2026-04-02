import http from "./http";

export async function login(username, password) {
  const { data } = await http.post("/auth/login/", { username, password });
  return data;
}

export async function refreshToken() {
  const { data } = await http.post("/auth/refresh/");
  return data;
}

export async function getMe(access) {
  const { data } = await http.get("/auth/me/", {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });
  return data;
}

export async function logout(access) {
  const { data } = await http.post(
    "/auth/logout/",
    {},
    {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    }
  );
  return data;
}