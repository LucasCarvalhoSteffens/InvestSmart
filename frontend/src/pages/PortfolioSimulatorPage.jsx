import { useMemo, useState } from "react";
import AssetAutocomplete from "../components/AssetAutocomplete";
import { useAuth } from "../contexts/AuthContext";
import { syncAssetByTicker } from "../services/assetsApi";
import { createPortfolio, createPortfolioItem } from "../services/portfoliosApi";

const EMPTY_SIM_FORM = {
  ticker: "",
  quantity: "",
  average_price: "",
  target_price: "",
  notes: "",
};

function cleanTicker(value) {
  if (!value) {
    return "";
  }

  return String(value)
    .trim()
    .split(" - ")[0]
    .split(" ")[0]
    .toUpperCase();
}

function formatCurrency(value) {
  const numericValue = Number(value ?? 0);

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number.isFinite(numericValue) ? numericValue : 0);
}

function formatPercent(value) {
  const numericValue = Number(value ?? 0);

  return `${new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(numericValue) ? numericValue : 0)}%`;
}

function extractErrorMessage(error, fallbackMessage) {
  const responseData = error?.response?.data;

  if (!responseData) {
    return fallbackMessage;
  }

  if (typeof responseData === "string") {
    return responseData;
  }

  if (typeof responseData.detail === "string") {
    return responseData.detail;
  }

  const firstKey = Object.keys(responseData)[0];
  const firstValue = responseData[firstKey];

  if (Array.isArray(firstValue) && firstValue.length > 0) {
    return firstValue[0];
  }

  if (typeof firstValue === "string") {
    return firstValue;
  }

  return fallbackMessage;
}

function buildItemMetrics(item) {
  const quantity = Number(item.quantity ?? 0);
  const averagePrice = Number(item.average_price ?? 0);
  const currentPrice = Number(item.current_price ?? 0);
  const targetPrice = Number(item.target_price ?? 0);

  const investedAmount = quantity * averagePrice;
  const currentValue = quantity * currentPrice;
  const targetValue = targetPrice > 0 ? quantity * targetPrice : null;
  const unrealizedGain = currentValue - investedAmount;
  const unrealizedGainPct =
    investedAmount > 0 ? (unrealizedGain / investedAmount) * 100 : 0;

  const targetGain = targetValue !== null ? targetValue - currentValue : null;
  const targetGainPct =
    targetValue !== null && currentValue > 0
      ? (targetGain / currentValue) * 100
      : null;

  return {
    investedAmount,
    currentValue,
    targetValue,
    unrealizedGain,
    unrealizedGainPct,
    targetGain,
    targetGainPct,
    isOpportunity: targetPrice > 0 && currentPrice <= targetPrice,
  };
}

