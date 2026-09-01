import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import './Auth.css'

export default function Signup() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmSent, setConfirmSent] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    // If email confirmation is required, there will be no session yet.
    if (data.session) {
      navigate('/dashboard')
    } else {
      setConfirmSent(true)
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-mark">
          Heha Laundry (UMOJA)<span>.</span>
        </div>

        {confirmSent ? (
          <div className="auth-form">
            <h2>Check your inbox</h2>
            <p className="auth-subtitle">
              We sent a confirmation link to {email}. Confirm your email, then sign in.
            </p>
            <div className="auth-switch">
              <Link to="/login">Back to sign in</Link>
            </div>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            <h2>Create your account</h2>
            <p className="auth-subtitle">- - - - - - - - - - - - - - - - - - - - - -</p>

            {error && <div className="auth-error">{error}</div>}

            <div className="field">
              <label htmlFor="fullName">Full name</label>
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
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
                autoComplete="new-password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>

            <div className="auth-switch">
              Already have an account? <Link to="/login">Sign in</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
