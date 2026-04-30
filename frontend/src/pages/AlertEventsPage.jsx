import { useEffect, useMemo, useState } from "react";
import AlertEventCard from "../components/AlertEventCard";
import { useAuth } from "../contexts/AuthContext";
import {
  checkPortfolioAlertEvents,
  listPortfolioAlertEvents,
  listPortfolios,
  markPortfolioAlertEventAsRead,
} from "../services/portfoliosApi";

function extractErrorMessage(error, fallbackMessage) {
  const responseData = error?.response?.data;

  if (!responseData) {
    return fallbackMessage;
  }

  if (typeof responseData === "string") {
    return responseData;
  }

  if (typeof responseData.detail === "string") {
    return responseData.detail;
  }

  const firstKey = Object.keys(responseData)[0];
  const firstValue = responseData[firstKey];

  if (Array.isArray(firstValue) && firstValue.length > 0) {
    return firstValue[0];
  }

  if (typeof firstValue === "string") {
    return firstValue;
  }

  return fallbackMessage;
}

function normalizeList(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.results)) {
    return data.results;
  }

  return [];
}

function getStats(alerts) {
  return alerts.reduce(
    (acc, alert) => {
      acc.total += 1;

      if (!alert.is_read) {
        acc.unread += 1;
      }

      if (alert.event_type === "below_or_equal_ceiling") {
        acc.insideCeiling += 1;
      }

      if (alert.event_type === "above_ceiling") {
        acc.aboveCeiling += 1;
      }

      return acc;
    },
    {
      total: 0,
      unread: 0,
      insideCeiling: 0,
      aboveCeiling: 0,
    },
  );
}