export default function PortfolioSimulatorPage() {
  const { accessToken } = useAuth();

  const [form, setForm] = useState(EMPTY_SIM_FORM);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [items, setItems] = useState([]);
  const [portfolioName, setPortfolioName] = useState("Carteira Simulada");
  const [loading, setLoading] = useState(false);
  const [savingPortfolio, setSavingPortfolio] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const simulatedItems = useMemo(() => {
    return items.map((item) => ({
      ...item,
      metrics: buildItemMetrics(item),
    }));
  }, [items]);

  const summary = useMemo(() => {
    const totals = simulatedItems.reduce(
      (accumulator, item) => {
        accumulator.totalInvested += item.metrics.investedAmount;
        accumulator.totalCurrent += item.metrics.currentValue;
        accumulator.totalTarget += item.metrics.targetValue ?? 0;
        accumulator.opportunities += item.metrics.isOpportunity ? 1 : 0;

        return accumulator;
      },
      {
        totalInvested: 0,
        totalCurrent: 0,
        totalTarget: 0,
        opportunities: 0,
      },
    );

    const currentGain = totals.totalCurrent - totals.totalInvested;
    const currentGainPct =
      totals.totalInvested > 0 ? (currentGain / totals.totalInvested) * 100 : 0;

    const targetGain = totals.totalTarget - totals.totalCurrent;
    const targetGainPct =
      totals.totalCurrent > 0 ? (targetGain / totals.totalCurrent) * 100 : 0;

    return {
      ...totals,
      currentGain,
      currentGainPct,
      targetGain,
      targetGainPct,
      totalItems: simulatedItems.length,
    };
  }, [simulatedItems]);

  function handleFormChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleTickerChange(ticker) {
    setForm((previous) => ({
      ...previous,
      ticker,
    }));

    setSelectedAsset(null);
    setSuccessMessage("");
    setError("");
  }

  function handleAssetSelected(asset) {
    if (!asset) {
      setSelectedAsset(null);
      return;
    }

    setSelectedAsset(asset);

    setForm((previous) => ({
      ...previous,
      ticker: asset.ticker,
    }));
  }

  function resetForm() {
    setForm(EMPTY_SIM_FORM);
    setSelectedAsset(null);
  }

  async function handleAddItem(event) {
    event.preventDefault();

    const ticker = cleanTicker(form.ticker);
    const quantity = Number(form.quantity);
    const averagePrice = Number(form.average_price);

    if (!ticker) {
      setError("Informe um ativo para simular.");
      return;
    }

    if (!quantity || quantity <= 0) {
      setError("Informe uma quantidade válida.");
      return;
    }

    if (!averagePrice || averagePrice <= 0) {
      setError("Informe um preço médio válido.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      const syncedAsset = await syncAssetByTicker(ticker, accessToken, false);

      const newItem = {
        id:
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${ticker}`,
        ticker: syncedAsset.ticker,
        name: syncedAsset.name || selectedAsset?.name || ticker,
        sector: syncedAsset.sector || "",
        current_price: syncedAsset.current_price || 0,
        quantity: form.quantity,
        average_price: form.average_price,
        target_price: form.target_price || "",
        notes: form.notes,
      };

      setItems((previous) => [...previous, newItem]);
      resetForm();
    } catch (err) {
      setError(
        extractErrorMessage(err, "Não foi possível buscar o ativo para simulação."),
      );
    } finally {
      setLoading(false);
    }
  }

  function handleRemoveItem(itemId) {
    setItems((previous) => previous.filter((item) => item.id !== itemId));
  }

  function handleClearSimulation() {
    const confirmed = window.confirm("Deseja limpar toda a simulação?");

    if (!confirmed) {
      return;
    }

    setItems([]);
    setSuccessMessage("");
    setError("");
  }

  async function handleSaveAsPortfolio() {
    if (items.length === 0) {
      setError("Adicione pelo menos um ativo antes de salvar como carteira.");
      return;
    }

    try {
      setSavingPortfolio(true);
      setError("");
      setSuccessMessage("");

      const createdPortfolio = await createPortfolio(
        {
          name: portfolioName || "Carteira Simulada",
          description:
            "Carteira criada a partir do simulador do InvestSmart.",
        },
        accessToken,
      );

      for (const item of items) {
        await createPortfolioItem(
          {
            portfolio: createdPortfolio.id,
            ticker: item.ticker,
            quantity: item.quantity,
            average_price: item.average_price,
            target_price: item.target_price || null,
            notes: item.notes,
          },
          accessToken,
        );
      }

      setSuccessMessage(
        "Simulação salva como carteira. Acesse Minhas Carteiras para acompanhar.",
      );
    } catch (err) {
      setError(
        extractErrorMessage(err, "Não foi possível salvar a simulação como carteira."),
      );
    } finally {
      setSavingPortfolio(false);
    }
  }

  return (
    <div className="portfolio-simulator-page">
      <section className="simulator-hero">
        <div>
          <span className="simulator-kicker">Simulador de Carteiras</span>
          <h2>Teste cenários antes de adicionar ativos à sua carteira real.</h2>
          <p>
            Use esta área para montar uma carteira hipotética, comparar preço
            médio, preço atual, preço teto e potencial de retorno sem alterar
            suas carteiras reais.
          </p>
        </div>

        <div className="simulator-hero-card">
          <span>Fluxo recomendado</span>
          <strong>Simular → Comparar → Salvar</strong>
          <small>
            Salve como carteira apenas quando quiser transformar o cenário em
            acompanhamento real.
          </small>
        </div>
      </section>

      {error && <div className="error-message">{error}</div>}

      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      <section className="simulator-layout">
        <div className="simulator-form-card">
          <div className="simulator-card-header">
            <div>
              <h3>Adicionar ativo à simulação</h3>
              <p>
                Pesquise o ativo pelo Yahoo Finance e informe os dados do cenário.
              </p>
            </div>
          </div>

          <form className="simulator-form" onSubmit={handleAddItem}>
            <AssetAutocomplete
              value={form.ticker}
              onChange={handleTickerChange}
              onAssetSelected={handleAssetSelected}
              label="Ativo"
              placeholder="Digite o ticker. Ex: PETR4, BBAS3, VALE3"
              disabled={loading}
            />

            <div className="simulator-input-grid">
              <label className="form-group">
                Quantidade
                <input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleFormChange}
                  min="1"
                  placeholder="Ex.: 10"
                  required
                />
              </label>

              <label className="form-group">
                Preço médio simulado
                <input
                  type="number"
                  name="average_price"
                  value={form.average_price}
                  onChange={handleFormChange}
                  min="0.01"
                  step="0.01"
                  placeholder="Ex.: 25.50"
                  required
                />
              </label>

              <label className="form-group">
                Preço teto desejado
                <input
                  type="number"
                  name="target_price"
                  value={form.target_price}
                  onChange={handleFormChange}
                  min="0.01"
                  step="0.01"
                  placeholder="Ex.: 30.00"
                />
              </label>

              <label className="form-group">
                Observações
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleFormChange}
                  placeholder="Ex.: cenário para dividendos, longo prazo..."
                />
              </label>
            </div>

            <button className="primary-btn simulator-submit-btn" type="submit" disabled={loading}>
              {loading ? "Buscando ativo..." : "Adicionar à simulação"}
            </button>
          </form>
        </div>

        <aside className="simulator-summary-card">
          <div className="simulator-card-header">
            <div>
              <h3>Resumo simulado</h3>
              <p>Consolidado dos ativos adicionados ao cenário.</p>
            </div>
          </div>

          <div className="simulator-summary-grid">
            <div className="summary-stat">
              <span className="summary-label">Ativos simulados</span>
              <strong>{summary.totalItems}</strong>
            </div>

            <div className="summary-stat">
              <span className="summary-label">Valor investido</span>
              <strong>{formatCurrency(summary.totalInvested)}</strong>
            </div>

            <div className="summary-stat">
              <span className="summary-label">Valor atual</span>
              <strong>{formatCurrency(summary.totalCurrent)}</strong>
            </div>

            <div className="summary-stat">
              <span className="summary-label">Ganho/Perda</span>
              <strong
                className={
                  summary.currentGain >= 0 ? "metric-positive" : "metric-negative"
                }
              >
                {formatCurrency(summary.currentGain)}
              </strong>
            </div>

            <div className="summary-stat">
              <span className="summary-label">Rentabilidade</span>
              <strong>{formatPercent(summary.currentGainPct)}</strong>
            </div>

            <div className="summary-stat">
              <span className="summary-label">Valor no preço teto</span>
              <strong>{formatCurrency(summary.totalTarget)}</strong>
            </div>

            <div className="summary-stat">
              <span className="summary-label">Potencial até teto</span>
              <strong
                className={
                  summary.targetGain >= 0 ? "metric-positive" : "metric-negative"
                }
              >
                {formatCurrency(summary.targetGain)}
              </strong>
            </div>

            <div className="summary-stat">
              <span className="summary-label">Oportunidades</span>
              <strong>{summary.opportunities}</strong>
            </div>
          </div>

          <div className="simulator-save-box">
            <label>
              Nome para salvar como carteira
              <input
                type="text"
                value={portfolioName}
                onChange={(event) => setPortfolioName(event.target.value)}
                placeholder="Ex.: Carteira Simulada"
              />
            </label>

            <div className="button-row wrap">
              <button
                type="button"
                className="primary-btn"
                onClick={handleSaveAsPortfolio}
                disabled={savingPortfolio || items.length === 0}
              >
                {savingPortfolio ? "Salvando..." : "Salvar como carteira"}
              </button>

              <button
                type="button"
                className="secondary-btn"
                onClick={handleClearSimulation}
                disabled={items.length === 0}
              >
                Limpar simulação
              </button>
            </div>
          </div>
        </aside>
      </section>

      <section className="simulator-results-card">
        <div className="simulator-card-header">
          <div>
            <h3>Ativos simulados</h3>
            <p>
              Esta lista é apenas uma simulação. Ela não altera suas carteiras
              reais até você clicar em salvar.
            </p>
          </div>
        </div>

        {simulatedItems.length === 0 ? (
          <div className="empty-state">
            <strong>Nenhum ativo simulado</strong>
            <span>Adicione ativos para visualizar o cenário consolidado.</span>
          </div>
        ) : (
          <div className="simulation-item-list">
            {simulatedItems.map((item) => (
              <article className="simulation-card card" key={item.id}>
                <div className="portfolio-item-head">
                  <div>
                    <h4>
                      {item.ticker} - {item.name}
                    </h4>

                    <div className="simulation-meta-row">
                      <span className="source-chip">
                        {item.sector || "Setor não informado"}
                      </span>

                      <span
                        className={`status-pill ${
                          item.metrics.isOpportunity
                            ? "status-buy"
                            : "status-neutral"
                        }`}
                      >
                        {item.metrics.isOpportunity
                          ? "Abaixo do preço teto"
                          : "Fora do preço teto"}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="danger-btn small-btn"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    Remover
                  </button>
                </div>

                <div className="portfolio-item-grid">
                  <div className="result-item">
                    <span>Quantidade</span>
                    <strong>{item.quantity}</strong>
                  </div>

                  <div className="result-item">
                    <span>Preço médio</span>
                    <strong>{formatCurrency(item.average_price)}</strong>
                  </div>

                  <div className="result-item">
                    <span>Preço atual</span>
                    <strong>{formatCurrency(item.current_price)}</strong>
                  </div>

                  <div className="result-item">
                    <span>Preço teto</span>
                    <strong>
                      {item.target_price
                        ? formatCurrency(item.target_price)
                        : "Não definido"}
                    </strong>
                  </div>

                  <div className="result-item">
                    <span>Valor investido</span>
                    <strong>{formatCurrency(item.metrics.investedAmount)}</strong>
                  </div>

                  <div className="result-item">
                    <span>Valor atual</span>
                    <strong>{formatCurrency(item.metrics.currentValue)}</strong>
                  </div>

                  <div className="result-item">
                    <span>Ganho/Perda atual</span>
                    <strong
                      className={
                        item.metrics.unrealizedGain >= 0
                          ? "metric-positive"
                          : "metric-negative"
                      }
                    >
                      {formatCurrency(item.metrics.unrealizedGain)}
                    </strong>
                  </div>

                  <div className="result-item">
                    <span>Rentabilidade atual</span>
                    <strong>{formatPercent(item.metrics.unrealizedGainPct)}</strong>
                  </div>

                  <div className="result-item">
                    <span>Potencial até teto</span>
                    <strong>
                      {item.metrics.targetGain !== null
                        ? formatCurrency(item.metrics.targetGain)
                        : "Não aplicável"}
                    </strong>
                  </div>

                  <div className="result-item">
                    <span>Potencial percentual</span>
                    <strong>
                      {item.metrics.targetGainPct !== null
                        ? formatPercent(item.metrics.targetGainPct)
                        : "Não aplicável"}
                    </strong>
                  </div>
                </div>

                {item.notes && <p className="muted">{item.notes}</p>}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}