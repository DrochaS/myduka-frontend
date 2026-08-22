import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
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
  const { status, error } = useSelector(selectAuth)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})

  if (isAuthenticated) {
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    return <Navigate to={homeForRole(user?.role)} replace />
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
      </form>
    </div>
  )
}
