function FormField({ id, label, hint, error, required = false, children }) {
  return (
    <div className="ui-form-field">
      <label htmlFor={id}>{label}{required ? ' *' : ''}</label>
      {hint ? <span className="ui-form-field__hint">{hint}</span> : null}
      {children}
      {error ? <span className="ui-form-field__error" role="alert">{error}</span> : null}
    </div>
  )
}

export default FormField
