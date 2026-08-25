import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../../components/common/Loader'
import { LineChart, BarChart } from '../../components/charts'
import { fetchStoreAnalytics } from '../../redux/slices/analyticsSlice'
import './StoreAnalytics.css'

const FALLBACK = {
  byStore: {
    labels: ['Westlands', 'CBD', 'Karen', 'Thika Road'],
    values: [120, 98, 76, 84],
    label: 'Sales (KES thousands)',
  },
  byProduct: {
    labels: ['Flour', 'Milk', 'Soap', 'Rice', 'Oil'],
    values: [40, 32, 18, 28, 22],
    label: 'Units sold',
  },
}

export default function StoreAnalytics() {
  const dispatch = useDispatch()
  const { storeAnalytics, status, error } = useSelector((state) => state.analytics)
  const byStore = storeAnalytics?.byStore || FALLBACK.byStore
  const byProduct = storeAnalytics?.byProduct || FALLBACK.byProduct

  useEffect(() => {
    dispatch(fetchStoreAnalytics())
  }, [dispatch])

  return (
    <div className="page analytics-page">
      <div className="page__header">
        <div>
          <h1>Store analytics</h1>
          <p>Compare store performance and top-moving products.</p>
        </div>
      </div>

      {error ? (
        <div className="error-banner">
          {error} Showing sample charts until the API responds.
        </div>
      ) : null}

      {status === 'loading' && !storeAnalytics ? (
        <Loader label="Loading analytics…" />
      ) : (
        <div className="chart-grid">
          <div className="panel chart-panel">
            <h2 className="panel__title">Sales by store</h2>
            <LineChart
              labels={byStore.labels}
              values={byStore.values}
              label={byStore.label || 'Sales'}
            />
          </div>
          <div className="panel chart-panel">
            <h2 className="panel__title">Product movement</h2>
            <BarChart
              labels={byProduct.labels}
              values={byProduct.values}
              label={byProduct.label || 'Units'}
            />
          </div>
        </div>
      )}
    </div>
  )
}
