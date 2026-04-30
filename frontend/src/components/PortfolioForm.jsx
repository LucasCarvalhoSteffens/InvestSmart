import PropTypes from "prop-types";

const PORTFOLIO_TEMPLATES = [
  {
    label: "Dividendos",
    name: "Carteira de Dividendos",
    description:
      "Carteira focada em ativos pagadores de dividendos e geração de renda passiva.",
    icon: "💰",
  },
  {
    label: "Longo prazo",
    name: "Carteira de Longo Prazo",
    description:
      "Carteira voltada para acumulação patrimonial com foco em empresas sólidas.",
    icon: "📈",
  },
  {
    label: "Preço teto",
    name: "Carteira de Oportunidades",
    description:
      "Carteira para acompanhar ativos próximos ou abaixo do preço teto definido.",
    icon: "🎯",
  },
];

export default function PortfolioForm({
  form,
  onChange,
  onSubmit,
  onCancel,
  submitting,
  editing,
}) {
  const descriptionLength = form.description?.length || 0;

  function emitChange(name, value) {
    onChange({
      target: {
        name,
        value,
      },
    });
  }

  function applyTemplate(template) {
    emitChange("name", template.name);
    emitChange("description", template.description);
  }

  function getSubmitButtonLabel() {
    if (submitting) {
      return "Salvando...";
    }

    if (editing) {
      return "Atualizar carteira";
    }

    return "Criar carteira";
  }

  return (
    <div className="portfolio-create-card portfolio-create-card-compact">
      <div className="portfolio-create-hero compact">
        <div>
          <span className="portfolio-create-kicker">
            {editing ? "Editando carteira" : "Nova carteira"}
          </span>

          <h3>{editing ? "Editar carteira" : "Criar carteira"}</h3>

          <p>
            Organize seus ativos por objetivo e acompanhe preço médio, preço teto e alertas.
          </p>
        </div>

        <div className="portfolio-create-icon">{editing ? "✏️" : "💼"}</div>
      </div>

      {!editing && (
        <div className="portfolio-template-section compact">
          <div className="portfolio-template-header">
            <strong>Modelos rápidos</strong>
            <span>Opcional</span>
          </div>

          <div className="portfolio-template-grid compact">
            {PORTFOLIO_TEMPLATES.map((template) => (
              <button
                key={template.label}
                type="button"
                className="portfolio-template-card compact"
                onClick={() => applyTemplate(template)}
                disabled={submitting}
              >
                <span>{template.icon}</span>
                <strong>{template.label}</strong>
              </button>
            ))}
          </div>
        </div>
      )}

      <form className="portfolio-create-form compact" onSubmit={onSubmit}>
        <div className="portfolio-field-group">
          <div className="portfolio-field-label">
            <label htmlFor="portfolio-name">Nome da carteira</label>
            <span>Obrigatório</span>
          </div>

          <input
            id="portfolio-name"
            type="text"
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Ex.: Carteira de Dividendos"
            maxLength="80"
            required
          />
        </div>

        <div className="portfolio-field-group">
          <div className="portfolio-field-label">
            <label htmlFor="portfolio-description">Descrição</label>
            <span>{descriptionLength}/240</span>
          </div>

          <textarea
            id="portfolio-description"
            name="description"
            value={form.description}
            onChange={onChange}
            placeholder="Ex.: foco em dividendos, longo prazo ou oportunidades abaixo do preço teto."
            maxLength="240"
          />
        </div>

        <div className="portfolio-create-actions compact">
          <button className="primary-btn" type="submit" disabled={submitting}>
            {getSubmitButtonLabel()}
          </button>

          {editing && (
            <button
              className="secondary-btn"
              type="button"
              onClick={onCancel}
              disabled={submitting}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

PortfolioForm.propTypes = {
  form: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  submitting: PropTypes.bool,
  editing: PropTypes.bool,
};