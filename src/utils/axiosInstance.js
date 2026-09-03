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
  // Use Vite's same-origin development proxy unless a deployment supplies
  // an explicit API URL.
  baseURL: import.meta.env.VITE_API_URL || '/api',
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
    if ([401, 422].includes(error.response?.status)) {
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