import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useAccount } from './useAccount'
import { AuthContext } from './AuthContextStore'
import { ApiError } from '../services/api/client'
import { apiCurrentUser, apiLogin, apiLogout, apiRegister, isAuthApiEnabled, type ApiAuthUser } from '../services/api/authApi'
import { clearDemoAuth, createDemoAuthUser, DEMO_LOGIN_EMAIL, getDemoAuth, isDemoCredentialMatch, saveDemoAuth } from '../services/demoAuthService'
import type { AuthResult, AuthUser, LoginCredentials, SignupData } from '../types'

function toAuthUser(user: ApiAuthUser): AuthUser {
  return { userId: user.id, email: user.email, sessionCreatedAt: new Date().toISOString() }
}

function profileForDemoLogin(user: AuthUser) {
  if (user.email !== DEMO_LOGIN_EMAIL) return {}
  return { id: user.userId, firstName: 'Alex', lastName: 'Morgan', email: user.email }
}

function authErrorMessage(error: unknown, fallback: string) {
  if (!(error instanceof ApiError)) return fallback
  if (error.code === 'EMAIL_ALREADY_REGISTERED') return 'An account with this email already exists.'
  if (error.status === 401) return 'Incorrect email or password.'
  if (error.status === 429) return 'Too many attempts. Please wait a moment and try again.'
  if (error.status >= 500) return 'The Iron Peak server is unavailable right now. Please try again shortly.'
  return error.message || fallback
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { customer, updateProfile, refreshAccount } = useAccount()
  const [user, setUser] = useState<AuthUser | null>(() => (isAuthApiEnabled ? null : getDemoAuth()))
  const [isLoading, setIsLoading] = useState(isAuthApiEnabled)

  useEffect(() => {
    if (!isAuthApiEnabled) return
    let active = true
    void apiCurrentUser()
      .then(({ user: currentUser }) => {
        if (!active) return
        setUser(toAuthUser(currentUser))
        void refreshAccount()
      })
      .catch(() => { if (active) setUser(null) })
      .finally(() => { if (active) setIsLoading(false) })
    return () => { active = false }
  }, [refreshAccount])

  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthResult> => {
    const email = credentials.email.trim().toLowerCase()
    if (!email) return { success: false, error: 'Please enter your email.' }
    if (!credentials.password) return { success: false, error: 'Please enter your password.' }

    if (!isAuthApiEnabled) {
      if (!isDemoCredentialMatch(email, credentials.password)) return { success: false, error: 'Incorrect email or password.' }
      const nextUser = createDemoAuthUser(email)
      saveDemoAuth(nextUser, credentials.rememberSession)
      updateProfile(profileForDemoLogin(nextUser))
      setUser(nextUser)
      return { success: true }
    }

    try {
      const { user: authenticated } = await apiLogin(email, credentials.password, credentials.rememberSession)
      setUser(toAuthUser(authenticated))
      void refreshAccount()
      return { success: true }
    } catch (error) {
      return { success: false, error: authErrorMessage(error, 'Unable to sign in.') }
    }
  }, [refreshAccount, updateProfile])

  const signup = useCallback(async (data: SignupData): Promise<AuthResult> => {
    const email = data.email.trim().toLowerCase()
    if (!data.firstName.trim() || !data.lastName.trim() || !email || !data.mobile.trim()) return { success: false, error: 'Please complete all required fields.' }

    if (!isAuthApiEnabled) {
      if (email === customer.email.trim().toLowerCase() || email === DEMO_LOGIN_EMAIL) return { success: false, error: 'Email already registered.' }
      const nextUser = createDemoAuthUser(email)
      saveDemoAuth(nextUser)
      updateProfile({ id: nextUser.userId, firstName: data.firstName.trim(), lastName: data.lastName.trim(), email, phone: data.mobile.trim(), memberSince: new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) })
      setUser(nextUser)
      return { success: true }
    }

    try {
      const { user: registered } = await apiRegister({
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email,
        mobile: data.mobile.trim(),
        password: data.password,
      })
      setUser(toAuthUser(registered))
      void refreshAccount()
      return { success: true }
    } catch (error) {
      return { success: false, error: authErrorMessage(error, 'Unable to create the account.') }
    }
  }, [customer.email, refreshAccount, updateProfile])

  const logout = useCallback(() => {
    clearDemoAuth()
    setUser(null)
    if (isAuthApiEnabled) void apiLogout().catch(() => undefined)
  }, [])

  const value = useMemo(() => ({ user, isAuthenticated: Boolean(user), isLoading, isDemoUser: !isAuthApiEnabled, login, signup, logout }), [user, isLoading, login, signup, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
