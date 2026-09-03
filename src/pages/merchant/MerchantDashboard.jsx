import { useEffect, useState } from 'react'
import { Line, Bar } from 'react-chartjs-2'
import { mergeChartOptions } from '../../components/charts/charts.js'
import axiosInstance from '../../utils/axiosInstance'
import Button from '../../components/common/Button'
import InviteAdminModal from './InviteAdminModal'
import './MerchantDashboard.css'

// TODO: replace remaining mock data below (STATS, revenue/category charts, top products,
// supplier payments) with real /merchant endpoints once they exist.
const RANGES = ['7D', '30D', '90D', '1Y']

const STATS = [
  { key: 'revenue', label: 'Total Revenue (Sep)', value: 'KSh 1.4M', hint: '+14% vs last month', icon: 'dollar' },
  { key: 'branches', label: 'Active Branches', value: '3', hint: '1 pending setup', icon: 'store' },
  { key: 'admins', label: 'Total Admins', value: '4', hint: '1 invite pending', icon: 'users' },
  { key: 'skus', label: 'SKUs Tracked', value: '1,240', hint: '+32 this month', icon: 'box' },
]

const REVENUE_LABELS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
const REVENUE_SERIES = [
  { key: 'nairobi', name: 'Nairobi CBD', color: '#0f766e', dash: [], values: [300, 420, 430, 350, 480, 600] },
  { key: 'westlands', name: 'Westlands', color: '#5eead4', dash: [6, 4], values: [280, 350, 360, 300, 380, 470] },
  { key: 'mombasa', name: 'Mombasa Rd', color: '#94a3b8', dash: [2, 3], values: [300, 310, 305, 295, 310, 320] },
]

const CATEGORY_LABELS = ['Beverages', 'Grains & Flour', 'Dairy', 'Personal Care', 'Snacks', 'Household']
const CATEGORY_VALUES = [150000, 115000, 95000, 78000, 60000, 52000]

const TOP_PRODUCTS = [
  { rank: 1, name: 'Tusker Lager 500ml', revenue: 'KSh 149K', units: '1240 units', change: '+12%', up: true },
  { rank: 2, name: 'Unga Pembe 2kg', revenue: 'KSh 88K', units: '980 units', change: '+5%', up: true },
  { rank: 3, name: 'Brookside Milk 500ml', revenue: 'KSh 52K', units: '870 units', change: '-2%', up: false },
  { rank: 4, name: 'Ariel Powder 500g', revenue: 'KSh 83K', units: '640 units', change: '+18%', up: true },
  { rank: 5, name: 'Pringles Original 165g', revenue: 'KSh 71K', units: '590 units', change: '+8%', up: true },
]

const SUPPLIER_PAYMENTS = [
  { id: 1, name: 'East African Breweries', amount: 'KSh 284K', due: '2026-09-10', status: 'pending' },
  { id: 2, name: 'Pembe Flour Mills', amount: 'KSh 126K', due: '2026-09-05', status: 'overdue' },
  { id: 3, name: 'Brookside Dairy', amount: 'KSh 93K', due: '2026-09-15', status: 'paid' },
  { id: 4, name: 'P&G Kenya', amount: 'KSh 211K', due: '2026-09-20', status: 'pending' },
]

const STATUS_LABEL = {
  active: 'Active',
  inactive: 'Inactive',
  pending: 'Pending',
  overdue: 'Overdue',
  paid: 'Paid',
}

function StatIcon({ name }) {
  const paths = {
    dollar: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
    store: 'M4 9l1-5h14l1 5M4 9v10a1 1 0 0 0 1 1h4v-6h6v6h4a1 1 0 0 0 1-1V9M4 9h16',
    users: 'M8 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 20c.5-3 2.5-5 5-5s4.5 2 5 5M16.5 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM14.5 20c.4-2.5 2-4.3 4-4.8',
    box: 'M4 8l8-4 8 4-8 4-8-4zM4 8v9l8 4 8-4V8M12 12v9',
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[name] || ''} />
    </svg>
  )
}

