import { useRef, useState } from 'react'
import './ExpenseModal.css'

function todayISO() {
  const d = new Date()
  const offset = d.getTimezoneOffset()
  const local = new Date(d.getTime() - offset * 60 * 1000)
  return local.toISOString().slice(0, 10)
}

export default function ExpenseModal({ onClose, onSave }) {
  const [date, setDate] = useState(todayISO())
  const [item, setItem] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [price, setPrice] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const dateInputRef = useRef(null)

  function openDatePicker() {
    const el = dateInputRef.current
    if (el?.showPicker) {
      el.showPicker()
    } else {
      el?.focus()
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!item.trim()) {
      setError('Enter what this expense was for.')
      return
    }
    if (!quantity || Number(quantity) <= 0) {
      setError('Quantity must be at least 1.')
      return
    }
    if (price === '' || Number(price) < 0) {
      setError('Enter a valid price.')
      return
    }

    setSaving(true)
    try {
      await onSave({
        date,
        item: item.trim(),
        quantity: Number(quantity),
        price: Number(price),
      })
    } catch (err) {
      setError(err.message || 'Could not save this expense.')
      setSaving(false)
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-header">
          <h2 id="modal-title">Add expense</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="modal-error">{error}</div>}

          <div className="field">
            <label htmlFor="exp-date">Date</label>
            <div className="date-field">
              <input
                id="exp-date"
                ref={dateInputRef}
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
              <button
                type="button"
                className="date-icon-btn"
                onClick={openDatePicker}
                aria-label="Choose date from calendar"
              >
                <CalendarIcon />
              </button>
            </div>
          </div>

          <div className="field">
            <label htmlFor="exp-item">Item</label>
            <input
              id="exp-item"
              type="text"
              placeholder="e.g Detergents, water bill e.t.c"
              value={item}
              onChange={(e) => setItem(e.target.value)}
              required
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="exp-qty">Quantity</label>
              <input
                id="exp-qty"
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="exp-price">Price</label>
              <input
                id="exp-price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="5" width="17" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 9.5H20.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 3V6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M16 3V6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
