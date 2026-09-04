import { useEffect, useState } from 'react'
import axiosInstance from '../../utils/axiosInstance'
import Button from '../../components/common/Button'
import AddSkuModal from './AddSkuModal'
import './Inventory.css'

function statusFor(qty) {
  if (qty <= 0) return 'out'
  if (qty < 50) return 'low'
  return 'in-stock'
}

const STATUS_LABEL = { 'in-stock': 'In stock', low: 'Low stock', out: 'Out of stock' }
const STATUS_CLASS = { 'in-stock': 'success', low: 'warning', out: 'danger' }

const CSV_COLUMNS = [
  { key: 'product_id', header: 'Product ID' },
  { key: 'name', header: 'Name' },
  { key: 'category', header: 'Category' },
  { key: 'store_id', header: 'Store ID' },
  { key: 'store_name', header: 'Store' },
  { key: 'quantity_in_stock', header: 'Quantity in stock' },
  { key: 'buy_price', header: 'Buy price' },
  { key: 'sell_price', header: 'Sell price' },
  { key: 'total_received', header: 'Total received' },
  { key: 'total_spoilt', header: 'Total spoilt' },
  { key: 'stock_value', header: 'Stock value' },
]

function toCsvValue(value) {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function downloadCsv(filename, rows) {
  const header = CSV_COLUMNS.map((c) => toCsvValue(c.header)).join(',')
  const body = rows
    .map((row) => CSV_COLUMNS.map((c) => toCsvValue(row[c.key])).join(','))
    .join('\n')
  const csv = `${header}\n${body}`

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export default function Inventory() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [addOpen, setAddOpen] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState(null)
  const [pendingDeleteId, setPendingDeleteId] = useState(null)

  async function loadProducts() {
    setLoading(true)
    setError(null)
    try {
      const res = await axiosInstance.get('/merchant/reports/products')
      setProducts(res.data?.products || [])
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load inventory.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  async function handleExport() {
    setExportError(null)
    setExporting(true)
    try {
      const res = await axiosInstance.get('/merchant/reports/products')
      const rows = res.data?.products || []
      if (rows.length === 0) {
        setExportError('No products to export.')
        return
      }
      const date = new Date().toISOString().slice(0, 10)
      downloadCsv(`myduka-inventory-${date}.csv`, rows)
    } catch (err) {
      setExportError(err.response?.data?.error || 'Failed to export inventory.')
    } finally {
      setExporting(false)
    }
  }

  async function handleDelete(product) {
    // eslint-disable-next-line no-alert
    const confirmed = window.confirm(`Delete ${product.name} from ${product.store_name}?`)
    if (!confirmed) return

    setPendingDeleteId(product.product_id)
    try {
      await axiosInstance.delete(`/merchant/products/${product.product_id}`)
      setProducts((prev) => prev.filter((p) => p.product_id !== product.product_id))
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert(err.response?.data?.error || 'Failed to delete product.')
    } finally {
      setPendingDeleteId(null)
    }
  }

  return (
    <div className="page inventory-page">
      <div className="page__header">
        <div>
          <h1>Inventory</h1>
          <p>{products.length} SKU {products.length === 1 ? 'entry' : 'entries'} across all branches</p>
        </div>
        <div className="page__actions">
          <Button variant="secondary" onClick={handleExport} loading={exporting}>
            Export
          </Button>
          <Button onClick={() => setAddOpen(true)}>+ Add SKU</Button>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {exportError && <div className="error-banner">{exportError}</div>}

      {loading ? (
        <p className="inventory-page__loading">Loading inventory…</p>
      ) : products.length === 0 ? (
        <p className="inventory-page__loading">No products yet. Add one to get started.</p>
      ) : (
        <div className="panel">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Branch</th>
                <th>Units</th>
                <th>Status</th>
                <th aria-hidden="true"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const status = statusFor(p.quantity_in_stock)
                const isPending = pendingDeleteId === p.product_id
                return (
                  <tr key={p.product_id}>
                    <td className="inventory-table__name">{p.name}</td>
                    <td>{p.category || '—'}</td>
                    <td>{p.store_name}</td>
                    <td>{p.quantity_in_stock.toLocaleString()}</td>
                    <td>
                      <span className={`status-badge status-badge--${STATUS_CLASS[status]}`}>
                        {STATUS_LABEL[status]}
                      </span>
                    </td>
                    <td>
                      <button
                        className="inventory-table__delete"
                        onClick={() => handleDelete(p)}
                        disabled={isPending}
                      >
                        {isPending ? '…' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <AddSkuModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreated={loadProducts}
      />
    </div>
  )
}