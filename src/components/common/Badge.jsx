import './Badge.css'

const TONES = {
  success: 'badge--success',
  warning: 'badge--warning',
  danger: 'badge--danger',
  info: 'badge--info',
  muted: 'badge--muted',
}

export default function Badge({ children, tone = 'info' }) {
  return <span className={`badge ${TONES[tone] || TONES.info}`}>{children}</span>
}
