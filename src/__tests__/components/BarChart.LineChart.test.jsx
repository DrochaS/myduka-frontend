import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import BarChart from '../../components/charts/BarChart.jsx'
import LineChart from '../../components/charts/LineChart.jsx'

vi.mock('react-chartjs-2', () => ({
  Bar: (props) => (
    <div data-testid="bar-chart">{JSON.stringify(props.data)}</div>
  ),
  Line: (props) => (
    <div data-testid="line-chart">{JSON.stringify(props.data)}</div>
  ),
}))

describe('BarChart', () => {
  it('renders comparison data through the Chart.js bar adapter', () => {
    render(
      <BarChart
        labels={['Amina', 'Brian']}
        values={[10, 20]}
        label="Stock actions"
      />,
    )
    const node = screen.getByTestId('bar-chart')
    expect(node.textContent).toContain('Amina')
    expect(node.textContent).toContain('Stock actions')
  })
})

describe('LineChart', () => {
  it('renders trend data through the Chart.js line adapter', () => {
    render(
      <LineChart labels={['Mon', 'Tue']} values={[5, 8]} label="Entries" />,
    )
    const node = screen.getByTestId('line-chart')
    expect(node.textContent).toContain('Mon')
    expect(node.textContent).toContain('Entries')
  })
})
