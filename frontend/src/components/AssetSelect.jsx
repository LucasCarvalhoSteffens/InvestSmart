import PropTypes from "prop-types";

import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { listAssets } from "../services/assetsApi";

export default function AssetSelect({ value, onChange }) {
  const { accessToken } = useAuth();

  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAssets() {
      if (!accessToken) {
        setAssets([]);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await listAssets(accessToken);

        const results = Array.isArray(data) ? data : data.results || [];

        setAssets(results);
      } catch {
        setError("Não foi possível carregar os ativos.");
      } finally {
        setLoading(false);
      }
    }

    loadAssets();
  }, [accessToken]);

  return (
    <div className="form-group">
      <label htmlFor="asset-select">Ativo</label>

        <select
          id="asset-select"
          value={value}
          onChange={onChange}
          disabled={loading}
        >
        <option value="">
          {loading ? "Carregando ativos..." : "Selecione um ativo"}
        </option>

        {assets.map((asset) => (
          <option key={asset.id} value={asset.id}>
            {asset.ticker} - {asset.name}
          </option>
        ))}
      </select>

      {error && <p className="error-text">{error}</p>}
    </div>
  );
}

AssetSelect.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
};