import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { searchAssets } from "../services/assetsApi";

function cleanTicker(value) {
  if (!value) {
    return "";
  }

  return String(value)
    .trim()
    .split(" - ")[0]
    .split(" ")[0]
    .toUpperCase();
}

export default function AssetSearchInput({ value, onChange, disabled }) {
  const { accessToken } = useAuth();

  const [query, setQuery] = useState(value || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!value) {
      return;
    }

    setQuery(value);
  }, [value]);

  useEffect(() => {
    const tickerOrSearch = cleanTicker(query);

    if (!accessToken || tickerOrSearch.length < 2) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const data = await searchAssets(tickerOrSearch, accessToken);
        setResults(Array.isArray(data) ? data : []);
      } catch {
        setError("Não foi possível buscar ativos.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [query, accessToken]);

  function handleInputChange(event) {
    const typedValue = event.target.value;

    setQuery(typedValue);
    onChange(cleanTicker(typedValue));
  }

  function handleSelect(asset) {
    const ticker = cleanTicker(asset.ticker);

    setQuery(`${ticker} - ${asset.name}`);
    setResults([]);
    onChange(ticker);
  }

  return (
    <div className="field-group asset-search-wrapper">
      <label htmlFor="asset-search">Ativo</label>

      <input
        id="asset-search"
        type="text"
        value={query}
        disabled={disabled}
        placeholder="Digite PETR4, BBAS3, TAEE11..."
        onChange={handleInputChange}
      />

      {loading && <small>Buscando ativos...</small>}

      {error && <small className="form-error">{error}</small>}

      {results.length > 0 && (
        <div className="asset-search-results">
          {results.map((asset) => (
            <button
              key={asset.ticker}
              type="button"
              className="asset-search-option"
              onClick={() => handleSelect(asset)}
            >
              <strong>{asset.ticker}</strong>
              <span>{asset.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}