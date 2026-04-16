import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <h2>Calculadora Multimétodo e Carteiras</h2>
        <p className="muted">
          Escolha um dos métodos disponíveis ou acesse suas carteiras para
          acompanhar posições e alertas.
        </p>
      </section>

      <section className="cards-grid">
        <Link className="feature-card" to="/graham">
          <h3>Método Graham</h3>
          <p>Calcule o preço justo com base em LPA e VPA.</p>
        </Link>

        <Link className="feature-card" to="/projetivo">
          <h3>Preço Teto Projetivo</h3>
          <p>Calcule o preço teto a partir de DPA e dividend yield médio.</p>
        </Link>

        <Link className="feature-card" to="/barsi">
          <h3>Método Barsi</h3>
          <p>Analise o preço teto com base em dividendos e yield alvo.</p>
        </Link>

        <Link className="feature-card" to="/carteiras">
          <h3>Carteiras</h3>
          <p>
            Cadastre carteiras, adicione ativos e configure alertas por preço.
          </p>
        </Link>
      </section>
    </>
  );
}