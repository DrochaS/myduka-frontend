import { useEffect, useState } from 'react'
import axiosInstance from '../../utils/axiosInstance'
import Button from '../../components/common/Button'
import './InviteAdminModal.css'

export default function InviteAdminModal({ open, onClose, onInvited }) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [storeId, setStoreId] = useState('')
  const [stores, setStores] = useState([])
  const [storesLoading, setStoresLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [successUrl, setSuccessUrl] = useState(null)

  // Reset form state each time the modal opens, and fetch branches for the dropdown.
  useEffect(() => {
    if (!open) return
    setFullName('')
    setEmail('')
    setStoreId('')
    setError(null)
    setSuccessUrl(null)

    setStoresLoading(true)
    axiosInstance
      .get('/merchant/stores')
      .then((res) => setStores(res.data || []))
      .catch(() => setStores([]))
      .finally(() => setStoresLoading(false))
  }, [open])

  if (!open) return null

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const payload = {
        email: email.trim(),
        full_name: fullName.trim() || undefined,
        store_id: storeId ? Number(storeId) : undefined,
      }
      const res = await axiosInstance.post('/auth/invite-admin', payload)
      setSuccessUrl(res.data?.invite_url || null)
      onInvited?.(res.data)
    } catch (err) {
      const details = err.response?.data
      setError(
        details?.details
          ? Object.values(details.details).flat().join(' ')
          : details?.error || 'Something went wrong sending the invite.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="invite-modal-backdrop" onClick={onClose}>
      <div className="invite-modal" onClick={(e) => e.stopPropagation()}>
        <div className="invite-modal__header">
          <h2>Invite Admin</h2>
          <button className="invite-modal__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        {successUrl ? (
          <div className="invite-modal__success">
            <p className="invite-modal__success-title">Invite sent to {email}.</p>
            <p className="invite-modal__success-hint">
              They'll receive an email with a link to set up their account. It expires in 48 hours.
            </p>
            <div className="invite-modal__actions">
              <Button onClick={onClose}>Done</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="invite-modal__form">
            {error && <div className="invite-modal__error">{error}</div>}

            <label className="invite-modal__field">
              <span>Full name</span>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Amara Osei"
              />
            </label>

            <label className="invite-modal__field">
              <span>Email *</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="amara@myduka.co"
              />
            </label>

            <label className="invite-modal__field">
              <span>Branch</span>
              <select
                value={storeId}
                onChange={(e) => setStoreId(e.target.value)}
                disabled={storesLoading}
              >
                <option value="">No branch assigned</option>
                {stores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="invite-modal__actions">
              <Button variant="secondary" type="button" onClick={onClose} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" loading={submitting}>
                Send invite
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}