import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiGet, apiPost, getErrorMessage } from '../api/apiSlice'

// Flip to false once GET /api/storefront/products and
// POST /api/storefront/checkout are live on the backend.
// Shapes here match API_CONTRACTS.md exactly, so flipping this is the
// only change needed once the real endpoints ship.
const USE_MOCK = true

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'Fresh Milk 500ml',
    category: 'Dairy',
    sku: 'DRY-001',
    image_url: null,
    sell_price: 70,
    quantity_in_stock: 45,
  },
  {
    id: 2,
    name: 'Supa Loaf White Bread 400g',
    category: 'Bakery',
    sku: 'BKY-002',
    image_url: null,
    sell_price: 65,
    quantity_in_stock: 30,
  },
  {
    id: 3,
    name: 'Fresh Fri Cooking Oil 2L',
    category: 'Groceries',
    sku: 'GRO-003',
    image_url: null,
    sell_price: 600,
    quantity_in_stock: 18,
  },
  {
    id: 4,
    name: 'Kericho Gold Black Tea 100 Bags',
    category: 'Beverages',
    sku: 'BEV-004',
    image_url: null,
    sell_price: 350,
    quantity_in_stock: 25,
  },
  {
    id: 5,
    name: 'Mwea Pishori Rice 5kg',
    category: 'Groceries',
    sku: 'GRO-005',
    image_url: null,
    sell_price: 1150,
    quantity_in_stock: 12,
  },
  {
    id: 6,
    name: 'Jogoo Maize Meal 2kg',
    category: 'Groceries',
    sku: 'GRO-006',
    image_url: null,
    sell_price: 160,
    quantity_in_stock: 60,
  },
]

function loadCartFromStorage() {
  try {
    const raw = globalThis.localStorage?.getItem('myduka_cart')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveCartToStorage(items) {
  try {
    globalThis.localStorage?.setItem('myduka_cart', JSON.stringify(items))
  } catch {
    /* ignore */
  }
}

const initialState = {
  products: [],
  productsStatus: 'idle',
  productsError: null,

  cartItems: loadCartFromStorage(), // [{ product_id, name, sell_price, quantity, quantity_in_stock }]

  checkoutStatus: 'idle',
  checkoutError: null,
  lastOrder: null,
}

export const fetchStorefrontProducts = createAsyncThunk(
  'storefront/fetchProducts',
  async (storeId, { rejectWithValue }) => {
    try {
      if (USE_MOCK) {
        await new Promise((resolve) => setTimeout(resolve, 300))
        return MOCK_PRODUCTS
      }
      return await apiGet(`/storefront/products?store_id=${storeId}`)
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to load products'))
    }
  },
)

export const submitCheckout = createAsyncThunk(
  'storefront/submitCheckout',
  async (payload, { rejectWithValue }) => {
    try {
      if (USE_MOCK) {
        await new Promise((resolve) => setTimeout(resolve, 600))
        const total = payload.items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)
        return {
          id: Math.floor(Math.random() * 100000),
          store_id: payload.store_id,
          customer_name: payload.customer_name,
          customer_phone: payload.customer_phone,
          payment_method: payload.payment_method,
          payment_status: payload.payment_method === 'cash' ? 'pending' : 'paid',
          status: 'confirmed',
          total_amount: total,
          items: payload.items.map((item, index) => ({
            id: index + 1,
            product_id: item.product_id,
            product_name: item.product_name,
            quantity: item.quantity,
            unit_price: item.unit_price,
            subtotal: item.quantity * item.unit_price,
          })),
          created_at: new Date().toISOString(),
          mpesa_checkout_request_id:
            payload.payment_method === 'mpesa' ? 'ws_CO_mock_123456' : null,
          mpesa_customer_message:
            payload.payment_method === 'mpesa' ? 'Check your phone to complete payment' : null,
        }
      }
      return await apiPost('/storefront/checkout', payload)
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Checkout failed'))
    }
  },
)

const storefrontSlice = createSlice({
  name: 'storefront',
  initialState,
  reducers: {
    addToCart(state, action) {
      const product = action.payload
      const existing = state.cartItems.find((item) => item.product_id === product.id)
      if (existing) {
        if (existing.quantity < product.quantity_in_stock) {
          existing.quantity += 1
        }
      } else {
        state.cartItems.push({
          product_id: product.id,
          name: product.name,
          sell_price: product.sell_price,
          quantity: 1,
          quantity_in_stock: product.quantity_in_stock,
        })
      }
      saveCartToStorage(state.cartItems)
    },
    updateCartQuantity(state, action) {
      const { productId, quantity } = action.payload
      const item = state.cartItems.find((row) => row.product_id === productId)
      if (item) {
        item.quantity = Math.max(1, Math.min(quantity, item.quantity_in_stock))
      }
      saveCartToStorage(state.cartItems)
    },
    removeFromCart(state, action) {
      state.cartItems = state.cartItems.filter((item) => item.product_id !== action.payload)
      saveCartToStorage(state.cartItems)
    },
    clearCart(state) {
      state.cartItems = []
      saveCartToStorage(state.cartItems)
    },
    clearCheckoutError(state) {
      state.checkoutError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStorefrontProducts.pending, (state) => {
        state.productsStatus = 'loading'
        state.productsError = null
      })
      .addCase(fetchStorefrontProducts.fulfilled, (state, action) => {
        state.productsStatus = 'succeeded'
        state.products = action.payload.items || action.payload || []
      })
      .addCase(fetchStorefrontProducts.rejected, (state, action) => {
        state.productsStatus = 'failed'
        state.productsError = action.payload
      })
      .addCase(submitCheckout.pending, (state) => {
        state.checkoutStatus = 'loading'
        state.checkoutError = null
      })
      .addCase(submitCheckout.fulfilled, (state, action) => {
        state.checkoutStatus = 'succeeded'
        state.lastOrder = action.payload
        state.cartItems = []
        saveCartToStorage([])
      })
      .addCase(submitCheckout.rejected, (state, action) => {
        state.checkoutStatus = 'failed'
        state.checkoutError = action.payload
      })
  },
})

export const {
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  clearCheckoutError,
} = storefrontSlice.actions

export default storefrontSlice.reducer