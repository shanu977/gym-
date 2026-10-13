import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthShell } from '../components/auth/AuthShell'
import { PasswordField } from '../components/auth/PasswordField'
import { useAuth } from '../contexts/useAuth'

type SignupForm = { firstName: string; lastName: string; email: string; mobile: string; password: string; confirmPassword: string; acceptedTerms: boolean }
const initialForm: SignupForm = { firstName: '', lastName: '', email: '', mobile: '', password: '', confirmPassword: '', acceptedTerms: false }

function validate(form: SignupForm) {
  if (!form.firstName.trim() || !form.lastName.trim()) return 'Please enter your first and last name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Enter a valid email address.'
  if (!/^(?:\+91[\s-]?|0)?[6-9]\d{9}$/.test(form.mobile.replace(/[()]/g, ''))) return 'Enter a valid Indian mobile number.'
  if (form.password.length < 12) return 'Password must be at least 12 characters.'
  if (form.password !== form.confirmPassword) return 'Passwords do not match.'
  if (!form.acceptedTerms) return 'Please accept the terms to continue.'
  return ''
}

export function SignupPage() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const update = (key: keyof SignupForm, value: string | boolean) => { setError(''); setForm((current) => ({ ...current, [key]: value })) }
  const submit = async (event: FormEvent) => { event.preventDefault(); const validationError = validate(form); if (validationError) { setError(validationError); return }; if (pending) return; setPending(true); setError(''); const result = await signup(form); setPending(false); if (!result.success) { setError(result.error ?? 'Unable to create the account.'); return }; navigate('/account', { replace: true }) }
  return <AuthShell eyebrow="Member access / Create account" title={<>Make it<br /><em>official.</em></>} copy="Create your Iron Peak account and start shaping the experience around you." footer={<p className="auth-switch">Already have an account? <Link to="/login">Sign in <ArrowRight size={14} /></Link></p>}><form className="auth-form signup-form" onSubmit={(event) => { void submit(event) }} noValidate><div className="auth-form-grid"><label className="auth-field">First name<input value={form.firstName} onChange={(event) => update('firstName', event.target.value)} autoComplete="given-name" /></label><label className="auth-field">Last name<input value={form.lastName} onChange={(event) => update('lastName', event.target.value)} autoComplete="family-name" /></label><label className="auth-field auth-field-wide">Email address<input type="email" value={form.email} onChange={(event) => update('email', event.target.value)} autoComplete="email" /></label><label className="auth-field auth-field-wide">Mobile number<input type="tel" value={form.mobile} onChange={(event) => update('mobile', event.target.value)} autoComplete="tel" placeholder="+91 98765 43210" /></label><PasswordField id="signup-password" label="Password" value={form.password} onChange={(value) => update('password', value)} autoComplete="new-password" hint="At least 12 characters." /><PasswordField id="signup-confirm-password" label="Confirm password" value={form.confirmPassword} onChange={(value) => update('confirmPassword', value)} autoComplete="new-password" /></div>{error && <div className="auth-form-error" role="alert">{error}</div>}<label className="terms-row"><input type="checkbox" checked={form.acceptedTerms} onChange={(event) => update('acceptedTerms', event.target.checked)} /><span>I understand and accept the <Link to="/contact">terms of use</Link>.</span></label><button className="button-primary auth-submit" type="submit" disabled={pending}>{pending ? 'Creating account…' : 'Create account'} <ArrowRight size={16} /></button></form><div className="signup-promise"><CheckCircle2 size={15} /><div><strong>Your profile starts here.</strong><span>You can complete your fitness preferences anytime in your account.</span></div></div></AuthShell>
}
