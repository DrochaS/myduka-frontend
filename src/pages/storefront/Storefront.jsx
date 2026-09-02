import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  fetchStorefrontProducts,
  addToCart,
  updateCartQuantity,
  removeFromCart,
} from '../../redux/slices/storefrontSlice'
import { formatCurrency } from '../../utils/formatters'
import Loader from '../../components/common/Loader'
import './Storefront.css'

const DEFAULT_STORE_ID = 1

export default function Storefront() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { products, productsStatus, productsError, cartItems } = useSelector(
    (state) => state.storefront,
  )

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchStorefrontProducts(DEFAULT_STORE_ID))
  }, [dispatch])

  const categories = useMemo(() => {
    const set = new Set(products.map((product) => product.category).filter(Boolean))
    return ['all', ...set]
  }, [products])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = category === 'all' || product.category === category
      return matchesSearch && matchesCategory
    })
  }, [products, search, category])

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cartItems.reduce((sum, item) => sum + item.quantity * item.sell_price, 0)

  return (
    <div className="storefront">
      <header className="storefront__nav">
        <span className="storefront__logo">MyDuka</span>
        <div className="storefront__search">
          <i className="storefront__search-icon" aria-hidden="true">
            🔍
          </i>
          <input
            type="text"
            placeholder="Search products"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <button
          type="button"
          className="storefront__cart-button"
          onClick={() => setCartOpen(true)}
          aria-label={`Open cart, ${cartCount} items`}
        >
          Cart
          {cartCount > 0 && <span className="storefront__cart-badge">{cartCount}</span>}
        </button>
      </header>

      <div className="storefront__categories">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`storefront__chip ${category === cat ? 'storefront__chip--active' : ''}`}
            onClick={() => setCategory(cat)}
          >
            {cat === 'all' ? 'All' : cat}
          </button>
        ))}
      </div>

      {productsStatus === 'loading' && <Loader label="Loading products…" />}
      {productsStatus === 'failed' && (
        <p className="storefront__error">{productsError}</p>
      )}

      {productsStatus === 'succeeded' && (
        <div className="storefront__grid">
          {filteredProducts.map((product) => {
            const inCart = cartItems.find((item) => item.product_id === product.id)
            const outOfStock = product.quantity_in_stock <= 0
            return (
              <div key={product.id} className="storefront__card">
                <div className="storefront__card-image" aria-hidden="true">
                  {product.name.charAt(0)}
                </div>
                <p className="storefront__card-name">{product.name}</p>
                <p className="storefront__card-price">{formatCurrency(product.sell_price)}</p>
                <button
                  type="button"
                  className="storefront__add-button"
                  disabled={outOfStock}
                  onClick={() => dispatch(addToCart(product))}
                >
                  {outOfStock ? 'Out of stock' : inCart ? `In cart (${inCart.quantity})` : 'Add to cart'}
                </button>
              </div>
            )
          })}
          {filteredProducts.length === 0 && (
            <p className="storefront__empty">No products match your search.</p>
          )}
        </div>
      )}

      {cartOpen && (
        <div className="storefront__cart-overlay" onClick={() => setCartOpen(false)}>
          <div
            className="storefront__cart-drawer"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="storefront__cart-header">
              <span>Your cart</span>
              <button
                type="button"
                className="storefront__cart-close"
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
              >
                ×
              </button>
            </div>

            {cartItems.length === 0 && (
              <p className="storefront__cart-empty">Your cart is empty.</p>
            )}

            <div className="storefront__cart-items">
              {cartItems.map((item) => (
                <div key={item.product_id} className="storefront__cart-item">
                  <div className="storefront__cart-item-info">
                    <p className="storefront__cart-item-name">{item.name}</p>
                    <p className="storefront__cart-item-price">
                      {formatCurrency(item.sell_price)}
                    </p>
                  </div>
                  <div className="storefront__cart-item-controls">
                    <button
                      type="button"
                      onClick={() =>
                        dispatch(
                          updateCartQuantity({
                            productId: item.product_id,
                            quantity: item.quantity - 1,
                          }),
                        )
                      }
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() =>
                        dispatch(
                          updateCartQuantity({
                            productId: item.product_id,
                            quantity: item.quantity + 1,
                          }),
                        )
                      }
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="storefront__cart-remove"
                      onClick={() => dispatch(removeFromCart(item.product_id))}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {cartItems.length > 0 && (
              <div className="storefront__cart-footer">
                <div className="storefront__cart-total">
                  <span>Total</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
                <button
                  type="button"
                  className="storefront__checkout-button"
                  onClick={() => navigate('/shop/checkout')}
                >
                  Proceed to checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}