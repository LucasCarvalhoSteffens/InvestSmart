import { useState } from "react";
import AssetSelect from "../components/AssetSelect";
import ResultCard from "../components/ResultCard";
import { useAuth } from "../contexts/AuthContext";
import { calculateGraham } from "../services/valuationApi";

export default function GrahamPage() {
  const { accessToken } = useAuth();

  const [form, setForm] = useState({
    asset_id: "",
    lpa: "",
    vpa: "",
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
      const data = await calculateGraham(form, accessToken);
      setResult(data);
    } catch (err) {
      setError(err?.response?.data?.detail || "Erro ao calcular Graham.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="hero">
        <h2>Método Graham</h2>
        <p>Calcule o preço justo com base em LPA e VPA.</p>
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
            <label>LPA</label>
            <input
              type="number"
              step="0.01"
              name="lpa"
              value={form.lpa}
              onChange={handleChange}
              placeholder="Ex: 5.10"
            />
          </div>

          <div className="form-group">
            <label>VPA</label>
            <input
              type="number"
              step="0.01"
              name="vpa"
              value={form.vpa}
              onChange={handleChange}
              placeholder="Ex: 32.40"
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button className="primary-btn" type="submit" disabled={submitting}>
            {submitting ? "Calculando..." : "Calcular Graham"}
          </button>
        </form>
      </div>

      <ResultCard title="Resultado Graham" result={result} />
    </div>
  );
}