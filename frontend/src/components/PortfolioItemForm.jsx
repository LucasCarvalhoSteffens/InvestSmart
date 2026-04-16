import AssetSelect from "./AssetSelect";

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
    <div className="card">
      <h3 className="section-title">
        {editing ? "Editar item da carteira" : "Adicionar ativo"}
      </h3>

      {!portfolioSelected ? (
        <p className="muted">
          Selecione uma carteira para cadastrar ativos.
        </p>
      ) : (
        <form className="form" onSubmit={onSubmit}>
          <AssetSelect value={form.asset} onChange={onAssetChange} />

          <div className="form-group">
            <label htmlFor="quantity">Quantidade</label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              placeholder="Ex.: 10"
              value={form.quantity}
              onChange={onTextChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="average_price">Preço médio</label>
            <input
              id="average_price"
              name="average_price"
              type="number"
              step="0.01"
              min="0"
              placeholder="Ex.: 25.40"
              value={form.average_price}
              onChange={onTextChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="target_price">Preço teto</label>
            <input
              id="target_price"
              name="target_price"
              type="number"
              step="0.01"
              min="0"
              placeholder="Ex.: 30.00"
              value={form.target_price}
              onChange={onTextChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Observações</label>
            <textarea
              id="notes"
              name="notes"
              rows="4"
              placeholder="Anotações sobre a posição"
              value={form.notes}
              onChange={onTextChange}
            />
          </div>

          <div className="button-row">
            <button className="primary-btn full-width" type="submit" disabled={submitting}>
              {submitting
                ? "Salvando..."
                : editing
                  ? "Atualizar item"
                  : "Adicionar item"}
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
      )}
    </div>
  );
}