/**
 * Shared API helpers for MyDuka slices.
 */
import axiosInstance from '../../utils/axiosInstance'

export async function apiGet(path, config) {
  const { data } = await axiosInstance.get(path, config)
  return data
}

export async function apiPost(path, body, config) {
  const { data } = await axiosInstance.post(path, body, config)
  return data
}

export async function apiPatch(path, body, config) {
  const { data } = await axiosInstance.patch(path, body, config)
  return data
}

export async function apiDelete(path, config) {
  const { data } = await axiosInstance.delete(path, config)
  return data
}

export function getErrorMessage(error, fallback = 'Something went wrong') {
  if (error?.message === 'Network Error' || error?.code === 'ERR_NETWORK') {
    return 'Unable to reach the backend API server. Please ensure the backend is running and CORS/VITE_API_URL is properly configured.'
  }
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  )
}
