import React from 'react'
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import Register from '../../pages/auth/Register'
import authReducer from '../../redux/slices/authSlice'

function renderRegister(preloadedState) {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState,
  })

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    </Provider>,
  )
}

describe('Register', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders registration fields and validates required inputs before submit', async () => {
    const user = userEvent.setup()
    renderRegister({
      auth: { user: null, token: null, status: 'idle', error: null },
    })

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/role/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(screen.getByText(/full name is required/i)).toBeInTheDocument()
    expect(screen.getByText(/enter a valid email/i)).toBeInTheDocument()
    expect(
      screen.getByText(/password must be at least 6 characters/i),
    ).toBeInTheDocument()
  })

  it('validates password confirmation matching', async () => {
    const user = userEvent.setup()
    renderRegister({
      auth: { user: null, token: null, status: 'idle', error: null },
    })

    await user.type(screen.getByLabelText(/full name/i), 'Jane Doe')
    await user.type(screen.getByLabelText(/email/i), 'jane@example.com')
    await user.type(screen.getByLabelText(/^password/i), 'secret123')
    await user.type(screen.getByLabelText(/confirm password/i), 'different123')

    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
  })

  it('shows MyDuka branding and sign in link', () => {
    renderRegister({
      auth: { user: null, token: null, status: 'idle', error: null },
    })
    expect(screen.getByText('MyDuka')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /create account/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument()
  })
})
