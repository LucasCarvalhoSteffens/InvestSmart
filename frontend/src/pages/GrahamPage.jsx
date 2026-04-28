import { useState } from "react";
import ResultCard from "../components/ResultCard";
import AssetAutocomplete from "../components/AssetAutocomplete";
import { useAuth } from "../contexts/AuthContext";
import { calculateGraham } from "../services/valuationApi";

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
      ticker: ticker.toUpperCase(),
    }));

    setSelectedAsset(null);
    setResult(null);
    setError("");
  }

  function handleAssetSelected(asset) {
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
      const payload = buildPayload();
      const data = await calculateGraham(payload, accessToken);
      setResult(data);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Erro ao calcular Graham."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="hero">
        <h2>Método Graham</h2>
        <p>
          Busque a ação pelo ticker e calcule o preço justo com base em LPA e
          VPA obtidos pela API do Yahoo Finance.
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="form">
          <AssetAutocomplete
            label="Ticker da ação"
            value={form.ticker}
            onChange={handleTickerChange}
            onAssetSelected={handleAssetSelected}
            placeholder="Digite parte do ticker. Ex: PET, BBA, VALE"
          />

          {selectedAsset && (
            <div className="info-box">
              <p>
                <strong>Ativo selecionado:</strong> {selectedAsset.ticker}
              </p>
              <p>
                <strong>Nome:</strong> {selectedAsset.name}
              </p>
              <p>
                <strong>Fonte:</strong> {selectedAsset.source}
              </p>
            </div>
          )}

          <div className="form-group">
            <label>LPA, opcional</label>
            <input
              type="number"
              step="0.0001"
              name="lpa"
              value={form.lpa}
              onChange={handleChange}
              placeholder="Deixe vazio para buscar pela API"
            />
            <small>
              Informe manualmente apenas se a API não retornar o lucro por ação.
            </small>
          </div>

          <div className="form-group">
            <label>VPA, opcional</label>
            <input
              type="number"
              step="0.0001"
              name="vpa"
              value={form.vpa}
              onChange={handleChange}
              placeholder="Deixe vazio para buscar pela API"
            />
            <small>
              Informe manualmente apenas se a API não retornar o valor
              patrimonial por ação.
            </small>
          </div>

          {error && <p className="error-text">{error}</p>}

          <button className="primary-btn" type="submit" disabled={submitting}>
            {submitting ? "Buscando e calculando..." : "Calcular Graham"}
          </button>
        </form>
      </div>

      <ResultCard title="Resultado Graham" result={result} />
    </div>
  );
}