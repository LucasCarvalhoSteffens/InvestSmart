import { useState } from "react";
import ResultCard from "../components/ResultCard";
import AssetAutocomplete from "../components/AssetAutocomplete";
import { useAuth } from "../contexts/AuthContext";
import { calculateProjected } from "../services/valuationApi";

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
      const payload = buildPayload();
      const data = await calculateProjected(payload, accessToken);
      setResult(data);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Erro ao calcular o método projetivo."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="hero">
        <h2>Preço Teto Projetivo</h2>
        <p>
          Busque a ação pelo ticker e calcule o preço teto com base em DPA e
          dividend yield médio obtidos pela API do Yahoo Finance.
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
            <label>DPA, opcional</label>
            <input
              type="number"
              step="0.0001"
              name="dpa"
              value={form.dpa}
              onChange={handleChange}
              placeholder="Deixe vazio para buscar pela API"
            />
            <small>
              Informe manualmente apenas se a API não retornar dividendos
              suficientes.
            </small>
          </div>

          <div className="form-group">
            <label>Dividend Yield médio, opcional</label>
            <input
              type="number"
              step="0.0001"
              name="average_dividend_yield"
              value={form.average_dividend_yield}
              onChange={handleChange}
              placeholder="Deixe vazio para buscar pela API"
            />
            <small>
              Exemplo: 0.0800 representa 8% ao ano. Preencha manualmente apenas
              se a API não retornar o dado.
            </small>
          </div>

          {error && <p className="error-text">{error}</p>}

          <button className="primary-btn" type="submit" disabled={submitting}>
            {submitting ? "Buscando e calculando..." : "Calcular Projetivo"}
          </button>
        </form>
      </div>

      <ResultCard title="Resultado Projetivo" result={result} />
    </div>
  );
}