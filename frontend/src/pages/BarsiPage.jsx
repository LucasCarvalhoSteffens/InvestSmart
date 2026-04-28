import { useState } from "react";
import ResultCard from "../components/ResultCard";
import AssetAutocomplete from "../components/AssetAutocomplete";
import { useAuth } from "../contexts/AuthContext";
import { calculateBarsi } from "../services/valuationApi";

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
      const payload = buildPayload();
      const data = await calculateBarsi(payload, accessToken);
      setResult(data);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Erro ao calcular Barsi."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="hero">
        <h2>Método Barsi</h2>
        <p>
          Busque a ação pelo ticker e calcule o preço teto com dados obtidos da
          API do Yahoo Finance.
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
            <label>Target Yield</label>
            <input
              type="number"
              step="0.0001"
              name="target_yield"
              value={form.target_yield}
              onChange={handleChange}
              placeholder="Ex: 0.0600"
            />
            <small>Exemplo: 0.0600 representa 6% ao ano.</small>
          </div>

          <div className="form-group">
            <label>Preço atual manual, opcional</label>
            <input
              type="number"
              step="0.01"
              name="current_price"
              value={form.current_price}
              onChange={handleChange}
              placeholder="Deixe vazio para buscar pela API"
            />
          </div>

          <div className="form-group">
            <label>Dividendo 1, opcional</label>
            <input
              type="number"
              step="0.0001"
              name="dividend_1"
              value={form.dividend_1}
              onChange={handleChange}
              placeholder="Deixe vazio para buscar pela API"
            />
          </div>

          <div className="form-group">
            <label>Dividendo 2, opcional</label>
            <input
              type="number"
              step="0.0001"
              name="dividend_2"
              value={form.dividend_2}
              onChange={handleChange}
              placeholder="Deixe vazio para buscar pela API"
            />
          </div>

          <div className="form-group">
            <label>Dividendo 3, opcional</label>
            <input
              type="number"
              step="0.0001"
              name="dividend_3"
              value={form.dividend_3}
              onChange={handleChange}
              placeholder="Deixe vazio para buscar pela API"
            />
          </div>

          <div className="form-group">
            <label>Dividendo 4, opcional</label>
            <input
              type="number"
              step="0.0001"
              name="dividend_4"
              value={form.dividend_4}
              onChange={handleChange}
              placeholder="Deixe vazio para buscar pela API"
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button className="primary-btn" type="submit" disabled={submitting}>
            {submitting ? "Buscando e calculando..." : "Calcular Barsi"}
          </button>
        </form>
      </div>

      <ResultCard title="Resultado Barsi" result={result} />
    </div>
  );
}