function Skeleton({ width = '100%', height = '1rem', className = '' }) {
  return (
    <span
      className={`ui-skeleton ${className}`.trim()}
      aria-hidden="true"
      style={{ width, height }}
    />
  )
}

export default Skeleton
