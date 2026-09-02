import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { submitCheckout, clearCheckoutError } from '../../redux/slices/storefrontSlice'
import { formatCurrency } from '../../utils/formatters'
import { isValidPhone, required } from '../../utils/validators'
import Loader from '../../components/common/Loader'
import './Checkout.css'

const DEFAULT_STORE_ID = 1

const PAYMENT_METHODS = [
  { 
    id: 'mpesa', 
    label: 'M-Pesa', 
    icon: '📱', 
    description: 'Pay via mobile money'
  },
  { 
    id: 'card', 
    label: 'Card', 
    icon: '💳', 
    description: 'Visa, Mastercard, and more'
  },
  { 
    id: 'cash', 
    label: 'Cash on Delivery', 
    icon: '💵', 
    description: 'Pay when delivered'
  },
]

// Payment method icons for visual selection
function PaymentMethodOption({ method, selected, onSelect, disabled }) {
  return (
    <label className={`checkout__payment-option ${selected ? 'checkout__payment-option--selected' : ''}`}>
      <input
        type="radio"
        name="payment_method"
        value={method.id}
        checked={selected}
        onChange={() => onSelect(method.id)}
        disabled={disabled}
      />
      <div className="checkout__payment-option-content">
        <span className="checkout__payment-option-icon">{method.icon}</span>
        <div className="checkout__payment-option-details">
          <span className="checkout__payment-option-label">{method.label}</span>
          <span className="checkout__payment-option-description">{method.description}</span>
        </div>
      </div>
    </label>
  )
}

// Order summary item
function OrderSummaryItem({ item }) {
  return (
    <div className="checkout__summary-row">
      <div className="checkout__summary-item-info">
        <span className="checkout__summary-item-name">{item.name}</span>
        <span className="checkout__summary-item-quantity">× {item.quantity}</span>
      </div>
      <span className="checkout__summary-item-price">{formatCurrency(item.quantity * item.sell_price)}</span>
    </div>
  )
}

