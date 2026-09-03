import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import {
  fetchStorefrontProducts,
  addToCart,
  updateCartQuantity,
  removeFromCart,
} from '../../redux/slices/storefrontSlice'
import { formatCurrency } from '../../utils/formatters'
import Loader from '../../components/common/Loader'
import { useAuth } from '../../hooks/useAuth'
import './Storefront.css'

const DEFAULT_STORE_ID = 1

// Product category icons (placeholder for actual icons)
const categoryIcons = {
  Dairy: '🥛',
  Bakery: '🍞',
  Groceries: '🛒',
  Beverages: '☕',
  default: '📦',
}

// Stock status indicator
function StockBadge({ quantity }) {
  if (quantity <= 0) {
    return <span className="storefront__stock-badge storefront__stock-badge--out">Out of stock</span>
  }
  if (quantity <= 10) {
    return <span className="storefront__stock-badge storefront__stock-badge--low">Low stock</span>
  }
  if (quantity <= 5) {
    return <span className="storefront__stock-badge storefront__stock-badge--critical">Only {quantity} left</span>
  }
  return <span className="storefront__stock-badge storefront__stock-badge--in_stock">In stock</span>
}

// Product card component
function ProductCard({ product, inCart, dispatch, addToCart }) {
  const outOfStock = product.quantity_in_stock <= 0
  const handleAddToCart = () => {
    if (!outOfStock) {
      dispatch(addToCart(product))
    }
  }

  const getCategoryIcon = (category) => categoryIcons[category] || categoryIcons.default

  return (
    <div className="storefront__card">
      <div className="storefront__card-image-container">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name}
            className="storefront__card-image"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}
        <div className="storefront__card-image-placeholder">
          <span className="storefront__card-icon">{getCategoryIcon(product.category)}</span>
        </div>
        {product.quantity_in_stock <= 10 && product.quantity_in_stock > 0 && (
          <span className="storefront__stock-badge-floating">Low stock</span>
        )}
        {product.quantity_in_stock <= 0 && (
          <span className="storefront__stock-badge-floating storefront__stock-badge--out">Sold out</span>
        )}
      </div>
      
      <div className="storefront__card-content">
        <div className="storefront__card-category">{product.category}</div>
        <h3 className="storefront__card-name">{product.name}</h3>
        <div className="storefront__card-price-row">
          <span className="storefront__card-price">{formatCurrency(product.sell_price)}</span>
          {inCart && <span className="storefront__card-in-cart">In cart ({inCart.quantity})</span>}
        </div>
        
        <button
          type="button"
          className={`storefront__add-button ${outOfStock ? 'storefront__add-button--disabled' : ''}`}
          disabled={outOfStock}
          onClick={handleAddToCart}
        >
          {outOfStock ? 'Out of stock' : inCart ? 'Added to cart' : 'Add to cart'}
        </button>
      </div>
    </div>
  )
}

// Cart item component
function CartItem({ item, dispatch, updateCartQuantity, removeFromCart }) {
  return (
    <div className="storefront__cart-item">
      <div className="storefront__cart-item-image">
        <span className="storefront__cart-item-icon">🛒</span>
      </div>
      <div className="storefront__cart-item-info">
        <h4 className="storefront__cart-item-name">{item.name}</h4>
        <span className="storefront__cart-item-price">{formatCurrency(item.sell_price)}</span>
        <StockBadge quantity={item.quantity_in_stock} />
      </div>
      <div className="storefront__cart-item-controls">
        <div className="storefront__cart-quantity">
          <button
            type="button"
            className="storefront__cart-qty-button"
            onClick={() => dispatch(updateCartQuantity({
              productId: item.product_id,
              quantity: item.quantity - 1,
            }))}
            disabled={item.quantity <= 1}
            aria-label={`Decrease quantity of ${item.name}`}
          >
            −
          </button>
          <span className="storefront__cart-qty-value">{item.quantity}</span>
          <button
            type="button"
            className="storefront__cart-qty-button"
            onClick={() => dispatch(updateCartQuantity({
              productId: item.product_id,
              quantity: item.quantity + 1,
            }))}
            disabled={item.quantity >= item.quantity_in_stock}
            aria-label={`Increase quantity of ${item.name}`}
          >
            +
          </button>
        </div>
        <button
          type="button"
          className="storefront__cart-remove"
          onClick={() => dispatch(removeFromCart(item.product_id))}
          aria-label={`Remove ${item.name} from cart`}
        >
          ×
        </button>
      </div>
    </div>
  )
}

// Empty state component
function EmptyState({ title, message, action, onAction }) {
  return (
    <div className="storefront__empty-state">
      <div className="storefront__empty-icon">🛒</div>
      <h3 className="storefront__empty-title">{title}</h3>
      <p className="storefront__empty-message">{message}</p>
      {action && onAction && (
        <button type="button" className="storefront__empty-action" onClick={onAction}>
          {action}
        </button>
      )}
    </div>
  )
}

