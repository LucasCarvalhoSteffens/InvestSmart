import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({ accessToken: "access-token-test" })
}));

vi.mock("../components/AssetAutocomplete", () => ({
  default: ({ label = "Ativo", value, onChange, onAssetSelected, placeholder }) => (
    <div>
      <label htmlFor="ticker-input">{label}</label>

      <input
        id="ticker-input"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />

      <button
        type="button"
        onClick={() =>
          onAssetSelected({
            ticker: "BBAS3",
            name: "Banco do Brasil",
            source: "Yahoo Finance"
          })
        }
      >
        Selecionar ativo
      </button>
    </div>
  )
}));

vi.mock("../components/ValuationResultCard", () => ({
  default: ({ title, result }) => {
    if (!result) {
      return (
        <div data-testid="valuation-empty-result">
          Nenhum cálculo realizado ainda
        </div>
      );
    }

    return (
      <section data-testid="valuation-result">
        <h3>{title || "Resultado"}</h3>
        <pre>{JSON.stringify(result)}</pre>
      </section>
    );
  }
}));

vi.mock("../services/valuationApi", () => ({
  calculateBarsi: vi.fn(),
  calculateGraham: vi.fn(),
  calculateProjected: vi.fn()
}));

import BarsiPage from "../pages/BarsiPage";
import GrahamPage from "../pages/GrahamPage";
import ProjectedPage from "../pages/ProjectedPage";
import {
  calculateBarsi,
  calculateGraham,
  calculateProjected
} from "../services/valuationApi";

function getTickerInput() {
  return screen.getByLabelText(/^ativo$/i);
}

describe("Valuation pages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("valida ticker obrigatório na página Barsi", async () => {
    const user = userEvent.setup();

    render(<BarsiPage />);

    await user.click(screen.getByRole("button", { name: /calcular preço teto/i }));

    expect(
      screen.getByText(/informe o ticker da ação/i)
    ).toBeInTheDocument();

    expect(calculateBarsi).not.toHaveBeenCalled();
  });

  it("calcula método Barsi com payload correto", async () => {
    const user = userEvent.setup();

    calculateBarsi.mockResolvedValueOnce({
      ticker: "BBAS3",
      fair_price: "30.00",
      method: "barsi"
    });

    const { container } = render(<BarsiPage />);

    await user.type(getTickerInput(), "bbas3");

    const targetYieldInput = container.querySelector('input[name="target_yield"]');
    const currentPriceInput = container.querySelector('input[name="current_price"]');
    const dividend1Input = container.querySelector('input[name="dividend_1"]');
    const dividend2Input = container.querySelector('input[name="dividend_2"]');

    await user.clear(targetYieldInput);
    await user.type(targetYieldInput, "0.08");

    await user.type(currentPriceInput, "27.50");
    await user.type(dividend1Input, "1.20");
    await user.type(dividend2Input, "1.30");

    await user.click(screen.getByRole("button", { name: /calcular preço teto/i }));

    await waitFor(() => {
      expect(calculateBarsi).toHaveBeenCalledWith(
        {
          ticker: "BBAS3",
          force_refresh: false,
          persist: false,
          target_yield: "0.08",
          current_price: "27.5",
          dividends: ["1.2", "1.3"]
        },
        "access-token-test"
      );
    });

    expect(await screen.findByTestId("valuation-result")).toBeInTheDocument();
    expect(screen.getByText(/fair_price/i)).toBeInTheDocument();
  });

  it("preenche ticker ao selecionar ativo na página Barsi", async () => {
    const user = userEvent.setup();

    render(<BarsiPage />);

    await user.click(screen.getByRole("button", { name: /selecionar ativo/i }));

    expect(screen.getByDisplayValue("BBAS3")).toBeInTheDocument();
    expect(screen.getByText("Banco do Brasil")).toBeInTheDocument();
  });

  it("valida ticker obrigatório na página Graham", async () => {
    const user = userEvent.setup();

    render(<GrahamPage />);

    await user.click(screen.getByRole("button", { name: /calcular preço justo/i }));

    expect(
      screen.getByText(/informe o ticker da ação/i)
    ).toBeInTheDocument();

    expect(calculateGraham).not.toHaveBeenCalled();
  });

  it("calcula método Graham com payload correto", async () => {
    const user = userEvent.setup();

    calculateGraham.mockResolvedValueOnce({
      ticker: "BBAS3",
      fair_price: "42.00",
      method: "graham"
    });

    const { container } = render(<GrahamPage />);

    await user.type(getTickerInput(), "bbas3");
    await user.type(container.querySelector('input[name="lpa"]'), "5.20");
    await user.type(container.querySelector('input[name="vpa"]'), "28.40");

    await user.click(screen.getByRole("button", { name: /calcular preço justo/i }));

    await waitFor(() => {
      expect(calculateGraham).toHaveBeenCalledWith(
        {
          ticker: "BBAS3",
          force_refresh: false,
          persist: false,
          lpa: "5.2",
          vpa: "28.4"
        },
        "access-token-test"
      );
    });

    expect(await screen.findByTestId("valuation-result")).toBeInTheDocument();
    expect(screen.getByText(/fair_price/i)).toBeInTheDocument();
  });

  it("valida ticker obrigatório na página Projetivo", async () => {
    const user = userEvent.setup();

    render(<ProjectedPage />);

    await user.click(screen.getByRole("button", { name: /calcular preço teto/i }));

    expect(
      screen.getByText(/informe o ticker da ação/i)
    ).toBeInTheDocument();

    expect(calculateProjected).not.toHaveBeenCalled();
  });

  it("calcula método Projetivo com payload correto", async () => {
    const user = userEvent.setup();

    calculateProjected.mockResolvedValueOnce({
      ticker: "BBAS3",
      fair_price: "31.5",
      method: "projected"
    });

    const { container } = render(<ProjectedPage />);

    await user.type(getTickerInput(), "bbas3");
    await user.type(container.querySelector('input[name="dpa"]'), "2.50");
    await user.type(
      container.querySelector('input[name="average_dividend_yield"]'),
      "0.08"
    );

    await user.click(screen.getByRole("button", { name: /calcular preço teto/i }));

    await waitFor(() => {
      expect(calculateProjected).toHaveBeenCalledWith(
        {
          ticker: "BBAS3",
          force_refresh: false,
          persist: false,
          dpa: "2.5",
          average_dividend_yield: "0.08"
        },
        "access-token-test"
      );
    });

    expect(await screen.findByTestId("valuation-result")).toBeInTheDocument();
    expect(screen.getByText(/fair_price/i)).toBeInTheDocument();
  });
});