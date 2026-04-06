import { useEffect, useState } from "react";
import { listAssets } from "../services/assetsApi";
import { useAuth } from "../contexts/AuthContext";

export default function AssetSelect({ value, onChange }) {
  const { accessToken } = useAuth();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAssets() {
      try {
        setError("");
        const data = await listAssets(accessToken);
        setAssets(data);
      } catch {
        setError("Não foi possível carregar os ativos.");
      } finally {
        setLoading(false);
      }
    }

    if (accessToken) {
      loadAssets();
    }
  }, [accessToken]);

  if (loading) {
    return <p className="muted">Carregando ativos...</p>;
  }

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  return (
    <div className="form-group">
      <label>Ativo</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Selecione um ativo</option>
        {assets.map((asset) => (
          <option key={asset.id} value={asset.id}>
            {asset.ticker} - {asset.name}
          </option>
        ))}
      </select>
    </div>
  );
}