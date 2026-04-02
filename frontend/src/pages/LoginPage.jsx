import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await signIn(form.username, form.password);
      navigate("/");
    } catch {
      setError("Usuário ou senha inválidos.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="center-page">
      <div className="card login-card">
        <h1>InvestSmart</h1>
        <p className="muted">Faça login para acessar a plataforma.</p>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Usuário</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Digite seu usuário"
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Digite sua senha"
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button className="primary-btn" type="submit" disabled={submitting}>
            {submitting ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}