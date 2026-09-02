import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Loader from '../../components/common/Loader'
import Button from '../../components/common/Button'
import { LineChart, BarChart } from '../../components/charts'
import { fetchClerkPerformance } from '../../redux/slices/analyticsSlice'
import './AdminDashboard.css'

const FALLBACK = {
  trend: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [12, 18, 15, 22, 19, 25, 21],
    label: 'Entries logged',
  },
  byClerk: {
    labels: ['Amina', 'Brian', 'Cate', 'David'],
    values: [42, 35, 28, 31],
    label: 'Stock actions',
  },
}

// TODO: replace all mock data below with a real /admin/overview endpoint.
const BRANCH = 'Nairobi CBD Branch'

const NOTIFICATIONS = [
  { id: 1, tone: 'danger', title: 'Out of stock: Cooking Oil 2L', time: '10 min ago' },
  { id: 2, tone: 'warning', title: 'Low stock: Tusker Lager 500ml', time: '38 min ago' },
  { id: 3, tone: 'danger', title: 'Payment declined · Order #4420', time: '12 min ago' },
]

const STATS = [
  { key: 'sales', label: 'Sales today', value: 'KSh 84,200', hint: '+9% vs yesterday', tone: 'success', icon: 'cart' },
  { key: 'low-stock', label: 'Low stock items', value: '3', hint: 'Action required', tone: 'danger', icon: 'trendDown' },
  { key: 'pending', label: 'Pending requests', value: '5', hint: '2 urgent', tone: 'warning', icon: 'clock' },
  { key: 'out-of-stock', label: 'Out of stock', value: '2', hint: 'Reorder needed', tone: 'danger', icon: 'box' },
]

const LOW_STOCK = [
  { name: 'Tusker Lager 500ml', branch: 'Westlands', have: 12, need: 50 },
  { name: 'Brookside Milk 500ml', branch: 'Mombasa Rd', have: 8, need: 30 },
  { name: 'Unga Pembe 2kg', branch: 'Nairobi CBD', have: 21, need: 40 },
]

const ACTIVITY = [
  { id: 1, tone: 'success', title: 'Order #4421 completed', detail: 'KSh 3,200 · Paid via M-Pesa', by: 'James K.', time: '5 min ago' },
  { id: 2, tone: 'danger', title: 'Payment declined', detail: 'KSh 5,800 · Card declined · Order #4420', by: 'System', time: '12 min ago' },
  { id: 3, tone: 'warning', title: 'Supply request submitted', detail: 'Unga Pembe 2kg × 100 units', by: 'Grace A.', time: '28 min ago' },
  { id: 4, tone: 'danger', title: 'Stock discrepancy flagged', detail: 'Brookside Milk — 14 units missing', by: 'System', time: '44 min ago' },
  { id: 5, tone: 'success', title: 'Order #4419 completed', detail: 'KSh 1,450 · Cash on delivery', by: 'James K.', time: '1 hr ago' },
]

const QUICK_ACTIONS = [
  { key: 'stock', title: 'Stock entries', hint: '14 items logged today', cta: 'Add entry', to: '/admin/stock-entries' },
  { key: 'supply', title: 'Supply requests', hint: '5 awaiting approval', cta: 'New request', to: '/admin/supply-requests' },
  { key: 'clerks', title: 'Clerk management', hint: '6 active clerks', cta: 'Add clerk', to: '/admin/clerks' },
]

