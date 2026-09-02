import { Link } from 'react-router-dom'
import Button from '../../components/common/Button'
import './MerchantDashboard.css'

export default function MerchantDashboard() {
  return (
    <div className="page merchant-page">
      <div className="page__header">
        <div>
          <h1>Merchant overview</h1>
          <p>Manage admins and review store-level analytics.</p>
        </div>
        <div className="page__actions">
          <Link to="/merchant/admins">
            <Button variant="secondary">Admin management</Button>
          </Link>
          <Link to="/merchant/analytics">
            <Button>Store analytics</Button>
          </Link>
        </div>
      </div>
      <div className="panel">
        <p>
          Use admin management to invite or deactivate store admins, then open
          analytics for store-by-store and product performance charts.
        </p>
      </div>
    </div>
  )
}
