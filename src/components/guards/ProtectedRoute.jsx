import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Loader from '../common/Loader'

const HOME_BY_ROLE = {
  clerk: '/clerk',
  admin: '/admin',
  merchant: '/merchant',
}

export function homeForRole(role) {
  const normalized = String(role || '').toLowerCase().trim()
  return HOME_BY_ROLE[normalized] || '/merchant'
}

export default function ProtectedRoute({ roles }) {
  const { isAuthenticated, role, status } = useAuth()
  const location = useLocation()
  const normalizedRole = String(role || '').toLowerCase().trim()

  if (status === 'loading' && !isAuthenticated) {
    return <Loader label="Checking session…" />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (roles?.length) {
    const allowed = roles.map((r) => String(r).toLowerCase().trim())
    if (!allowed.includes(normalizedRole)) {
      return <Navigate to="/unauthorized" replace />
    }
  }

  return <Outlet />
}
