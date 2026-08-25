/**
 * Chart.js spike / base setup for MyDuka analytics charts.
 *
 * Register only the controllers & elements we need (tree-shake friendly).
 * Import this module once before rendering any chart component.
 */
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
)

/** Shared palette aligned with app CSS variables where possible */
export const chartColors = {
  primary: '#2563eb',
  primaryFill: 'rgba(37, 99, 235, 0.15)',
  secondary: '#059669',
  secondaryFill: 'rgba(5, 150, 105, 0.15)',
  danger: '#dc2626',
  dangerFill: 'rgba(220, 38, 38, 0.15)',
  grid: 'rgba(107, 99, 117, 0.2)',
  text: '#6b6375',
}

/** Default options reused by LineChart / BarChart */
export const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: chartColors.text,
        boxWidth: 12,
        usePointStyle: true,
      },
    },
    tooltip: {
      mode: 'index',
      intersect: false,
    },
  },
  scales: {
    x: {
      grid: { color: chartColors.grid },
      ticks: { color: chartColors.text },
    },
    y: {
      beginAtZero: true,
      grid: { color: chartColors.grid },
      ticks: { color: chartColors.text },
    },
  },
}

/**
 * Merge caller options over defaults (shallow for top-level, deep for plugins/scales).
 * @param {import('chart.js').ChartOptions} [overrides]
 */
export function mergeChartOptions(overrides = {}) {
  return {
    ...defaultChartOptions,
    ...overrides,
    plugins: {
      ...defaultChartOptions.plugins,
      ...(overrides.plugins || {}),
      legend: {
        ...defaultChartOptions.plugins.legend,
        ...(overrides.plugins?.legend || {}),
      },
      tooltip: {
        ...defaultChartOptions.plugins.tooltip,
        ...(overrides.plugins?.tooltip || {}),
      },
    },
    scales: {
      ...defaultChartOptions.scales,
      ...(overrides.scales || {}),
      x: {
        ...defaultChartOptions.scales.x,
        ...(overrides.scales?.x || {}),
      },
      y: {
        ...defaultChartOptions.scales.y,
        ...(overrides.scales?.y || {}),
      },
    },
  }
}

export { ChartJS }
