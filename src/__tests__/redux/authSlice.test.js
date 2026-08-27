import { describe, it, expect, beforeEach } from 'vitest'
import authReducer, {
  logout,
  clearAuthError,
  login,
  acceptInvite,
  register,
} from '../../redux/slices/authSlice'

describe('authSlice', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts unauthenticated when storage is empty', () => {
    const state = authReducer(undefined, { type: '@@INIT' })
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.status).toBe('idle')
  })

  it('stores user and token on login.fulfilled', () => {
    const payload = {
      token: 'jwt-token',
      user: { id: 1, email: 'clerk@myduka.test', role: 'clerk' },
    }
    const state = authReducer(undefined, {
      type: login.fulfilled.type,
      payload,
    })
    expect(state.token).toBe('jwt-token')
    expect(state.user.role).toBe('clerk')
    expect(state.status).toBe('succeeded')
  })

  it('records login failures', () => {
    const state = authReducer(
      { user: null, token: null, status: 'loading', error: null },
      { type: login.rejected.type, payload: 'Invalid credentials' },
    )
    expect(state.status).toBe('failed')
    expect(state.error).toBe('Invalid credentials')
  })

  it('accepts invite payload and clears on logout', () => {
    let state = authReducer(undefined, {
      type: acceptInvite.fulfilled.type,
      payload: {
        token: 'invite-jwt',
        user: { id: 2, role: 'admin', email: 'admin@myduka.test' },
      },
    })
    expect(state.token).toBe('invite-jwt')
    expect(state.user.role).toBe('admin')

    state = authReducer(state, logout())
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(localStorage.getItem('token')).toBeNull()
  })

  it('stores user and token on register.fulfilled', () => {
    const payload = {
      token: 'register-jwt',
      user: { id: 3, email: 'merchant@myduka.test', role: 'merchant' },
    }
    const state = authReducer(undefined, {
      type: register.fulfilled.type,
      payload,
    })
    expect(state.token).toBe('register-jwt')
    expect(state.user.role).toBe('merchant')
    expect(state.status).toBe('succeeded')
  })

  it('records register failures', () => {
    const state = authReducer(
      { user: null, token: null, status: 'loading', error: null },
      { type: register.rejected.type, payload: 'Email already exists' },
    )
    expect(state.status).toBe('failed')
    expect(state.error).toBe('Email already exists')
  })

  it('clears auth errors', () => {
    const state = authReducer(
      { user: null, token: null, status: 'failed', error: 'Boom' },
      clearAuthError(),
    )
    expect(state.error).toBeNull()
  })

})
