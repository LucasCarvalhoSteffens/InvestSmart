import PropTypes from "prop-types";

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

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Data não disponível";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function getAlertLabel(eventType) {
  if (eventType === "below_or_equal_ceiling") {
    return "Dentro do teto";
  }

  if (eventType === "above_ceiling") {
    return "Acima do teto";
  }

  return "Alerta";
}

function getAlertClassName(eventType) {
  if (eventType === "below_or_equal_ceiling") {
    return "success";
  }

  if (eventType === "above_ceiling") {
    return "warning";
  }

  return "neutral";
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

function getInitials(ticker) {
  if (!ticker) {
    return "AT";
  }

  return String(ticker).slice(0, 2).toUpperCase();
}

AlertEventCard.propTypes = {
  alert: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    event_type: PropTypes.string,
    asset_ticker: PropTypes.string,
    asset_name: PropTypes.string,
    portfolio_name: PropTypes.string,
    is_read: PropTypes.bool,
    created_at: PropTypes.string,
    current_price: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    price_ceiling: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    price_ceiling_source: PropTypes.string,
    message: PropTypes.string,
  }).isRequired,
  onMarkAsRead: PropTypes.func,
  markingAsRead: PropTypes.bool
};

export default function AlertEventCard({ alert, onMarkAsRead, markingAsRead }) {
  const alertClassName = getAlertClassName(alert.event_type);

  return (
    <article className={`alert-v2-card ${alert.is_read ? "read" : "unread"}`}>
      <div className="alert-v2-card-header">
        <div className="alert-v2-asset">
          <span className={`alert-v2-avatar ${alertClassName}`}>
            {getInitials(alert.asset_ticker)}
          </span>

          <div>
            <h4>{alert.asset_ticker || "Ativo"}</h4>
            <p>{alert.asset_name || "Nome não informado"}</p>
          </div>
        </div>

        {!alert.is_read && <span className="alert-v2-new">Novo</span>}
      </div>

      <div className="alert-v2-price-grid">
        <div>
          <span>Preço atual</span>
          <strong>{formatCurrency(alert.current_price)}</strong>
        </div>

        <div>
          <span>Preço teto</span>
          <strong>{formatCurrency(alert.price_ceiling)}</strong>
        </div>
      </div>

      <div className="alert-v2-status-row">
        <span className={`alert-v2-status ${alertClassName}`}>
          {getAlertLabel(alert.event_type)}
        </span>

        <span className={`alert-v2-status ${alert.is_read ? "neutral" : "hit"}`}>
          {alert.is_read ? "Lido" : "Não lido"}
        </span>
      </div>

      <div className="alert-v2-info">
        <div>
          <span>Carteira</span>
          <strong>{alert.portfolio_name || "Não informada"}</strong>
        </div>

        <div>
          <span>Fonte</span>
          <strong>{getSourceLabel(alert.price_ceiling_source)}</strong>
        </div>

        <div>
          <span>Data</span>
          <strong>{formatDateTime(alert.created_at)}</strong>
        </div>
      </div>

      {alert.message && <p className="alert-v2-message">{alert.message}</p>}

      {!alert.is_read && (
        <div className="alert-v2-footer">
          <button
            type="button"
            className="secondary-btn small-btn"
            onClick={() => onMarkAsRead(alert.id)}
            disabled={markingAsRead}
          >
            {markingAsRead ? "Atualizando..." : "Marcar como lido"}
          </button>
        </div>
      )}
    </article>
  );
}
