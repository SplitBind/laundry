import { NavLink } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import './Sidebar.css'

export default function Sidebar() {
  const { signOut, user } = useAuth()
  const initial = (user?.user_metadata?.full_name || user?.email || '?')[0].toUpperCase()

  return (
    <aside className="sidebar">
      <div className="sidebar-mark">
        Ledger<span>.</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
          Expenses
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
          Profile
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initial}</div>
          <span>{user?.user_metadata?.full_name || user?.email}</span>
        </div>
        <button className="sidebar-signout" onClick={signOut}>
          Sign out
        </button>
      </div>
    </aside>
  )
}