// Form input component
function FormInput({ label, type = 'text', value, onChange, placeholder, error, required = false, disabled = false }) {
  return (
    <div className="checkout__form-group">
      <label className="checkout__form-label">
        {label}
        {required && <span className="checkout__form-required">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`checkout__form-input ${error ? 'checkout__form-input--error' : ''}`}
      />
      {error && <span className="checkout__form-error">{error}</span>}
    </div>
  )
}

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
        <div className="checkout__empty-icon">🛒</div>
        <h2 className="checkout__empty-title">Your cart is empty</h2>
        <p className="checkout__empty-message">Looks like you haven't added anything to your cart yet</p>
        <button 
          type="button" 
          className="checkout__empty-action"
          onClick={() => navigate('/shop')}
        >
          Back to shop
        </button>
      </div>
    )
  }

  return (
    <div className="checkout">
      <div className="checkout__header">
        <button type="button" className="checkout__back" onClick={() => navigate('/shop')}>
          <span className="checkout__back-icon">←</span>
          <span>Back to shop</span>
        </button>
      </div>

      <div className="checkout__container">
        <h1 className="checkout__title">Checkout</h1>
        
        <div className="checkout__layout">
          {/* Main form */}
          <div className="checkout__main">
            <form className="checkout__form" onSubmit={handleSubmit}>
              {/* Progress indicator */}
              <div className="checkout__progress">
                <div className="checkout__progress-step checkout__progress-step--active">
                  <span className="checkout__progress-number">1</span>
                  <span className="checkout__progress-label">Details</span>
                </div>
                <div className="checkout__progress-connector"></div>
                <div className="checkout__progress-step">
                  <span className="checkout__progress-number">2</span>
                  <span className="checkout__progress-label">Payment</span>
                </div>
                <div className="checkout__progress-connector"></div>
                <div className="checkout__progress-step">
                  <span className="checkout__progress-number">3</span>
                  <span className="checkout__progress-label">Confirm</span>
                </div>
              </div>

              {/* Customer Information */}
              <section className="checkout__section">
                <h2 className="checkout__section-title">Customer Information</h2>
                
                <FormInput
                  label="Full Name"
                  type="text"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="Enter your full name"
                  error={fieldErrors.customerName}
                  required
                />

                <FormInput
                  label="Phone Number"
                  type="tel"
                  value={customerPhone}
                  onChange={(event) => setCustomerPhone(event.target.value)}
                  placeholder="0712 345 678"
                  error={fieldErrors.customerPhone}
                  required
                />
              </section>

              {/* Payment Method */}
              <section className="checkout__section">
                <h2 className="checkout__section-title">Payment Method</h2>
                
                <div className="checkout__payment-methods">
                  {PAYMENT_METHODS.map((method) => (
                    <PaymentMethodOption
                      key={method.id}
                      method={method}
                      selected={paymentMethod === method.id}
                      onSelect={setPaymentMethod}
                      disabled={checkoutStatus === 'loading'}
                    />
                  ))}
                </div>

                {/* Card details (conditional) */}
                {paymentMethod === 'card' && (
                  <div className="checkout__card-details">
                    <FormInput
                      label="Card Number"
                      type="text"
                      value={cardNumber}
                      onChange={(event) => setCardNumber(event.target.value)}
                      placeholder="4242 4242 4242 4242"
                      error={fieldErrors.cardNumber}
                      required
                    />
                    <div className="checkout__card-hint">
                      <span className="checkout__card-hint-icon">ℹ️</span>
                      <span>We accept Visa, Mastercard, and all major credit cards</span>
                    </div>
                  </div>
                )}

                {/* Payment method hints */}
                <div className="checkout__payment-hint">
                  {paymentMethod === 'mpesa' && (
                    <div className="checkout__payment-hint-content">
                      <span className="checkout__payment-hint-icon">📱</span>
                      <span>
                        You'll receive an M-Pesa prompt on <strong>{customerPhone || 'your phone'}</strong> to complete payment.
                      </span>
                    </div>
                  )}
                  {paymentMethod === 'cash' && (
                    <div className="checkout__payment-hint-content">
                      <span className="checkout__payment-hint-icon">💵</span>
                      <span>Pay in cash when your order is delivered.</span>
                    </div>
                  )}
                  {paymentMethod === 'card' && (
                    <div className="checkout__payment-hint-content">
                      <span className="checkout__payment-hint-icon">🔒</span>
                      <span>Secure payment processing. Your details are encrypted.</span>
                    </div>
                  )}
                </div>

                {/* Error display */}
                {checkoutError && (
                  <div className="checkout__error">
                    <span className="checkout__error-icon">⚠️</span>
                    <span>{checkoutError}</span>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  className="checkout__submit"
                  disabled={checkoutStatus === 'loading'}
                >
                  {checkoutStatus === 'loading' ? (
                    <>
                      <Loader size="small" inline />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Payment</span>
                      <span className="checkout__submit-amount">{formatCurrency(total)}</span>
                    </>
                  )}
                </button>
              </section>
            </form>
            </div>

            {/* Order Summary Sidebar */}
            <div className="checkout__sidebar">
              <div className="checkout__summary">
                <h2 className="checkout__summary-title">Order Summary</h2>
                
                <div className="checkout__summary-items">
                  {cartItems.map((item) => (
                    <OrderSummaryItem key={item.product_id} item={item} />
                  ))}
                </div>

                <div className="checkout__summary-totals">
                  <div className="checkout__summary-total-row">
                    <span>Subtotal</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                  <div className="checkout__summary-total-row">
                    <span>Delivery</span>
                    <span className="checkout__summary-free">Free</span>
                  </div>
                  <div className="checkout__summary-total-row checkout__summary-total-row--grand">
                    <span>Total</span>
                    <span className="checkout__summary-grand-amount">{formatCurrency(total)}</span>
                  </div>
                </div>

                {/* Trust badges */}
                <div className="checkout__trust-badges">
                  <span className="checkout__trust-badge">🛡️ Secure checkout</span>
                  <span className="checkout__trust-badge">📦 Free delivery</span>
                  <span className="checkout__trust-badge">✅ Easy returns</span>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  )
}