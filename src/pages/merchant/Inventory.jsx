import { useState } from 'react'
import axiosInstance from '../../utils/axiosInstance'
import Button from '../../components/common/Button'
import AddSkuModal from './AddSkuModal'
import './Inventory.css'

// TODO: replace with real GET /merchant/inventory data (this table stays mock for now,
// per product decision — only Add SKU + Export are wired to the backend).
const SKUS = [
  { id: 1, name: 'Tusker Lager 500ml', category: 'Beverages', branches: 3, units: 1240, status: 'in-stock' },
  { id: 2, name: 'Unga Pembe 2kg', category: 'Grains & Flour', branches: 3, units: 980, status: 'in-stock' },
  { id: 3, name: 'Brookside Milk 500ml', category: 'Dairy', branches: 2, units: 40, status: 'low' },
  { id: 4, name: 'Ariel Powder 500g', category: 'Household', branches: 3, units: 640, status: 'in-stock' },
  { id: 5, name: 'Cooking Oil 2L', category: 'Household', branches: 1, units: 0, status: 'out' },
]

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
  const [skus] = useState(SKUS)
  const [addOpen, setAddOpen] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState(null)

  async function handleExport() {
    setExportError(null)
    setExporting(true)
    try {
      const res = await axiosInstance.get('/merchant/reports/products')
      const products = res.data?.products || []
      if (products.length === 0) {
        setExportError('No products to export.')
        return
      }
      const date = new Date().toISOString().slice(0, 10)
      downloadCsv(`myduka-inventory-${date}.csv`, products)
    } catch (err) {
      setExportError(err.response?.data?.error || 'Failed to export inventory.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="page inventory-page">
      <div className="page__header">
        <div>
          <h1>Inventory</h1>
          <p>{skus.length} SKUs tracked across all branches</p>
        </div>
        <div className="page__actions">
          <Button variant="secondary" onClick={handleExport} loading={exporting}>
            Export
          </Button>
          <Button onClick={() => setAddOpen(true)}>+ Add SKU</Button>
        </div>
      </div>

      {exportError && <div className="error-banner">{exportError}</div>}

      <div className="panel">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Branches</th>
              <th>Total units</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {skus.map((s) => (
              <tr key={s.id}>
                <td className="inventory-table__name">{s.name}</td>
                <td>{s.category}</td>
                <td>{s.branches}</td>
                <td>{s.units.toLocaleString()}</td>
                <td>
                  <span className={`status-badge status-badge--${STATUS_CLASS[s.status]}`}>
                    {STATUS_LABEL[s.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddSkuModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreated={() => {
          // TODO: once the table is wired to real data, refetch it here.
        }}
      />
    </div>
  )
}