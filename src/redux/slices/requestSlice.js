import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiGet, apiPost, apiPatch, getErrorMessage } from '../api/apiSlice'

const initialState = {
  requests: [],
  status: 'idle',
  error: null,
}

export const fetchSupplyRequests = createAsyncThunk(
  'request/fetchSupplyRequests',
  async (_, { rejectWithValue }) => {
    try {
      return await apiGet('/admin/supply-requests')
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to load supply requests'))
    }
  },
)

export const createSupplyRequest = createAsyncThunk(
  'request/createSupplyRequest',
  async (payload, { rejectWithValue }) => {
    try {
      return await apiPost('/clerk/supply-requests', payload)
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to request supply'))
    }
  },
)

export const reviewSupplyRequest = createAsyncThunk(
  'request/reviewSupplyRequest',
  async ({ id, decision }, { rejectWithValue }) => {
    try {
      return await apiPatch(`/admin/supply-requests/${id}`, { decision })
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to update request'))
    }
  },
)

const requestSlice = createSlice({
  name: 'request',
  initialState,
  reducers: {
    clearRequestError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSupplyRequests.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchSupplyRequests.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.requests = action.payload.items || action.payload || []
      })
      .addCase(fetchSupplyRequests.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(createSupplyRequest.fulfilled, (state, action) => {
        const item = action.payload.item || action.payload
        state.requests = [item, ...state.requests]
      })
      .addCase(reviewSupplyRequest.fulfilled, (state, action) => {
        const updated = action.payload.item || action.payload
        state.requests = state.requests.map((row) =>
          row.id === updated.id ? { ...row, ...updated } : row,
        )
      })
  },
})

export const { clearRequestError } = requestSlice.actions
export default requestSlice.reducer
