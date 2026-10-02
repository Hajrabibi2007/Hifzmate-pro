function ProgressBar({ value = 0, label, max = 100 }) {
  const safeValue = Math.min(Math.max(value, 0), max)
  const percentage = max > 0 ? (safeValue / max) * 100 : 0
  const accessibleLabel = label || 'Progress'

  return (
    <div className="ui-progress">
      <div
        className="ui-progress__track"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax={max}
        aria-valuenow={safeValue}
        aria-label={accessibleLabel}
      >
        <span className="ui-progress__value" style={{ width: `${percentage}%` }} />
      </div>
      <span className="ui-progress__label">{label ? `${label}: ` : ''}{safeValue} of {max}</span>
    </div>
  )
}

export default ProgressBar
