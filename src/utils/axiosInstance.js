import axios from 'axios'

function readToken() {
  try {
    return globalThis.localStorage?.getItem?.('token') || null
  } catch {
    return null
  }
}

function clearSession() {
  try {
    globalThis.localStorage?.removeItem?.('token')
    globalThis.localStorage?.removeItem?.('user')
  } catch {
    /* ignore */
  }
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use((config) => {
  const token = readToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearSession()
      if (
        typeof window !== 'undefined' &&
        !window.location.pathname.includes('/login')
      ) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
