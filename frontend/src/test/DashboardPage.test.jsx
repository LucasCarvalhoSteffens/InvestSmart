import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({ accessToken: "access-token-test" })
}));

vi.mock("../services/portfoliosApi", () => ({
  checkPortfolioAlertEvents: vi.fn(),
  getPortfolioSimulation: vi.fn(),
  listPortfolioAlertEvents: vi.fn(),
  listPortfolios: vi.fn()
}));

import DashboardPage from "../pages/DashboardPage";
import {
  checkPortfolioAlertEvents,
  getPortfolioSimulation,
  listPortfolioAlertEvents,
  listPortfolios
} from "../services/portfoliosApi";

const simulationResponse = {
  summary: {
    total_invested: 1000,
    total_current_value: 1200,
    total_unrealized_gain: 200,
    total_unrealized_gain_pct: 20,
    opportunities_count: 1
  },
  items: [
    {
      asset_ticker: "BBAS3",
      current_price: 27.5,
      price_ceiling: 30,
      current_value: 700,
      estimated_return_pct: 9.1
    },
    {
      asset_ticker: "PETR4",
      current_price: 35,
      price_ceiling: 32,
      current_value: 500,
      estimated_return_pct: -8.6
    }
  ]
};

const alertEvents = [
  {
    id: 10,
    asset_ticker: "BBAS3",
    message: "Preço dentro do preço teto.",
    current_price: 27.5,
    price_ceiling: 30,
    is_read: false
  }
];

describe("DashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    listPortfolios.mockResolvedValue([
      { id: 1, name: "Carteira Dividendos" }
    ]);

    getPortfolioSimulation.mockResolvedValue(simulationResponse);
    listPortfolioAlertEvents.mockResolvedValue(alertEvents);

    checkPortfolioAlertEvents.mockResolvedValue({
      created_events: 1
    });
  });

  it("carrega KPIs, oportunidades e alertas recentes", async () => {
    render(<DashboardPage />);

    expect(
      await screen.findByRole("heading", { name: /dashboard/i })
    ).toBeInTheDocument();

    expect(screen.getByText("Carteira Dividendos")).toBeInTheDocument();
    expect(screen.getByText("Valor investido")).toBeInTheDocument();
    expect(screen.getByText("Valor atual")).toBeInTheDocument();
    expect(screen.getByText("Resultado")).toBeInTheDocument();
    expect(screen.getByText("Oportunidades")).toBeInTheDocument();
    expect(screen.getByText("Alertas")).toBeInTheDocument();

    expect(await screen.findByText("R$ 1.000,00")).toBeInTheDocument();
    expect(screen.getByText("R$ 1.200,00")).toBeInTheDocument();
    expect(screen.getByText("R$ 200,00")).toBeInTheDocument();
    expect(screen.getByText("20,00%")).toBeInTheDocument();

    expect(screen.getAllByText("BBAS3").length).toBeGreaterThan(0);
    expect(screen.getByText("Preço dentro do preço teto.")).toBeInTheDocument();

    expect(getPortfolioSimulation).toHaveBeenCalledWith(
      "1",
      "access-token-test"
    );

    expect(listPortfolioAlertEvents).toHaveBeenCalledWith(
      { portfolio_id: "1" },
      "access-token-test"
    );
  });

  it("executa verificação de alertas pela tela de dashboard", async () => {
    const user = userEvent.setup();

    render(<DashboardPage />);

    await screen.findByText("R$ 1.000,00");

    await user.click(screen.getByRole("button", { name: /verificar alertas/i }));

    await waitFor(() => {
      expect(checkPortfolioAlertEvents).toHaveBeenCalledWith(
        {
          portfolio_id: 1,
          force_refresh: true
        },
        "access-token-test"
      );
    });

    expect(getPortfolioSimulation).toHaveBeenCalledTimes(2);
  });

  it("permite alterar a taxa de projeção patrimonial", async () => {
    const user = userEvent.setup();

    render(<DashboardPage />);

    await screen.findByText("R$ 1.000,00");

    const input = screen.getByLabelText(/rentabilidade anual simulada/i);

    await user.clear(input);
    await user.type(input, "12");

    expect(input).toHaveValue(12);
  });
});