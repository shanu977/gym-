import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AuthShell } from '../components/auth/AuthShell'
import { PasswordField } from '../components/auth/PasswordField'
import { useAuth } from '../contexts/useAuth'
import { isAuthApiEnabled } from '../services/api/authApi'
import { DEMO_LOGIN_EMAIL, getSafeRedirect } from '../services/demoAuthService'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberSession, setRememberSession] = useState(true)
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (pending) return
    setPending(true)
    setError('')
    const result = await login({ email, password, rememberSession })
    setPending(false)
    if (!result.success) { setError(result.error ?? 'Unable to sign in.'); return }
    navigate(getSafeRedirect(params.get('redirect')), { replace: true })
  }
  return <AuthShell eyebrow={isAuthApiEnabled ? 'Member access / Sign in' : 'Member access / Demo login'} title={<>Welcome<br /><em>back.</em></>} copy="Your training practice is waiting. Sign in to return to your Iron Peak account." footer={<p className="auth-switch">New to Iron Peak? <Link to="/signup">Create an account <ArrowRight size={14} /></Link></p>}><form className="auth-form" onSubmit={(event) => { void submit(event) }} noValidate><label className="auth-field" htmlFor="login-email">Email address<input id="login-email" name="email" type="email" value={email} onChange={(event) => { setEmail(event.target.value); setError('') }} autoComplete="email" placeholder="you@example.com" aria-invalid={Boolean(error)} /></label><PasswordField id="login-password" label="Password" value={password} onChange={(value) => { setPassword(value); setError('') }} autoComplete="current-password" />{error && <div className="auth-form-error" role="alert">{error}</div>}<label className="remember-row"><input type="checkbox" checked={rememberSession} onChange={(event) => setRememberSession(event.target.checked)} /> <span>Keep me signed in on this device</span></label><button className="button-primary auth-submit" type="submit" disabled={pending}>{pending ? 'Signing in…' : 'Sign in'} <ArrowRight size={16} /></button></form>{isAuthApiEnabled ? <div className="demo-credential-card"><div><CheckCircle2 size={15} /><span>Connected account</span></div><strong>Sign in with your Iron Peak account</strong><span>New here? Create one from the signup page.</span></div> : <div className="demo-credential-card"><div><CheckCircle2 size={15} /><span>Demo credentials</span></div><strong>{DEMO_LOGIN_EMAIL}</strong><span>Password: Demo@123</span></div>}</AuthShell>
}
