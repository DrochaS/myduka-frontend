import './Table.css'

export default function Table({ columns = [], rows = [], emptyMessage = 'No records yet.' }) {
  if (!rows.length) {
    return <p className="table-empty">{emptyMessage}</p>
  }

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id ?? JSON.stringify(row)}>
              {columns.map((col) => (
                <td key={col.key}>
                  {typeof col.render === 'function'
                    ? col.render(row[col.key], row)
                    : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
