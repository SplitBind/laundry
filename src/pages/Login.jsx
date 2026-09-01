import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import './Auth.css'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    navigate('/dashboard')
  }

  return (
    <div className="auth-screen">
      <div className="auth-brand">
        <div className="auth-mark">
          Ledger<span>.</span>
        </div>
        <div className="auth-headline">
          <h1>Every dollar, entered in its place.</h1>
          <p>A quiet, orderly record of what you spend — nothing more, nothing less.</p>
        </div>
        <div className="auth-figure">"The purpose of a budget is to tell your money where to go."</div>
      </div>
      <div className="auth-form-side">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Welcome back</h2>
          <p className="auth-subtitle">Sign in to see your ledger.</p>

          {error && <div className="auth-error">{error}</div>}

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>

          <div className="auth-switch">
            New here? <Link to="/signup">Create an account</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
