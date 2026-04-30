import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({ accessToken: "access-token-test" })
}));

vi.mock("../services/portfoliosApi", () => ({
  checkPortfolioAlertEvents: vi.fn(),
  listPortfolioAlertEvents: vi.fn(),
  listPortfolios: vi.fn(),
  markPortfolioAlertEventAsRead: vi.fn()
}));

import AlertEventsPage from "../pages/AlertEventsPage";
import {
  checkPortfolioAlertEvents,
  listPortfolioAlertEvents,
  listPortfolios,
  markPortfolioAlertEventAsRead
} from "../services/portfoliosApi";

function makeAlerts() {
  return [
    {
      id: 1,
      event_type: "below_or_equal_ceiling",
      asset_ticker: "BBAS3",
      asset_name: "Banco do Brasil",
      portfolio_name: "Carteira Dividendos",
      is_read: false,
      created_at: "2026-04-30T12:00:00Z",
      current_price: "27.5",
      price_ceiling: "30",
      price_ceiling_source: "barsi",
      message: "Preço dentro do preço teto."
    }
  ];
}

describe("AlertEventsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    listPortfolios.mockResolvedValue([
      { id: 1, name: "Carteira Dividendos" }
    ]);

    listPortfolioAlertEvents.mockResolvedValue(makeAlerts());

    checkPortfolioAlertEvents.mockResolvedValue({
      checked_items: 2,
      created_events: 1,
      skipped_items: 0,
      failed_updates: 0
    });

    markPortfolioAlertEventAsRead.mockResolvedValue({
      id: 1,
      is_read: true
    });
  });

  it("carrega carteiras e eventos de alerta", async () => {
    render(<AlertEventsPage />);

    expect(
      await screen.findByRole("heading", { name: /alertas de preço teto/i })
    ).toBeInTheDocument();

    expect(await screen.findByText("BBAS3")).toBeInTheDocument();
    expect(screen.getByText("Banco do Brasil")).toBeInTheDocument();
    expect(screen.getAllByText("Carteira Dividendos").length).toBeGreaterThan(0);
    expect(screen.getByText("Preço dentro do preço teto.")).toBeInTheDocument();

    expect(listPortfolios).toHaveBeenCalledWith("access-token-test");
    expect(listPortfolioAlertEvents).toHaveBeenCalledWith(
      {},
      "access-token-test"
    );
  });

  it("aplica filtros de carteira e somente não lidos", async () => {
    const user = userEvent.setup();

    render(<AlertEventsPage />);

    await screen.findByText("BBAS3");

    await user.selectOptions(screen.getByLabelText(/carteira/i), "1");

    await waitFor(() => {
      expect(listPortfolioAlertEvents).toHaveBeenLastCalledWith(
        { portfolio_id: "1" },
        "access-token-test"
      );
    });

    await user.click(screen.getByLabelText(/somente não lidos/i));

    await waitFor(() => {
      expect(listPortfolioAlertEvents).toHaveBeenLastCalledWith(
        { portfolio_id: "1", is_read: "false" },
        "access-token-test"
      );
    });
  });

  it("executa a verificação manual de alertas", async () => {
    const user = userEvent.setup();

    render(<AlertEventsPage />);

    await screen.findByText("BBAS3");

    await user.click(screen.getByRole("button", { name: /verificar agora/i }));

    await waitFor(() => {
      expect(checkPortfolioAlertEvents).toHaveBeenCalledWith(
        {
          force_refresh: true,
          cooldown_hours: 24
        },
        "access-token-test"
      );
    });

    expect(
      await screen.findByText(/verificação executada com sucesso/i)
    ).toBeInTheDocument();
    
    expect(screen.getByText("Verificados")).toBeInTheDocument();
    expect(screen.getByText("Gerados")).toBeInTheDocument();
  });

  it("marca um alerta como lido", async () => {
    const user = userEvent.setup();

    render(<AlertEventsPage />);

    await screen.findByText("BBAS3");

    await user.click(screen.getByRole("button", { name: /marcar como lido/i }));

    await waitFor(() => {
      expect(markPortfolioAlertEventAsRead).toHaveBeenCalledWith(
        1,
        "access-token-test"
      );
    });

    expect(
      await screen.findByText(/alerta marcado como lido/i)
    ).toBeInTheDocument();
  });
});