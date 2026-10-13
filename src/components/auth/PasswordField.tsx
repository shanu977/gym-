import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export function PasswordField({ id, label, value, onChange, autoComplete, error, hint }: { id: string; label: string; value: string; onChange: (value: string) => void; autoComplete?: string; error?: string; hint?: string }) {
  const [visible, setVisible] = useState(false)
  return <label className="auth-field" htmlFor={id}>{label}<div className="password-wrap"><input id={id} name={id} type={visible ? 'text' : 'password'} value={value} onChange={(event) => onChange(event.target.value)} autoComplete={autoComplete} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined} /><button type="button" className="password-toggle" onClick={() => setVisible((current) => !current)} aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}><span className="sr-only">{visible ? 'Hide' : 'Show'} password</span>{visible ? <EyeOff size={16} /> : <Eye size={16} />}</button></div>{hint && !error && <small id={`${id}-hint`} className="auth-hint">{hint}</small>}{error && <small id={`${id}-error`} className="auth-error">{error}</small>}</label>
}
