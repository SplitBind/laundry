import { useState } from 'react'
import Topbar from '../components/Topbar'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'
import './Profile.css'

export default function Profile() {
  const { user } = useAuth()
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '')
  const [newPassword, setNewPassword] = useState('')
  const [savingName, setSavingName] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [nameMessage, setNameMessage] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')

  async function handleNameSave(e) {
    e.preventDefault()
    setSavingName(true)
    setNameMessage('')
    const { error } = await supabase.auth.updateUser({ data: { full_name: fullName } })
    setSavingName(false)
    setNameMessage(error ? error.message : 'Saved.')
  }

  async function handlePasswordSave(e) {
    e.preventDefault()
    if (newPassword.length < 6) {
      setPasswordMessage('Password must be at least 6 characters.')
      return
    }
    setSavingPassword(true)
    setPasswordMessage('')
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setSavingPassword(false)
    setPasswordMessage(error ? error.message : 'Password updated.')
    if (!error) setNewPassword('')
  }

  const initial = (fullName || user?.email || '?')[0].toUpperCase()

  return (
    <div className="app-shell">
      <Topbar />
      <main className="profile">
        <header className="profile-header">
          <div className="profile-avatar-large">{initial}</div>
          <div>
            <h1>{fullName || 'Your profile'}</h1>
            <p className="profile-email">{user?.email}</p>
          </div>
        </header>

        <section className="profile-section">
          <h2>Display name</h2>
          <form onSubmit={handleNameSave} className="profile-form">
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name"
            />
            <button className="btn-primary" type="submit" disabled={savingName}>
              {savingName ? 'Saving…' : 'Save'}
            </button>
          </form>
          {nameMessage && <p className="profile-message">{nameMessage}</p>}
        </section>

        <section className="profile-section">
          <h2>Change password</h2>
          <form onSubmit={handlePasswordSave} className="profile-form">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              autoComplete="new-password"
            />
            <button className="btn-primary" type="submit" disabled={savingPassword}>
              {savingPassword ? 'Updating…' : 'Update'}
            </button>
          </form>
          {passwordMessage && <p className="profile-message">{passwordMessage}</p>}
        </section>

        <section className="profile-section">
          <h2>Account</h2>
          <p className="profile-meta">
            Member since{' '}
            {new Date(user?.created_at).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </section>
      </main>
    </div>
  )
}
