function Alert({ children, tone = 'info', title }) {
  return (
    <div
      className={`ui-alert ui-alert--${tone}`}
      role={tone === 'error' ? 'alert' : 'status'}
      aria-live={tone === 'error' ? 'assertive' : 'polite'}
    >
      {title ? <strong>{title}</strong> : null}
      <span>{children}</span>
    </div>
  )
}

export default Alert
