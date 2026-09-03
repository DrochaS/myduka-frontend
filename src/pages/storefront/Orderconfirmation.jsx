import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { formatCurrency } from '../../utils/formatters'
import './Checkout.css'
import './Orderconfirmation.css'

// Order item component for confirmation
function ConfirmationItem({ item }) {
  return (
    <div className="confirmation__item">
      <div className="confirmation__item-info">
        <span className="confirmation__item-name">{item.product_name}</span>
        <span className="confirmation__item-quantity">× {item.quantity}</span>
      </div>
      <span className="confirmation__item-price">{formatCurrency(item.subtotal)}</span>
    </div>
  )
}

// Order summary component
function OrderSummary({ order }) {
  return (
    <div className="confirmation__summary">
      <h3 className="confirmation__summary-title">Order Summary</h3>
      <div className="confirmation__items">
        {order.items.map((item) => (
          <ConfirmationItem key={item.id} item={item} />
        ))}
      </div>
      <div className="confirmation__totals">
        <div className="confirmation__total-row">
          <span>Subtotal</span>
          <span>{formatCurrency(order.total_amount - (order.delivery_fee || 0))}</span>
        </div>
        {order.delivery_fee && (
          <div className="confirmation__total-row">
            <span>Delivery</span>
            <span>{formatCurrency(order.delivery_fee)}</span>
          </div>
        )}
        <div className="confirmation__total-row confirmation__total-row--grand">
          <span>Total</span>
          <span className="confirmation__grand-amount">{formatCurrency(order.total_amount)}</span>
        </div>
      </div>
    </div>
  )
}

// Status indicator
function PaymentStatus({ order }) {
  const statusMap = {
    paid: {
      icon: '✅',
      title: 'Payment Confirmed',
      message: 'Your payment has been successfully processed.',
      color: 'var(--success)'
    },
    pending: {
      icon: '⏳',
      title: 'Payment Pending',
      message: order.mpesa_customer_message || 'Check your phone to complete payment.',
      color: 'var(--warning)'
    },
    failed: {
      icon: '❌',
      title: 'Payment Failed',
      message: 'There was an issue with your payment. Please try again.',
      color: 'var(--danger)'
    }
  }

  const status = statusMap[order.payment_status] || statusMap.pending

  return (
    <div className="confirmation__status" data-status={order.payment_status}>
      <div className="confirmation__status-icon">{status.icon}</div>
      <div className="confirmation__status-content">
        <h4 className="confirmation__status-title">{status.title}</h4>
        <p className="confirmation__status-message">{status.message}</p>
      </div>
    </div>
  )
}

// Action buttons
function ActionButtons({ order, onContinueShopping, onViewOrder }) {
  return (
    <div className="confirmation__actions">
      <button type="button" className="confirmation__action-primary" onClick={onContinueShopping}>
        Continue Shopping
      </button>
      <button type="button" className="confirmation__action-secondary" onClick={onViewOrder}>
        View Order Details
      </button>
    </div>
  )
}

export default function OrderConfirmation() {
  const { orderId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const lastOrder = useSelector((state) => state.storefront.lastOrder)

  const order = location.state?.order || lastOrder

  if (!order || String(order.id) !== String(orderId)) {
    return (
      <div className="confirmation confirmation--error">
        <div className="confirmation__error-icon">❌</div>
        <h2 className="confirmation__error-title">Order Not Found</h2>
        <p className="confirmation__error-message">We couldn't find that order. It may have expired or been cancelled.</p>
        <button 
          type="button" 
          className="confirmation__error-action"
          onClick={() => navigate('/shop')}
        >
          Back to shop
        </button>
      </div>
    )
  }

  return (
    <div className="confirmation-page">
      <header className="confirmation__header">
        <div className="confirmation__header-container">
          <div className="confirmation__logo">
            <span className="confirmation__logo-icon">🏪</span>
            <span className="confirmation__logo-text">MyDuka</span>
          </div>
        </div>
      </header>

      <main className="confirmation__main">
        <div className="confirmation">
          {/* Success indicator */}
          <div className="confirmation__success">
            <div className="confirmation__success-icon">✅</div>
            <h1 className="confirmation__success-title">Order Placed Successfully!</h1>
            <p className="confirmation__order-id">Order #{order.id}</p>
          </div>

          {/* Payment status */}
          <PaymentStatus order={order} />

          {/* Delivery info */}
          <div className="confirmation__delivery">
            <div className="confirmation__delivery-icon">🚚</div>
            <div className="confirmation__delivery-content">
              <h4 className="confirmation__delivery-title">Delivery Information</h4>
              <p className="confirmation__delivery-message">
                {order.payment_method === 'cash' 
                  ? 'Pay in cash when your order is delivered.'
                  : 'Your order will be delivered to your location.'}
              </p>
            </div>
          </div>

          {/* Order summary */}
          <OrderSummary order={order} />

          {/* Order details */}
          <div className="confirmation__details">
            <h4 className="confirmation__details-title">Order Details</h4>
            <div className="confirmation__details-grid">
              <div className="confirmation__detail">
                <span className="confirmation__detail-label">Order ID</span>
                <span className="confirmation__detail-value">#{order.id}</span>
              </div>
              <div className="confirmation__detail">
                <span className="confirmation__detail-label">Payment Method</span>
                <span className="confirmation__detail-value">
                  {order.payment_method === 'mpesa' ? 'M-Pesa' : 
                   order.payment_method === 'card' ? 'Card' : 'Cash on Delivery'}
                </span>
              </div>
              <div className="confirmation__detail">
                <span className="confirmation__detail-label">Customer</span>
                <span className="confirmation__detail-value">{order.customer_name}</span>
              </div>
              <div className="confirmation__detail">
                <span className="confirmation__detail-label">Phone</span>
                <span className="confirmation__detail-value">{order.customer_phone}</span>
              </div>
              <div className="confirmation__detail">
                <span className="confirmation__detail-label">Date</span>
                <span className="confirmation__detail-value">
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="confirmation__detail">
                <span className="confirmation__detail-label">Status</span>
                <span className="confirmation__detail-value confirmation__detail-value--status">
                  {order.status === 'confirmed' ? 'Confirmed' : order.status}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <ActionButtons
            order={order}
            onContinueShopping={() => navigate('/shop')}
            onViewOrder={() => navigate('/shop')}
          />
        </div>
      </main>
    </div>
  )
}