export default function AlertEventsPage() {
  const { accessToken } = useAuth();

  const [alerts, setAlerts] = useState([]);
  const [portfolios, setPortfolios] = useState([]);

  const [selectedPortfolioId, setSelectedPortfolioId] = useState("");
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [loadingPortfolios, setLoadingPortfolios] = useState(false);
  const [loadingAlerts, setLoadingAlerts] = useState(false);
  const [checking, setChecking] = useState(false);
  const [markingAsReadId, setMarkingAsReadId] = useState(null);

  const [pageError, setPageError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [checkSummary, setCheckSummary] = useState(null);

  const filteredAlerts = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return alerts;
    }

    return alerts.filter((alert) => {
      const content = [
        alert.asset_ticker,
        alert.asset_name,
        alert.portfolio_name,
        alert.message,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return content.includes(search);
    });
  }, [alerts, searchTerm]);

  const stats = useMemo(() => getStats(alerts), [alerts]);

  async function fetchPortfolios(currentAccessToken, shouldUpdate = true) {
    if (!currentAccessToken) {
      return;
    }

    try {
      setLoadingPortfolios(true);
      setPageError("");

      const data = await listPortfolios(currentAccessToken);

      if (shouldUpdate) {
        setPortfolios(normalizeList(data));
      }
    } catch (error) {
      if (shouldUpdate) {
        setPageError(
          extractErrorMessage(error, "Não foi possível carregar as carteiras."),
        );
      }
    } finally {
      if (shouldUpdate) {
        setLoadingPortfolios(false);
      }
    }
  }

  async function fetchAlerts(currentAccessToken, shouldUpdate = true) {
    if (!currentAccessToken) {
      return;
    }

    try {
      setLoadingAlerts(true);
      setPageError("");

      const params = {};

      if (selectedPortfolioId) {
        params.portfolio_id = selectedPortfolioId;
      }

      if (onlyUnread) {
        params.is_read = "false";
      }

      const data = await listPortfolioAlertEvents(params, currentAccessToken);

      if (shouldUpdate) {
        setAlerts(normalizeList(data));
      }
    } catch (error) {
      if (shouldUpdate) {
        setPageError(
          extractErrorMessage(error, "Não foi possível carregar os alertas."),
        );
      }
    } finally {
      if (shouldUpdate) {
        setLoadingAlerts(false);
      }
    }
  }

  function renderAlertsContent() {
    if (loadingAlerts) {
      return <div className="loading-card">Carregando alertas...</div>;
    }

    if (filteredAlerts.length === 0) {
      return (
        <div className="empty-state">
          <strong>Nenhum alerta encontrado</strong>
          <span>
            Quando a rotina identificar ativos acima ou abaixo do preço teto,
            os alertas aparecerão aqui.
          </span>
        </div>
      );
    }

    return (
      <div className="alerts-v2-grid">
        {filteredAlerts.map((alert) => (
          <AlertEventCard
            key={alert.id}
            alert={alert}
            onMarkAsRead={handleMarkAsRead}
            markingAsRead={markingAsReadId === alert.id}
          />
        ))}
      </div>
    );
  }

  useEffect(() => {
    let shouldUpdate = true;

    fetchPortfolios(accessToken, shouldUpdate);

    return () => {
      shouldUpdate = false;
    };
  }, [accessToken]);

  useEffect(() => {
    let shouldUpdate = true;

    fetchAlerts(accessToken, shouldUpdate);

    return () => {
      shouldUpdate = false;
    };
  }, [accessToken, selectedPortfolioId, onlyUnread]);

  async function handleRefreshAlerts() {
    await fetchAlerts(accessToken, true);
  }

  async function handleCheckAlerts() {
    if (!accessToken) {
      return;
    }

    try {
      setChecking(true);
      setPageError("");
      setSuccessMessage("");
      setCheckSummary(null);

      const payload = {
        force_refresh: true,
        cooldown_hours: 24,
      };

      if (selectedPortfolioId) {
        payload.portfolio_id = Number(selectedPortfolioId);
      }

      const summary = await checkPortfolioAlertEvents(payload, accessToken);

      setCheckSummary(summary);
      setSuccessMessage("Verificação executada com sucesso.");

      await fetchAlerts(accessToken, true);
    } catch (error) {
      setPageError(
        extractErrorMessage(
          error,
          "Não foi possível executar a verificação dos alertas.",
        ),
      );
    } finally {
      setChecking(false);
    }
  }

  async function handleMarkAsRead(alertEventId) {
    if (!accessToken) {
      return;
    }

    try {
      setMarkingAsReadId(alertEventId);
      setPageError("");
      setSuccessMessage("");

      await markPortfolioAlertEventAsRead(alertEventId, accessToken);

      setAlerts((previousAlerts) =>
        previousAlerts.map((alert) =>
          alert.id === alertEventId ? { ...alert, is_read: true } : alert,
        ),
      );

      setSuccessMessage("Alerta marcado como lido.");
    } catch (error) {
      setPageError(
        extractErrorMessage(error, "Não foi possível marcar o alerta como lido."),
      );
    } finally {
      setMarkingAsReadId(null);
    }
  }

  return (
    <div className="alerts-v2-page">
      <section className="alerts-v2-hero">
        <div>
          <span className="alerts-v2-kicker">Monitoramento automático</span>

          <h2>Alertas de preço teto</h2>

          <p>
            Acompanhe oportunidades e avisos gerados quando o preço atual dos
            ativos cruza os limites definidos nas suas carteiras.
          </p>
        </div>

        <div className="alerts-v2-actions">
          <button
            type="button"
            className="secondary-btn"
            onClick={handleRefreshAlerts}
            disabled={loadingAlerts || checking}
          >
            Atualizar lista
          </button>

          <button
            type="button"
            className="primary-btn"
            onClick={handleCheckAlerts}
            disabled={checking}
          >
            {checking ? "Verificando..." : "Verificar agora"}
          </button>
        </div>
      </section>

      {pageError && <div className="error-message">{pageError}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <section className="alerts-v2-stats-grid">
        <div className="alerts-v2-stat total">
          <span>Total</span>
          <strong>{stats.total}</strong>
        </div>

        <div className="alerts-v2-stat unread">
          <span>Não lidos</span>
          <strong>{stats.unread}</strong>
        </div>

        <div className="alerts-v2-stat success">
          <span>Dentro do teto</span>
          <strong>{stats.insideCeiling}</strong>
        </div>

        <div className="alerts-v2-stat warning">
          <span>Acima do teto</span>
          <strong>{stats.aboveCeiling}</strong>
        </div>
      </section>

      {checkSummary && (
        <section className="alerts-v2-check-summary">
          <div>
            <span>Última verificação</span>
            <strong>Rotina executada</strong>
          </div>

          <div className="alerts-v2-check-grid">
            <div>
              <span>Verificados</span>
              <strong>{checkSummary.checked_items ?? 0}</strong>
            </div>

            <div>
              <span>Gerados</span>
              <strong>{checkSummary.created_events ?? 0}</strong>
            </div>

            <div>
              <span>Ignorados</span>
              <strong>{checkSummary.skipped_items ?? 0}</strong>
            </div>

            <div>
              <span>Falhas</span>
              <strong>{checkSummary.failed_updates ?? 0}</strong>
            </div>
          </div>
        </section>
      )}

      <section className="alerts-v2-filter-card">
        <div className="alerts-v2-filter-header">
          <div>
            <span>Filtros</span>
            <strong>Refine a listagem</strong>
          </div>

          <small>{filteredAlerts.length} alerta(s) encontrado(s)</small>
        </div>

        <div className="alerts-v2-filter-grid">
          <label>
            <span>Carteira</span>
            <select
              value={selectedPortfolioId}
              onChange={(event) => setSelectedPortfolioId(event.target.value)}
              disabled={loadingPortfolios}
            >
              <option value="">Todas as carteiras</option>

              {portfolios.map((portfolio) => (
                <option key={portfolio.id} value={portfolio.id}>
                  {portfolio.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Buscar</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="PETR4, carteira, mensagem..."
            />
          </label>

          <label className="alerts-v2-checkbox">
            <input
              type="checkbox"
              checked={onlyUnread}
              onChange={(event) => setOnlyUnread(event.target.checked)}
            />

            <span>Somente não lidos</span>
          </label>
        </div>
      </section>

      <section className="alerts-v2-list-card">
        <div className="alerts-v2-list-header">
          <div>
            <span>Eventos</span>
            <h3>Histórico de alertas</h3>
          </div>
        </div>

        {renderAlertsContent()}
      </section>
    </div>
  );
}