import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import './Topbar.css'

export default function Topbar() {
  const { user, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()

  const initial = (user?.user_metadata?.full_name || user?.email || '?')[0].toUpperCase()

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function handleSignOut() {
    setOpen(false)
    await signOut()
    navigate('/login')
  }

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link to="/dashboard" className="topbar-mark">
          HEHA LAUNDRY EXPENSE TRACKER<span>.</span>
        </Link>

        <div className="topbar-profile" ref={menuRef}>
          <button
            className="profile-trigger"
            onClick={() => setOpen((o) => !o)}
            aria-haspopup="true"
            aria-expanded={open}
          >
            {initial}
          </button>

          {open && (
            <div className="profile-menu" role="menu">
              <div className="profile-menu-header">
                <div className="profile-menu-name">{user?.user_metadata?.full_name || 'Account'}</div>
                <div className="profile-menu-email">{user?.email}</div>
              </div>
              <Link to="/profile" className="profile-menu-item" role="menuitem" onClick={() => setOpen(false)}>
                Profile
              </Link>
              <button className="profile-menu-item profile-menu-signout" role="menuitem" onClick={handleSignOut}>
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
