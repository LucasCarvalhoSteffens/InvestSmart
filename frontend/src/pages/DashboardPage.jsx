import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import DashboardRecentAlerts from "../components/DashboardRecentAlerts";
import { useAuth } from "../contexts/AuthContext";
import {
  checkPortfolioAlertEvents,
  getPortfolioSimulation,
  listPortfolioAlertEvents,
  listPortfolios,
} from "../services/portfoliosApi";

const CHART_COLORS = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#dc2626",
  "#7c3aed",
  "#0891b2",
  "#db2777",
  "#65a30d",
];

const BAR_COLORS = {
  currentPrice: "#2563eb",
  priceCeiling: "#16a34a",
  projectedValue: "#7c3aed",
};

function getResultVariant(value) {
  return Number(value ?? 0) >= 0 ? "success" : "danger";
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

function toNumber(value) {
  const numericValue = Number(value ?? 0);
  return Number.isFinite(numericValue) ? numericValue : 0;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(toNumber(value));
}

function formatPercent(value) {
  return `${new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(toNumber(value))}%`;
}

function DashboardKpiCard({ title, value, subtitle, variant = "primary" }) {
  return (
    <article className={`dashboard-kpi-card dashboard-kpi-card--${variant}`}>
      <span className="dashboard-kpi-title">{title}</span>
      <strong className="dashboard-kpi-value">{value}</strong>

      {subtitle ? (
        <small className="dashboard-kpi-subtitle">{subtitle}</small>
      ) : null}
    </article>
  );
}

function SectionCard({ title, description, children }) {
  return (
    <article className="dashboard-card">
      <div className="dashboard-card-header">
        <h3>{title}</h3>
        {description ? <p>{description}</p> : null}
      </div>

      {children}
    </article>
  );
}

export default function DashboardPage() {
  const { accessToken } = useAuth();

  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState("");
  const [simulation, setSimulation] = useState(null);
  const [alertEvents, setAlertEvents] = useState([]);
  const [annualProjectionRate, setAnnualProjectionRate] = useState("8");

  const [loading, setLoading] = useState(true);
  const [checkingAlerts, setCheckingAlerts] = useState(false);
  const [error, setError] = useState("");

  const summary = simulation?.summary ?? {};
  const items = simulation?.items ?? [];

  const loadPortfolios = useCallback(async () => {
    if (!accessToken) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await listPortfolios(accessToken);
      const portfolioList = normalizeList(data);

      setPortfolios(portfolioList);

      setSelectedPortfolioId((currentId) => {
        if (
          currentId &&
          portfolioList.some(
            (portfolio) => String(portfolio.id) === String(currentId),
          )
        ) {
          return currentId;
        }

        return portfolioList[0]?.id ? String(portfolioList[0].id) : "";
      });
    } catch {
      setError("Não foi possível carregar as carteiras.");
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  const loadDashboardData = useCallback(
    async (portfolioId) => {
      if (!accessToken || !portfolioId) {
        return;
      }

      try {
        setLoading(true);
        setError("");

        const [simulationData, alertData] = await Promise.all([
          getPortfolioSimulation(portfolioId, accessToken),
          listPortfolioAlertEvents({ portfolio_id: portfolioId }, accessToken),
        ]);

        setSimulation(simulationData);
        setAlertEvents(normalizeList(alertData));
      } catch {
        setError("Não foi possível carregar o dashboard.");
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
    if (selectedPortfolioId) {
      loadDashboardData(selectedPortfolioId);
    }
  }, [selectedPortfolioId, loadDashboardData]);

  async function handleCheckAlerts() {
    if (!selectedPortfolioId || !accessToken) {
      return;
    }

    try {
      setCheckingAlerts(true);
      setError("");

      await checkPortfolioAlertEvents(
        {
          portfolio_id: Number(selectedPortfolioId),
          force_refresh: true,
        },
        accessToken,
      );

      await loadDashboardData(selectedPortfolioId);
    } catch {
      setError("Não foi possível verificar os alertas.");
    } finally {
      setCheckingAlerts(false);
    }
  }

  const allocationData = useMemo(
    () =>
      items.map((item) => ({
        name: item.asset_ticker,
        value: toNumber(item.current_value),
      })),
    [items],
  );

  const valuationData = useMemo(
    () =>
      items.map((item) => ({
        ticker: item.asset_ticker,
        precoAtual: toNumber(item.current_price),
        precoTeto: toNumber(item.price_ceiling),
      })),
    [items],
  );

  const projectionData = useMemo(() => {
    const baseValue = toNumber(summary.total_current_value);
    const rate = toNumber(annualProjectionRate) / 100;

    return [0, 5, 10, 20].map((year) => ({
      year: year === 0 ? "Hoje" : `${year} anos`,
      value: baseValue * Math.pow(1 + rate, year),
    }));
  }, [summary.total_current_value, annualProjectionRate]);

  const opportunities = useMemo(
    () =>
      items
        .filter(
          (item) =>
            toNumber(item.current_price) <= toNumber(item.price_ceiling),
        )
        .sort(
          (a, b) =>
            toNumber(b.estimated_return_pct) -
            toNumber(a.estimated_return_pct),
        ),
    [items],
  );

  if (loading) {
    return <div className="loading-card">Carregando dashboard...</div>;
  }

  return (
    <section className="dashboard-page">
      <div className="dashboard-topbar">
        <div>
          <h2>Dashboard</h2>
          <p>Visão consolidada da carteira, oportunidades e alertas.</p>
        </div>

        <div className="dashboard-topbar-actions">
          <select
            value={selectedPortfolioId}
            onChange={(event) => setSelectedPortfolioId(event.target.value)}
          >
            {portfolios.length === 0 ? (
              <option value="">Nenhuma carteira encontrada</option>
            ) : (
              portfolios.map((portfolio) => (
                <option key={portfolio.id} value={portfolio.id}>
                  {portfolio.name}
                </option>
              ))
            )}
          </select>

          <button
            type="button"
            className="primary-btn"
            onClick={handleCheckAlerts}
            disabled={checkingAlerts || !selectedPortfolioId}
          >
            {checkingAlerts ? "Verificando..." : "Verificar alertas"}
          </button>
        </div>
      </div>

      {error ? <div className="error-message">{error}</div> : null}

      <div className="dashboard-kpi-grid">
        <DashboardKpiCard
          title="Valor investido"
          value={formatCurrency(summary.total_invested)}
          variant="primary"
        />

        <DashboardKpiCard
          title="Valor atual"
          value={formatCurrency(summary.total_current_value)}
          variant="info"
        />

        <DashboardKpiCard
          title="Resultado"
          value={formatCurrency(summary.total_unrealized_gain)}
          subtitle={formatPercent(summary.total_unrealized_gain_pct)}
          variant={getResultVariant(summary.total_unrealized_gain)}
        />

        <DashboardKpiCard
          title="Oportunidades"
          value={summary.opportunities_count ?? 0}
          variant="success"
        />

        <DashboardKpiCard
          title="Alertas"
          value={alertEvents.length}
          variant="warning"
        />
      </div>

      <div className="dashboard-grid-2">
        <SectionCard
          title="Preço atual x preço teto"
          description="Compare rapidamente se o ativo está acima ou abaixo do preço teto."
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={valuationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ticker" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />

              <Bar
                dataKey="precoAtual"
                name="Preço atual"
                fill={BAR_COLORS.currentPrice}
                radius={[6, 6, 0, 0]}
              />

              <Bar
                dataKey="precoTeto"
                name="Preço teto"
                fill={BAR_COLORS.priceCeiling}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard
          title="Distribuição da carteira"
          description="Mostra a participação de cada ativo na carteira."
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={allocationData}
                dataKey="value"
                nameKey="name"
                outerRadius={95}
                label
              >
                {allocationData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <div className="dashboard-grid-2">
        <SectionCard
          title="Melhores oportunidades"
          description="Ativos com maior potencial em relação ao preço teto."
        >
          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Ativo</th>
                  <th>Preço atual</th>
                  <th>Preço teto</th>
                  <th>Retorno estimado</th>
                </tr>
              </thead>

              <tbody>
                {opportunities.length > 0 ? (
                  opportunities.slice(0, 5).map((item) => (
                    <tr key={item.asset_ticker}>
                      <td>{item.asset_ticker}</td>
                      <td>{formatCurrency(item.current_price)}</td>
                      <td>{formatCurrency(item.price_ceiling)}</td>
                      <td>{formatPercent(item.estimated_return_pct)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">Nenhuma oportunidade encontrada.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <DashboardRecentAlerts alerts={alertEvents} />
      </div>

      <SectionCard
        title="Projeção patrimonial"
        description="Simulação simples da evolução da carteira ao longo do tempo."
      >
        <div className="dashboard-projection-toolbar">
          <label>
            Rentabilidade anual simulada (%)
            <input
              type="number"
              min="0"
              step="0.1"
              value={annualProjectionRate}
              onChange={(event) => setAnnualProjectionRate(event.target.value)}
            />
          </label>
        </div>

        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={projectionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />

            <Line
              type="monotone"
              dataKey="value"
              name="Valor projetado"
              stroke={BAR_COLORS.projectedValue}
              strokeWidth={3}
              dot={{
                r: 5,
                fill: BAR_COLORS.projectedValue,
              }}
              activeDot={{
                r: 7,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </SectionCard>
    </section>
  );
}
