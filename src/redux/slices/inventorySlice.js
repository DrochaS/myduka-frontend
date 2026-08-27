import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiGet, apiPost, apiPatch, getErrorMessage } from '../api/apiSlice'

const initialState = {
  stockEntries: [],
  products: [],
  status: 'idle',
  error: null,
}

export const fetchStockEntries = createAsyncThunk(
  'inventory/fetchStockEntries',
  async (_, { rejectWithValue }) => {
    try {
      return await apiGet('/clerk/stock')
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to load stock'))
    }
  },
)

export const createStockEntry = createAsyncThunk(
  'inventory/createStockEntry',
  async (payload, { rejectWithValue }) => {
    try {
      return await apiPost('/clerk/stock', payload)
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to create stock entry'))
    }
  },
)

export const reportSpoiltGoods = createAsyncThunk(
  'inventory/reportSpoiltGoods',
  async (payload, { rejectWithValue }) => {
    try {
      return await apiPost('/clerk/spoilt', payload)
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to report spoilt goods'))
    }
  },
)

export const fetchProducts = createAsyncThunk(
  'inventory/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      return await apiGet('/clerk/products')
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to load products'))
    }
  },
)

export const updateSupplierPayment = createAsyncThunk(
  'inventory/updateSupplierPayment',
  async ({ id, paymentStatus }, { rejectWithValue }) => {
    try {
      return await apiPatch(`/admin/supplier-payments/${id}`, { paymentStatus })
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to update payment'))
    }
  },
)

export const fetchSupplierPayments = createAsyncThunk(
  'inventory/fetchSupplierPayments',
  async (_, { rejectWithValue }) => {
    try {
      return await apiGet('/admin/supplier-payments')
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to load payments'))
    }
  },
)

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    ...initialState,
    supplierPayments: [],
  },
  reducers: {
    clearInventoryError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStockEntries.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchStockEntries.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.stockEntries = action.payload.items || action.payload || []
      })
      .addCase(fetchStockEntries.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(createStockEntry.fulfilled, (state, action) => {
        const entry = action.payload.item || action.payload
        state.stockEntries = [entry, ...state.stockEntries]
      })
      .addCase(reportSpoiltGoods.fulfilled, (state, action) => {
        const updated = action.payload.item || action.payload
        if (updated?.id) {
          state.stockEntries = state.stockEntries.map((row) =>
            row.id === updated.id ? { ...row, ...updated } : row,
          )
        }
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload.items || action.payload || []
      })
      .addCase(fetchSupplierPayments.fulfilled, (state, action) => {
        state.supplierPayments = action.payload.items || action.payload || []
      })
      .addCase(updateSupplierPayment.fulfilled, (state, action) => {
        const updated = action.payload.item || action.payload
        state.supplierPayments = state.supplierPayments.map((row) =>
          row.id === updated.id ? { ...row, ...updated } : row,
        )
      })
  },
})

export const { clearInventoryError } = inventorySlice.actions
export default inventorySlice.reducer
