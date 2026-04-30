import { useMemo, useState } from "react";
import AssetAutocomplete from "../components/AssetAutocomplete";
import ValuationResultCard from "../components/ValuationResultCard";
import { useAuth } from "../contexts/AuthContext";
import { calculateGraham } from "../services/valuationApi";

const METHOD_BENEFITS = [
  "Usa LPA e VPA para estimar valor justo",
  "Ajuda a comparar preço atual com valor intrínseco",
  "Boa opção para análise fundamentalista conservadora",
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

export default function GrahamPage() {
  const { accessToken } = useAuth();

  const [form, setForm] = useState({
    ticker: "",
    lpa: "",
    vpa: "",
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

    if (form.lpa) {
      payload.lpa = form.lpa;
    }

    if (form.vpa) {
      payload.vpa = form.vpa;
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
      const data = await calculateGraham(buildPayload(), accessToken);
      setResult(data);
    } catch (err) {
      setError(getApiError(err, "Erro ao calcular Graham."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="valuation-page graham-theme">
      <section className="valuation-hero">
        <div className="valuation-hero-content">
          <span className="valuation-badge">Valuation conservador</span>
          <h2>Método Graham</h2>
          <p>
            Calcule o preço justo da ação com base em lucro por ação e valor patrimonial.
            Ideal para analisar margem de segurança de forma mais conservadora.
          </p>

          <div className="valuation-hero-tags">
            <span>LPA</span>
            <span>VPA</span>
            <span>Preço justo</span>
          </div>
        </div>

        <div className="valuation-formula-card">
          <span>Fórmula base</span>
          <strong>√(22,5 × LPA × VPA)</strong>
          <small>Quando a API não retornar LPA ou VPA, você pode preencher manualmente.</small>
        </div>
      </section>

      <section className="valuation-layout">
        <div className="valuation-card valuation-form-card">
          <div className="valuation-card-header">
            <div>
              <h3>Dados para cálculo</h3>
              <p>Busque o ativo e revise os indicadores antes de calcular.</p>
            </div>
            {selectedTicker && <span className="valuation-selected-pill">{selectedTicker}</span>}
          </div>

          <form className="valuation-form" onSubmit={handleSubmit}>
            <AssetAutocomplete
              value={form.ticker}
              onChange={handleTickerChange}
              onAssetSelected={handleAssetSelected}
              label="Ativo"
              placeholder="Digite o ticker. Ex: PETR4, BBAS3, VALE3"
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
                <span>LPA, opcional</span>
                <input
                  type="number"
                  step="0.0001"
                  name="lpa"
                  value={form.lpa}
                  onChange={handleChange}
                  placeholder="Ex: 4.35"
                />
                <small>Lucro por ação. Preencha apenas se quiser sobrescrever a API.</small>
              </label>

              <label className="valuation-field">
                <span>VPA, opcional</span>
                <input
                  type="number"
                  step="0.0001"
                  name="vpa"
                  value={form.vpa}
                  onChange={handleChange}
                  placeholder="Ex: 22.80"
                />
                <small>Valor patrimonial por ação.</small>
              </label>
            </div>

            {error && <div className="valuation-error">{error}</div>}

            <button className="primary-btn valuation-submit-btn" type="submit" disabled={submitting}>
              {submitting ? "Buscando e calculando..." : "Calcular preço justo"}
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
            title="Resultado Graham"
            subtitle="Estimativa de preço justo pelo método de Graham."
            primaryLabel="Preço justo estimado"
            primaryKeys={["fair_price", "graham_price", "intrinsic_value", "target_price", "price"]}
            accent="blue"
          />
        </aside>
      </section>
    </div>
  );
}