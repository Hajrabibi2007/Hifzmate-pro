function SectionHeader({ title, description, action }) {
  return (
    <header className="ui-section-header">
      <div>
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {action ? <div className="ui-section-header__action">{action}</div> : null}
    </header>
  )
}

export default SectionHeader
