import PropTypes from "prop-types";

export default function AlertForm({
    form,
    onChange,
    onSubmit,
    onCancel,
    submitting,
  }) {
    return (
      <form className="stack" onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor={`alert-type-${form.formKey}`}>Tipo de alerta</label>
          <select
            id={`alert-type-${form.formKey}`}
            name="alert_type"
            value={form.alert_type}
            onChange={onChange}
          >
            <option value="below_or_equal">Preço menor ou igual</option>
            <option value="above_or_equal">Preço maior ou igual</option>
          </select>
        </div>
  
        <div className="form-group">
          <label htmlFor={`alert-threshold-${form.formKey}`}>Preço de disparo</label>
          <input
            id={`alert-threshold-${form.formKey}`}
            name="threshold_price"
            type="number"
            step="0.01"
            min="0"
            placeholder="Ex.: 28.50"
            value={form.threshold_price}
            onChange={onChange}
            required
          />
        </div>
  
        <div className="button-row">
          <button className="primary-btn small-btn" type="submit" disabled={submitting}>
            {submitting ? "Salvando..." : "Criar alerta"}
          </button>
  
          <button
            className="secondary-btn small-btn"
            type="button"
            onClick={onCancel}
          >
            Limpar
          </button>
        </div>
      </form>
    );
  }

  AlertForm.propTypes = {
    form: PropTypes.shape({
      formKey: PropTypes.string,
      alert_type: PropTypes.string,
      threshold_price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    submitting: PropTypes.bool,
  };