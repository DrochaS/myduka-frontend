import { useState } from 'react'
import Button from '../../components/common/Button'
import './StockEntries.css'

// TODO: replace with real GET /admin/stock-entries data
const MOCK_ENTRIES = [
  { id: 1, item: 'Tusker Lager 500ml', qty: 24, type: 'restock', branch: 'Westlands', by: 'Amina', date: '2 Sep 2026, 9:12 AM' },
  { id: 2, item: 'Brookside Milk 500ml', qty: 12, type: 'restock', branch: 'Mombasa Rd', by: 'Brian', date: '2 Sep 2026, 8:47 AM' },
  { id: 3, item: 'Tomatoes 8kg', qty: -8, type: 'spoilt', branch: 'Nairobi CBD', by: 'Grace A.', date: '2 Sep 2026, 7:55 AM' },
  { id: 4, item: 'Unga Pembe 2kg', qty: 40, type: 'restock', branch: 'Nairobi CBD', by: 'Cate', date: '1 Sep 2026, 6:30 PM' },
]

const TYPE_LABEL = { restock: 'Restock', spoilt: 'Spoilt', adjustment: 'Adjustment' }

export default function StockEntries() {
  const [entries] = useState(MOCK_ENTRIES)

  return (
    <div className="page stock-entries-page">
      <div className="page__header">
        <div>
          <h1>Stock entries</h1>
          <p>{entries.length} items logged today</p>
        </div>
        <div className="page__actions">
          <Button>+ Add entry</Button>
        </div>
      </div>

      <div className="panel">
        <table className="entries-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Type</th>
              <th>Qty</th>
              <th>Branch</th>
              <th>Logged by</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.id}>
                <td className="entries-table__item">{e.item}</td>
                <td>
                  <span className={`type-badge type-badge--${e.type}`}>{TYPE_LABEL[e.type] || e.type}</span>
                </td>
                <td className={e.qty < 0 ? 'entries-table__qty--negative' : 'entries-table__qty--positive'}>
                  {e.qty > 0 ? `+${e.qty}` : e.qty}
                </td>
                <td>{e.branch}</td>
                <td>{e.by}</td>
                <td className="entries-table__date">{e.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}