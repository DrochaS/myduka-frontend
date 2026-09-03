import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Table from '../../components/common/Table'

describe('Table', () => {
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'sku', label: 'SKU' },
    { key: 'quantity', label: 'Quantity' },
    {
      key: 'price',
      label: 'Price',
      render: (value) => `KES ${value}`,
    },
  ]

  it('renders column headers and cell values', () => {
    render(
      <Table
        columns={columns}
        rows={[
          { id: 1, name: 'Flour', sku: 'FL-01', quantity: 20, price: 150 },
        ]}
      />,
    )

    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('SKU')).toBeInTheDocument()
    expect(screen.getByText('Flour')).toBeInTheDocument()
    expect(screen.getByText('FL-01')).toBeInTheDocument()
    expect(screen.getByText('KES 150')).toBeInTheDocument()
  })

  it('shows the empty message when there are no rows', () => {
    render(
      <Table columns={columns} rows={[]} emptyMessage="Nothing in stock" />,
    )
    expect(screen.getByText('Nothing in stock')).toBeInTheDocument()
  })
})
