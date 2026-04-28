import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <h2>Calculadora Multimétodo e Carteiras</h2>
        <p>
          Escolha um dos métodos disponíveis, acesse suas carteiras ou acompanhe
          os alertas automáticos de preço teto.
        </p>
      </section>

      <section className="cards-grid">
        <Link to="/graham" className="feature-card">
          <h3>Método Graham</h3>
          <p>Calcule o preço justo com base em LPA e VPA.</p>
        </Link>

        <Link to="/projetivo" className="feature-card">
          <h3>Preço Teto Projetivo</h3>
          <p>Calcule o preço teto a partir de DPA e dividend yield médio.</p>
        </Link>

        <Link to="/barsi" className="feature-card">
          <h3>Método Barsi</h3>
          <p>Analise o preço teto com base em dividendos e yield alvo.</p>
        </Link>

        <Link to="/carteiras" className="feature-card">
          <h3>Carteiras</h3>
          <p>Cadastre carteiras, adicione ativos e configure alertas por preço.</p>
        </Link>

        <Link to="/alertas" className="feature-card">
          <h3>Alertas automáticos</h3>
          <p>
            Visualize eventos gerados pela rotina de preço atual contra preço teto.
          </p>
        </Link>
      </section>
    </>
  );
}