export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim())
}

export function required(value, label = 'Field') {
  if (value === null || value === undefined || String(value).trim() === '') {
    return `${label} is required`
  }
  return null
}

export function positiveNumber(value, label = 'Value') {
  const num = Number(value)
  if (Number.isNaN(num) || num < 0) {
    return `${label} must be a non-negative number`
  }
  return null
}

export function validateLogin({ email, password }) {
  const errors = {}
  if (!isValidEmail(email)) errors.email = 'Enter a valid email'
  if (!password || password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
  }
  return errors
}
