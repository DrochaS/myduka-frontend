import './Input.css'

export default function Input({
  label,
  id,
  error,
  type = 'text',
  className = '',
  ...props
}) {
  const inputId = id || props.name || label

  return (
    <label className={`field ${className}`.trim()} htmlFor={inputId}>
      {label ? <span className="field__label">{label}</span> : null}
      <input id={inputId} type={type} className="field__input" {...props} />
      {error ? <span className="field__error">{error}</span> : null}
    </label>
  )
}
