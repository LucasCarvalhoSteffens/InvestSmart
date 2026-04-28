function formatCurrency(value) {
    const numericValue = Number(value ?? 0);
  
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number.isFinite(numericValue) ? numericValue : 0);
  }
  
  function formatDateTime(value) {
    if (!value) {
      return "Data não disponível";
    }
  
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(value));
  }
  
  function getAlertLabel(eventType) {
    if (eventType === "below_or_equal_ceiling") {
      return "Dentro do preço teto";
    }
  
    if (eventType === "above_ceiling") {
      return "Acima do preço teto";
    }
  
    return "Alerta de preço";
  }
  
  function getAlertClassName(eventType) {
    if (eventType === "below_or_equal_ceiling") {
      return "status-hit";
    }
  
    if (eventType === "above_ceiling") {
      return "status-warning";
    }
  
    return "status-neutral";
  }
  
  function getSourceLabel(source) {
    const labels = {
      manual: "Manual",
      projected: "Projetivo",
      barsi: "Barsi",
      graham: "Graham",
    };
  
    return labels[source] ?? source ?? "Não informado";
  }
  
  export default function AlertEventCard({ alert, onMarkAsRead, markingAsRead }) {
    const statusClassName = getAlertClassName(alert.event_type);
  
    return (
      <article className={`card alert-event-card ${alert.is_read ? "read" : "unread"}`}>
        <div className="alert-event-header">
          <div>
            <span className={`status-pill ${statusClassName}`}>
              {getAlertLabel(alert.event_type)}
            </span>
  
            <h3 className="alert-event-title">
              {alert.asset_ticker} - {alert.asset_name}
            </h3>
  
            <p className="muted">
              Carteira: {alert.portfolio_name}
            </p>
          </div>
  
          <div className="alert-event-state">
            <span className={`status-pill ${alert.is_read ? "status-idle" : "status-buy"}`}>
              {alert.is_read ? "Lido" : "Novo"}
            </span>
  
            <small className="muted">
              {formatDateTime(alert.created_at)}
            </small>
          </div>
        </div>
  
        <div className="alert-event-grid">
          <div className="result-item">
            <span className="summary-label">Preço atual</span>
            <strong>{formatCurrency(alert.current_price)}</strong>
          </div>
  
          <div className="result-item">
            <span className="summary-label">Preço teto</span>
            <strong>{formatCurrency(alert.price_ceiling)}</strong>
          </div>
  
          <div className="result-item">
            <span className="summary-label">Fonte do preço teto</span>
            <strong>{getSourceLabel(alert.price_ceiling_source)}</strong>
          </div>
        </div>
  
        <p className="alert-event-message">
          {alert.message}
        </p>
  
        {!alert.is_read ? (
          <div className="button-row">
            <button
              type="button"
              className="secondary-btn small-btn"
              onClick={() => onMarkAsRead(alert.id)}
              disabled={markingAsRead}
            >
              {markingAsRead ? "Atualizando..." : "Marcar como lido"}
            </button>
          </div>
        ) : null}
      </article>
    );
  }