export default function Storefront() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, role, user } = useAuth()
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
    return ['all', ...Array.from(set).sort()]
  }, [products])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const productName = product.name || ''
      const productCategory = product.category || ''
      const normalizedSearch = search.toLowerCase()
      const matchesSearch = productName.toLowerCase().includes(normalizedSearch) ||
                           productCategory.toLowerCase().includes(normalizedSearch)
      const matchesCategory = category === 'all' || product.category === category
      return matchesSearch && matchesCategory
    })
  }, [products, search, category])

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cartItems.reduce((sum, item) => sum + item.quantity * item.sell_price, 0)

  return (
    <div className="storefront">
      {/* Header with navigation */}
      <header className="storefront__header">
        <div className="storefront__header-container">
          <Link to="/shop" className="storefront__logo-link" style={{ textDecoration: 'none' }}>
            <div className="storefront__logo">
              <span className="storefront__logo-icon">🏪</span>
              <span className="storefront__logo-text">MyDuka</span>
            </div>
          </Link>
          
          <div className="storefront__search-container">
            <div className="storefront__search">
              <i className="storefront__search-icon" aria-hidden="true">
                🔍
              </i>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="storefront__search-input"
              />
              {search && (
                <button 
                  type="button" 
                  className="storefront__search-clear"
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          
          <div className="storefront__header-actions">
            {isAuthenticated ? (
              <Link
                to="/"
                className="storefront__dashboard-link"
              >
                <span className="storefront__dashboard-icon">👤</span>
                <span>Dashboard</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="storefront__signin-link"
              >
                <span>Staff sign in</span>
              </Link>
            )}
            
            <button
              type="button"
              className="storefront__cart-button"
              onClick={() => setCartOpen(true)}
              aria-label={`Open cart, ${cartCount} items`}
            >
              <span className="storefront__cart-icon">🛒</span>
              {cartCount > 0 && <span className="storefront__cart-badge">{cartCount}</span>}
              <span className="storefront__cart-text">Cart</span>
            </button>
          </div>
        </div>
      </header>

      <main className="storefront__main">
        {/* Hero section */}
        <section className="storefront__hero">
          <div className="storefront__hero-content">
            <h1 className="storefront__hero-title">
              Welcome to <span className="storefront__hero-highlight">MyDuka</span>
            </h1>
            <p className="storefront__hero-subtitle">
              Fresh groceries and everyday essentials delivered to your doorstep
            </p>
          </div>
          <div className="storefront__hero-actions">
            <div className="storefront__categories-scroll">
              <div className="storefront__categories">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`storefront__chip ${category === cat ? 'storefront__chip--active' : ''}`}
                    onClick={() => setCategory(cat)}
                  >
                    <span className="storefront__chip-text">
                      {cat === 'all' ? 'All Products' : cat}
                    </span>
                    {category === cat && <span className="storefront__chip-check">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Loading state */}
        {productsStatus === 'loading' && (
          <div className="storefront__loading">
            <Loader label="Loading products..." />
          </div>
        )}

        {/* Error state */}
        {productsStatus === 'failed' && (
          <div className="storefront__error-state">
            <EmptyState
              title="Something went wrong"
              message={productsError || 'Failed to load products'}
              action="Retry"
              onAction={() => dispatch(fetchStorefrontProducts(DEFAULT_STORE_ID))}
            />
          </div>
        )}

        {/* Products grid */}
        {productsStatus === 'succeeded' && (
          <section className="storefront__products">
            {filteredProducts.length > 0 ? (
              <div className="storefront__grid">
                {filteredProducts.map((product) => {
                  const inCart = cartItems.find((item) => item.product_id === product.id)
                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      inCart={inCart}
                      dispatch={dispatch}
                      addToCart={addToCart}
                    />
                  )
                })}
              </div>
            ) : (
              <EmptyState
                title="No products found"
                message={search || category !== 'all' 
                  ? `No products match your ${search ? 'search' : 'filter'}.` 
                  : 'There are no products available at the moment.'}
                action="Clear filters"
                onAction={() => {
                  setSearch('')
                  setCategory('all')
                }}
              />
            )}
          </section>
        )}
      </main>

      {/* Cart drawer overlay */}
      {cartOpen && (
        <div 
          className="storefront__cart-overlay" 
          onClick={() => setCartOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Cart drawer */}
      <aside className={`storefront__cart-drawer ${cartOpen ? 'storefront__cart-drawer--open' : ''}`}>
        <div className="storefront__cart-header">
          <div className="storefront__cart-title">
            <span className="storefront__cart-title-icon">🛒</span>
            <h2 className="storefront__cart-title-text">Your Cart</h2>
          </div>
          <button
            type="button"
            className="storefront__cart-close"
            onClick={() => setCartOpen(false)}
            aria-label="Close cart"
          >
            ×
          </button>
        </div>

        {cartItems.length === 0 ? (
          <EmptyState
            title="Your cart is empty"
            message="Add items to your cart to get started"
            action="Continue shopping"
            onAction={() => setCartOpen(false)}
          />
        ) : (
          <>
            <div className="storefront__cart-items-container">
              <div className="storefront__cart-items">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.product_id}
                    item={item}
                    dispatch={dispatch}
                    updateCartQuantity={updateCartQuantity}
                    removeFromCart={removeFromCart}
                  />
                ))}
              </div>
            </div>

            <div className="storefront__cart-footer">
              <div className="storefront__cart-summary">
                <div className="storefront__cart-summary-row">
                  <span>Subtotal</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
                <div className="storefront__cart-summary-row">
                  <span>Delivery</span>
                  <span>Free</span>
                </div>
                <div className="storefront__cart-summary-row storefront__cart-summary-row--total">
                  <span>Total</span>
                  <span className="storefront__cart-total-amount">{formatCurrency(cartTotal)}</span>
                </div>
              </div>

              <button
                type="button"
                className="storefront__checkout-button"
                onClick={() => {
                  setCartOpen(false)
                  navigate('/shop/checkout')
                }}
              >
                <span>Proceed to Checkout</span>
                <span className="storefront__checkout-arrow">→</span>
              </button>

              <button
                type="button"
                className="storefront__continue-shopping"
                onClick={() => setCartOpen(false)}
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}