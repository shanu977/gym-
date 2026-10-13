import { apiRequest } from './client'

export const isAuthApiEnabled = import.meta.env.PROD || import.meta.env.VITE_AUTH_API === 'true'

export type ApiAuthUser = {
  id: string
  email: string
  roles: string[]
  profile: { firstName: string; lastName: string; phone: string | null } | null
}

export function apiLogin(email: string, password: string, rememberSession: boolean) {
  return apiRequest<{ user: ApiAuthUser }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, rememberSession }),
  })
}

export function apiRegister(input: { firstName: string; lastName: string; email: string; mobile: string; password: string }) {
  return apiRequest<{ user: ApiAuthUser }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function apiCurrentUser() {
  return apiRequest<{ user: ApiAuthUser }>('/auth/me')
}

export function apiLogout() {
  return apiRequest<undefined>('/auth/logout', { method: 'POST' })
}
