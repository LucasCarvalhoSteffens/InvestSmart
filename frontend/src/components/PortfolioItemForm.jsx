import AssetAutocomplete from "./AssetAutocomplete";

export default function PortfolioItemForm({
  portfolioSelected,
  form,
  onTextChange,
  onAssetChange,
  onSubmit,
  onCancel,
  submitting,
  editing,
}) {
  return (
    <div className="card portfolio-form-card portfolio-item-form-compact">
      <div className="form-header compact">
        <div>
          <span className="portfolio-item-form-kicker">
            {editing ? "Editando ativo" : "Novo ativo"}
          </span>

          <h3 className="section-title">
            {editing ? "Editar ativo" : "Adicionar ativo"}
          </h3>

          <p className="muted">
            Informe o ativo, quantidade, preço médio e preço teto.
          </p>
        </div>

        {editing && <span className="status-pill status-idle">Edição</span>}
      </div>

      {!portfolioSelected ? (
        <div className="empty-state compact">
          <strong>Nenhuma carteira selecionada</strong>
          <span>Selecione ou crie uma carteira antes de adicionar ativos.</span>
        </div>
      ) : (
        <form className="form friendly-form compact" onSubmit={onSubmit}>
          <AssetAutocomplete
            value={form.ticker}
            onChange={onAssetChange}
            label="Ativo"
            placeholder="Digite o ticker. Ex: PETR4, BBAS3, VALE3"
            disabled={submitting}
          />

          <div className="form-grid portfolio-item-grid-compact">
            <div className="form-group">
              <label htmlFor="quantity">Quantidade</label>
              <input
                id="quantity"
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={onTextChange}
                min="1"
                placeholder="Ex.: 10"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="average_price">Preço médio</label>
              <input
                id="average_price"
                type="number"
                name="average_price"
                value={form.average_price}
                onChange={onTextChange}
                min="0.01"
                step="0.01"
                placeholder="Ex.: 24.50"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="target_price">Preço teto</label>
              <input
                id="target_price"
                type="number"
                name="target_price"
                value={form.target_price}
                onChange={onTextChange}
                min="0.01"
                step="0.01"
                placeholder="Opcional"
              />
            </div>

            <div className="form-group">
              <label htmlFor="notes">Observações</label>
              <input
                id="notes"
                type="text"
                name="notes"
                value={form.notes}
                onChange={onTextChange}
                placeholder="Ex.: longo prazo, dividendos..."
              />
            </div>
          </div>

          <div className="button-row form-actions compact">
            <button className="primary-btn" type="submit" disabled={submitting}>
              {submitting
                ? "Salvando..."
                : editing
                  ? "Atualizar ativo"
                  : "Adicionar ativo"}
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
      )}
    </div>
  );
}