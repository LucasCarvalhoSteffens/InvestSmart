import { useMemo, useState } from "react";
import AssetAutocomplete from "../components/AssetAutocomplete";
import ValuationResultCard from "../components/ValuationResultCard";
import { useAuth } from "../contexts/AuthContext";
import { calculateBarsi } from "../services/valuationApi";

const METHOD_BENEFITS = [
  "Foca em dividendos e geração de renda",
  "Permite definir um yield mínimo desejado",
  "Ajuda a encontrar um preço teto de entrada",
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

export default function BarsiPage() {
  const { accessToken } = useAuth();

  const [form, setForm] = useState({
    ticker: "",
    target_yield: "0.0600",
    current_price: "",
    dividend_1: "",
    dividend_2: "",
    dividend_3: "",
    dividend_4: "",
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

    if (form.target_yield) {
      payload.target_yield = form.target_yield;
    }

    if (form.current_price) {
      payload.current_price = form.current_price;
    }

    const dividends = [
      form.dividend_1,
      form.dividend_2,
      form.dividend_3,
      form.dividend_4,
    ].filter((value) => value !== "");

    if (dividends.length > 0) {
      payload.dividends = dividends;
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
      const data = await calculateBarsi(buildPayload(), accessToken);
      setResult(data);
    } catch (err) {
      setError(getApiError(err, "Erro ao calcular Barsi."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="valuation-page barsi-theme">
      <section className="valuation-hero">
        <div className="valuation-hero-content">
          <span className="valuation-badge">Foco em dividendos</span>
          <h2>Método Barsi</h2>
          <p>
            Calcule um preço teto considerando dividendos e yield alvo. É uma tela pensada para
            investidores que avaliam geração de renda e margem de segurança.
          </p>

          <div className="valuation-hero-tags">
            <span>Dividendos</span>
            <span>Yield alvo</span>
            <span>Preço teto</span>
          </div>
        </div>

        <div className="valuation-formula-card">
          <span>Ideia do cálculo</span>
          <strong>Dividendos ÷ Yield alvo</strong>
          <small>Exemplo: 0.0600 representa uma exigência de 6% ao ano.</small>
        </div>
      </section>

      <section className="valuation-layout">
        <div className="valuation-card valuation-form-card">
          <div className="valuation-card-header">
            <div>
              <h3>Dados para cálculo</h3>
              <p>Busque o ativo e ajuste os dividendos usados na estimativa.</p>
            </div>
            {selectedTicker && <span className="valuation-selected-pill">{selectedTicker}</span>}
          </div>

          <form className="valuation-form" onSubmit={handleSubmit}>
            <AssetAutocomplete
              value={form.ticker}
              onChange={handleTickerChange}
              onAssetSelected={handleAssetSelected}
              label="Ativo"
              placeholder="Digite o ticker. Ex: BBAS3, TAEE11, PETR4"
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
                <span>Target Yield</span>
                <input
                  type="number"
                  step="0.0001"
                  name="target_yield"
                  value={form.target_yield}
                  onChange={handleChange}
                  placeholder="Ex: 0.0600"
                />
                <small>Exemplo: 0.0600 representa 6% ao ano.</small>
              </label>

              <label className="valuation-field">
                <span>Preço atual, opcional</span>
                <input
                  type="number"
                  step="0.01"
                  name="current_price"
                  value={form.current_price}
                  onChange={handleChange}
                  placeholder="Ex: 27.50"
                />
                <small>Use se quiser sobrescrever a cotação retornada pela API.</small>
              </label>
            </div>

            <div className="valuation-dividend-box">
              <div className="valuation-section-title">
                <strong>Dividendos manuais</strong>
                <span>Opcional</span>
              </div>

              <p>
                Preencha apenas se quiser informar manualmente os dividendos usados no cálculo.
                Caso contrário, o sistema tentará utilizar os dados retornados pela API.
              </p>

              <div className="valuation-input-grid dividend-grid">
                {[1, 2, 3, 4].map((index) => (
                  <label className="valuation-field" key={index}>
                    <span>Dividendo {index}</span>
                    <input
                      type="number"
                      step="0.0001"
                      name={`dividend_${index}`}
                      value={form[`dividend_${index}`]}
                      onChange={handleChange}
                      placeholder="Ex: 0.5000"
                    />
                  </label>
                ))}
              </div>
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
            title="Resultado Barsi"
            subtitle="Estimativa de preço teto com foco em dividendos."
            primaryLabel="Preço teto estimado"
            primaryKeys={["target_price", "ceiling_price", "barsi_price", "fair_price", "price"]}
            accent="orange"
          />
        </aside>
      </section>
    </div>
  );
}