import http from "./http";

function buildConfig(access, params) {
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

export async function listPortfolios(access) {
  const { data } = await http.get("/portfolios/", buildConfig(access));
  return data;
}

export async function createPortfolio(payload, access) {
  const { data } = await http.post(
    "/portfolios/",
    payload,
    buildConfig(access),
  );
  return data;
}

export async function updatePortfolio(portfolioId, payload, access) {
  const { data } = await http.put(
    `/portfolios/${portfolioId}/`,
    payload,
    buildConfig(access),
  );
  return data;
}

export async function deletePortfolio(portfolioId, access) {
  await http.delete(`/portfolios/${portfolioId}/`, buildConfig(access));
}

export async function listPortfolioItems(portfolioId, access) {
  const { data } = await http.get(
    "/portfolios/items/",
    buildConfig(access, { portfolio_id: portfolioId }),
  );
  return data;
}

export async function createPortfolioItem(payload, access) {
  const { data } = await http.post(
    "/portfolios/items/",
    payload,
    buildConfig(access),
  );
  return data;
}

export async function updatePortfolioItem(itemId, payload, access) {
  const { data } = await http.put(
    `/portfolios/items/${itemId}/`,
    payload,
    buildConfig(access),
  );
  return data;
}

export async function deletePortfolioItem(itemId, access) {
  await http.delete(`/portfolios/items/${itemId}/`, buildConfig(access));
}

export async function listPortfolioAlerts(filters, access) {
  const { data } = await http.get(
    "/portfolios/alerts/",
    buildConfig(access, filters),
  );
  return data;
}

export async function createPortfolioAlert(payload, access) {
  const { data } = await http.post(
    "/portfolios/alerts/",
    payload,
    buildConfig(access),
  );
  return data;
}

export async function updatePortfolioAlert(alertId, payload, access) {
  const { data } = await http.put(
    `/portfolios/alerts/${alertId}/`,
    payload,
    buildConfig(access),
  );
  return data;
}

export async function deletePortfolioAlert(alertId, access) {
  await http.delete(`/portfolios/alerts/${alertId}/`, buildConfig(access));
}