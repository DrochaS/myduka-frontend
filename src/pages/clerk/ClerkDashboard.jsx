import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '../../components/common/Button'
import Table from '../../components/common/Table'
import Badge from '../../components/common/Badge'
import Loader from '../../components/common/Loader'
import Pagination from '../../components/common/Pagination'
import {
  fetchProducts,
  fetchStockEntries,
} from '../../redux/slices/inventorySlice'
import { usePagination } from '../../hooks/usePagination'
import { formatCurrency, formatDate, formatStatus } from '../../utils/formatters'
import StockEntryModal from './StockEntryModal'
import RequestSupplyModal from './RequestSupplyModal'
import SpoiltGoodsModal from './SpoiltGoodsModal'
import './ClerkDashboard.css'

function paymentTone(status) {
  return status === 'paid' ? 'success' : 'warning'
}

export default function ClerkDashboard() {
  const dispatch = useDispatch()
  const { stockEntries, products, status, error } = useSelector(
    (state) => state.inventory,
  )
  const [stockOpen, setStockOpen] = useState(false)
  const [supplyOpen, setSupplyOpen] = useState(false)
  const [spoiltOpen, setSpoiltOpen] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState(null)
  const { page, setPage, totalPages, pageItems } = usePagination(stockEntries, 8)

  useEffect(() => {
    dispatch(fetchStockEntries())
    dispatch(fetchProducts())
  }, [dispatch])

  const columns = [
    { key: 'productName', label: 'Product' },
    { key: 'quantityReceived', label: 'Received' },
    { key: 'stockQuantity', label: 'In stock' },
    { key: 'spoiltQuantity', label: 'Spoilt' },
    {
      key: 'buyingPrice',
      label: 'Buy',
      render: (value) => formatCurrency(value),
    },
    {
      key: 'sellingPrice',
      label: 'Sell',
      render: (value) => formatCurrency(value),
    },
    {
      key: 'paymentStatus',
      label: 'Payment',
      render: (value) => (
        <Badge tone={paymentTone(value)}>{formatStatus(value)}</Badge>
      ),
    },
    {
      key: 'createdAt',
      label: 'Logged',
      render: (value) => formatDate(value),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_value, row) => (
        <Button
          variant="ghost"
          onClick={() => {
            setSelectedEntry(row)
            setSpoiltOpen(true)
          }}
        >
          Spoilt
        </Button>
      ),
    },
  ]

  return (
    <div className="page clerk-page">
      <div className="page__header">
        <div>
          <h1>Clerk stock desk</h1>
          <p>Log deliveries, request restocks, and mark spoilt goods.</p>
        </div>
        <div className="page__actions">
          <Button variant="secondary" onClick={() => setSupplyOpen(true)}>
            Request supply
          </Button>
          <Button onClick={() => setStockOpen(true)}>New stock entry</Button>
        </div>
      </div>

      {error ? <div className="error-banner">{error}</div> : null}
      {status === 'loading' && !stockEntries.length ? (
        <Loader label="Loading stock entries…" />
      ) : (
        <div className="panel">
          <Table
            columns={columns}
            rows={pageItems}
            emptyMessage="No stock entries yet. Add your first delivery."
          />
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      )}

      <StockEntryModal
        open={stockOpen}
        onClose={() => setStockOpen(false)}
        products={products}
      />
      <RequestSupplyModal
        open={supplyOpen}
        onClose={() => setSupplyOpen(false)}
        products={products}
      />
      <SpoiltGoodsModal
        open={spoiltOpen}
        onClose={() => {
          setSpoiltOpen(false)
          setSelectedEntry(null)
        }}
        entry={selectedEntry}
      />
    </div>
  )
}
