const appEnv = import.meta.env.VITE_APP_ENV || 'development'
const apiUrl = import.meta.env.VITE_API_URL || ''

export const env = {
  appEnv,
  apiUrl,
  isDev: appEnv === 'development',
  isStaging: appEnv === 'staging',
  isProd: appEnv === 'production',
}
