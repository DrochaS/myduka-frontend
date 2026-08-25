import { Link } from 'react-router-dom'
import Button from '../../components/common/Button'
import '../../components/layout/PageWrapper.css'

export default function NotFound() {
  return (
    <div className="auth-page">
      <div className="auth-card form-grid">
        <h1>Page not found</h1>
        <p>The page you requested does not exist in MyDuka.</p>
        <Link to="/">
          <Button>Go home</Button>
        </Link>
      </div>
    </div>
  )
}
