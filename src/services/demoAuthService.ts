import type { AuthUser } from '../types'

export const DEMO_AUTH_KEY = 'iron-peak-demo-auth'
export const DEMO_LOGIN_EMAIL = 'alex.morgan@example.com'
export const DEMO_LOGIN_PASSWORD = 'Demo@123'
export const LEGACY_DEMO_LOGIN_EMAIL = 'aarav.mehta@example.com'

function isAuthUser(value: unknown): value is AuthUser {
  return Boolean(value && typeof value === 'object' && typeof (value as AuthUser).userId === 'string' && Boolean((value as AuthUser).userId) && typeof (value as AuthUser).email === 'string' && Boolean((value as AuthUser).email) && typeof (value as AuthUser).sessionCreatedAt === 'string')
}

export function getDemoAuth(): AuthUser | null {
  if (typeof window === 'undefined') return null
  try {
    const storedValue = window.localStorage.getItem(DEMO_AUTH_KEY) ?? window.sessionStorage.getItem(DEMO_AUTH_KEY)
    const parsed: unknown = JSON.parse(storedValue ?? 'null')
    if (!parsed || typeof parsed !== 'object' || (parsed as { authenticated?: unknown }).authenticated !== true || !isAuthUser(parsed)) {
      if (parsed !== null) { window.localStorage.removeItem(DEMO_AUTH_KEY); window.sessionStorage.removeItem(DEMO_AUTH_KEY) }
      return null
    }
    return parsed
  } catch {
    try { window.localStorage.removeItem(DEMO_AUTH_KEY); window.sessionStorage.removeItem(DEMO_AUTH_KEY) } catch { /* browser storage can be unavailable */ }
    return null
  }
}

export function saveDemoAuth(user: AuthUser, rememberSession = true) {
  try {
    const serialized = JSON.stringify({ authenticated: true, ...user })
    if (rememberSession) { window.localStorage.setItem(DEMO_AUTH_KEY, serialized); window.sessionStorage.removeItem(DEMO_AUTH_KEY) }
    else { window.sessionStorage.setItem(DEMO_AUTH_KEY, serialized); window.localStorage.removeItem(DEMO_AUTH_KEY) }
    return true
  } catch {
    return false
  }
}

export function clearDemoAuth() {
  try { window.localStorage.removeItem(DEMO_AUTH_KEY); window.sessionStorage.removeItem(DEMO_AUTH_KEY) } catch { /* browser storage can be unavailable */ }
}

export function isDemoCredentialMatch(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase()
  return (normalizedEmail === DEMO_LOGIN_EMAIL || normalizedEmail === LEGACY_DEMO_LOGIN_EMAIL) && password === DEMO_LOGIN_PASSWORD
}

export function createDemoAuthUser(email: string): AuthUser {
  return { userId: `demo-user-${email.trim().toLowerCase()}`, email: email.trim().toLowerCase(), sessionCreatedAt: new Date().toISOString() }
}

export function getSafeRedirect(value: string | null | undefined) {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.startsWith('/login') || value.startsWith('/signup')) return '/account'
  return value
}
