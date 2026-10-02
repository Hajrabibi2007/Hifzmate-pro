function ChartContainer({ title, description, children, empty = false }) {
  return (
    <section className="ui-chart-container" aria-label={title}>
      <header className="ui-chart-container__header">
        <h3>{title}</h3>
        {description ? <p>{description}</p> : null}
      </header>
      <div className="ui-chart-container__body">
        {empty ? <p className="ui-chart-container__empty">Not enough data to display this chart.</p> : children}
      </div>
    </section>
  )
}

export default ChartContainer
