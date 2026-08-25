import { describe, it, expect } from 'vitest'
import {
  chartColors,
  defaultChartOptions,
  mergeChartOptions,
} from '../../components/charts/charts.js'

describe('chartColors', () => {
  it('exposes the primary brand palette', () => {
    expect(chartColors.primary).toBe('#2563eb')
    expect(chartColors.secondary).toBe('#059669')
    expect(chartColors.danger).toBe('#dc2626')
  })

  it('includes translucent fill variants', () => {
    expect(chartColors.primaryFill).toMatch(/rgba\(37, 99, 235/)
    expect(chartColors.secondaryFill).toMatch(/rgba\(5, 150, 105/)
  })
})

describe('defaultChartOptions', () => {
  it('keeps charts responsive without fixed aspect ratio', () => {
    expect(defaultChartOptions.responsive).toBe(true)
    expect(defaultChartOptions.maintainAspectRatio).toBe(false)
  })

  it('starts the Y axis at zero', () => {
    expect(defaultChartOptions.scales.y.beginAtZero).toBe(true)
  })
})

describe('mergeChartOptions', () => {
  it('returns defaults when called with no overrides', () => {
    const merged = mergeChartOptions()
    expect(merged.responsive).toBe(true)
    expect(merged.plugins.legend.position).toBe('top')
  })

  it('overrides top-level options while keeping nested defaults', () => {
    const merged = mergeChartOptions({ responsive: false })
    expect(merged.responsive).toBe(false)
    expect(merged.plugins.tooltip.mode).toBe('index')
  })

  it('deep-merges plugin legend overrides', () => {
    const merged = mergeChartOptions({
      plugins: { legend: { position: 'bottom' } },
    })
    expect(merged.plugins.legend.position).toBe('bottom')
    expect(merged.plugins.legend.labels.usePointStyle).toBe(true)
  })

  it('deep-merges scale overrides', () => {
    const merged = mergeChartOptions({
      scales: { y: { beginAtZero: false } },
    })
    expect(merged.scales.y.beginAtZero).toBe(false)
    expect(merged.scales.x.grid.color).toBe(chartColors.grid)
  })
})