function BranchRevenueChart() {
  const data = {
    labels: REVENUE_LABELS,
    datasets: REVENUE_SERIES.map((s) => ({
      label: s.name,
      data: s.values.map((v) => v * 1000),
      borderColor: s.color,
      backgroundColor: 'transparent',
      borderDash: s.dash,
      tension: 0.35,
      pointRadius: 3,
      pointHoverRadius: 5,
      fill: false,
    })),
  }

  const options = mergeChartOptions({
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        ticks: {
          callback: (v) => `${v / 1000}K`,
        },
      },
    },
  })

  return (
    <div className="chart-frame chart-frame--lg">
      <Line data={data} options={options} />
    </div>
  )
}

function CategorySalesChart() {
  const data = {
    labels: CATEGORY_LABELS,
    datasets: [
      {
        label: 'Revenue',
        data: CATEGORY_VALUES,
        backgroundColor: '#0f766e',
        borderRadius: 4,
        maxBarThickness: 20,
      },
    ],
  }

  const options = mergeChartOptions({
    indexAxis: 'y',
    plugins: { legend: { display: false } },
    scales: {
      x: {
        beginAtZero: true,
        ticks: { callback: (v) => `${v / 1000}K` },
      },
      y: {
        grid: { display: false },
      },
    },
  })

  return (
    <div className="chart-frame chart-frame--md">
      <Bar data={data} options={options} />
    </div>
  )
}

function initials(nameOrEmail) {
  const base = (nameOrEmail || '').trim()
  if (!base) return '?'
  const parts = base.split(' ').filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return base.slice(0, 2).toUpperCase()
}

function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toISOString().slice(0, 10)
}

