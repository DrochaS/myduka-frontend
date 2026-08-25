import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Loader from '../common/Loader'

const HOME_BY_ROLE = {
  clerk: '/clerk',
  admin: '/admin',
  merchant: '/merchant',
}

export function homeForRole(role) {
  return HOME_BY_ROLE[role] || '/login'
}

export default function ProtectedRoute({ roles }) {
  const { isAuthenticated, role, status } = useAuth()
  const location = useLocation()

  if (status === 'loading' && !isAuthenticated) {
    return <Loader label="Checking session…" />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (roles?.length && !roles.includes(role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}
