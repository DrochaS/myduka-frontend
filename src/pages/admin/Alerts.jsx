import Button from '../../components/common/Button'
import './Alerts.css'

// TODO: replace with real GET /admin/alerts data
const MOCK_ALERTS = [
  { id: 1, tone: 'danger', title: 'Out of stock: Cooking Oil 2L', detail: 'Nairobi CBD · 0 units remaining', time: '10 min ago' },
  { id: 2, tone: 'warning', title: 'Low stock: Tusker Lager 500ml', detail: 'Westlands · 12/50 units', time: '38 min ago' },
  { id: 3, tone: 'danger', title: 'Payment declined', detail: 'Order #4420 · KSh 5,800 · Card declined', time: '12 min ago' },
  { id: 4, tone: 'warning', title: 'Stock discrepancy flagged', detail: 'Brookside Milk — 14 units missing', time: '44 min ago' },
]

export default function Alerts() {
  return (
    <div className="page alerts-page">
      <div className="page__header">
        <div>
          <h1>Alerts</h1>
          <p>{MOCK_ALERTS.length} active alerts</p>
        </div>
        <div className="page__actions">
          <Button variant="secondary">Mark all read</Button>
        </div>
      </div>

      <div className="panel">
        <div className="alerts-list">
          {MOCK_ALERTS.map((a) => (
            <div className="alert-row" key={a.id}>
              <span className={`alert-row__dot alert-row__dot--${a.tone}`} />
              <div className="alert-row__body">
                <p className="alert-row__title">{a.title}</p>
                <p className="alert-row__detail">{a.detail}</p>
              </div>
              <span className="alert-row__time">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}