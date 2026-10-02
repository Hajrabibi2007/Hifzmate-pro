function LoadingState({ label = 'Loading' }) {
  return <div className="ui-state ui-state--loading" role="status" aria-live="polite" aria-busy="true">{label}...</div>
}

export default LoadingState