export default function MerchantDashboard() {
  const [range, setRange] = useState('30D')
  const [inviteOpen, setInviteOpen] = useState(false)

  const [admins, setAdmins] = useState([])
  const [storeMap, setStoreMap] = useState({})
  const [adminsLoading, setAdminsLoading] = useState(true)
  const [adminsError, setAdminsError] = useState(null)
  const [pendingDeleteId, setPendingDeleteId] = useState(null)

  async function loadAdmins() {
    setAdminsLoading(true)
    setAdminsError(null)
    try {
      const [adminsRes, storesRes] = await Promise.all([
        axiosInstance.get('/merchant/admins'),
        axiosInstance.get('/merchant/stores'),
      ])
      const map = {}
      for (const s of storesRes.data || []) {
        map[s.id] = s.name
      }
      setStoreMap(map)
      setAdmins(adminsRes.data || [])
    } catch (err) {
      setAdminsError(err.response?.data?.error || 'Failed to load admins.')
    } finally {
      setAdminsLoading(false)
    }
  }

  useEffect(() => {
    loadAdmins()
  }, [])

  async function handleRemove(admin) {
    const label = admin.full_name || admin.email
    // eslint-disable-next-line no-alert
    const confirmed = window.confirm(`Remove ${label}? This cannot be undone.`)
    if (!confirmed) return

    setPendingDeleteId(admin.id)
    try {
      await axiosInstance.delete(`/merchant/admins/${admin.id}`)
      setAdmins((prev) => prev.filter((a) => a.id !== admin.id))
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert(err.response?.data?.error || 'Failed to remove admin.')
    } finally {
      setPendingDeleteId(null)
    }
  }

  return (
    <div className="page merchant-page">
      <div className="page__header">
        <div>
          <h1>Store Performance</h1>
          <p>September 2026 · 3 active branches</p>
        </div>
        <div className="range-tabs">
          {RANGES.map((r) => (
            <button
              key={r}
              className={`range-tabs__btn ${r === range ? 'is-active' : ''}`}
              onClick={() => setRange(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="merchant-stat-grid">
        {STATS.map((s) => (
          <div className="panel merchant-stat-card" key={s.key}>
            <div className="merchant-stat-card__icon">
              <StatIcon name={s.icon} />
            </div>
            <p className="merchant-stat-card__label">{s.label}</p>
            <p className="merchant-stat-card__value">{s.value}</p>
            <p className="merchant-stat-card__hint">{s.hint}</p>
          </div>
        ))}
      </div>

      <div className="panel">
        <div className="panel__header">
          <div>
            <h2 className="panel__title">Branch Revenue Comparison</h2>
            <p className="panel__subtitle">Monthly revenue across all branches (KSh)</p>
          </div>
          <div className="chart-legend">
            {REVENUE_SERIES.map((s) => (
              <span className="chart-legend__item" key={s.key}>
                <span
                  className="chart-legend__swatch"
                  style={{ background: s.color, opacity: s.dash.length ? 0.6 : 1 }}
                />
                {s.name}
              </span>
            ))}
          </div>
        </div>
        <BranchRevenueChart />
      </div>

      <div className="merchant-split-grid">
        <div className="panel">
          <h2 className="panel__title">Sales by Category</h2>
          <p className="panel__subtitle">All branches · September 2026</p>
          <CategorySalesChart />
        </div>

        <div className="panel">
          <h2 className="panel__title">Top Products</h2>
          <p className="panel__subtitle">By revenue this month</p>
          <div className="top-products-list">
            {TOP_PRODUCTS.map((p) => (
              <div className="top-product-row" key={p.rank}>
                <span className="top-product-row__rank">{p.rank}</span>
                <div className="top-product-row__body">
                  <p className="top-product-row__name">{p.name}</p>
                  <p className="top-product-row__meta">{p.revenue} · {p.units}</p>
                </div>
                <span className={`top-product-row__change ${p.up ? 'is-up' : 'is-down'}`}>
                  {p.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel__header">
          <div>
            <h2 className="panel__title">Admin Management</h2>
            <p className="panel__subtitle">Manage admins across all branches</p>
          </div>
          <Button onClick={() => setInviteOpen(true)}>+ Invite Admin</Button>
        </div>

        {adminsError && <div className="error-banner">{adminsError}</div>}

        {adminsLoading ? (
          <p className="admin-table__loading">Loading admins…</p>
        ) : admins.length === 0 ? (
          <p className="admin-table__loading">No admins yet. Invite one to get started.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Branch</th>
                <th>Status</th>
                <th>Joined</th>
                <th aria-hidden="true"></th>
              </tr>
            </thead>
            <tbody>
              {admins.map((a) => (
                <tr key={a.id}>
                  <td>
                    <div className="admin-table__name">
                      <span className="admin-table__avatar">
                        {initials(a.full_name || a.email)}
                      </span>
                      {a.full_name || a.username || a.email}
                    </div>
                  </td>
                  <td className="admin-table__email">{a.email}</td>
                  <td>{a.store_id ? storeMap[a.store_id] || `Store #${a.store_id}` : '—'}</td>
                  <td>
                    <span className={`status-badge status-badge--${a.is_active ? 'active' : 'inactive'}`}>
                      {a.is_active ? STATUS_LABEL.active : STATUS_LABEL.inactive}
                    </span>
                  </td>
                  <td className="admin-table__joined">{formatDate(a.created_at)}</td>
                  <td>
                    <button
                      className="admin-table__remove"
                      onClick={() => handleRemove(a)}
                      disabled={pendingDeleteId === a.id}
                    >
                      {pendingDeleteId === a.id ? '…' : 'Remove'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="panel">
        <h2 className="panel__title">Supplier Payment Status</h2>
        <p className="panel__subtitle">Outstanding and upcoming payments</p>
        <div className="supplier-grid">
          {SUPPLIER_PAYMENTS.map((p) => (
            <div className="supplier-card" key={p.id}>
              <div className="supplier-card__row">
                <p className="supplier-card__name">{p.name}</p>
                <p className="supplier-card__amount">{p.amount}</p>
              </div>
              <div className="supplier-card__row">
                <p className="supplier-card__due">Due {p.due}</p>
                <span className={`status-badge status-badge--${p.status}`}>{STATUS_LABEL[p.status]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <InviteAdminModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onInvited={loadAdmins}
      />
    </div>
  )
}