import './Loader.css'

export default function Loader({ label = 'Loading…', size = 'medium', inline = false }) {
  const className = `loader loader--${size}${inline ? ' loader--inline' : ''}`
  
  return (
    <div className={className.trim()} role="status" aria-live="polite">
      <span className="loader__spinner" aria-hidden="true" />
      {label && <span>{label}</span>}
    </div>
  )
}
