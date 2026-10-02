function EmptyState({ title = 'Nothing here yet', children, action }) {
  return (
    <div className="ui-state ui-state--empty" role="status">
      <strong>{title}</strong>
      {children ? <p>{children}</p> : null}
      {action}
    </div>
  )
}

export default EmptyState
