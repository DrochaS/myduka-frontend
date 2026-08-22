import { useEffect } from 'react'
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

export default function AdminDashboard() {
  const dispatch = useDispatch()
  const { clerkPerformance, status, error } = useSelector((state) => state.analytics)
  const trend = clerkPerformance?.trend || FALLBACK.trend
  const byClerk = clerkPerformance?.byClerk || FALLBACK.byClerk

  useEffect(() => {
    dispatch(fetchClerkPerformance())
  }, [dispatch])

  return (
    <div className="page admin-page">
      <div className="page__header">
        <div>
          <h1>Admin dashboard</h1>
          <p>Track clerk performance and jump into store operations.</p>
        </div>
        <div className="page__actions">
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

      {status === 'loading' && !clerkPerformance ? (
        <Loader label="Loading clerk performance…" />
      ) : (
        <div className="chart-grid">
          <div className="panel chart-panel">
            <h2 className="panel__title">Weekly activity</h2>
            <LineChart
              labels={trend.labels}
              values={trend.values}
              label={trend.label || 'Entries'}
            />
          </div>
          <div className="panel chart-panel">
            <h2 className="panel__title">Clerk comparison</h2>
            <BarChart
              labels={byClerk.labels}
              values={byClerk.values}
              label={byClerk.label || 'Actions'}
            />
          </div>
        </div>
      )}
    </div>
  )
}
