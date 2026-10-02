function Input({ id, label, hint, error, type = 'text', required = false, ...props }) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className="ui-form-field">
      {label ? <label htmlFor={id}>{label}{required ? ' *' : ''}</label> : null}
      {hint ? <span id={hintId} className="ui-form-field__hint">{hint}</span> : null}
      <input
        {...props}
        id={id}
        className="ui-input"
        type={type}
        required={required}
        aria-describedby={describedBy}
        aria-invalid={error ? 'true' : undefined}
      />
      {error ? <span id={errorId} className="ui-form-field__error" role="alert">{error}</span> : null}
    </div>
  )
}

export default Input
