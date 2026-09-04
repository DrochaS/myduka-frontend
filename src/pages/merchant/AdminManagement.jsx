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
  deactivateAdmin,
  deleteAdmin,
  fetchAdmins,
  inviteAdmin,
} from '../../redux/slices/analyticsSlice'
import { usePagination } from '../../hooks/usePagination'
import { isValidEmail } from '../../utils/validators'
import { formatDate } from '../../utils/formatters'
import './AdminManagement.css'

export default function AdminManagement() {
  const dispatch = useDispatch()
  const { admins, status, error } = useSelector((state) => state.analytics)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', storeName: '' })
  const [formError, setFormError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const { page, setPage, totalPages, pageItems } = usePagination(admins, 8)

  useEffect(() => {
    dispatch(fetchAdmins())
  }, [dispatch])

  const onInvite = async (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.storeName.trim()) {
      setFormError('Name and store are required')
      return
    }
    if (!isValidEmail(form.email)) {
      setFormError('Enter a valid email')
      return
    }
    setSubmitting(true)
    const result = await dispatch(inviteAdmin(form))
    setSubmitting(false)
    if (inviteAdmin.fulfilled.match(result)) {
      setForm({ name: '', email: '', storeName: '' })
      setFormError(null)
      setOpen(false)
    }
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'storeName', label: 'Store' },
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
      label: 'Invited',
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
              onClick={() => dispatch(deactivateAdmin(row.id))}
            >
              Deactivate
            </Button>
          ) : null}
          <Button variant="danger" onClick={() => dispatch(deleteAdmin(row.id))}>
            Delete
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="page admin-management-page">
      <div className="page__header">
        <div>
          <h1>Admin management</h1>
          <p>Invite store admins and control their account access.</p>
        </div>
        <Button onClick={() => setOpen(true)}>Invite admin</Button>
      </div>

      {error ? <div className="error-banner">{error}</div> : null}
      {status === 'loading' && !admins.length ? (
        <Loader label="Loading admins…" />
      ) : (
        <div className="panel">
          <Table columns={columns} rows={pageItems} emptyMessage="No admins yet." />
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      )}

      <Modal
        open={open}
        title="Invite admin"
        onClose={() => setOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="invite-admin-form" loading={submitting}>
              Send invite
            </Button>
          </>
        }
      >
        <form id="invite-admin-form" className="form-grid" onSubmit={onInvite}>
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
          <Input
            label="Store name"
            name="storeName"
            value={form.storeName}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, storeName: event.target.value }))
            }
          />
        </form>
      </Modal>
    </div>
  )
}
