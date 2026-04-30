import { useMemo, useState } from "react";
import AssetAutocomplete from "../components/AssetAutocomplete";
import ValuationResultCard from "../components/ValuationResultCard";
import { useAuth } from "../contexts/AuthContext";
import { calculateProjected } from "../services/valuationApi";

const METHOD_BENEFITS = [
  "Usa dividendos e yield médio como referência",
  "Ajuda a estimar um preço teto para compra",
  "Funciona bem para ativos focados em renda passiva",
];

function getApiError(err, fallback) {
  const detail = err?.response?.data?.detail;

  if (typeof detail === "string") {
    return detail;
  }

  if (detail && typeof detail === "object") {
    return Object.values(detail).flat().join(" ");
  }

  return err?.message || fallback;
}

export default function ProjectedPage() {
  const { accessToken } = useAuth();

  const [form, setForm] = useState({
    ticker: "",
    dpa: "",
    average_dividend_yield: "",
  });

  const [selectedAsset, setSelectedAsset] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selectedTicker = useMemo(() => {
    return selectedAsset?.ticker || form.ticker || "";
  }, [selectedAsset, form.ticker]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleTickerChange(ticker) {
    setForm((prev) => ({
      ...prev,
      ticker: String(ticker || "").toUpperCase(),
    }));

    setSelectedAsset(null);
    setResult(null);
    setError("");
  }

  function handleAssetSelected(asset) {
    if (!asset) {
      setSelectedAsset(null);
      setResult(null);
      setError("");
      return;
    }
  
    setSelectedAsset(asset);
  
    setForm((prev) => ({
      ...prev,
      ticker: asset.ticker,
    }));
  
    setResult(null);
    setError("");
  }

  function buildPayload() {
    const payload = {
      ticker: form.ticker.trim().toUpperCase(),
      force_refresh: false,
      persist: false,
    };

    if (form.dpa) {
      payload.dpa = form.dpa;
    }

    if (form.average_dividend_yield) {
      payload.average_dividend_yield = form.average_dividend_yield;
    }

    return payload;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setResult(null);

    if (!form.ticker.trim()) {
      setError("Informe o ticker da ação. Ex: PETR4, BBAS3, VALE3.");
      return;
    }

    setSubmitting(true);

    try {
      const data = await calculateProjected(buildPayload(), accessToken);
      setResult(data);
    } catch (err) {
      setError(getApiError(err, "Erro ao calcular o método projetivo."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="valuation-page projected-theme">
      <section className="valuation-hero">
        <div className="valuation-hero-content">
          <span className="valuation-badge">Projeção por dividendos</span>
          <h2>Preço Teto Projetivo</h2>
          <p>
            Estime um preço teto usando DPA e dividend yield médio. A tela permite usar dados
            vindos da API ou preencher valores manualmente quando necessário.
          </p>

          <div className="valuation-hero-tags">
            <span>DPA</span>
            <span>Dividend Yield</span>
            <span>Preço teto</span>
          </div>
        </div>

        <div className="valuation-formula-card">
          <span>Ideia do cálculo</span>
          <strong>DPA ÷ DY médio</strong>
          <small>Quanto maior o dividendo esperado e menor o yield exigido, maior tende a ser o preço teto.</small>
        </div>
      </section>

      <section className="valuation-layout">
        <div className="valuation-card valuation-form-card">
          <div className="valuation-card-header">
            <div>
              <h3>Dados para cálculo</h3>
              <p>Informe o ativo e, se quiser, ajuste manualmente DPA e dividend yield.</p>
            </div>
            {selectedTicker && <span className="valuation-selected-pill">{selectedTicker}</span>}
          </div>

          <form className="valuation-form" onSubmit={handleSubmit}>
            <AssetAutocomplete
              value={form.ticker}
              onChange={handleTickerChange}
              onAssetSelected={handleAssetSelected}
              label="Ativo"
              placeholder="Digite o ticker. Ex: TAEE11, BBAS3, PETR4"
            />

            {selectedAsset && (
              <div className="selected-valuation-asset">
                <div>
                  <strong>{selectedAsset.ticker}</strong>
                  <span>{selectedAsset.name}</span>
                </div>
                <small>{selectedAsset.source || "Yahoo Finance"}</small>
              </div>
            )}

            <div className="valuation-input-grid">
              <label className="valuation-field">
                <span>DPA, opcional</span>
                <input
                  type="number"
                  step="0.0001"
                  name="dpa"
                  value={form.dpa}
                  onChange={handleChange}
                  placeholder="Ex: 2.40"
                />
                <small>Dividendos por ação considerados no cálculo.</small>
              </label>

              <label className="valuation-field">
                <span>Dividend Yield médio, opcional</span>
                <input
                  type="number"
                  step="0.0001"
                  name="average_dividend_yield"
                  value={form.average_dividend_yield}
                  onChange={handleChange}
                  placeholder="Ex: 0.0800"
                />
                <small>Exemplo: 0.0800 representa 8% ao ano.</small>
              </label>
            </div>

            {error && <div className="valuation-error">{error}</div>}

            <button className="primary-btn valuation-submit-btn" type="submit" disabled={submitting}>
              {submitting ? "Buscando e calculando..." : "Calcular preço teto"}
            </button>
          </form>
        </div>

        <aside className="valuation-side-panel">
          <div className="valuation-info-card">
            <h4>Como interpretar</h4>
            <ul>
              {METHOD_BENEFITS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <ValuationResultCard
            result={result}
            title="Resultado Projetivo"
            subtitle="Estimativa de preço teto com base em dividendos."
            primaryLabel="Preço teto estimado"
            primaryKeys={["target_price", "ceiling_price", "projected_price", "fair_price", "price"]}
            accent="green"
          />
        </aside>
      </section>
    </div>
  );
}