import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { formatCurrency } from '../../utils/formatters'
import './Checkout.css'
import './Orderconfirmation.css'

export default function OrderConfirmation() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const lastOrder = useSelector((state) => state.storefront.lastOrder)

  const order = location.state?.order || lastOrder

  if (!order || String(order.id) !== String(id)) {
    return (
      <div className="checkout checkout--empty">
        <p>We couldn't find that order.</p>
        <button type="button" onClick={() => navigate('/shop')}>
          Back to shop
        </button>
      </div>
    )
  }

  return (
    <div className="checkout">
      <div className="confirmation">
        <div className="confirmation__icon">✓</div>
        <h1>Order placed</h1>
        <p className="confirmation__order-id">Order #{order.id}</p>

        {order.payment_method === 'mpesa' && order.payment_status === 'pending' && (
          <p className="confirmation__hint">
            {order.mpesa_customer_message || 'Check your phone to complete payment.'}
          </p>
        )}
        {order.payment_method === 'cash' && (
          <p className="confirmation__hint">Pay in cash when your order is delivered.</p>
        )}
        {order.payment_status === 'paid' && (
          <p className="confirmation__hint confirmation__hint--success">Payment confirmed.</p>
        )}

        <div className="confirmation__items">
          {order.items.map((item) => (
            <div key={item.id} className="checkout__summary-row">
              <span>
                {item.product_name} × {item.quantity}
              </span>
              <span>{formatCurrency(item.subtotal)}</span>
            </div>
          ))}
          <div className="checkout__summary-total">
            <span>Total</span>
            <span>{formatCurrency(order.total_amount)}</span>
          </div>
        </div>

        <button type="button" className="checkout__submit" onClick={() => navigate('/shop')}>
          Continue shopping
        </button>
      </div>
    </div>
  )
}