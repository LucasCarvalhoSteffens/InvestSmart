export default function PortfolioForm({
    form,
    onChange,
    onSubmit,
    onCancel,
    submitting,
    editing,
  }) {
    return (
      <div className="card">
        <h3 className="section-title">
          {editing ? "Editar carteira" : "Nova carteira"}
        </h3>
  
        <form className="form" onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="portfolio-name">Nome</label>
            <input
              id="portfolio-name"
              name="name"
              type="text"
              placeholder="Ex.: Carteira Dividendos"
              value={form.name}
              onChange={onChange}
              required
            />
          </div>
  
          <div className="form-group">
            <label htmlFor="portfolio-description">Descrição</label>
            <textarea
              id="portfolio-description"
              name="description"
              rows="4"
              placeholder="Descreva o objetivo da carteira"
              value={form.description}
              onChange={onChange}
            />
          </div>
  
          <div className="button-row">
            <button className="primary-btn full-width" type="submit" disabled={submitting}>
              {submitting
                ? "Salvando..."
                : editing
                  ? "Atualizar carteira"
                  : "Criar carteira"}
            </button>
  
            {editing && (
              <button
                className="secondary-btn full-width"
                type="button"
                onClick={onCancel}
              >
                Cancelar edição
              </button>
            )}
          </div>
        </form>
      </div>
    );
  }