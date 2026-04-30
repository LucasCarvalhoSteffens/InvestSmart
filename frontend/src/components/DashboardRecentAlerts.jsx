import PropTypes from "prop-types";

function formatCurrency(value) {
  const numericValue = Number(value ?? 0);

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number.isFinite(numericValue) ? numericValue : 0);
}

function formatDate(value) {
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

function getAlertStatus(alert) {
  if (alert.event_type === "below_or_equal_ceiling") {
    return {
      label: "Dentro do teto",
      className: "success",
    };
  }

  if (alert.event_type === "above_ceiling") {
    return {
      label: "Acima do teto",
      className: "warning",
    };
  }

  return {
    label: "Alerta",
    className: "neutral",
  };
}

export default function DashboardRecentAlerts({ alerts = [] }) {
  const recentAlerts = alerts.slice(0, 6);

  return (
    <section className="dashboard-alerts-compact-card">
      <div className="dashboard-alerts-compact-header">
        <div>
          <span>Monitoramento</span>
          <h3>Alertas recentes</h3>
          <p>Últimos eventos gerados pelo acompanhamento das carteiras.</p>
        </div>

        <strong>{recentAlerts.length}</strong>
      </div>

      {recentAlerts.length === 0 ? (
        <div className="empty-state compact">
          <strong>Nenhum alerta recente</strong>
          <span>Os alertas gerados aparecerão aqui.</span>
        </div>
      ) : (
        <div className="dashboard-alerts-compact-grid">
          {recentAlerts.map((alert) => {
            const status = getAlertStatus(alert);

            return (
              <article className="dashboard-alert-mini-card" key={alert.id}>
                <div className="dashboard-alert-mini-top">
                  <div>
                    <strong>{alert.asset_ticker || "Ativo"}</strong>
                    <span>{alert.portfolio_name || "Carteira"}</span>
                  </div>

                  <small className={`dashboard-alert-status ${status.className}`}>
                    {status.label}
                  </small>
                </div>

                <p>{alert.message || "Alerta gerado para este ativo."}</p>

                <div className="dashboard-alert-mini-values">
                  <div>
                    <span>Atual</span>
                    <strong>{formatCurrency(alert.current_price)}</strong>
                  </div>

                  <div>
                    <span>Teto</span>
                    <strong>{formatCurrency(alert.price_ceiling)}</strong>
                  </div>
                </div>

                <div className="dashboard-alert-mini-footer">
                  <span>{formatDate(alert.created_at)}</span>

                  {!alert.is_read && <strong>Novo</strong>}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

DashboardRecentAlerts.propTypes = {
  alerts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      event_type: PropTypes.string,
      asset_ticker: PropTypes.string,
      portfolio_name: PropTypes.string,
      message: PropTypes.string,
      current_price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      price_ceiling: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      created_at: PropTypes.string,
      is_read: PropTypes.bool,
    })
  ),
};