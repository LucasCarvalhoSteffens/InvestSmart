import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../services/http", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn()
  }
}));

import http from "../services/http";
import {
  checkPortfolioAlertEvents,
  getPortfolioSimulation,
  listPortfolioAlertEvents,
  listPortfolios,
  markPortfolioAlertEventAsRead
} from "../services/portfoliosApi";

describe("portfoliosApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lista carteiras usando o token de acesso", async () => {
    http.get.mockResolvedValueOnce({ data: [{ id: 1, name: "Carteira" }] });

    const result = await listPortfolios("access-token");

    expect(result).toEqual([{ id: 1, name: "Carteira" }]);
    expect(http.get).toHaveBeenCalledWith("/portfolios/", {
      headers: { Authorization: "Bearer access-token" }
    });
  });

  it("busca a simulação de uma carteira", async () => {
    http.get.mockResolvedValueOnce({
      data: {
        summary: { total_current_value: 1200 },
        items: []
      }
    });

    const result = await getPortfolioSimulation(3, "access-token");

    expect(result.summary.total_current_value).toBe(1200);
    expect(http.get).toHaveBeenCalledWith("/portfolios/3/simulation/", {
      headers: { Authorization: "Bearer access-token" }
    });
  });

  it("lista eventos de alerta com filtros", async () => {
    http.get.mockResolvedValueOnce({ data: [{ id: 99 }] });

    const result = await listPortfolioAlertEvents(
      { portfolio_id: 1, is_read: "false" },
      "access-token"
    );

    expect(result).toEqual([{ id: 99 }]);
    expect(http.get).toHaveBeenCalledWith("/portfolios/alert-events/", {
      headers: { Authorization: "Bearer access-token" },
      params: { portfolio_id: 1, is_read: "false" }
    });
  });

  it("executa a verificação de alertas", async () => {
    const payload = { portfolio_id: 1, force_refresh: true };

    http.post.mockResolvedValueOnce({
      data: {
        checked_items: 2,
        created_events: 1
      }
    });

    const result = await checkPortfolioAlertEvents(payload, "access-token");

    expect(result.created_events).toBe(1);
    expect(http.post).toHaveBeenCalledWith(
      "/portfolios/alert-events/check/",
      payload,
      {
        headers: { Authorization: "Bearer access-token" }
      }
    );
  });

  it("marca evento como lido", async () => {
    http.patch.mockResolvedValueOnce({
      data: {
        id: 7,
        is_read: true
      }
    });

    const result = await markPortfolioAlertEventAsRead(7, "access-token");

    expect(result.is_read).toBe(true);
    expect(http.patch).toHaveBeenCalledWith(
      "/portfolios/alert-events/7/mark-as-read/",
      {},
      {
        headers: { Authorization: "Bearer access-token" }
      }
    );
  });
});