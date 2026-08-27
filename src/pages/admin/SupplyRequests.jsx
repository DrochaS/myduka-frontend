import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '../../components/common/Button'
import Table from '../../components/common/Table'
import Badge from '../../components/common/Badge'
import Loader from '../../components/common/Loader'
import Pagination from '../../components/common/Pagination'
import {
  fetchSupplyRequests,
  reviewSupplyRequest,
} from '../../redux/slices/requestSlice'
import { usePagination } from '../../hooks/usePagination'
import { formatDate, formatStatus } from '../../utils/formatters'

function statusTone(status) {
  if (status === 'approved') return 'success'
  if (status === 'declined') return 'danger'
  return 'warning'
}

export default function SupplyRequests() {
  const dispatch = useDispatch()
  const { requests, status, error } = useSelector((state) => state.request)
  const { page, setPage, totalPages, pageItems } = usePagination(requests, 8)

  useEffect(() => {
    dispatch(fetchSupplyRequests())
  }, [dispatch])

  const onReview = (id, decision) => {
    dispatch(reviewSupplyRequest({ id, decision }))
  }

  const columns = [
    { key: 'productName', label: 'Product' },
    { key: 'quantity', label: 'Qty' },
    { key: 'clerkName', label: 'Clerk' },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <Badge tone={statusTone(value)}>{formatStatus(value || 'pending')}</Badge>
      ),
    },
    {
      key: 'createdAt',
      label: 'Requested',
      render: (value) => formatDate(value),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_value, row) => {
        const pending = !row.status || row.status === 'pending'
        if (!pending) return '—'
        return (
          <div className="page__actions">
            <Button variant="secondary" onClick={() => onReview(row.id, 'approved')}>
              Approve
            </Button>
            <Button variant="danger" onClick={() => onReview(row.id, 'declined')}>
              Decline
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1>Supply requests</h1>
          <p>Approve or decline restock requests from clerks.</p>
        </div>
      </div>
      {error ? <div className="error-banner">{error}</div> : null}
      {status === 'loading' && !requests.length ? (
        <Loader label="Loading supply requests…" />
      ) : (
        <div className="panel">
          <Table columns={columns} rows={pageItems} emptyMessage="No supply requests." />
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      )}
    </div>
  )
}
