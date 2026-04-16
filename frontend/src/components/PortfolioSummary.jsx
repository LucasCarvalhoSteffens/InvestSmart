function formatCurrency(value) {
    const numericValue = Number(value ?? 0);
  
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number.isFinite(numericValue) ? numericValue : 0);
  }
  
  function formatPercent(value) {
    const numericValue = Number(value ?? 0);
  
    return `${new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number.isFinite(numericValue) ? numericValue : 0)}%`;
  }
  
  export default function PortfolioSummary({ portfolio }) {
    if (!portfolio) {
      return (
        <div className="card">
          <h3 className="section-title">Resumo da carteira</h3>
          <p className="muted">
            Selecione ou crie uma carteira para visualizar os indicadores.
          </p>
        </div>
      );
    }
  
    return (
      <div className="card">
        <div className="page-header compact">
          <div>
            <h2>{portfolio.name}</h2>
            <p className="muted">
              {portfolio.description || "Sem descrição cadastrada."}
            </p>
          </div>
        </div>
  
        <div className="summary-grid">
          <div className="summary-stat">
            <span className="summary-label">Itens</span>
            <strong>{portfolio.total_items}</strong>
          </div>
  
          <div className="summary-stat">
            <span className="summary-label">Valor investido</span>
            <strong>{formatCurrency(portfolio.total_invested)}</strong>
          </div>
  
          <div className="summary-stat">
            <span className="summary-label">Valor atual</span>
            <strong>{formatCurrency(portfolio.total_current_value)}</strong>
          </div>
  
          <div className="summary-stat">
            <span className="summary-label">Ganho/Perda</span>
            <strong>{formatCurrency(portfolio.total_unrealized_gain)}</strong>
          </div>
  
          <div className="summary-stat">
            <span className="summary-label">Rentabilidade</span>
            <strong>{formatPercent(portfolio.total_unrealized_gain_pct)}</strong>
          </div>
        </div>
      </div>
    );
  }