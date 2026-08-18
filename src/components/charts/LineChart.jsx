import { Line } from 'react-chartjs-2'
import { chartColors, mergeChartOptions } from './charts.js'

/**
 * Line chart for trends (sales, stock levels over time).
 *
 * @param {object} props
 * @param {string[]} props.labels
 * @param {number[]} props.values
 * @param {string} [props.label='Series']
 * @param {string} [props.title]
 * @param {import('chart.js').ChartOptions} [props.options]
 * @param {string} [props.className]
 */
export default function LineChart({
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
        borderColor: chartColors.primary,
        backgroundColor: chartColors.primaryFill,
        fill: true,
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 5,
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
      <Line data={data} options={chartOptions} />
    </div>
  )
}
