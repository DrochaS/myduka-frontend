import { Link } from 'react-router-dom'
import Button from '../../components/common/Button'
import { useAuth } from '../../hooks/useAuth'
import { homeForRole } from '../../components/guards/ProtectedRoute'
import '../../components/layout/PageWrapper.css'

export default function Unauthorized() {
  const { role, isAuthenticated } = useAuth()
  const target = isAuthenticated ? homeForRole(role) : '/login'

  return (
    <div className="auth-page">
      <div className="auth-card form-grid">
        <h1>Unauthorized</h1>
        <p>You do not have permission to view this page.</p>
        <Link to={target}>
          <Button>Back to your dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
