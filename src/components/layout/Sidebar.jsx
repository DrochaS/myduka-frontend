import { NavLink } from 'react-router-dom'
import './Sidebar.css'

const NAV_BY_ROLE = {
  clerk: [
    { to: '/clerk', label: 'Stock desk' },
  ],
  admin: [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/supply-requests', label: 'Supply requests' },
    { to: '/admin/supplier-payments', label: 'Supplier payments' },
    { to: '/admin/clerks', label: 'Clerks' },
  ],
  merchant: [
    { to: '/merchant', label: 'Overview' },
    { to: '/merchant/admins', label: 'Admins' },
    { to: '/merchant/analytics', label: 'Store analytics' },
  ],
}

export default function Sidebar({ role, open, onClose }) {
  const links = NAV_BY_ROLE[role] || []

  return (
    <>
      <div
        className={`sidebar-backdrop ${open ? 'is-open' : ''}`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside className={`sidebar ${open ? 'is-open' : ''}`}>
        <div className="sidebar__brand">Inventory</div>
        <nav className="sidebar__nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to.split('/').length <= 2}
              className={({ isActive }) =>
                `sidebar__link ${isActive ? 'is-active' : ''}`
              }
              onClick={onClose}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
