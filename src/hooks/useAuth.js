import { useSelector } from 'react-redux'
import { selectAuth, selectIsAuthenticated, selectUser } from '../redux/slices/authSlice'

export function useAuth() {
  const auth = useSelector(selectAuth)
  const user = useSelector(selectUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  return {
    ...auth,
    user,
    isAuthenticated,
    role: user?.role || null,
  }
}

export default useAuth
