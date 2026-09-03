import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../../redux/slices/authSlice'
import { useAuth } from '../../hooks/useAuth'
import Button from '../common/Button'
import './Navbar.css'

export default function Navbar({ onMenuToggle }) {
  const { user } = useAuth()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <header className="navbar">
      <div className="navbar__left">
        <button type="button" className="navbar__menu" onClick={onMenuToggle} aria-label="Toggle menu">
          ☰
        </button>
        <Link to="/" className="navbar__brand">
          MyDuka
        </Link>
      </div>
      <div className="navbar__right">
        <Link
          to="/shop"
          className="navbar__storefront-link"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.4rem 0.75rem',
            background: 'var(--bg, #f8fafc)',
            border: '1px solid var(--border, #e2e8f0)',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--text, #1e293b)',
            textDecoration: 'none',
          }}
        >
          <span>🛍️</span>
          <span>Storefront</span>
        </Link>
        <div className="navbar__user">
          <strong>{user?.name || user?.email || 'User'}</strong>
          <span>{user?.role}</span>
        </div>
        <Button variant="secondary" onClick={handleLogout}>
          Log out
        </Button>
      </div>
    </header>
  )
}
