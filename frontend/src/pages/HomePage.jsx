import { Link } from "react-router-dom";

const methodCards = [
  {
    title: "Método Graham",
    description:
      "Calcule o preço justo de uma ação com base em lucro por ação e valor patrimonial.",
    icon: "📘",
    link: "/graham",
    label: "Calcular Graham",
    tags: ["LPA", "VPA", "Valor intrínseco"],
    accent: "blue",
  },
  {
    title: "Preço Teto Projetivo",
    description:
      "Projete um preço teto utilizando dividendos por ação e dividend yield médio.",
    icon: "📈",
    link: "/projected",
    label: "Calcular Projetivo",
    tags: ["DPA", "Dividend Yield", "Projeção"],
    accent: "green",
  },
  {
    title: "Método Barsi",
    description:
      "Analise ativos com foco em dividendos, renda passiva e yield mínimo desejado.",
    icon: "💰",
    link: "/barsi",
    label: "Calcular Barsi",
    tags: ["Dividendos", "Yield alvo", "Preço teto"],
    accent: "orange",
  },
];

const workflowSteps = [
  {
    number: "01",
    title: "Busque o ativo",
    description:
      "Pesquise ações brasileiras usando integração com dados de mercado.",
  },
  {
    number: "02",
    title: "Calcule o valuation",
    description:
      "Compare Graham, Barsi e Projetivo para entender diferentes visões de preço.",
  },
  {
    number: "03",
    title: "Monte sua carteira",
    description:
      "Cadastre posições, preço médio e preço teto para acompanhar oportunidades.",
  },
  {
    number: "04",
    title: "Acompanhe alertas",
    description:
      "Visualize eventos quando o preço atual se aproxima dos limites definidos.",
  },
];

const stats = [
  {
    value: "3",
    label: "Métodos de valuation",
  },
  {
    value: "5+",
    label: "Fluxos principais",
  },
  {
    value: "JWT",
    label: "Autenticação",
  },
  {
    value: "API",
    label: "Dados externos",
  },
];

export default function HomePage() {
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero-content">
          <span className="home-kicker">Plataforma Web de Análise Fundamentalista</span>

          <h1>
            Analise ações, calcule preço justo e acompanhe suas carteiras em um só lugar.
          </h1>

          <p>
            O InvestSmart reúne métodos clássicos de valuation, simulação de carteiras
            e alertas por preço teto para apoiar decisões de investimento de longo prazo.
          </p>

          <div className="home-actions">
            <Link className="primary-btn home-primary-action" to="/portfolios">
              Abrir carteiras
            </Link>

            <Link className="secondary-btn home-secondary-action" to="/graham">
              Começar por Graham
            </Link>
          </div>
        </div>

        <div className="home-hero-panel">
          <div className="home-panel-header">
            <span>Resumo do MVP</span>
            <strong>InvestSmart</strong>
          </div>

          <div className="home-panel-metric highlight">
            <span>Funcionalidade central</span>
            <strong>Calculadora multimétodo</strong>
          </div>

          <div className="home-panel-list">
            <div>
              <span>Graham</span>
              <strong>LPA + VPA</strong>
            </div>

            <div>
              <span>Barsi</span>
              <strong>Dividendos</strong>
            </div>

            <div>
              <span>Projetivo</span>
              <strong>Preço teto</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="home-stats-grid">
        {stats.map((stat) => (
          <div className="home-stat-card" key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>

      <section className="home-section">
        <div className="home-section-header">
          <div>
            <span className="home-section-kicker">Calculadoras</span>
            <h2>Escolha uma forma de analisar o ativo</h2>
          </div>

          <p>
            Use os três métodos para comparar diferentes abordagens de preço justo,
            margem de segurança e geração de renda.
          </p>
        </div>

        <div className="home-method-grid">
          {methodCards.map((card) => (
            <Link
              to={card.link}
              className={`home-method-card ${card.accent}`}
              key={card.title}
            >
              <div className="home-method-icon">{card.icon}</div>

              <div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>

              <div className="home-method-tags">
                {card.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>

              <strong className="home-method-link">{card.label} →</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section home-workflow-section">
        <div className="home-section-header">
          <div>
            <span className="home-section-kicker">Fluxo recomendado</span>
            <h2>Do valuation ao acompanhamento da carteira</h2>
          </div>

          <p>
            A navegação foi organizada para o usuário sair da análise individual do ativo
            até a gestão de carteira e alertas.
          </p>
        </div>

        <div className="home-workflow-grid">
          {workflowSteps.map((step) => (
            <div className="home-workflow-card" key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="home-bottom-grid">
        <div className="home-feature-box portfolios">
          <span>Carteiras</span>
          <h2>Monte cenários com preço médio, quantidade e preço teto.</h2>
          <p>
            Cadastre ativos, acompanhe sua posição e use os cálculos como apoio para
            analisar oportunidades de compra.
          </p>

          <Link className="primary-btn" to="/portfolios">
            Gerenciar carteiras
          </Link>
        </div>

        <div className="home-feature-box alerts">
          <span>Alertas</span>
          <h2>Acompanhe eventos gerados pelos seus limites de preço.</h2>
          <p>
            A área de alertas ajuda a validar o funcionamento do monitoramento automático
            e fortalece a demonstração do projeto.
          </p>

          <Link className="secondary-btn" to="/alerts">
            Ver alertas
          </Link>
        </div>
      </section>
    </div>
  );
}