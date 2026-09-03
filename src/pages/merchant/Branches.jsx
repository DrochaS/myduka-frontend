import Button from '../../components/common/Button'
import './Branches.css'

// TODO: replace with real GET /merchant/branches data
const BRANCHES = [
  { id: 1, name: 'Nairobi CBD', address: 'Moi Avenue, Nairobi', revenue: 'KSh 480K', admins: 2, status: 'active' },
  { id: 2, name: 'Westlands', address: 'Waiyaki Way, Nairobi', revenue: 'KSh 470K', admins: 1, status: 'active' },
  { id: 3, name: 'Mombasa Rd', address: 'Mombasa Rd, Nairobi', revenue: 'KSh 320K', admins: 1, status: 'active' },
  { id: 4, name: 'Kisumu Central', address: 'Oginga Odinga St, Kisumu', revenue: '—', admins: 0, status: 'pending' },
]

const STATUS_LABEL = { active: 'Active', pending: 'Pending setup' }

export default function Branches() {
  return (
    <div className="page branches-page">
      <div className="page__header">
        <div>
          <h1>Branches</h1>
          <p>{BRANCHES.length} branches · {BRANCHES.filter((b) => b.status === 'active').length} active</p>
        </div>
        <div className="page__actions">
          <Button>+ Add branch</Button>
        </div>
      </div>

      <div className="branches-grid">
        {BRANCHES.map((b) => (
          <div className="panel branch-card" key={b.id}>
            <div className="branch-card__header">
              <p className="branch-card__name">{b.name}</p>
              <span className={`status-badge status-badge--${b.status === 'active' ? 'active' : 'pending'}`}>
                {STATUS_LABEL[b.status]}
              </span>
            </div>
            <p className="branch-card__address">{b.address}</p>
            <div className="branch-card__stats">
              <div>
                <p className="branch-card__stat-value">{b.revenue}</p>
                <p className="branch-card__stat-label">Revenue (Sep)</p>
              </div>
              <div>
                <p className="branch-card__stat-value">{b.admins}</p>
                <p className="branch-card__stat-label">Admins</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}