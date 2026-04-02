import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Layout() {
  const { user, signOut } = useAuth();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1 className="brand">InvestSmart</h1>
          <p className="subtitle">Plataforma de análise fundamentalista</p>
        </div>

        <div className="topbar-right">
          <span className="user-badge">{user?.username}</span>
          <button className="secondary-btn" onClick={signOut}>
            Sair
          </button>
        </div>
      </header>

      <nav className="nav-links">
        <Link to="/">Início</Link>
        <Link to="/graham">Graham</Link>
        <Link to="/projected">Projetivo</Link>
        <Link to="/barsi">Barsi</Link>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
}