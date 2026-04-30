import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "./Sidebar";

export default function Layout() {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSidebarOpen(false);
    }, 0);
  
    return () => window.clearTimeout(timeoutId);
  }, [location.pathname]);

  return (
    <div className="app-layout">
      <Sidebar
        open={sidebarOpen}
        user={user}
        onClose={() => setSidebarOpen(false)}
        onSignOut={signOut}
      />

      {sidebarOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-label="Fechar menu lateral"
        />
      )}

      <div className="app-main-area">
        <header className="app-topbar">
          <button
            type="button"
            className="app-menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menu lateral"
          >
            ☰
          </button>

          <div className="app-topbar-brand">
            <strong>InvestSmart</strong>
            <small>Plataforma de análise fundamentalista</small>
          </div>
        </header>

        <main className="app-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}