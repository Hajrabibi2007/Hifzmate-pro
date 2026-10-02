import { useEffect, useId, useRef } from 'react'

function Modal({ open = false, title, children, onClose }) {
  const titleId = useId()
  const modalRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    const modal = modalRef.current
    const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    const focusableElements = modal?.querySelectorAll(focusableSelector)
    const firstElement = focusableElements?.[0]
    const lastElement = focusableElements?.[focusableElements.length - 1]
    firstElement?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose?.()
        return
      }

      if (event.key !== 'Tab' || !modal || !firstElement || !lastElement) return

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="ui-modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="ui-modal"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="ui-modal__header">
          <h2 id={titleId}>{title}</h2>
          <button className="ui-button ui-button--icon" type="button" aria-label="Close dialog" onClick={onClose}>
            Close
          </button>
        </header>
        <div className="ui-modal__body">{children}</div>
      </section>
    </div>
  )
}

export default Modal
