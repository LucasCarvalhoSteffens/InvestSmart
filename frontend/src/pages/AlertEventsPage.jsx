import { useCallback, useEffect, useMemo, useState } from "react";

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

export default function AlertEventsPage() {
  const { accessToken } = useAuth();

  const [alerts, setAlerts] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState("");
  const [onlyUnread, setOnlyUnread] = useState(false);

  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [markingAsReadId, setMarkingAsReadId] = useState(null);

  const [pageError, setPageError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [checkSummary, setCheckSummary] = useState(null);

  const unreadCount = useMemo(
    () => alerts.filter((alert) => !alert.is_read).length,
    [alerts],
  );

  const filters = useMemo(() => {
    const params = {};

    if (selectedPortfolioId) {
      params.portfolio_id = selectedPortfolioId;
    }

    if (onlyUnread) {
      params.is_read = "false";
    }

    return params;
  }, [selectedPortfolioId, onlyUnread]);

  const loadPortfolios = useCallback(async () => {
    if (!accessToken) {
      return;
    }

    const data = await listPortfolios(accessToken);
    setPortfolios(normalizeList(data));
  }, [accessToken]);

  const loadAlerts = useCallback(async () => {
    if (!accessToken) {
      return;
    }

    try {
      setLoading(true);
      setPageError("");

      const data = await listPortfolioAlertEvents(filters, accessToken);
      setAlerts(normalizeList(data));
    } catch (error) {
      setPageError(
        extractErrorMessage(
          error,
          "Não foi possível carregar os alertas automáticos.",
        ),
      );
    } finally {
      setLoading(false);
    }
  }, [accessToken, filters]);

  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        setPageError("");

        await Promise.all([
          loadPortfolios(),
          loadAlerts(),
        ]);
      } catch (error) {
        setPageError(
          extractErrorMessage(
            error,
            "Não foi possível carregar os dados da tela de alertas.",
          ),
        );
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, [loadPortfolios, loadAlerts]);

  async function handleCheckAlerts() {
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
      setSuccessMessage("Verificação de alertas executada com sucesso.");

      await loadAlerts();
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
    try {
      setMarkingAsReadId(alertEventId);
      setPageError("");
      setSuccessMessage("");

      await markPortfolioAlertEventAsRead(alertEventId, accessToken);

      setAlerts((previousAlerts) =>
        previousAlerts.map((alert) =>
          alert.id === alertEventId
            ? { ...alert, is_read: true }
            : alert,
        ),
      );

      setSuccessMessage("Alerta marcado como lido.");
    } catch (error) {
      setPageError(
        extractErrorMessage(
          error,
          "Não foi possível marcar o alerta como lido.",
        ),
      );
    } finally {
      setMarkingAsReadId(null);
    }
  }

  return (
    <section className="stack">
      <div className="page-header compact">
        <div>
          <h2>Alertas automáticos</h2>
          <p className="muted">
            Acompanhe os alertas gerados pela rotina de verificação de preço atual
            contra preço teto.
          </p>
        </div>

        <div className="button-row wrap">
          <button
            type="button"
            className="secondary-btn"
            onClick={loadAlerts}
            disabled={loading || checking}
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
      </div>

      {pageError ? (
        <p className="error-text">{pageError}</p>
      ) : null}

      {successMessage ? (
        <p className="success-text">{successMessage}</p>
      ) : null}

      {checkSummary ? (
        <div className="card soft-card">
          <h3 className="section-title">Resumo da última verificação</h3>

          <div className="summary-grid">
            <div className="summary-stat">
              <span className="summary-label">Itens verificados</span>
              <strong>{checkSummary.checked_items}</strong>
            </div>

            <div className="summary-stat">
              <span className="summary-label">Alertas gerados</span>
              <strong>{checkSummary.created_events}</strong>
            </div>

            <div className="summary-stat">
              <span className="summary-label">Itens ignorados</span>
              <strong>{checkSummary.skipped_items}</strong>
            </div>

            <div className="summary-stat">
              <span className="summary-label">Falhas na atualização</span>
              <strong>{checkSummary.failed_updates}</strong>
            </div>
          </div>
        </div>
      ) : null}

      <div className="card">
        <div className="alert-filters">
          <div className="form-group">
            <label htmlFor="portfolio-filter">Filtrar por carteira</label>
            <select
              id="portfolio-filter"
              value={selectedPortfolioId}
              onChange={(event) => setSelectedPortfolioId(event.target.value)}
            >
              <option value="">Todas as carteiras</option>

              {portfolios.map((portfolio) => (
                <option key={portfolio.id} value={portfolio.id}>
                  {portfolio.name}
                </option>
              ))}
            </select>
          </div>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={onlyUnread}
              onChange={(event) => setOnlyUnread(event.target.checked)}
            />

            Exibir somente não lidos
          </label>

          <div className="alert-count-card">
            <span className="summary-label">Não lidos nesta listagem</span>
            <strong>{unreadCount}</strong>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="card">
          <p className="muted">Carregando alertas...</p>
        </div>
      ) : alerts.length === 0 ? (
        <div className="card">
          <h3>Nenhum alerta encontrado</h3>
          <p className="muted">
            Quando a rotina periódica identificar ativos acima ou abaixo do preço
            teto, os alertas aparecerão aqui.
          </p>
        </div>
      ) : (
        <div className="alert-events-list">
          {alerts.map((alert) => (
            <AlertEventCard
              key={alert.id}
              alert={alert}
              onMarkAsRead={handleMarkAsRead}
              markingAsRead={markingAsReadId === alert.id}
            />
          ))}
        </div>
      )}
    </section>
  );
}