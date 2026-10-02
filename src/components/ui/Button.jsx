function Button({ children, variant = 'primary', type = 'button', disabled = false, loading = false, ariaLabel, className = '', onClick }) {
  return (
    <button
      className={`ui-button ui-button--${variant} ${className}`.trim()}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}

export default Button
