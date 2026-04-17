import { useCallback, useEffect, useMemo, useState } from "react";
import AlertForm from "../components/AlertForm";
import PortfolioForm from "../components/PortfolioForm";
import PortfolioItemForm from "../components/PortfolioItemForm";
import PortfolioSimulationPanel from "../components/PortfolioSimulationPanel";
import PortfolioSummary from "../components/PortfolioSummary";
import { useAuth } from "../contexts/AuthContext";
import {
  createPortfolio,
  createPortfolioAlert,
  createPortfolioItem,
  deletePortfolio,
  deletePortfolioAlert,
  deletePortfolioItem,
  getPortfolioSimulation,
  listPortfolios,
  updatePortfolio,
  updatePortfolioItem,
} from "../services/portfoliosApi";

const EMPTY_PORTFOLIO_FORM = {
  name: "",
  description: "",
};

const EMPTY_ITEM_FORM = {
  asset: "",
  quantity: "",
  average_price: "",
  target_price: "",
  notes: "",
};

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

function getDefaultAlertForm(item) {
  return {
    formKey: item.id,
    alert_type: "below_or_equal",
    threshold_price: item.target_price || item.current_price || "",
  };
}

export default function PortfoliosPage() {
  const { accessToken } = useAuth();

  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [portfolioForm, setPortfolioForm] = useState(EMPTY_PORTFOLIO_FORM);
  const [portfolioSubmitting, setPortfolioSubmitting] = useState(false);
  const [portfolioEditingId, setPortfolioEditingId] = useState(null);

  const [itemForm, setItemForm] = useState(EMPTY_ITEM_FORM);
  const [itemSubmitting, setItemSubmitting] = useState(false);
  const [itemEditingId, setItemEditingId] = useState(null);

  const [alertForms, setAlertForms] = useState({});
  const [alertSubmittingId, setAlertSubmittingId] = useState(null);

  const [simulation, setSimulation] = useState(null);
  const [simulationLoading, setSimulationLoading] = useState(false);
  const [simulationError, setSimulationError] = useState("");

  const selectedPortfolio = useMemo(
    () =>
      portfolios.find((portfolio) => portfolio.id === selectedPortfolioId) ?? null,
    [portfolios, selectedPortfolioId],
  );

  const loadPortfolios = useCallback(
    async (preferredPortfolioId = null) => {
      if (!accessToken) {
        return;
      }

      try {
        setLoading(true);
        setPageError("");

        const data = await listPortfolios(accessToken);
        setPortfolios(data);

        setSelectedPortfolioId((currentSelectedId) => {
          if (
            preferredPortfolioId &&
            data.some((portfolio) => portfolio.id === preferredPortfolioId)
          ) {
            return preferredPortfolioId;
          }

          if (
            currentSelectedId &&
            data.some((portfolio) => portfolio.id === currentSelectedId)
          ) {
            return currentSelectedId;
          }

          return data[0]?.id ?? null;
        });
      } catch (error) {
        setPageError(
          extractErrorMessage(error, "Não foi possível carregar as carteiras."),
        );
      } finally {
        setLoading(false);
      }
    },
    [accessToken],
  );

  const loadSimulation = useCallback(
    async (portfolioId) => {
      if (!accessToken || !portfolioId) {
        setSimulation(null);
        setSimulationError("");
        return;
      }

      try {
        setSimulationLoading(true);
        setSimulationError("");

        const data = await getPortfolioSimulation(portfolioId, accessToken);
        setSimulation(data);
      } catch (error) {
        setSimulation(null);
        setSimulationError(
          extractErrorMessage(
            error,
            "Não foi possível carregar a simulação da carteira.",
          ),
        );
      } finally {
        setSimulationLoading(false);
      }
    },
    [accessToken],
  );

  useEffect(() => {
    loadPortfolios();
  }, [loadPortfolios]);

  useEffect(() => {
    setItemForm(EMPTY_ITEM_FORM);
    setItemEditingId(null);
    setAlertForms({});
  }, [selectedPortfolioId]);

  useEffect(() => {
    if (!selectedPortfolioId) {
      setSimulation(null);
      setSimulationError("");
      return;
    }

    loadSimulation(selectedPortfolioId);
  }, [selectedPortfolioId, loadSimulation]);

  function handlePortfolioFieldChange(event) {
    const { name, value } = event.target;

    setPortfolioForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleItemFieldChange(event) {
    const { name, value } = event.target;

    setItemForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleAssetChange(value) {
    setItemForm((previous) => ({
      ...previous,
      asset: value,
    }));
  }

  function resetPortfolioForm() {
    setPortfolioForm(EMPTY_PORTFOLIO_FORM);
    setPortfolioEditingId(null);
  }

  function resetItemForm() {
    setItemForm(EMPTY_ITEM_FORM);
    setItemEditingId(null);
  }

  async function handlePortfolioSubmit(event) {
    event.preventDefault();
    setPortfolioSubmitting(true);
    setPageError("");

    try {
      if (portfolioEditingId) {
        const updated = await updatePortfolio(
          portfolioEditingId,
          portfolioForm,
          accessToken,
        );

        await loadPortfolios(updated.id);
      } else {
        const created = await createPortfolio(portfolioForm, accessToken);
        await loadPortfolios(created.id);
      }

      resetPortfolioForm();
    } catch (error) {
      setPageError(
        extractErrorMessage(error, "Não foi possível salvar a carteira."),
      );
    } finally {
      setPortfolioSubmitting(false);
    }
  }

  async function handleDeletePortfolio(portfolioId) {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir esta carteira?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setPageError("");
      await deletePortfolio(portfolioId, accessToken);
      await loadPortfolios();
    } catch (error) {
      setPageError(
        extractErrorMessage(error, "Não foi possível excluir a carteira."),
      );
    }
  }

  function handleEditPortfolio(portfolio) {
    setPortfolioEditingId(portfolio.id);
    setPortfolioForm({
      name: portfolio.name,
      description: portfolio.description ?? "",
    });
  }

  async function handleItemSubmit(event) {
    event.preventDefault();

    if (!selectedPortfolio) {
      return;
    }

    setItemSubmitting(true);
    setPageError("");

    const payload = {
      portfolio: selectedPortfolio.id,
      asset: itemForm.asset,
      quantity: itemForm.quantity,
      average_price: itemForm.average_price,
      target_price: itemForm.target_price || null,
      notes: itemForm.notes,
    };

    try {
      if (itemEditingId) {
        await updatePortfolioItem(itemEditingId, payload, accessToken);
      } else {
        await createPortfolioItem(payload, accessToken);
      }

      await loadPortfolios(selectedPortfolio.id);
      await loadSimulation(selectedPortfolio.id);
      resetItemForm();
    } catch (error) {
      setPageError(
        extractErrorMessage(error, "Não foi possível salvar o item."),
      );
    } finally {
      setItemSubmitting(false);
    }
  }

  function handleEditItem(item) {
    setItemEditingId(item.id);
    setItemForm({
      asset: String(item.asset),
      quantity: String(item.quantity),
      average_price: String(item.average_price),
      target_price: item.target_price ? String(item.target_price) : "",
      notes: item.notes ?? "",
    });
  }

  async function handleDeleteItem(itemId) {
    const confirmed = window.confirm(
      "Tem certeza que deseja remover este ativo da carteira?",
    );

    if (!confirmed || !selectedPortfolio) {
      return;
    }

    try {
      setPageError("");
      await deletePortfolioItem(itemId, accessToken);
      await loadPortfolios(selectedPortfolio.id);
      await loadSimulation(selectedPortfolio.id);
    } catch (error) {
      setPageError(
        extractErrorMessage(error, "Não foi possível excluir o item."),
      );
    }
  }

  function getAlertForm(item) {
    return alertForms[item.id] ?? getDefaultAlertForm(item);
  }

  function handleAlertFieldChange(item, event) {
    const { name, value } = event.target;

    setAlertForms((previous) => ({
      ...previous,
      [item.id]: {
        ...getAlertForm(item),
        [name]: value,
      },
    }));
  }

  function resetAlertForm(item) {
    setAlertForms((previous) => ({
      ...previous,
      [item.id]: getDefaultAlertForm(item),
    }));
  }

  async function handleAlertSubmit(item, event) {
    event.preventDefault();

    if (!selectedPortfolio) {
      return;
    }

    const form = getAlertForm(item);

    try {
      setAlertSubmittingId(item.id);
      setPageError("");

      await createPortfolioAlert(
        {
          portfolio_item: item.id,
          alert_type: form.alert_type,
          threshold_price: form.threshold_price,
        },
        accessToken,
      );

      resetAlertForm(item);
      await loadPortfolios(selectedPortfolio.id);
    } catch (error) {
      setPageError(
        extractErrorMessage(error, "Não foi possível criar o alerta."),
      );
    } finally {
      setAlertSubmittingId(null);
    }
  }

  async function handleDeleteAlert(alertId) {
    if (!selectedPortfolio) {
      return;
    }

    try {
      setPageError("");
      await deletePortfolioAlert(alertId, accessToken);
      await loadPortfolios(selectedPortfolio.id);
    } catch (error) {
      setPageError(
        extractErrorMessage(error, "Não foi possível excluir o alerta."),
      );
    }
  }

  return (
    <div className="stack">
      <div className="page-header">
        <div>
          <h2>Carteiras</h2>
          <p className="muted">
            Organize seus ativos, acompanhe a posição e crie alertas por preço.
          </p>
        </div>

        <button
          className="secondary-btn small-btn"
          type="button"
          onClick={() => {
            loadPortfolios(selectedPortfolioId);
            if (selectedPortfolioId) {
              loadSimulation(selectedPortfolioId);
            }
          }}
        >
          Atualizar
        </button>
      </div>

      {pageError && <p className="error-text">{pageError}</p>}

      <div className="portfolio-layout">
        <aside className="portfolio-sidebar stack">
          <div className="card">
            <h3 className="section-title">Minhas carteiras</h3>

            {loading ? (
              <p className="muted">Carregando carteiras...</p>
            ) : portfolios.length === 0 ? (
              <p className="muted">
                Você ainda não possui carteiras cadastradas.
              </p>
            ) : (
              <div className="portfolio-list">
                {portfolios.map((portfolio) => (
                  <div
                    key={portfolio.id}
                    className={`portfolio-list-item ${
                      selectedPortfolioId === portfolio.id ? "active" : ""
                    }`}
                  >
                    <button
                      className="portfolio-list-button"
                      type="button"
                      onClick={() => setSelectedPortfolioId(portfolio.id)}
                    >
                      <div className="portfolio-list-main">
                        <strong>{portfolio.name}</strong>
                        <span className="muted">
                          {portfolio.total_items} item(ns)
                        </span>
                      </div>
                    </button>

                    <div className="portfolio-list-actions">
                      <button
                        className="secondary-btn small-btn"
                        type="button"
                        onClick={() => handleEditPortfolio(portfolio)}
                      >
                        Editar
                      </button>

                      <button
                        className="danger-btn small-btn"
                        type="button"
                        onClick={() => handleDeletePortfolio(portfolio.id)}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <PortfolioForm
            form={portfolioForm}
            onChange={handlePortfolioFieldChange}
            onSubmit={handlePortfolioSubmit}
            onCancel={resetPortfolioForm}
            submitting={portfolioSubmitting}
            editing={Boolean(portfolioEditingId)}
          />
        </aside>

        <section className="portfolio-content stack">
          <PortfolioSummary portfolio={selectedPortfolio} />

          {selectedPortfolio ? (
            <PortfolioSimulationPanel
              simulation={simulation}
              loading={simulationLoading}
              error={simulationError}
              onRefresh={() => loadSimulation(selectedPortfolio.id)}
            />
          ) : null}

          <PortfolioItemForm
            portfolioSelected={Boolean(selectedPortfolio)}
            form={itemForm}
            onTextChange={handleItemFieldChange}
            onAssetChange={handleAssetChange}
            onSubmit={handleItemSubmit}
            onCancel={resetItemForm}
            submitting={itemSubmitting}
            editing={Boolean(itemEditingId)}
          />

          <div className="card">
            <h3 className="section-title">Ativos da carteira</h3>

            {!selectedPortfolio ? (
              <p className="muted">
                Selecione uma carteira para visualizar os ativos.
              </p>
            ) : selectedPortfolio.items?.length === 0 ? (
              <p className="muted">Nenhum ativo cadastrado nesta carteira.</p>
            ) : (
              <div className="portfolio-item-list">
                {selectedPortfolio.items.map((item) => {
                  const alertForm = getAlertForm(item);

                  return (
                    <div className="portfolio-item-card" key={item.id}>
                      <div className="portfolio-item-head">
                        <div>
                          <h4>
                            {item.asset_ticker} - {item.asset_name}
                          </h4>
                          <p className="muted">
                            {item.notes || "Sem observações para esta posição."}
                          </p>
                        </div>

                        <div className="button-row wrap">
                          <button
                            className="secondary-btn small-btn"
                            type="button"
                            onClick={() => handleEditItem(item)}
                          >
                            Editar item
                          </button>

                          <button
                            className="danger-btn small-btn"
                            type="button"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            Excluir item
                          </button>
                        </div>
                      </div>

                      <div className="portfolio-item-grid">
                        <div className="result-item">
                          <span className="muted">Quantidade</span>
                          <strong>{item.quantity}</strong>
                        </div>

                        <div className="result-item">
                          <span className="muted">Preço médio</span>
                          <strong>{formatCurrency(item.average_price)}</strong>
                        </div>

                        <div className="result-item">
                          <span className="muted">Preço atual</span>
                          <strong>{formatCurrency(item.current_price)}</strong>
                        </div>

                        <div className="result-item">
                          <span className="muted">Preço teto</span>
                          <strong>
                            {item.target_price
                              ? formatCurrency(item.target_price)
                              : "Não definido"}
                          </strong>
                        </div>

                        <div className="result-item">
                          <span className="muted">Valor investido</span>
                          <strong>{formatCurrency(item.invested_amount)}</strong>
                        </div>

                        <div className="result-item">
                          <span className="muted">Valor atual</span>
                          <strong>{formatCurrency(item.current_value)}</strong>
                        </div>

                        <div className="result-item">
                          <span className="muted">Ganho/Perda</span>
                          <strong>{formatCurrency(item.unrealized_gain)}</strong>
                        </div>

                        <div className="result-item">
                          <span className="muted">Rentabilidade</span>
                          <strong>{formatPercent(item.unrealized_gain_pct)}</strong>
                        </div>

                        <div className="result-item">
                          <span className="muted">Abaixo do teto?</span>
                          <strong>{item.is_below_target ? "Sim" : "Não"}</strong>
                        </div>

                        <div className="result-item">
                          <span className="muted">Distância até o teto</span>
                          <strong>
                            {item.distance_to_target !== null
                              ? formatCurrency(item.distance_to_target)
                              : "Não aplicável"}
                          </strong>
                        </div>
                      </div>

                      <div className="portfolio-alert-section">
                        <h5>Alertas deste ativo</h5>

                        {item.alerts?.length > 0 ? (
                          <div className="alert-list">
                            {item.alerts.map((alert) => (
                              <div className="alert-chip" key={alert.id}>
                                <div className="chip-label">
                                  <strong>
                                    {alert.alert_type === "below_or_equal"
                                      ? "Preço menor ou igual"
                                      : "Preço maior ou igual"}
                                  </strong>
                                  <span className="muted">
                                    Disparo em {formatCurrency(alert.threshold_price)}
                                  </span>
                                  <span className="muted">
                                    Atual: {formatCurrency(alert.current_price)}
                                  </span>
                                </div>

                                <div className="chip-actions">
                                  <span
                                    className={`status-pill ${
                                      alert.triggered_now ? "status-hit" : "status-idle"
                                    }`}
                                  >
                                    {alert.triggered_now
                                      ? "Disparando agora"
                                      : "Aguardando"}
                                  </span>

                                  <button
                                    className="danger-btn small-btn"
                                    type="button"
                                    onClick={() => handleDeleteAlert(alert.id)}
                                  >
                                    Excluir alerta
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="muted">Nenhum alerta configurado.</p>
                        )}

                        <div className="card soft-card">
                          <h5>Novo alerta</h5>

                          <AlertForm
                            form={alertForm}
                            onChange={(event) =>
                              handleAlertFieldChange(item, event)
                            }
                            onSubmit={(event) => handleAlertSubmit(item, event)}
                            onCancel={() => resetAlertForm(item)}
                            submitting={alertSubmittingId === item.id}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}