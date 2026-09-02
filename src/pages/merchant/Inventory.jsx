import { useState } from 'react'
import Button from '../../components/common/Button'
import './Inventory.css'

// TODO: replace with real GET /merchant/inventory data
const SKUS = [
  { id: 1, name: 'Tusker Lager 500ml', category: 'Beverages', branches: 3, units: 1240, status: 'in-stock' },
  { id: 2, name: 'Unga Pembe 2kg', category: 'Grains & Flour', branches: 3, units: 980, status: 'in-stock' },
  { id: 3, name: 'Brookside Milk 500ml', category: 'Dairy', branches: 2, units: 40, status: 'low' },
  { id: 4, name: 'Ariel Powder 500g', category: 'Household', branches: 3, units: 640, status: 'in-stock' },
  { id: 5, name: 'Cooking Oil 2L', category: 'Household', branches: 1, units: 0, status: 'out' },
]

const STATUS_LABEL = { 'in-stock': 'In stock', low: 'Low stock', out: 'Out of stock' }
const STATUS_CLASS = { 'in-stock': 'success', low: 'warning', out: 'danger' }

export default function Inventory() {
  const [skus] = useState(SKUS)

  return (
    <div className="page inventory-page">
      <div className="page__header">
        <div>
          <h1>Inventory</h1>
          <p>{skus.length} SKUs tracked across all branches</p>
        </div>
        <div className="page__actions">
          <Button variant="secondary">Export</Button>
          <Button>+ Add SKU</Button>
        </div>
      </div>

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
    </div>
  )
}