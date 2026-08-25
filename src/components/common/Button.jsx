import './Button.css'

const VARIANTS = {
  primary: 'btn--primary',
  secondary: 'btn--secondary',
  danger: 'btn--danger',
  ghost: 'btn--ghost',
}

export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  className = '',
  disabled = false,
  loading = false,
  ...props
}) {
  return (
    <button
      type={type}
      className={`btn ${VARIANTS[variant] || VARIANTS.primary} ${className}`.trim()}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Please wait…' : children}
    </button>
  )
}
