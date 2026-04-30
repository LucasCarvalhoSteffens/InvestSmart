import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import AlertEventCard from "../components/AlertEventCard";

const baseAlert = {
  id: 10,
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
};

describe("AlertEventCard", () => {
  it("renderiza os dados principais de um alerta novo", () => {
    render(<AlertEventCard alert={baseAlert} onMarkAsRead={vi.fn()} />);

    expect(screen.getByText("BBAS3")).toBeInTheDocument();
    expect(screen.getByText("Banco do Brasil")).toBeInTheDocument();
    expect(screen.getByText("Novo")).toBeInTheDocument();
    expect(screen.getByText("Dentro do teto")).toBeInTheDocument();
    expect(screen.getByText("Não lido")).toBeInTheDocument();
    expect(screen.getByText("Carteira Dividendos")).toBeInTheDocument();
    expect(screen.getByText("Barsi")).toBeInTheDocument();
    expect(screen.getByText("Preço dentro do preço teto.")).toBeInTheDocument();
    expect(screen.getByText("R$ 27,50")).toBeInTheDocument();
    expect(screen.getByText("R$ 30,00")).toBeInTheDocument();
  });

  it("chama onMarkAsRead com o id correto", async () => {
    const user = userEvent.setup();
    const onMarkAsRead = vi.fn();

    render(<AlertEventCard alert={baseAlert} onMarkAsRead={onMarkAsRead} />);

    await user.click(screen.getByRole("button", { name: /marcar como lido/i }));

    expect(onMarkAsRead).toHaveBeenCalledWith(10);
  });

  it("não exibe botão de leitura quando o alerta já está lido", () => {
    render(
      <AlertEventCard
        alert={{ ...baseAlert, is_read: true }}
        onMarkAsRead={vi.fn()}
      />
    );

    expect(screen.getByText("Lido")).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: /marcar como lido/i })
    ).not.toBeInTheDocument();
  });
});