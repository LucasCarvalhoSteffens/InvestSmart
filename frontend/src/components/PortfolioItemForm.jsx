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
    <div className="card portfolio-form-card">
      <div className="form-header">
        <div>
          <h3 className="section-title">
            {editing ? "Editar ativo da carteira" : "Adicionar ativo"}
          </h3>
          <p className="muted">
            Pesquise um ativo, informe sua posição e defina um preço teto para acompanhamento.
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
        <form className="form friendly-form" onSubmit={onSubmit}>
          <AssetAutocomplete
            value={form.ticker}
            onChange={onAssetChange}
            label="Ativo"
            placeholder="Digite o ticker. Ex: PETR4, BBAS3, VALE3"
            disabled={submitting}
          />

          <div className="form-grid two-columns">
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
              <small className="field-hint">Quantidade de ações na posição.</small>
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
              <small className="field-hint">Valor médio pago por ação.</small>
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
                placeholder="Ex.: 30.00"
              />
              <small className="field-hint">
                Opcional. Usado para alertas e análise de oportunidade.
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Observações</label>
              <textarea
                id="notes"
                name="notes"
                value={form.notes}
                onChange={onTextChange}
                placeholder="Ex.: posição de longo prazo, foco em dividendos..."
              />
            </div>
          </div>

          <div className="button-row form-actions">
            <button className="primary-btn" type="submit" disabled={submitting}>
              {submitting
                ? "Salvando..."
                : editing
                  ? "Atualizar ativo"
                  : "Adicionar à carteira"}
            </button>

            {editing && (
              <button
                className="secondary-btn"
                type="button"
                onClick={onCancel}
                disabled={submitting}
              >
                Cancelar edição
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}