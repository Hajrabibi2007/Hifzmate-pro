function ErrorState({ title = 'Something went wrong', children, action }) {
  return (
    <div className="ui-state ui-state--error" role="alert">
      <strong>{title}</strong>
      {children ? <p>{children}</p> : null}
      {action}
    </div>
  )
}

export default ErrorState
