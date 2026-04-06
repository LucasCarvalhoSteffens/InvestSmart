import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div>
      <section className="hero">
        <h2>Calculadora Multimétodo</h2>
        <p>Escolha um dos métodos disponíveis para realizar a análise do ativo.</p>
      </section>

      <section className="cards-grid">
        <Link to="/graham" className="feature-card">
          <h3>Método Graham</h3>
          <p>Calcule o preço justo com base em LPA e VPA.</p>
        </Link>

        <Link to="/projected" className="feature-card">
          <h3>Preço Teto Projetivo</h3>
          <p>Calcule o preço teto a partir de DPA e dividend yield médio.</p>
        </Link>

        <Link to="/barsi" className="feature-card">
          <h3>Método Barsi</h3>
          <p>Analise o preço teto com base em dividendos e yield alvo.</p>
        </Link>
      </section>
    </div>
  );
}