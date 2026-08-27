import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import {
  acceptInvite,
  clearAuthError,
  selectAuth,
} from '../../redux/slices/authSlice'
import { homeForRole } from '../../components/guards/ProtectedRoute'
import '../../components/layout/PageWrapper.css'

export default function AcceptInvite() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const token = useMemo(() => params.get('token') || '', [params])
  const { status, error } = useSelector(selectAuth)
  const [form, setForm] = useState({
    name: '',
    password: '',
    confirmPassword: '',
  })
  const [localError, setLocalError] = useState(null)

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (error) dispatch(clearAuthError())
    setLocalError(null)
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    if (!token) {
      setLocalError('Invite token is missing from the URL.')
      return
    }
    if (form.password.length < 6) {
      setLocalError('Password must be at least 6 characters.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setLocalError('Passwords do not match.')
      return
    }

    const result = await dispatch(
      acceptInvite({
        token,
        name: form.name,
        password: form.password,
      }),
    )

    if (acceptInvite.fulfilled.match(result)) {
      navigate(homeForRole(result.payload.user?.role))
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card form-grid" onSubmit={onSubmit}>
        <div>
          <div className="brand">MyDuka</div>
          <h1>Accept invite</h1>
          <p>Set your name and password to join the store team.</p>
        </div>
        {(error || localError) && (
          <div className="error-banner">{error || localError}</div>
        )}
        <Input
          label="Full name"
          name="name"
          value={form.name}
          onChange={onChange}
          required
        />
        <Input
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          required
        />
        <Input
          label="Confirm password"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={onChange}
          required
        />
        <Button type="submit" loading={status === 'loading'}>
          Activate account
        </Button>
      </form>
    </div>
  )
}
