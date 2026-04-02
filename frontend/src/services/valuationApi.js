import http from "./http";

export async function calculateGraham(payload, access) {
  const { data } = await http.post("/valuation/graham/", payload, {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });
  return data;
}

export async function calculateProjected(payload, access) {
  const { data } = await http.post("/valuation/projected/", payload, {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });
  return data;
}

export async function calculateBarsi(payload, access) {
  const { data } = await http.post("/valuation/barsi/", payload, {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });
  return data;
}