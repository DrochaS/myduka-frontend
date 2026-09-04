import { useEffect, useState } from 'react'
import axiosInstance from '../../utils/axiosInstance'
import Button from '../../components/common/Button'
import AddBranchModal from './AddBranchModal'
import './Branches.css'

export default function Branches() {
  const [branches, setBranches] = useState([])
  const [adminCounts, setAdminCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [addOpen, setAddOpen] = useState(false)

  async function loadBranches() {
    setLoading(true)
    setError(null)
    try {
      const [storesRes, adminsRes] = await Promise.all([
        axiosInstance.get('/merchant/stores'),
        axiosInstance.get('/merchant/admins'),
      ])
      const counts = {}
      for (const a of adminsRes.data || []) {
        if (a.store_id) counts[a.store_id] = (counts[a.store_id] || 0) + 1
      }
      setAdminCounts(counts)
      setBranches(storesRes.data || [])
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load branches.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBranches()
  }, [])

  return (
    <div className="page branches-page">
      <div className="page__header">
        <div>
          <h1>Branches</h1>
          <p>{branches.length} {branches.length === 1 ? 'branch' : 'branches'}</p>
        </div>
        <div className="page__actions">
          <Button onClick={() => setAddOpen(true)}>+ Add branch</Button>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <p className="branches-page__loading">Loading branches…</p>
      ) : branches.length === 0 ? (
        <p className="branches-page__loading">No branches yet. Add one to get started.</p>
      ) : (
        <div className="branches-grid">
          {branches.map((b) => (
            <div className="panel branch-card" key={b.id}>
              <div className="branch-card__header">
                <p className="branch-card__name">{b.name}</p>
                <span className="status-badge status-badge--active">Active</span>
              </div>
              <p className="branch-card__address">{b.location || 'No location set'}</p>
              <div className="branch-card__stats">
                <div>
                  {/* TODO: no revenue-by-store endpoint yet */}
                  <p className="branch-card__stat-value">—</p>
                  <p className="branch-card__stat-label">Revenue (Sep)</p>
                </div>
                <div>
                  <p className="branch-card__stat-value">{adminCounts[b.id] || 0}</p>
                  <p className="branch-card__stat-label">Admins</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddBranchModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreated={loadBranches}
      />
    </div>
  )
}