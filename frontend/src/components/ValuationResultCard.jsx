import PropTypes from "prop-types";

const LABELS = {
    ticker: "Ticker",
    asset_ticker: "Ticker",
    asset_name: "Ativo",
    name: "Nome",
    current_price: "Preço atual",
    fair_price: "Preço justo",
    target_price: "Preço teto",
    ceiling_price: "Preço teto",
    projected_price: "Preço projetado",
    graham_price: "Preço Graham",
    barsi_price: "Preço Barsi",
    intrinsic_value: "Valor intrínseco",
    lpa: "LPA",
    eps: "LPA",
    vpa: "VPA",
    book_value_per_share: "VPA",
    dpa: "DPA",
    dividends: "Dividendos",
    annual_dividend: "Dividendo anual",
    target_yield: "Yield alvo",
    average_dividend_yield: "Dividend Yield médio",
    dividend_yield: "Dividend Yield",
    margin_of_safety: "Margem de segurança",
    margin_of_safety_pct: "Margem de segurança",
    source: "Fonte",
  };
  
  const HIDDEN_KEYS = new Set([
    "id",
    "asset",
    "asset_id",
    "created_at",
    "updated_at",
  ]);
  
  function formatLabel(key) {
    return LABELS[key] || key.replaceAll("_", " ").replaceAll(/\b\w/g, (char) => char.toUpperCase());
  }
  
  function isNumeric(value) {
    if (value === null || value === undefined || value === "") {
      return false;
    }
  
    return !Number.isNaN(Number(value));
  }
  
  function formatCurrency(value) {
    return Number(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }
  
  function formatNumber(value) {
    return Number(value).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    });
  }
  
  function formatPercent(value) {
    const numericValue = Number(value);
    const normalizedValue = Math.abs(numericValue) <= 1 ? numericValue * 100 : numericValue;
  
    return `${normalizedValue.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}%`;
  }
  
  function shouldFormatAsCurrency(key) {
    const normalizedKey = key.toLowerCase();
  
    return (
      normalizedKey.includes("price") ||
      normalizedKey.includes("preco") ||
      normalizedKey.includes("valor") ||
      normalizedKey.includes("value")
    );
  }
  
  function shouldFormatAsPercent(key) {
    const normalizedKey = key.toLowerCase();
  
    return (
      normalizedKey.includes("yield") ||
      normalizedKey.includes("pct") ||
      normalizedKey.includes("percent") ||
      normalizedKey.includes("margin")
    );
  }
  
  function formatValue(key, value) {
    if (value === null || value === undefined || value === "") {
      return "Não informado";
    }
  
    if (Array.isArray(value)) {
      return value.join(", ");
    }
  
    if (typeof value === "boolean") {
      return value ? "Sim" : "Não";
    }
  
    if (isNumeric(value)) {
      if (shouldFormatAsPercent(key)) {
        return formatPercent(value);
      }
  
      if (shouldFormatAsCurrency(key)) {
        return formatCurrency(value);
      }
  
      return formatNumber(value);
    }
  
    return String(value);
  }
  
  function getPrimaryEntry(result, primaryKeys) {
    for (const key of primaryKeys) {
      if (result?.[key] !== undefined && result?.[key] !== null && result?.[key] !== "") {
        return [key, result[key]];
      }
    }
  
    return Object.entries(result || {}).find(([key, value]) => {
      return !HIDDEN_KEYS.has(key) && value !== null && value !== undefined && value !== "";
    });
  }
  
  export default function ValuationResultCard({
    result,
    title,
    subtitle,
    primaryLabel = "Resultado principal",
    primaryKeys = [],
    accent = "blue",
  }) {
    if (!result) {
      return (
        <div className="valuation-result-empty">
          <div className="empty-result-icon">📊</div>
          <strong>Nenhum cálculo realizado ainda</strong>
          <span>Preencha os dados do ativo e clique em calcular para visualizar o resultado.</span>
        </div>
      );
    }
  
    const primaryEntry = getPrimaryEntry(result, primaryKeys);
    const primaryValue = primaryEntry ? formatValue(primaryEntry[0], primaryEntry[1]) : "Não informado";
  
    const entries = Object.entries(result).filter(([key]) => {
      return !HIDDEN_KEYS.has(key) && key !== primaryEntry?.[0];
    });
  
    return (
      <article className={`valuation-result-card ${accent}`}>
        <div className="valuation-result-header">
          <div>
            <span className="valuation-result-eyebrow">Resultado calculado</span>
            <h3>{title}</h3>
            {subtitle && <p>{subtitle}</p>}
          </div>
        </div>
  
        <div className="valuation-primary-result">
          <span>{primaryLabel}</span>
          <strong>{primaryValue}</strong>
        </div>
  
        {entries.length > 0 && (
          <div className="valuation-result-grid">
            {entries.map(([key, value]) => (
              <div className="valuation-result-item" key={key}>
                <span>{formatLabel(key)}</span>
                <strong>{formatValue(key, value)}</strong>
              </div>
            ))}
          </div>
        )}
      </article>
    );
  }

  ValuationResultCard.propTypes = {
    result: PropTypes.object,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    primaryLabel: PropTypes.string,
    primaryKeys: PropTypes.arrayOf(PropTypes.string),
    accent: PropTypes.string,
  };