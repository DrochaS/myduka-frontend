import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '../../components/common/Button'
import Table from '../../components/common/Table'
import Badge from '../../components/common/Badge'
import Loader from '../../components/common/Loader'
import {
  fetchSupplierPayments,
  updateSupplierPayment,
} from '../../redux/slices/inventorySlice'
import { formatCurrency, formatDate, formatStatus } from '../../utils/formatters'
import './SupplierPayments.css'

export default function SupplierPayments() {
  const dispatch = useDispatch()
  const { supplierPayments, status, error } = useSelector((state) => state.inventory)

  useEffect(() => {
    dispatch(fetchSupplierPayments())
  }, [dispatch])

  const { paid, unpaid } = useMemo(() => {
    const paidRows = []
    const unpaidRows = []
    supplierPayments.forEach((row) => {
      if (row.paymentStatus === 'paid') paidRows.push(row)
      else unpaidRows.push(row)
    })
    return { paid: paidRows, unpaid: unpaidRows }
  }, [supplierPayments])

  const columns = (showPayAction) => [
    { key: 'productName', label: 'Product' },
    { key: 'supplierName', label: 'Supplier' },
    {
      key: 'amount',
      label: 'Amount',
      render: (value) => formatCurrency(value),
    },
    {
      key: 'paymentStatus',
      label: 'Status',
      render: (value) => (
        <Badge tone={value === 'paid' ? 'success' : 'warning'}>
          {formatStatus(value)}
        </Badge>
      ),
    },
    {
      key: 'updatedAt',
      label: 'Updated',
      render: (value) => formatDate(value),
    },
    ...(showPayAction
      ? [
          {
            key: 'actions',
            label: 'Actions',
            render: (_value, row) => (
              <Button
                variant="secondary"
                onClick={() =>
                  dispatch(
                    updateSupplierPayment({
                      id: row.id,
                      paymentStatus: 'paid',
                    }),
                  )
                }
              >
                Mark paid
              </Button>
            ),
          },
        ]
      : []),
  ]

  if (status === 'loading' && !supplierPayments.length) {
    return <Loader label="Loading supplier payments…" />
  }

  return (
    <div className="page payments-page">
      <div className="page__header">
        <div>
          <h1>Supplier payments</h1>
          <p>Separate unpaid deliveries from settled supplier invoices.</p>
        </div>
      </div>
      {error ? <div className="error-banner">{error}</div> : null}

      <section className="panel">
        <h2 className="panel__title">Unpaid</h2>
        <Table
          columns={columns(true)}
          rows={unpaid}
          emptyMessage="No unpaid supplier balances."
        />
      </section>

      <section className="panel">
        <h2 className="panel__title">Paid</h2>
        <Table
          columns={columns(false)}
          rows={paid}
          emptyMessage="No paid supplier records yet."
        />
      </section>
    </div>
  )
}
