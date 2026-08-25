import { Bar } from 'react-chartjs-2'
import { chartColors, mergeChartOptions } from './charts.js'

/**
 * Bar chart for comparisons (category sales, clerk performance, etc.).
 *
 * @param {object} props
 * @param {string[]} props.labels
 * @param {number[]} props.values
 * @param {string} [props.label='Series']
 * @param {string} [props.title]
 * @param {import('chart.js').ChartOptions} [props.options]
 * @param {string} [props.className]
 */
export default function BarChart({
  labels = [],
  values = [],
  label = 'Series',
  title,
  options,
  className,
}) {
  const data = {
    labels,
    datasets: [
      {
        label,
        data: values,
        backgroundColor: chartColors.primary,
        borderColor: chartColors.primary,
        borderWidth: 1,
        borderRadius: 4,
        maxBarThickness: 48,
      },
    ],
  }

  const chartOptions = mergeChartOptions({
    ...options,
    plugins: {
      ...options?.plugins,
      title: title
        ? { display: true, text: title, color: chartColors.text }
        : options?.plugins?.title,
    },
  })

  return (
    <div className={className} style={{ position: 'relative', width: '100%', height: '100%', minHeight: 240 }}>
      <Bar data={data} options={chartOptions} />
    </div>
  )
}
