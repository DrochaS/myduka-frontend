import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiPost, getErrorMessage } from '../api/apiSlice'

function storageGet(key) {
  try {
    return globalThis.localStorage?.getItem?.(key) ?? null
  } catch {
    return null
  }
}

function storageSet(key, value) {
  try {
    globalThis.localStorage?.setItem?.(key, value)
  } catch {
    /* ignore storage errors in non-browser contexts */
  }
}

function storageRemove(key) {
  try {
    globalThis.localStorage?.removeItem?.(key)
  } catch {
    /* ignore storage errors in non-browser contexts */
  }
}

function readStoredUser() {
  try {
    const raw = storageGet('user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const initialState = {
  user: readStoredUser(),
  token: storageGet('token'),
  status: 'idle',
  error: null,
}

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await apiPost('/auth/login', credentials)
      storageSet('token', data.token)
      storageSet('user', JSON.stringify(data.user))
      return data
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Login failed'))
    }
  },
)

export const acceptInvite = createAsyncThunk(
  'auth/acceptInvite',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await apiPost('/auth/accept-invite', payload)
      if (data.token && data.user) {
        storageSet('token', data.token)
        storageSet('user', JSON.stringify(data.user))
      }
      return data
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Invite acceptance failed'))
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      state.status = 'idle'
      state.error = null
      storageRemove('token')
      storageRemove('user')
    },
    clearAuthError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(acceptInvite.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(acceptInvite.fulfilled, (state, action) => {
        state.status = 'succeeded'
        if (action.payload.user) state.user = action.payload.user
        if (action.payload.token) state.token = action.payload.token
      })
      .addCase(acceptInvite.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  },
})

export const { logout, clearAuthError } = authSlice.actions
export const selectAuth = (state) => state.auth
export const selectUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => Boolean(state.auth.token)
export default authSlice.reducer
