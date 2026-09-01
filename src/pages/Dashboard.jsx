import { useEffect, useMemo, useState } from 'react'
import Sidebar from '../components/Sidebar'
import ExpenseModal from '../components/ExpenseModal'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'
import './Dashboard.css'

function formatDate(iso) {
  const [y, m, d] = iso.split('-')
  const dt = new Date(Number(y), Number(m) - 1, Number(d))
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatMoney(n) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}

export default function Dashboard() {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    loadExpenses()
  }, [])

  async function loadExpenses() {
    setLoading(true)
    setError('')
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setExpenses(data)
    }
    setLoading(false)
  }

  async function handleSave(expense) {
    const { data, error } = await supabase
      .from('expenses')
      .insert({
        user_id: user.id,
        date: expense.date,
        item: expense.item,
        quantity: expense.quantity,
        price: expense.price,
      })
      .select()
      .single()

    if (error) throw error

    setExpenses((prev) =>
      [...prev, data].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    )
    setModalOpen(false)
  }

  async function handleDelete(id) {
    const prev = expenses
    setExpenses((e) => e.filter((x) => x.id !== id))
    const { error } = await supabase.from('expenses').delete().eq('id', id)
    if (error) {
      setExpenses(prev)
      setError(error.message)
    }
  }

  const total = useMemo(
    () => expenses.reduce((sum, e) => sum + Number(e.price) * Number(e.quantity), 0),
    [expenses]
  )

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="dashboard">
        <header className="dashboard-header">
          <div>
            <h1>Expenses</h1>
            <p className="dashboard-subtitle">A running record of what's gone out.</p>
          </div>
          <div className="dashboard-total">
            <span>Total tracked</span>
            <strong>{formatMoney(total)}</strong>
          </div>
        </header>

        {error && <div className="dashboard-error">{error}</div>}

        <div className="ledger">
          <div className="ledger-row ledger-head">
            <span>Date</span>
            <span>Item</span>
            <span className="num">Quantity</span>
            <span className="num">Price</span>
            <span className="num">Amount</span>
            <span></span>
          </div>

          {loading ? (
            <div className="ledger-empty">Loading your ledger…</div>
          ) : expenses.length === 0 ? (
            <div className="ledger-empty">
              Nothing recorded yet. Add your first expense to start the ledger.
            </div>
          ) : (
            expenses.map((e) => (
              <div className="ledger-row" key={e.id}>
                <span className="ledger-date">{formatDate(e.date)}</span>
                <span className="ledger-item">{e.item}</span>
                <span className="num">{e.quantity}</span>
                <span className="num">{formatMoney(Number(e.price))}</span>
                <span className="num ledger-amount">{formatMoney(Number(e.price) * Number(e.quantity))}</span>
                <span className="ledger-row-actions">
                  <button
                    className="row-delete"
                    onClick={() => handleDelete(e.id)}
                    aria-label={`Delete ${e.item}`}
                  >
                    Remove
                  </button>
                </span>
              </div>
            ))
          )}
        </div>

        <button className="fab" onClick={() => setModalOpen(true)} aria-label="Add expense">
          +
        </button>

        {modalOpen && <ExpenseModal onClose={() => setModalOpen(false)} onSave={handleSave} />}
      </main>
    </div>
  )
}
