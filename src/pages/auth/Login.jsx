import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import {
  clearAuthError,
  login,
  selectAuth,
  selectIsAuthenticated,
} from '../../redux/slices/authSlice'
import { homeForRole } from '../../components/guards/ProtectedRoute'
import { validateLogin } from '../../utils/validators'
import '../../components/layout/PageWrapper.css'

export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const justRegistered = searchParams.get('registered') === 'true'
  const { status, error } = useSelector(selectAuth)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})

  if (isAuthenticated) {
    let role = null
    try {
      role = JSON.parse(localStorage.getItem('user') || 'null')?.role
    } catch {
      role = null
    }
    return <Navigate to={homeForRole(role)} replace />
  }

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (error) dispatch(clearAuthError())
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validateLogin(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    const result = await dispatch(login(form))
    if (login.fulfilled.match(result)) {
      navigate(homeForRole(result.payload.user?.role))
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card form-grid" onSubmit={onSubmit}>
        <div>
          <div className="brand">MyDuka</div>
          <h1>Sign in</h1>
          <p>Access your store inventory workspace.</p>
        </div>
        {justRegistered ? (
          <div
            style={{
              background: 'rgba(34, 197, 94, 0.1)',
              color: '#16a34a',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '8px',
              padding: '0.7rem 0.85rem',
              fontSize: '0.9rem',
            }}
          >
            Account created successfully! Please sign in with your credentials.
          </div>
        ) : null}
        {error ? <div className="error-banner">{error}</div> : null}
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={onChange}
          error={errors.email}
        />
        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={form.password}
          onChange={onChange}
          error={errors.password}
        />
        <Button type="submit" loading={status === 'loading'}>
          Sign in
        </Button>
        <div className="auth-footer">
          Don't have an account? <Link to="/register">Create an account</Link>
        </div>
      </form>
    </div>
  )
}

