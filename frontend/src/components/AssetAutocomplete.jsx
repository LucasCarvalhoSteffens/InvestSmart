import PropTypes from "prop-types";

import { useEffect, useMemo, useRef, useState } from "react";
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

export default function AssetAutocomplete({
  value,
  onChange,
  onAssetSelected,
  label = "Ativo",
  placeholder = "Digite o ticker do ativo",
  disabled = false,
}) {
  const { accessToken } = useAuth();
  const wrapperRef = useRef(null);

  const [query, setQuery] = useState(value || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const normalizedQuery = useMemo(() => cleanTicker(query), [query]);

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
        setHighlightedIndex(-1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!accessToken || normalizedQuery.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const data = await searchAssets(normalizedQuery, accessToken);
        const items = Array.isArray(data) ? data : [];

        setResults(items);
        setOpen(true);
        setHighlightedIndex(items.length > 0 ? 0 : -1);
      } catch {
        setError("Não foi possível buscar ativos no momento.");
        setResults([]);
        setOpen(true);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [normalizedQuery, accessToken]);

  function handleInputChange(event) {
    const newValue = event.target.value;

    setQuery(newValue);
    onChange(cleanTicker(newValue));
    onAssetSelected?.(null);
    setOpen(true);
  }

  function handleSelect(asset) {
    const ticker = cleanTicker(asset.ticker);
    const displayValue = `${ticker} - ${asset.name || "Ativo"}`;

    setQuery(displayValue);
    setOpen(false);
    setHighlightedIndex(-1);

    onChange(ticker);
    onAssetSelected?.(asset);
  }

  function handleKeyDown(event) {
    if (!open || results.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    }

    if (event.key === "Enter" && highlightedIndex >= 0) {
      event.preventDefault();
      handleSelect(results[highlightedIndex]);
    }

    if (event.key === "Escape") {
      setOpen(false);
      setHighlightedIndex(-1);
    }
  }

  function handleClear() {
    setQuery("");
    setResults([]);
    setError("");
    setOpen(false);
    setHighlightedIndex(-1);
    onChange("");
    onAssetSelected?.(null);
  }

  return (
    <div className="asset-autocomplete" ref={wrapperRef}>
      <label htmlFor="asset-autocomplete-input" className="autocomplete-label">
        {label}
      </label>

      <div className="autocomplete-wrapper">
        <input
          id="asset-autocomplete-input"
          type="text"
          value={query}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          onChange={handleInputChange}
          onFocus={() => {
            if (results.length > 0 || error) {
              setOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
        />

        {query && (
          <button
            type="button"
            className="autocomplete-clear-btn"
            onClick={handleClear}
            aria-label="Limpar busca"
          >
            ×
          </button>
        )}
      </div>

      <small className="autocomplete-hint">
        Digite o ticker ou parte do nome da empresa. Ex.: PETR4, BBAS3, VALE3
      </small>

      {open && (
        <div className="autocomplete-results">
          {loading && <div className="autocomplete-state">Buscando ativos...</div>}

          {!loading && error && (
            <div className="autocomplete-state autocomplete-state-error">{error}</div>
          )}

          {!loading && !error && results.length === 0 && normalizedQuery.length >= 2 && (
            <div className="autocomplete-state">
              Nenhum ativo encontrado para "{normalizedQuery}".
            </div>
          )}

          {!loading &&
            !error &&
            results.map((asset, index) => {
              const isActive = index === highlightedIndex;

              return (
                <button
                  key={`${asset.ticker}-${index}`}
                  type="button"
                  className={`autocomplete-option ${isActive ? "active" : ""}`}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => handleSelect(asset)}
                >
                  <div className="autocomplete-option-main">
                    <div className="autocomplete-option-top">
                      <strong>{asset.ticker}</strong>
                      {asset.source && (
                        <span className="autocomplete-source-badge">{asset.source}</span>
                      )}
                    </div>

                    <span className="autocomplete-option-name">
                      {asset.name || "Nome não informado"}
                    </span>
                  </div>

                  <span className="autocomplete-option-action">Selecionar</span>
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
}

AssetAutocomplete.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onAssetSelected: PropTypes.func,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
};