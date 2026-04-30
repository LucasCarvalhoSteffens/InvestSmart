import AlertForm from "./AlertForm";

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

function getGainClass(value) {
  return Number(value ?? 0) >= 0 ? "metric-positive" : "metric-negative";
}

function getOpportunityLabel(item) {
  if (!item.target_price) {
    return "Sem preço teto";
  }

  return item.is_below_target ? "Dentro do preço teto" : "Acima do preço teto";
}

function getOpportunityClass(item) {
  if (!item.target_price) {
    return "status-neutral";
  }

  return item.is_below_target ? "status-buy" : "status-warning";
}

export default function PortfolioAssetsSection({
  selectedPortfolio,
  getAlertForm,
  onEditItem,
  onDeleteItem,
  onAlertChange,
  onAlertSubmit,
  onAlertCancel,
  onDeleteAlert,
  alertSubmittingId,
}) {
  const items = selectedPortfolio?.items ?? [];

  return (
    <div className="card portfolio-assets-card compact-assets-card">
      <div className="portfolio-assets-header compact">
        <div>
          <span className="portfolio-assets-kicker">Ativos</span>
          <h3 className="section-title">Ativos da carteira</h3>
          <p className="muted">
            Gerencie as posições reais da carteira selecionada.
          </p>
        </div>

        {selectedPortfolio && (
          <div className="portfolio-assets-counter">
            <strong>{items.length}</strong>
            <span>ativo(s)</span>
          </div>
        )}
      </div>

      {!selectedPortfolio ? (
        <div className="empty-state compact">
          <strong>Nenhuma carteira selecionada</strong>
          <span>Escolha uma carteira na lateral para visualizar os ativos.</span>
        </div>
      ) : items.length === 0 ? (
        <div className="empty-state compact">
          <strong>Nenhum ativo cadastrado</strong>
          <span>Adicione o primeiro ativo para começar o acompanhamento.</span>
        </div>
      ) : (
        <div className="portfolio-assets-list-compact">
          {items.map((item) => {
            const alertForm = getAlertForm(item);

            return (
              <article className="portfolio-asset-card-compact" key={item.id}>
                <div className="portfolio-asset-main-row">
                  <div className="portfolio-asset-identity">
                    <div className="portfolio-asset-icon">
                      {item.asset_ticker?.slice(0, 1) || "A"}
                    </div>

                    <div>
                      <h4>{item.asset_ticker}</h4>
                      <p>{item.asset_name}</p>
                    </div>
                  </div>

                  <div className="portfolio-asset-actions">
                    <span
                      className={`status-pill ${getOpportunityClass(item)}`}
                    >
                      {getOpportunityLabel(item)}
                    </span>

                    <button
                      type="button"
                      className="secondary-btn small-btn"
                      onClick={() => onEditItem(item)}
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      className="danger-btn small-btn"
                      onClick={() => onDeleteItem(item.id)}
                    >
                      Excluir
                    </button>
                  </div>
                </div>

                {item.notes && (
                  <p className="portfolio-asset-note">{item.notes}</p>
                )}

                <div className="portfolio-asset-metrics">
                  <div className="portfolio-asset-metric">
                    <span>Qtd.</span>
                    <strong>{item.quantity}</strong>
                  </div>

                  <div className="portfolio-asset-metric">
                    <span>Preço médio</span>
                    <strong>{formatCurrency(item.average_price)}</strong>
                  </div>

                  <div className="portfolio-asset-metric">
                    <span>Preço atual</span>
                    <strong>{formatCurrency(item.current_price)}</strong>
                  </div>

                  <div className="portfolio-asset-metric">
                    <span>Preço teto</span>
                    <strong>
                      {item.target_price
                        ? formatCurrency(item.target_price)
                        : "Não definido"}
                    </strong>
                  </div>

                  <div className="portfolio-asset-metric">
                    <span>Investido</span>
                    <strong>{formatCurrency(item.invested_amount)}</strong>
                  </div>

                  <div className="portfolio-asset-metric">
                    <span>Valor atual</span>
                    <strong>{formatCurrency(item.current_value)}</strong>
                  </div>

                  <div className="portfolio-asset-metric">
                    <span>Ganho/Perda</span>
                    <strong className={getGainClass(item.unrealized_gain)}>
                      {formatCurrency(item.unrealized_gain)}
                    </strong>
                  </div>

                  <div className="portfolio-asset-metric">
                    <span>Rentabilidade</span>
                    <strong className={getGainClass(item.unrealized_gain_pct)}>
                      {formatPercent(item.unrealized_gain_pct)}
                    </strong>
                  </div>
                </div>

                <details className="portfolio-asset-alerts">
                  <summary>
                    <span>Alertas do ativo</span>
                    <strong>{item.alerts?.length ?? 0}</strong>
                  </summary>

                  <div className="portfolio-asset-alerts-content">
                    {item.alerts?.length > 0 ? (
                      <div className="alert-list compact">
                        {item.alerts.map((alert) => (
                          <div className="alert-chip compact" key={alert.id}>
                            <div className="chip-label">
                              <strong>
                                {alert.alert_type === "below_or_equal"
                                  ? "Preço menor ou igual"
                                  : "Preço maior ou igual"}
                              </strong>

                              <span>
                                Disparo em {formatCurrency(alert.threshold_price)}
                              </span>

                              <small>
                                Atual: {formatCurrency(alert.current_price)}
                              </small>
                            </div>

                            <div className="chip-actions">
                              <span
                                className={`status-pill ${
                                  alert.triggered_now
                                    ? "status-hit"
                                    : "status-idle"
                                }`}
                              >
                                {alert.triggered_now
                                  ? "Disparando"
                                  : "Aguardando"}
                              </span>

                              <button
                                type="button"
                                className="danger-btn small-btn"
                                onClick={() => onDeleteAlert(alert.id)}
                              >
                                Excluir
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="muted compact-text">
                        Nenhum alerta configurado para este ativo.
                      </p>
                    )}

                    <div className="portfolio-new-alert-box">
                      <h5>Novo alerta</h5>

                      <AlertForm
                        form={alertForm}
                        onChange={(event) => onAlertChange(item, event)}
                        onSubmit={(event) => onAlertSubmit(item, event)}
                        onCancel={() => onAlertCancel(item)}
                        submitting={alertSubmittingId === item.id}
                      />
                    </div>
                  </div>
                </details>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}