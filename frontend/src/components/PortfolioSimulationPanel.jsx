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
  
  function getSourceLabel(source) {
    switch (source) {
      case "manual":
        return "Manual";
      case "projected":
        return "Projetivo";
      case "barsi":
        return "Barsi";
      default:
        return "Sem origem";
    }
  }
  
  function getStatusMeta(item) {
    if (item.price_ceiling == null) {
      return {
        label: "Sem teto",
        className: "status-idle",
      };
    }
  
    if (item.is_opportunity) {
      return {
        label: "Oportunidade",
        className: "status-buy",
      };
    }
  
    return {
      label: "Acima do teto",
      className: "status-warning",
    };
  }
  
  function MetricValue({ value }) {
    const numericValue = Number(value ?? 0);
  
    let className = "metric-neutral";
  
    if (numericValue > 0) className = "metric-positive";
    if (numericValue < 0) className = "metric-negative";
  
    return <strong className={className}>{value}</strong>;
  }
  
  export default function PortfolioSimulationPanel({
    simulation,
    loading,
    error,
    onRefresh,
  }) {
    const summary = simulation?.summary;
    const items = simulation?.items ?? [];
  
    return (
      <section className="card stack">
        <div className="page-header compact">
          <div>
            <h3 className="section-title">Simulador consolidado da carteira</h3>
            <p className="muted">
              Preço teto por ativo, margem, retorno estimado e oportunidades de
              compra.
            </p>
          </div>
  
          <button
            type="button"
            className="secondary-btn small-btn"
            onClick={onRefresh}
            disabled={loading}
          >
            {loading ? "Atualizando..." : "Atualizar simulação"}
          </button>
        </div>
  
        {error ? <p className="error-text">{error}</p> : null}
  
        {loading && !simulation ? <p className="muted">Carregando simulação...</p> : null}
  
        {!loading && !simulation ? (
          <p className="muted">Selecione uma carteira para visualizar a simulação.</p>
        ) : null}
  
        {summary ? (
          <>
            <div className="summary-grid">
              <div className="summary-stat">
                <span className="summary-label">Itens cobertos</span>
                <strong>
                  {summary.covered_items} / {summary.total_items}
                </strong>
                <span className="muted">
                  {formatPercent(summary.coverage_by_count_pct)}
                </span>
              </div>
  
              <div className="summary-stat">
                <span className="summary-label">Cobertura por valor</span>
                <strong>{formatPercent(summary.coverage_by_value_pct)}</strong>
              </div>
  
              <div className="summary-stat">
                <span className="summary-label">Valor atual</span>
                <strong>{formatCurrency(summary.total_current_value)}</strong>
              </div>
  
              <div className="summary-stat">
                <span className="summary-label">Valor teto consolidado</span>
                <strong>{formatCurrency(summary.total_target_value)}</strong>
              </div>
  
              <div className="summary-stat">
                <span className="summary-label">Retorno estimado</span>
                <MetricValue
                  value={`${formatCurrency(summary.total_estimated_return_value)} (${formatPercent(summary.total_estimated_return_pct)})`}
                />
              </div>
  
              <div className="summary-stat">
                <span className="summary-label">Potencial de oportunidade</span>
                <MetricValue
                  value={formatCurrency(summary.total_opportunity_value)}
                />
              </div>
  
              <div className="summary-stat">
                <span className="summary-label">Ganho/perda atual</span>
                <MetricValue
                  value={`${formatCurrency(summary.total_unrealized_gain)} (${formatPercent(summary.total_unrealized_gain_pct)})`}
                />
              </div>
  
              <div className="summary-stat">
                <span className="summary-label">Oportunidades</span>
                <strong>{summary.opportunities_count}</strong>
              </div>
            </div>
  
            <div className="simulation-item-list">
              {items.length === 0 ? (
                <p className="muted">Nenhum item encontrado para simular.</p>
              ) : (
                items.map((item) => {
                  const status = getStatusMeta(item);
  
                  return (
                    <article key={item.id} className="portfolio-item-card simulation-card">
                      <div className="portfolio-item-head">
                        <div>
                          <h4>
                            {item.asset_ticker} - {item.asset_name}
                          </h4>
                          <div className="simulation-meta-row">
                            <span className={`status-pill ${status.className}`}>
                              {status.label}
                            </span>
                            <span className="source-chip">
                              Origem do teto: {getSourceLabel(item.price_ceiling_source)}
                            </span>
                          </div>
                        </div>
  
                        <div className="button-row wrap">
                          <span className="muted">
                            Quantidade: <strong>{item.quantity}</strong>
                          </span>
                        </div>
                      </div>
  
                      <div className="portfolio-item-grid">
                        <div className="result-item">
                          <span className="summary-label">Preço médio</span>
                          <strong>{formatCurrency(item.average_price)}</strong>
                        </div>
  
                        <div className="result-item">
                          <span className="summary-label">Preço atual</span>
                          <strong>{formatCurrency(item.current_price)}</strong>
                        </div>
  
                        <div className="result-item">
                          <span className="summary-label">Preço teto</span>
                          <strong>
                            {item.price_ceiling != null
                              ? formatCurrency(item.price_ceiling)
                              : "Não disponível"}
                          </strong>
                        </div>
  
                        <div className="result-item">
                          <span className="summary-label">Margem até o teto</span>
                          <MetricValue
                            value={
                              item.margin_to_ceiling != null
                                ? `${formatCurrency(item.margin_to_ceiling)} (${formatPercent(item.margin_to_ceiling_pct)})`
                                : "Não aplicável"
                            }
                          />
                        </div>
  
                        <div className="result-item">
                          <span className="summary-label">Retorno estimado</span>
                          <MetricValue
                            value={
                              item.estimated_return_value != null
                                ? `${formatCurrency(item.estimated_return_value)} (${formatPercent(item.estimated_return_pct)})`
                                : "Não aplicável"
                            }
                          />
                        </div>
  
                        <div className="result-item">
                          <span className="summary-label">Potencial de compra</span>
                          <MetricValue
                            value={formatCurrency(item.opportunity_value)}
                          />
                        </div>
  
                        <div className="result-item">
                          <span className="summary-label">Valor investido</span>
                          <strong>{formatCurrency(item.invested_amount)}</strong>
                        </div>
  
                        <div className="result-item">
                          <span className="summary-label">Valor atual</span>
                          <strong>{formatCurrency(item.current_value)}</strong>
                        </div>
  
                        <div className="result-item">
                          <span className="summary-label">Preço justo Graham</span>
                          <strong>
                            {item.graham_fair_price != null
                              ? formatCurrency(item.graham_fair_price)
                              : "Não disponível"}
                          </strong>
                        </div>
                      </div>
  
                      {item.notes ? <p className="muted">{item.notes}</p> : null}
                    </article>
                  );
                })
              )}
            </div>
          </>
        ) : null}
      </section>
    );
  }