import { useState } from 'react'
import axiosInstance from '../../utils/axiosInstance'
import Button from '../../components/common/Button'
import './AddBranchModal.css'

export default function AddBranchModal({ open, onClose, onCreated }) {
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  if (!open) return null

  function handleClose() {
    setName('')
    setLocation('')
    setError(null)
    onClose()
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const res = await axiosInstance.post('/merchant/stores', {
        name: name.trim(),
        location: location.trim() || undefined,
      })
      onCreated?.(res.data)
      handleClose()
    } catch (err) {
      const details = err.response?.data
      setError(
        details?.details
          ? Object.values(details.details).flat().join(' ')
          : details?.error || 'Something went wrong creating the branch.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="branch-modal-backdrop" onClick={handleClose}>
      <div className="branch-modal" onClick={(e) => e.stopPropagation()}>
        <div className="branch-modal__header">
          <h2>Add branch</h2>
          <button className="branch-modal__close" onClick={handleClose} aria-label="Close">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="branch-modal__form">
          {error && <div className="branch-modal__error">{error}</div>}

          <label className="branch-modal__field">
            <span>Branch name *</span>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Kisumu Central"
            />
          </label>

          <label className="branch-modal__field">
            <span>Location</span>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Oginga Odinga St, Kisumu"
            />
          </label>

          <div className="branch-modal__actions">
            <Button variant="secondary" type="button" onClick={handleClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              Add branch
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}