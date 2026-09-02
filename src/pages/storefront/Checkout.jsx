import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { submitCheckout, clearCheckoutError } from '../../redux/slices/storefrontSlice'
import { formatCurrency } from '../../utils/formatters'
import { isValidPhone, required } from '../../utils/validators'
import './Checkout.css'

const DEFAULT_STORE_ID = 1

const PAYMENT_METHODS = [
  { id: 'card', label: 'Card' },
  { id: 'cash', label: 'Cash on delivery' },
  { id: 'mpesa', label: 'M-Pesa' },
]

export default function Checkout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { cartItems, checkoutStatus, checkoutError } = useSelector((state) => state.storefront)

  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('mpesa')
  const [cardNumber, setCardNumber] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const total = cartItems.reduce((sum, item) => sum + item.quantity * item.sell_price, 0)

  function validate() {
    const errors = {}
    const nameError = required(customerName, 'Name')
    if (nameError) errors.customerName = nameError
    if (!isValidPhone(customerPhone)) errors.customerPhone = 'Enter a valid phone number'
    if (paymentMethod === 'card' && (!cardNumber || cardNumber.replace(/\s/g, '').length < 12)) {
      errors.cardNumber = 'Enter a valid card number'
    }
    return errors
  }

  async function handleSubmit(event) {
    event.preventDefault()
    dispatch(clearCheckoutError())
    const errors = validate()
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    const payload = {
      store_id: DEFAULT_STORE_ID,
      customer_name: customerName,
      customer_phone: customerPhone,
      payment_method: paymentMethod,
      items: cartItems.map((item) => ({
        product_id: item.product_id,
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.sell_price,
      })),
    }

    const result = await dispatch(submitCheckout(payload))
    if (submitCheckout.fulfilled.match(result)) {
      navigate(`/shop/order/${result.payload.id}`, { state: { order: result.payload } })
    }
  }

  if (cartItems.length === 0 && checkoutStatus !== 'loading') {
    return (
      <div className="checkout checkout--empty">
        <p>Your cart is empty.</p>
        <button type="button" onClick={() => navigate('/shop')}>
          Back to shop
        </button>
      </div>
    )
  }

  return (
    <div className="checkout">
      <button type="button" className="checkout__back" onClick={() => navigate('/shop')}>
        ← Back to shop
      </button>

      <div className="checkout__layout">
        <form className="checkout__form" onSubmit={handleSubmit}>
          <h1>Checkout</h1>

          <label className="checkout__label">
            Full name
            <input
              type="text"
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              placeholder="Jane Wambui"
            />
            {fieldErrors.customerName && (
              <span className="checkout__field-error">{fieldErrors.customerName}</span>
            )}
          </label>

          <label className="checkout__label">
            Phone number
            <input
              type="tel"
              value={customerPhone}
              onChange={(event) => setCustomerPhone(event.target.value)}
              placeholder="0712345678"
            />
            {fieldErrors.customerPhone && (
              <span className="checkout__field-error">{fieldErrors.customerPhone}</span>
            )}
          </label>

          <fieldset className="checkout__payment-methods">
            <legend>Payment method</legend>
            {PAYMENT_METHODS.map((method) => (
              <label key={method.id} className="checkout__payment-option">
                <input
                  type="radio"
                  name="payment_method"
                  value={method.id}
                  checked={paymentMethod === method.id}
                  onChange={() => setPaymentMethod(method.id)}
                />
                {method.label}
              </label>
            ))}
          </fieldset>

          {paymentMethod === 'card' && (
            <label className="checkout__label">
              Card number
              <input
                type="text"
                value={cardNumber}
                onChange={(event) => setCardNumber(event.target.value)}
                placeholder="4242 4242 4242 4242"
              />
              {fieldErrors.cardNumber && (
                <span className="checkout__field-error">{fieldErrors.cardNumber}</span>
              )}
            </label>
          )}

          {paymentMethod === 'mpesa' && (
            <p className="checkout__hint">
              You'll receive an M-Pesa prompt on {customerPhone || 'your phone'} to complete
              payment.
            </p>
          )}

          {paymentMethod === 'cash' && (
            <p className="checkout__hint">Pay in cash when your order is delivered.</p>
          )}

          {checkoutError && <p className="checkout__error">{checkoutError}</p>}

          <button
            type="submit"
            className="checkout__submit"
            disabled={checkoutStatus === 'loading'}
          >
            {checkoutStatus === 'loading' ? 'Placing order…' : `Pay ${formatCurrency(total)}`}
          </button>
        </form>

        <div className="checkout__summary">
          <h2>Order summary</h2>
          {cartItems.map((item) => (
            <div key={item.product_id} className="checkout__summary-row">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{formatCurrency(item.quantity * item.sell_price)}</span>
            </div>
          ))}
          <div className="checkout__summary-total">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}