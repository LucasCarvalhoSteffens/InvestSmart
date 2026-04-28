import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { searchAssets } from "../services/assetsApi";

export default function AssetAutocomplete({
  value,
  onChange,
  onAssetSelected,
  label = "Ativo",
  placeholder = "Digite parte do ticker. Ex: PET, BBA, VALE",
}) {
  const { accessToken } = useAuth();

  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState("");

  const debounceRef = useRef(null);

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const normalizedQuery = query.trim();

    if (normalizedQuery.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const data = await searchAssets(normalizedQuery, accessToken);
        setSuggestions(Array.isArray(data) ? data : []);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
        setError("Não foi possível buscar ativos.");
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, accessToken]);

  function handleInputChange(event) {
    const nextValue = event.target.value.toUpperCase();

    setQuery(nextValue);
    setError("");

    if (onChange) {
      onChange(nextValue);
    }
  }

  function handleSelectAsset(asset) {
    setQuery(asset.ticker);
    setSuggestions([]);
    setShowSuggestions(false);
    setError("");

    if (onChange) {
      onChange(asset.ticker);
    }

    if (onAssetSelected) {
      onAssetSelected(asset);
    }
  }

  return (
    <div className="form-group asset-autocomplete">
      <label>{label}</label>

      <div className="autocomplete-wrapper">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          placeholder={placeholder}
          autoComplete="off"
        />

        {loading && <small>Buscando ativos...</small>}

        {showSuggestions && suggestions.length > 0 && (
          <div className="autocomplete-list">
            {suggestions.map((asset) => (
              <button
                type="button"
                key={asset.ticker}
                className="autocomplete-item"
                onClick={() => handleSelectAsset(asset)}
              >
                <strong>{asset.ticker}</strong>
                <span>{asset.name}</span>
                <small>{asset.source}</small>
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <p className="error-text">{error}</p>}
    </div>
  );
}