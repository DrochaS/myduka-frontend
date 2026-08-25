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
