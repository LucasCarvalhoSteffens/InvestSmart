import AssetSearchInput from "./AssetSearchInput";

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
    <div className="form-card">
      <h3>{editing ? "Editar item da carteira" : "Adicionar ativo"}</h3>

      {!portfolioSelected ? (
        <p>Selecione uma carteira para cadastrar ativos.</p>
      ) : (
        <form onSubmit={onSubmit}>
          <AssetSearchInput
          value={form.ticker}
          onChange={onAssetChange}
          disabled={submitting}
          />

          <label>
            Quantidade
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={onTextChange}
              min="1"
              required
            />
          </label>

          <label>
            Preço médio
            <input
              type="number"
              name="average_price"
              value={form.average_price}
              onChange={onTextChange}
              min="0.01"
              step="0.01"
              required
            />
          </label>

          <label>
            Preço teto
            <input
              type="number"
              name="target_price"
              value={form.target_price}
              onChange={onTextChange}
              min="0.01"
              step="0.01"
            />
          </label>

          <label>
            Observações
            <textarea
              name="notes"
              value={form.notes}
              onChange={onTextChange}
            />
          </label>

          <div className="button-row">
            <button className="primary-btn full-width" type="submit" disabled={submitting}>
              {submitting ? "Salvando..." : editing ? "Atualizar item" : "Adicionar item"}
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