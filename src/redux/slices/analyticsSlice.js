import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiGet, apiPost, apiPatch, apiDelete, getErrorMessage } from '../api/apiSlice'

const initialState = {
  clerkPerformance: null,
  storeAnalytics: null,
  clerks: [],
  admins: [],
  status: 'idle',
  error: null,
}

export const fetchClerkPerformance = createAsyncThunk(
  'analytics/fetchClerkPerformance',
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiGet('/admin/reports/clerk-performance')
      return {
        trend: data.entriesByClerk,
        byClerk: data.spoiltByClerk,
      }
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to load clerk performance'))
    }
  },
)

export const fetchStoreAnalytics = createAsyncThunk(
  'analytics/fetchStoreAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const [storeReport, productReport] = await Promise.all([
        apiGet('/merchant/reports/stores'),
        apiGet('/merchant/reports/products'),
      ])
      const payments = storeReport.paidUnpaidByStore
      return {
        byStore: {
          labels: payments.labels,
          values: payments.paid.map(
            (amount, index) => amount + payments.unpaid[index],
          ),
          label: 'Supplier payments',
        },
        byProduct: productReport.stockByProduct,
      }
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to load store analytics'))
    }
  },
)

export const fetchClerks = createAsyncThunk(
  'analytics/fetchClerks',
  async (_, { rejectWithValue }) => {
    try {
      return await apiGet('/admin/clerks')
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to load clerks'))
    }
  },
)

export const inviteClerk = createAsyncThunk(
  'analytics/inviteClerk',
  async (payload, { rejectWithValue }) => {
    try {
      return await apiPost('/admin/clerks', payload)
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to invite clerk'))
    }
  },
)

export const deactivateClerk = createAsyncThunk(
  'analytics/deactivateClerk',
  async (id, { rejectWithValue }) => {
    try {
      return await apiPatch(`/admin/clerks/${id}`, { active: false })
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to deactivate clerk'))
    }
  },
)

export const deleteClerk = createAsyncThunk(
  'analytics/deleteClerk',
  async (id, { rejectWithValue }) => {
    try {
      await apiDelete(`/admin/clerks/${id}`)
      return { id }
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to delete clerk'))
    }
  },
)

export const fetchAdmins = createAsyncThunk(
  'analytics/fetchAdmins',
  async (_, { rejectWithValue }) => {
    try {
      return await apiGet('/merchant/admins')
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to load admins'))
    }
  },
)

export const inviteAdmin = createAsyncThunk(
  'analytics/inviteAdmin',
  async (payload, { rejectWithValue }) => {
    try {
      return await apiPost('/merchant/admins', payload)
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to invite admin'))
    }
  },
)

export const deactivateAdmin = createAsyncThunk(
  'analytics/deactivateAdmin',
  async (id, { rejectWithValue }) => {
    try {
      return await apiPatch(`/merchant/admins/${id}`, { active: false })
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to deactivate admin'))
    }
  },
)

export const deleteAdmin = createAsyncThunk(
  'analytics/deleteAdmin',
  async (id, { rejectWithValue }) => {
    try {
      await apiDelete(`/merchant/admins/${id}`)
      return { id }
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to delete admin'))
    }
  },
)

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearAnalyticsError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClerkPerformance.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchClerkPerformance.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.clerkPerformance = action.payload
      })
      .addCase(fetchClerkPerformance.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(fetchStoreAnalytics.fulfilled, (state, action) => {
        state.storeAnalytics = action.payload
      })
      .addCase(fetchClerks.fulfilled, (state, action) => {
        state.clerks = action.payload.items || action.payload || []
      })
      .addCase(inviteClerk.fulfilled, (state, action) => {
        const item = action.payload.item || action.payload
        state.clerks = [item, ...state.clerks]
      })
      .addCase(deactivateClerk.fulfilled, (state, action) => {
        const updated = action.payload.item || action.payload
        state.clerks = state.clerks.map((row) =>
          row.id === updated.id ? { ...row, ...updated, active: false } : row,
        )
      })
      .addCase(deleteClerk.fulfilled, (state, action) => {
        state.clerks = state.clerks.filter((row) => row.id !== action.payload.id)
      })
      .addCase(fetchAdmins.fulfilled, (state, action) => {
        state.admins = action.payload.items || action.payload || []
      })
      .addCase(inviteAdmin.fulfilled, (state, action) => {
        const item = action.payload.item || action.payload
        state.admins = [item, ...state.admins]
      })
      .addCase(deactivateAdmin.fulfilled, (state, action) => {
        const updated = action.payload.item || action.payload
        state.admins = state.admins.map((row) =>
          row.id === updated.id ? { ...row, ...updated, active: false } : row,
        )
      })
      .addCase(deleteAdmin.fulfilled, (state, action) => {
        state.admins = state.admins.filter((row) => row.id !== action.payload.id)
      })
  },
})

export const { clearAnalyticsError } = analyticsSlice.actions
export default analyticsSlice.reducer
