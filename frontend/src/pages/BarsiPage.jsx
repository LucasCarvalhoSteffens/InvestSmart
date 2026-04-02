import { useState } from "react";
import AssetSelect from "../components/AssetSelect";
import ResultCard from "../components/ResultCard";
import { useAuth } from "../contexts/AuthContext";
import { calculateBarsi } from "../services/valuationApi";

export default function BarsiPage() {
  const { accessToken } = useAuth();

  const [form, setForm] = useState({
    asset_id: "",
    current_price: "",
    target_yield: "",
    dividend_1: "",
    dividend_2: "",
    dividend_3: "",
    dividend_4: "",
  });

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

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const data = await calculateBarsi(form, accessToken);
      setResult(data);
    } catch (err) {
      setError(err?.response?.data?.detail || "Erro ao calcular Barsi.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="hero">
        <h2>Método Barsi</h2>
        <p>Calcule o preço teto com base em dividendos e yield alvo.</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="form">
          <AssetSelect
            value={form.asset_id}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, asset_id: value }))
            }
          />

          <div className="form-group">
            <label>Preço atual</label>
            <input
              type="number"
              step="0.01"
              name="current_price"
              value={form.current_price}
              onChange={handleChange}
              placeholder="Ex: 27.50"
            />
          </div>

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
          </div>

          <div className="form-group">
            <label>Dividendo 1</label>
            <input
              type="number"
              step="0.0001"
              name="dividend_1"
              value={form.dividend_1}
              onChange={handleChange}
              placeholder="Ex: 0.5000"
            />
          </div>

          <div className="form-group">
            <label>Dividendo 2</label>
            <input
              type="number"
              step="0.0001"
              name="dividend_2"
              value={form.dividend_2}
              onChange={handleChange}
              placeholder="Ex: 0.6000"
            />
          </div>

          <div className="form-group">
            <label>Dividendo 3</label>
            <input
              type="number"
              step="0.0001"
              name="dividend_3"
              value={form.dividend_3}
              onChange={handleChange}
              placeholder="Ex: 0.5500"
            />
          </div>

          <div className="form-group">
            <label>Dividendo 4</label>
            <input
              type="number"
              step="0.0001"
              name="dividend_4"
              value={form.dividend_4}
              onChange={handleChange}
              placeholder="Ex: 0.6500"
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button className="primary-btn" type="submit" disabled={submitting}>
            {submitting ? "Calculando..." : "Calcular Barsi"}
          </button>
        </form>
      </div>

      <ResultCard title="Resultado Barsi" result={result} />
    </div>
  );
}