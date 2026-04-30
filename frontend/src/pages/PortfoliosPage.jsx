import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PortfolioAssetsSection from "../components/PortfolioAssetsSection";
import PortfolioForm from "../components/PortfolioForm";
import PortfolioItemForm from "../components/PortfolioItemForm";
import PortfolioSummary from "../components/PortfolioSummary";
import { useAuth } from "../contexts/AuthContext";
import {
  createPortfolio,
  createPortfolioAlert,
  createPortfolioItem,
  deletePortfolio,
  deletePortfolioAlert,
  deletePortfolioItem,
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
  ticker: "",
  quantity: "",
  average_price: "",
  target_price: "",
  notes: "",
};

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
  const portfolioFormRef = useRef(null);

  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState(null);
  const [portfolioSearch, setPortfolioSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [portfolioForm, setPortfolioForm] = useState(EMPTY_PORTFOLIO_FORM);
  const [portfolioSubmitting, setPortfolioSubmitting] = useState(false);
  const [portfolioEditingId, setPortfolioEditingId] = useState(null);

  const [itemForm, setItemForm] = useState(EMPTY_ITEM_FORM);
  const [itemSubmitting, setItemSubmitting] = useState(false);
  const [itemEditingId, setItemEditingId] = useState(null);

  const [alertForms, setAlertForms] = useState({});
  const [alertSubmittingId, setAlertSubmittingId] = useState(null);

  const selectedPortfolio = useMemo(
    () =>
      portfolios.find((portfolio) => portfolio.id === selectedPortfolioId) ??
      null,
    [portfolios, selectedPortfolioId],
  );

  const filteredPortfolios = useMemo(() => {
    const search = portfolioSearch.trim().toLowerCase();

    if (!search) {
      return portfolios;
    }

    return portfolios.filter((portfolio) => {
      const name = portfolio.name?.toLowerCase() ?? "";
      const description = portfolio.description?.toLowerCase() ?? "";

      return name.includes(search) || description.includes(search);
    });
  }, [portfolioSearch, portfolios]);

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

  useEffect(() => {
    loadPortfolios();
  }, [loadPortfolios]);

  useEffect(() => {
    setItemForm(EMPTY_ITEM_FORM);
    setItemEditingId(null);
    setAlertForms({});
  }, [selectedPortfolioId]);

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

  function handleAssetChange(ticker) {
    setItemForm((previous) => ({
      ...previous,
      ticker,
      asset: "",
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

  function scrollToPortfolioForm() {
    portfolioFormRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  async function handlePortfolioSubmit(event) {
    event.preventDefault();

    if (!portfolioForm.name.trim()) {
      setPageError("Informe o nome da carteira.");
      return;
    }

    try {
      setPortfolioSubmitting(true);
      setPageError("");
      setSuccessMessage("");

      if (portfolioEditingId) {
        const updatedPortfolio = await updatePortfolio(
          portfolioEditingId,
          {
            name: portfolioForm.name.trim(),
            description: portfolioForm.description.trim(),
          },
          accessToken,
        );

        await loadPortfolios(updatedPortfolio.id);
        setSuccessMessage("Carteira atualizada com sucesso.");
      } else {
        const createdPortfolio = await createPortfolio(
          {
            name: portfolioForm.name.trim(),
            description: portfolioForm.description.trim(),
          },
          accessToken,
        );

        await loadPortfolios(createdPortfolio.id);
        setSuccessMessage("Carteira criada com sucesso.");
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

  function handleEditPortfolio(portfolio) {
    setPortfolioEditingId(portfolio.id);
    setPortfolioForm({
      name: portfolio.name ?? "",
      description: portfolio.description ?? "",
    });
    scrollToPortfolioForm();
  }

  async function handleDeletePortfolio(portfolioId) {
    const confirmed = globalThis.confirm(
      "Tem certeza que deseja excluir esta carteira?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setPageError("");
      setSuccessMessage("");

      await deletePortfolio(portfolioId, accessToken);
      await loadPortfolios();

      setSuccessMessage("Carteira excluída com sucesso.");
    } catch (error) {
      setPageError(
        extractErrorMessage(error, "Não foi possível excluir a carteira."),
      );
    }
  }

  async function handleItemSubmit(event) {
    event.preventDefault();

    if (!selectedPortfolio) {
      return;
    }

    setItemSubmitting(true);
    setPageError("");
    setSuccessMessage("");

    const cleanTicker = itemForm.ticker
      ? itemForm.ticker.trim().split(" - ")[0].split(" ")[0].toUpperCase()
      : "";

    const payload = {
      portfolio: selectedPortfolio.id,
      quantity: itemForm.quantity,
      average_price: itemForm.average_price,
      target_price: itemForm.target_price || null,
      notes: itemForm.notes,
    };

    if (cleanTicker) {
      payload.ticker = cleanTicker;
    } else if (itemForm.asset) {
      payload.asset = itemForm.asset;
    }

    try {
      if (itemEditingId) {
        await updatePortfolioItem(itemEditingId, payload, accessToken);
        setSuccessMessage("Ativo atualizado com sucesso.");
      } else {
        await createPortfolioItem(payload, accessToken);
        setSuccessMessage("Ativo adicionado à carteira.");
      }

      await loadPortfolios(selectedPortfolio.id);
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
      ticker: item.asset_ticker || "",
      quantity: String(item.quantity),
      average_price: String(item.average_price),
      target_price: item.target_price ? String(item.target_price) : "",
      notes: item.notes ?? "",
    });
  }

  async function handleDeleteItem(itemId) {
    const confirmed = globalThis.confirm(
      "Tem certeza que deseja remover este ativo da carteira?",
    );

    if (!confirmed || !selectedPortfolio) {
      return;
    }

    try {
      setPageError("");
      setSuccessMessage("");

      await deletePortfolioItem(itemId, accessToken);
      await loadPortfolios(selectedPortfolio.id);

      setSuccessMessage("Ativo removido da carteira.");
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
      setSuccessMessage("");

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

      setSuccessMessage("Alerta criado com sucesso.");
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
      setSuccessMessage("");

      await deletePortfolioAlert(alertId, accessToken);
      await loadPortfolios(selectedPortfolio.id);

      setSuccessMessage("Alerta excluído com sucesso.");
    } catch (error) {
      setPageError(
        extractErrorMessage(error, "Não foi possível excluir o alerta."),
      );
    }
  }

  function renderPortfolioListContent() {
    if (loading) {
      return <p className="muted">Carregando carteiras...</p>;
    }
  
    if (portfolios.length === 0) {
      return (
        <div className="empty-state compact">
          <strong>Nenhuma carteira cadastrada</strong>
          <span>Crie sua primeira carteira usando o formulário acima.</span>
        </div>
      );
    }
  
    if (filteredPortfolios.length === 0) {
      return (
        <div className="empty-state compact">
          <strong>Nenhuma carteira encontrada</strong>
          <span>Tente outro termo na busca.</span>
        </div>
      );
    }
  
    return (
      <div className="portfolio-list">
        {filteredPortfolios.map((portfolio) => (
          <article
            key={portfolio.id}
            className={`portfolio-list-item ${
              portfolio.id === selectedPortfolioId ? "active" : ""
            }`}
          >
            <button
              type="button"
              className="portfolio-list-button"
              onClick={() => setSelectedPortfolioId(portfolio.id)}
            >
              <span className="portfolio-list-main">
                <strong>{portfolio.name}</strong>
                <span>{portfolio.total_items} ativo(s)</span>
  
                {portfolio.description && (
                  <small>{portfolio.description}</small>
                )}
              </span>
            </button>
  
            <div className="portfolio-list-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={() => handleEditPortfolio(portfolio)}
              >
                Editar
              </button>
  
              <button
                type="button"
                className="danger-btn"
                onClick={() => handleDeletePortfolio(portfolio.id)}
              >
                Excluir
              </button>
            </div>
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="portfolios-page">
      <header className="page-header compact portfolio-page-header">
        <div>
          <span className="portfolio-page-kicker">Carteiras reais</span>
          <h2>Minhas Carteiras</h2>
          <p className="muted">
            Crie e acompanhe suas carteiras reais com preço médio, preço teto,
            rentabilidade e alertas por ativo.
          </p>
        </div>

        <div className="portfolio-header-actions">
          <button
            type="button"
            className="secondary-btn small-btn"
            onClick={() => loadPortfolios(selectedPortfolioId)}
          >
            Atualizar dados
          </button>
        </div>
      </header>

      {pageError && <div className="error-message">{pageError}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <section className="portfolio-create-area" ref={portfolioFormRef}>
        <PortfolioForm
          form={portfolioForm}
          onChange={handlePortfolioFieldChange}
          onSubmit={handlePortfolioSubmit}
          onCancel={resetPortfolioForm}
          submitting={portfolioSubmitting}
          editing={Boolean(portfolioEditingId)}
        />
      </section>

      <div className="portfolio-workspace">
        <aside className="portfolio-sidebar">
          <div className="card portfolio-list-card">
            <div className="portfolio-list-header">
              <div>
                <h3 className="section-title">Carteiras cadastradas</h3>
                <p className="muted">
                  Selecione uma carteira para visualizar e gerenciar os ativos.
                </p>
              </div>
            </div>

            <div className="portfolio-search-box">
              <input
                type="text"
                value={portfolioSearch}
                onChange={(event) => setPortfolioSearch(event.target.value)}
                placeholder="Buscar carteira..."
              />
            </div>

            {renderPortfolioListContent()}
            
          </div>
        </aside>

        <section className="portfolio-content stack">
          <div className="portfolio-context-card">
            <span>Carteira selecionada</span>
            <h3>{selectedPortfolio?.name || "Selecione uma carteira"}</h3>
            <p>
              {selectedPortfolio?.description ||
                "Selecione uma carteira na lateral para visualizar os detalhes e os ativos cadastrados."}
            </p>

            {selectedPortfolio && (
              <div className="portfolio-context-actions">
                <button
                  type="button"
                  className="secondary-btn small-btn"
                  onClick={() => handleEditPortfolio(selectedPortfolio)}
                >
                  Editar carteira
                </button>
              </div>
            )}
          </div>

          <PortfolioSummary portfolio={selectedPortfolio} />

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

          <PortfolioAssetsSection
            selectedPortfolio={selectedPortfolio}
            getAlertForm={getAlertForm}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
            onAlertChange={handleAlertFieldChange}
            onAlertSubmit={handleAlertSubmit}
            onAlertCancel={resetAlertForm}
            onDeleteAlert={handleDeleteAlert}
            alertSubmittingId={alertSubmittingId}
          />
        </section>
      </div>
    </div>
  );
}