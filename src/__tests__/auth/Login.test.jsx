import React from 'react'
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import Login from '../../pages/auth/Login'
import authReducer from '../../redux/slices/authSlice'

function renderLogin(preloadedState) {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState,
  })

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </Provider>,
  )
}

describe('Login', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders credential fields and validates before submit', async () => {
    const user = userEvent.setup()
    renderLogin({
      auth: { user: null, token: null, status: 'idle', error: null },
    })

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(screen.getByText(/enter a valid email/i)).toBeInTheDocument()
    expect(
      screen.getByText(/password must be at least 6 characters/i),
    ).toBeInTheDocument()
  })

  it('shows MyDuka branding on the auth card', () => {
    renderLogin({
      auth: { user: null, token: null, status: 'idle', error: null },
    })
    expect(screen.getByText('MyDuka')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument()
  })
})
