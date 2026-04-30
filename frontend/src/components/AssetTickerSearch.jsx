import PropTypes from "prop-types";

import { useState } from "react";
import { syncAssetByTicker } from "../services/assetsApi";

export default function AssetTickerSearch({ onAssetSelected }) {
  const [ticker, setTicker] = useState("");
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearchAsset() {
    if (!ticker.trim()) {
      setError("Informe o ticker da ação.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await syncAssetByTicker(ticker.trim());

      setAsset(result);

      if (onAssetSelected) {
        onAssetSelected(result);
      }
    } catch (err) {
      setAsset(null);
      setError(err.message || "Erro ao buscar ativo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <label htmlFor="asset-ticker-search">Buscar ativo</label>

      <input
        id="asset-ticker-search"
        type="text"
      />

      <div className="flex gap-2">
        <input
          type="text"
          value={ticker}
          onChange={(event) => setTicker(event.target.value.toUpperCase())}
          placeholder="Ex: PETR4, BBAS3, VALE3"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
        />

        <button
          type="button"
          onClick={handleSearchAsset}
          disabled={loading}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

      {asset && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm">
          <p>
            <strong>Ativo encontrado:</strong> {asset.ticker}
          </p>
          <p>
            <strong>Nome:</strong> {asset.name}
          </p>
          <p>
            <strong>Preço atual:</strong> R$ {asset.current_price}
          </p>
          <p>
            <strong>Fonte:</strong> {asset.data_source}
          </p>
        </div>
      )}
    </div>
  );
}

AssetTickerSearch.propTypes = {
  onAssetSelected: PropTypes.func.isRequired,
};