function StatIcon({ name }) {
  const paths = {
    cart: 'M4 5h2l1.5 9.5A2 2 0 0 0 9.5 16H17a2 2 0 0 0 2-1.6L20.5 8H6.2M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM17 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
    trendDown: 'M4 6l6 6 4-4 6 8M14 16h6v-6',
    clock: 'M12 8v4l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z',
    box: 'M4 8l8-4 8 4-8 4-8-4zM4 8v9l8 4 8-4V8M12 12v9',
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[name] || ''} />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

function NotificationsBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState(NOTIFICATIONS)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="notif" ref={ref}>
      <button
        className="notif-bell"
        aria-label={`${notifications.length} unread notifications`}
        onClick={() => setOpen((o) => !o)}
      >
        <BellIcon />
        {notifications.length > 0 && <span className="notif-bell__badge">{notifications.length}</span>}
      </button>

      {open && (
        <div className="notif-panel">
          <div className="notif-panel__header">
            <p className="notif-panel__title">Notifications</p>
            {notifications.length > 0 && (
              <button className="notif-panel__clear" onClick={() => setNotifications([])}>
                Mark all read
              </button>
            )}
          </div>
          {notifications.length === 0 ? (
            <p className="notif-panel__empty">You're all caught up.</p>
          ) : (
            <div className="notif-panel__list">
              {notifications.map((n) => (
                <div className="notif-item" key={n.id}>
                  <span className={`notif-item__dot notif-item__dot--${n.tone}`} />
                  <div>
                    <p className="notif-item__title">{n.title}</p>
                    <p className="notif-item__time">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function AdminDashboard() {
  const dispatch = useDispatch()
  const { clerkPerformance, status, error } = useSelector((state) => state.analytics)
  const trend = clerkPerformance?.trend || FALLBACK.trend
  const byClerk = clerkPerformance?.byClerk || FALLBACK.byClerk

  useEffect(() => {
    dispatch(fetchClerkPerformance())
  }, [dispatch])

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'short', year: 'numeric',
  })

  return (
    <div className="page admin-page">
      <div className="page__header admin-page__header">
        <div>
          <h1>Admin dashboard</h1>
          <p>{BRANCH} · {today}</p>
        </div>
        <div className="page__actions">
          <NotificationsBell />
          <Link to="/admin/supply-requests">
            <Button variant="secondary">Supply requests</Button>
          </Link>
          <Link to="/admin/clerks">
            <Button>Manage clerks</Button>
          </Link>
        </div>
      </div>

      {error ? (
        <div className="error-banner">
          {error} Showing sample charts until the API responds.
        </div>
      ) : null}

      <div className="stat-grid">
        {STATS.map((s) => (
          <div className="panel stat-card" key={s.key}>
            <div className={`stat-card__icon stat-card__icon--${s.tone}`}>
              <StatIcon name={s.icon} />
            </div>
            <p className="stat-card__value">{s.value}</p>
            <p className="stat-card__label">{s.label}</p>
            <p className={`stat-card__hint stat-card__hint--${s.tone}`}>{s.hint}</p>
          </div>
        ))}
      </div>

      <div className="panel">
        <div className="panel__header">
          <h2 className="panel__title">Low stock alerts</h2>
          <Link to="/admin/supply-requests" className="panel__link">View all</Link>
        </div>
        <div className="low-stock-list">
          {LOW_STOCK.map((item) => {
            const pct = Math.min(100, Math.round((item.have / item.need) * 100))
            const tone = pct < 30 ? 'danger' : 'warning'
            return (
              <div className="low-stock-row" key={item.name}>
                <div className="low-stock-row__info">
                  <p className="low-stock-row__name">{item.name}</p>
                  <p className="low-stock-row__branch">{item.branch}</p>
                </div>
                <div className="low-stock-row__progress">
                  <div className="progress-track">
                    <div className={`progress-fill progress-fill--${tone}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className={`low-stock-row__count low-stock-row__count--${tone}`}>
                    {item.have}/{item.need} units
                  </span>
                </div>
                <Button variant="secondary" className="low-stock-row__cta">Reorder</Button>
              </div>
            )
          })}
        </div>
      </div>

      <div className="panel">
        <h2 className="panel__title">Live activity feed</h2>
        <div className="activity-list">
          {ACTIVITY.map((a) => (
            <div className="activity-row" key={a.id}>
              <span className={`activity-row__dot activity-row__dot--${a.tone}`} />
              <div className="activity-row__body">
                <p className="activity-row__title">{a.title}</p>
                <p className="activity-row__detail">{a.detail}</p>
                <p className="activity-row__by">by {a.by}</p>
              </div>
              <span className="activity-row__time">{a.time}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="quick-action-grid">
        {QUICK_ACTIONS.map((qa) => (
          <div className="panel quick-action-card" key={qa.key}>
            <p className="quick-action-card__title">{qa.title}</p>
            <p className="quick-action-card__hint">{qa.hint}</p>
            <Link to={qa.to}>
              <Button variant="secondary" className="quick-action-card__cta">+ {qa.cta}</Button>
            </Link>
          </div>
        ))}
      </div>

      {status === 'loading' && !clerkPerformance ? (
        <Loader label="Loading clerk performance…" />
      ) : (
        <div className="chart-grid">
          <div className="panel chart-panel">
            <h2 className="panel__title">Weekly activity</h2>
            <LineChart labels={trend.labels} values={trend.values} label={trend.label || 'Entries'} />
          </div>
          <div className="panel chart-panel">
            <h2 className="panel__title">Clerk comparison</h2>
            <BarChart labels={byClerk.labels} values={byClerk.values} label={byClerk.label || 'Actions'} />
          </div>
        </div>
      )}
    </div>
  )
}