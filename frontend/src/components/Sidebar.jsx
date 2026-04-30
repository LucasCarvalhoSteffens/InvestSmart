import { NavLink } from "react-router-dom";

const navigationGroups = [
  {
    title: "Visão geral",
    items: [
      {
        to: "/",
        icon: "🏠",
        label: "Início",
        description: "Resumo da plataforma",
      },
      {
        to: "/dashboard",
        icon: "📊",
        label: "Dashboard",
        description: "Indicadores e gráficos",
      },
    ],
  },
  {
    title: "Calculadoras",
    items: [
      {
        to: "/graham",
        icon: "📘",
        label: "Graham",
        description: "Preço justo por LPA e VPA",
      },
      {
        to: "/projected",
        icon: "📈",
        label: "Projetivo",
        description: "Preço teto por dividendos",
      },
      {
        to: "/barsi",
        icon: "💰",
        label: "Barsi",
        description: "Foco em renda passiva",
      },
    ],
  },
  {
    title: "Carteiras",
    items: [
      {
        to: "/portfolios",
        icon: "💼",
        label: "Minhas Carteiras",
        description: "Acompanhe ativos reais",
      },
      {
        to: "/simulator",
        icon: "🧪",
        label: "Simulador",
        description: "Teste cenários hipotéticos",
      },
    ],
  },
  {
    title: "Monitoramento",
    items: [
      {
        to: "/alerts",
        icon: "🔔",
        label: "Alertas",
        description: "Histórico de disparos",
      },
    ],
  },
];

function getUserDisplayName(user) {
  if (!user) {
    return "Usuário";
  }

  return user.first_name || user.username || user.email || "Usuário";
}

export default function Sidebar({ open, user, onClose, onSignOut }) {
  return (
    <aside className={`app-sidebar ${open ? "open" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <span className="sidebar-logo">IS</span>

          <div>
            <strong>InvestSmart</strong>
            <small>Análise fundamentalista</small>
          </div>
        </div>

        <button
          type="button"
          className="sidebar-close-btn"
          onClick={onClose}
          aria-label="Fechar menu lateral"
        >
          ×
        </button>
      </div>

      <div className="sidebar-user-card">
        <span className="sidebar-user-avatar">
          {getUserDisplayName(user).charAt(0).toUpperCase()}
        </span>

        <div>
          <strong>{getUserDisplayName(user)}</strong>
          <small>Conta autenticada</small>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Navegação principal">
        {navigationGroups.map((group) => (
          <div className="sidebar-nav-group" key={group.title}>
            <span className="sidebar-nav-title">{group.title}</span>

            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `sidebar-nav-link ${isActive ? "active" : ""}`
                }
              >
                <span className="sidebar-nav-icon">{item.icon}</span>

                <span className="sidebar-nav-text">
                  <strong>{item.label}</strong>
                  <small>{item.description}</small>
                </span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer-card">
          <strong>MVP em evolução</strong>
          <small>
            Calculadoras, carteiras reais, simulador, alertas e dashboards.
          </small>
        </div>

        <button type="button" className="sidebar-logout-btn" onClick={onSignOut}>
          Sair da plataforma
        </button>
      </div>
    </aside>
  );
}