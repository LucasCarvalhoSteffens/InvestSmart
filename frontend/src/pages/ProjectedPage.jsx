import { useState } from "react";
import AssetSelect from "../components/AssetSelect";
import ResultCard from "../components/ResultCard";
import { useAuth } from "../contexts/AuthContext";
import { calculateProjected } from "../services/valuationApi";

export default function ProjectedPage() {
  const { accessToken } = useAuth();

  const [form, setForm] = useState({
    asset_id: "",
    dpa: "",
    average_dividend_yield: "",
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
      const data = await calculateProjected(form, accessToken);
      setResult(data);
    } catch (err) {
      setError(err?.response?.data?.detail || "Erro ao calcular o método projetivo.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="hero">
        <h2>Preço Teto Projetivo</h2>
        <p>Calcule o preço teto com base em DPA e dividend yield médio.</p>
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
            <label>DPA</label>
            <input
              type="number"
              step="0.0001"
              name="dpa"
              value={form.dpa}
              onChange={handleChange}
              placeholder="Ex: 2.4000"
            />
          </div>

          <div className="form-group">
            <label>Dividend Yield médio</label>
            <input
              type="number"
              step="0.0001"
              name="average_dividend_yield"
              value={form.average_dividend_yield}
              onChange={handleChange}
              placeholder="Ex: 0.0800"
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button className="primary-btn" type="submit" disabled={submitting}>
            {submitting ? "Calculando..." : "Calcular Projetivo"}
          </button>
        </form>
      </div>

      <ResultCard title="Resultado Projetivo" result={result} />
    </div>
  );
}