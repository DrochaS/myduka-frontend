import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Modal from '../../components/common/Modal'
import Table from '../../components/common/Table'
import Badge from '../../components/common/Badge'
import Loader from '../../components/common/Loader'
import Pagination from '../../components/common/Pagination'
import {
  deactivateClerk,
  deleteClerk,
  fetchClerks,
  inviteClerk,
} from '../../redux/slices/analyticsSlice'
import { usePagination } from '../../hooks/usePagination'
import { isValidEmail } from '../../utils/validators'
import { formatDate } from '../../utils/formatters'

export default function ClerkManagement() {
  const dispatch = useDispatch()
  const { clerks, status, error } = useSelector((state) => state.analytics)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '' })
  const [formError, setFormError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const { page, setPage, totalPages, pageItems } = usePagination(clerks, 8)

  useEffect(() => {
    dispatch(fetchClerks())
  }, [dispatch])

  const onInvite = async (event) => {
    event.preventDefault()
    if (!form.name.trim()) {
      setFormError('Name is required')
      return
    }
    if (!isValidEmail(form.email)) {
      setFormError('Enter a valid email')
      return
    }
    setSubmitting(true)
    const result = await dispatch(inviteClerk(form))
    setSubmitting(false)
    if (inviteClerk.fulfilled.match(result)) {
      setForm({ name: '', email: '' })
      setFormError(null)
      setOpen(false)
    }
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    {
      key: 'active',
      label: 'Status',
      render: (value) => (
        <Badge tone={value === false ? 'muted' : 'success'}>
          {value === false ? 'Inactive' : 'Active'}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      label: 'Joined',
      render: (value) => formatDate(value),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_value, row) => (
        <div className="page__actions">
          {row.active !== false ? (
            <Button
              variant="secondary"
              onClick={() => dispatch(deactivateClerk(row.id))}
            >
              Deactivate
            </Button>
          ) : null}
          <Button variant="danger" onClick={() => dispatch(deleteClerk(row.id))}>
            Delete
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1>Clerk management</h1>
          <p>Invite store clerks, deactivate accounts, or remove them.</p>
        </div>
        <Button onClick={() => setOpen(true)}>Invite clerk</Button>
      </div>

      {error ? <div className="error-banner">{error}</div> : null}
      {status === 'loading' && !clerks.length ? (
        <Loader label="Loading clerks…" />
      ) : (
        <div className="panel">
          <Table columns={columns} rows={pageItems} emptyMessage="No clerks yet." />
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      )}

      <Modal
        open={open}
        title="Invite clerk"
        onClose={() => setOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="invite-clerk-form" loading={submitting}>
              Send invite
            </Button>
          </>
        }
      >
        <form id="invite-clerk-form" className="form-grid" onSubmit={onInvite}>
          {formError ? <div className="error-banner">{formError}</div> : null}
          <Input
            label="Full name"
            name="name"
            value={form.name}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, name: event.target.value }))
            }
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, email: event.target.value }))
            }
          />
        </form>
      </Modal>
    </div>
  )
}
