import { NavLink, Link } from 'react-router-dom'
import './Sidebar.css'

const NAV_BY_ROLE = {
  clerk: [
    { to: '/clerk', label: 'Stock desk', icon: 'grid' },
  ],
  admin: [
    { to: '/admin', label: 'Overview', icon: 'grid' },
    { to: '/admin/stock-entries', label: 'Stock entries', icon: 'box' },
    { to: '/admin/supply-requests', label: 'Supply requests', icon: 'clipboard' },
    { to: '/admin/supplier-payments', label: 'Supplier payments', icon: 'cart' },
    { to: '/admin/clerks', label: 'Clerk management', icon: 'users' },
    { to: '/admin/alerts', label: 'Alerts', icon: 'alert' },
  ],
  merchant: [
    { to: '/merchant', label: 'Overview', icon: 'grid' },
    { to: '/merchant/admins', label: 'Admins', icon: 'users' },
    { to: '/merchant/analytics', label: 'Store analytics', icon: 'chart' },
  ],
}

const ROLE_HOME = { merchant: '/merchant', admin: '/admin', clerk: '/clerk' }
const ROLE_LABELS = { merchant: 'Merchant', admin: 'Admin', clerk: 'Clerk' }

function Icon({ name }) {
  const paths = {
    grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
    clipboard: 'M9 4h6a1 1 0 0 1 1 1v1h1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1V5a1 1 0 0 1 1-1z',
    cart: 'M4 5h2l1.5 9.5A2 2 0 0 0 9.5 16H17a2 2 0 0 0 2-1.6L20.5 8H6.2M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM17 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
    users: 'M8 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 20c.5-3 2.5-5 5-5s4.5 2 5 5M16.5 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM14.5 20c.4-2.5 2-4.3 4-4.8',
    chart: 'M4 20V10M10 20V4M16 20v-7M4 20h16',
    box: 'M4 8l8-4 8 4-8 4-8-4zM4 8v9l8 4 8-4V8M12 12v9',
    alert: 'M12 9v4M12 17h.01M10.3 3.9L2.8 17a1.5 1.5 0 0 0 1.3 2.2h15.8a1.5 1.5 0 0 0 1.3-2.2L13.7 3.9a1.5 1.5 0 0 0-2.6 0z',
    logout: 'M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3M15 16l4-4-4-4M19 12H9',
    chevron: 'M9 6l6 6-6 6',
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[name] || ''} />
    </svg>
  )
}

export default function Sidebar({ role, open, onClose, user, onLogout }) {
  const links = NAV_BY_ROLE[role] || []
  const availableRoles = Object.keys(NAV_BY_ROLE)

  return (
    <>
      <div
        className={`sidebar-backdrop ${open ? 'is-open' : ''}`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside className={`sidebar ${open ? 'is-open' : ''}`}>
        <div className="sidebar__logo">
          <span className="sidebar__logo-mark">M</span>
          <span className="sidebar__logo-text">MyDuka</span>
        </div>

        <div className="sidebar__section">
          <p className="sidebar__section-title">Switch view</p>
          <div className="sidebar__switcher">
            {availableRoles.map((r) => (
              <Link
                key={r}
                to={ROLE_HOME[r]}
                className={`sidebar__switcher-item ${r === role ? 'is-active' : ''}`}
              >
                {ROLE_LABELS[r]}
                {r === role && <Icon name="chevron" />}
              </Link>
            ))}
          </div>
        </div>

        <div className="sidebar__section">
          <p className="sidebar__section-title">Navigation</p>
          <nav className="sidebar__nav">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to.split('/').length <= 2}
                className={({ isActive }) => `sidebar__link ${isActive ? 'is-active' : ''}`}
                onClick={onClose}
              >
                <Icon name={link.icon} />
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {user && (
          <div className="sidebar__footer">
            <div className="sidebar__avatar">{user.name?.[0] || '?'}</div>
            <div className="sidebar__user">
              <span className="sidebar__user-name">{user.name}</span>
              <span className="sidebar__user-role">{ROLE_LABELS[role]}</span>
            </div>
            {onLogout && (
              <button className="sidebar__logout" onClick={onLogout} aria-label="Log out">
                <Icon name="logout" />
              </button>
            )}
          </div>
        )}
      </aside>
    </>
  )
}