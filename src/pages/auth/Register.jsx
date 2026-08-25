import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import {
  clearAuthError,
  demoLogin,
  register,
  selectAuth,
  selectIsAuthenticated,
} from '../../redux/slices/authSlice'
import { homeForRole } from '../../components/guards/ProtectedRoute'
import { validateRegister } from '../../utils/validators'
import '../../components/layout/PageWrapper.css'

export default function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { status, error } = useSelector(selectAuth)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'merchant',
    password: '',
    confirmPassword: '',
  })
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
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validateRegister(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    const result = await dispatch(
      register({
        name: form.name,
        full_name: form.name,
        email: form.email,
        role: form.role,
        password: form.password,
      }),
    )

    if (register.fulfilled.match(result)) {
      const user = result.payload.user
      const token = result.payload.token || result.payload.access_token
      if (token && user) {
        navigate(homeForRole(user.role))
      } else {
        navigate('/login?registered=true')
      }
    }
  }

  const handleOfflinePreview = () => {
    const role = form.role || 'merchant'
    dispatch(
      demoLogin({
        role,
        full_name: form.name || 'Demo User',
        email: form.email || `${role}@myduka.demo`,
      }),
    )
    navigate(homeForRole(role))
  }

  const handleQuickDemo = (role) => {
    dispatch(demoLogin(role))
    navigate(homeForRole(role))
  }

  return (
    <div className="auth-page">
      <div className="auth-card form-grid">
        <form className="form-grid" onSubmit={onSubmit}>
          <div>
            <div className="brand">MyDuka</div>
            <h1>Create account</h1>
            <p>Sign up to manage and track your store inventory.</p>
          </div>

          {error ? (
            <div className="error-banner" style={{ display: 'grid', gap: '0.5rem' }}>
              <div>{error}</div>
              <Button
                type="button"
                variant="secondary"
                onClick={handleOfflinePreview}
                style={{ fontSize: '0.85rem' }}
              >
                ⚡ Preview with this account in offline mode
              </Button>
            </div>
          ) : null}

          <Input
            label="Full name"
            name="name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={onChange}
            error={errors.name}
          />

          <Input
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={onChange}
            error={errors.email}
          />

          <label className="field" htmlFor="role-select">
            <span className="field__label">Role</span>
            <select
              id="role-select"
              name="role"
              className="field__input"
              value={form.role}
              onChange={onChange}
            >
              <option value="merchant">Merchant (Store Owner)</option>
              <option value="admin">Store Admin</option>
              <option value="clerk">Inventory Clerk</option>
            </select>
            {errors.role ? (
              <span className="field__error">{errors.role}</span>
            ) : null}
          </label>

          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={onChange}
            error={errors.password}
          />

          <Input
            label="Confirm password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={onChange}
            error={errors.confirmPassword}
          />

          <Button type="submit" loading={status === 'loading'}>
            Create account
          </Button>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </form>

        <div
          style={{
            borderTop: '1px solid var(--border)',
            paddingTop: '1rem',
            marginTop: '0.5rem',
          }}
        >
          <div
            style={{
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'var(--muted)',
              marginBottom: '0.6rem',
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            Instant Demo Preview (No backend required)
          </div>
          <div
            style={{
              display: 'grid',
              gap: '0.45rem',
            }}
          >
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleQuickDemo('merchant')}
              style={{ width: '100%', fontSize: '0.88rem' }}
            >
              Explore as Merchant (Owner)
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleQuickDemo('admin')}
              style={{ width: '100%', fontSize: '0.88rem' }}
            >
              Explore as Store Admin
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleQuickDemo('clerk')}
              style={{ width: '100%', fontSize: '0.88rem' }}
            >
              Explore as Inventory Clerk
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
