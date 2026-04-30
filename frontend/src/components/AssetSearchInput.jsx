import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { searchAssets } from "../services/assetsApi";

const POPULAR_ASSETS = ["PETR4.SA", "VALE3.SA", "ITUB4.SA", "BBAS3.SA", "WEGE3.SA"];

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

  const wrapperRef = useRef(null);

  const [query, setQuery] = useState(value || "");
  const [results, setResults] = useState([]);
  const [selectedTicker, setSelectedTicker] = useState(value || "");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState("");

  const normalizedQuery = useMemo(() => cleanTicker(query), [query]);
  const shouldShowResults = focused && (results.length > 0 || loading || error);

  useEffect(() => {
    setQuery(value || "");
    setSelectedTicker(value || "");
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setFocused(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!accessToken || normalizedQuery.length < 2 || selectedTicker === normalizedQuery) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const data = await searchAssets(normalizedQuery, accessToken);
        setResults(Array.isArray(data) ? data : []);
      } catch {
        setError("Não foi possível buscar ativos agora.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [accessToken, normalizedQuery, selectedTicker]);

  function handleInputChange(event) {
    const typedValue = event.target.value;
    const ticker = cleanTicker(typedValue);

    setQuery(typedValue);
    setSelectedTicker("");
    setFocused(true);
    onChange(ticker);
  }

  function handleSelect(asset) {
    const ticker = cleanTicker(asset.ticker);

    setQuery(`${ticker} - ${asset.name || "Ativo"}`);
    setSelectedTicker(ticker);
    setResults([]);
    setFocused(false);
    onChange(ticker);
  }

  function handleQuickSelect(ticker) {
    setQuery(ticker);
    setSelectedTicker(ticker);
    setResults([]);
    setFocused(false);
    onChange(ticker);
  }

  function handleClear() {
    setQuery("");
    setSelectedTicker("");
    setResults([]);
    setError("");
    onChange("");
  }

  return (
    <div className="asset-search-wrapper" ref={wrapperRef}>
      <div className="field-label-row">
        <label htmlFor="asset-search">Ativo</label>
        {selectedTicker && <span className="selected-asset-pill">{selectedTicker}</span>}
      </div>

      <div className="asset-search-input-row">
        <input
          id="asset-search"
          type="text"
          value={query}
          disabled={disabled}
          placeholder="Digite o ticker ou nome do ativo. Ex.: PETR4"
          autoComplete="off"
          onFocus={() => setFocused(true)}
          onChange={handleInputChange}
        />

        {query && (
          <button
            type="button"
            className="clear-input-btn"
            onClick={handleClear}
            disabled={disabled}
            aria-label="Limpar ativo selecionado"
          >
            ×
          </button>
        )}
      </div>

      <small className="field-hint">
        Busque ativos direto do Yahoo Finance. Para ações brasileiras, use o sufixo .SA quando necessário.
      </small>

      {!query && (
        <div className="quick-assets">
          {POPULAR_ASSETS.map((ticker) => (
            <button
              key={ticker}
              type="button"
              className="quick-asset-chip"
              disabled={disabled}
              onClick={() => handleQuickSelect(ticker)}
            >
              {ticker}
            </button>
          ))}
        </div>
      )}

      {shouldShowResults && (
        <div className="asset-search-results">
          {loading && <div className="asset-search-state">Buscando ativos...</div>}

          {!loading && error && <div className="asset-search-state error">{error}</div>}

          {!loading && !error && results.length === 0 && normalizedQuery.length >= 2 && (
            <div className="asset-search-state">
              Nenhum ativo encontrado para “{normalizedQuery}”.
            </div>
          )}

          {!loading &&
            !error &&
            results.map((asset) => (
              <button
                key={asset.ticker}
                type="button"
                className="asset-search-option"
                onClick={() => handleSelect(asset)}
              >
                <div>
                  <strong>{asset.ticker}</strong>
                  <span>{asset.name || "Nome não informado"}</span>
                </div>

                <small>Selecionar</small>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}