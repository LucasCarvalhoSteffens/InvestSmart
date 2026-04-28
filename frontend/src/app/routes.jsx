import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";

import AlertEventsPage from "../pages/AlertEventsPage";
import BarsiPage from "../pages/BarsiPage";
import DashboardPage from "../pages/DashboardPage";
import GrahamPage from "../pages/GrahamPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import PortfoliosPage from "../pages/PortfoliosPage";
import ProjectedPage from "../pages/ProjectedPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomePage />} />

          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="portfolios" element={<PortfoliosPage />} />
          <Route path="alerts" element={<AlertEventsPage />} />

          <Route path="graham" element={<GrahamPage />} />
          <Route path="projected" element={<ProjectedPage />} />
          <Route path="barsi" element={<BarsiPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}