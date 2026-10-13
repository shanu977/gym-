export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly details?: unknown

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL ?? ''
const pointsAtLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(configuredBaseUrl)

// A production bundle must never call a developer machine. Fall back to same-origin.
const apiBaseUrl = import.meta.env.PROD && pointsAtLocalhost ? '' : configuredBaseUrl
if (import.meta.env.PROD && pointsAtLocalhost && configuredBaseUrl) {
  console.warn('[api] VITE_API_BASE_URL points at localhost in a production build; using same-origin requests instead.')
}

let csrfToken: string | null = null

async function getCsrfToken() {
  if (csrfToken) return csrfToken
  const response = await fetch(`${apiBaseUrl}/api/v1/auth/csrf`, { credentials: 'include' })
  const body: unknown = await response.json().catch(() => null)
  if (!response.ok || !body || typeof body !== 'object' || !('csrfToken' in body) || typeof body.csrfToken !== 'string') throw new ApiError(response.status, 'CSRF_TOKEN_UNAVAILABLE', 'Security token could not be obtained.')
  csrfToken = body.csrfToken
  return csrfToken
}

function errorCode(body: unknown): string {
  if (body && typeof body === 'object' && 'error' in body && body.error && typeof body.error === 'object' && 'code' in body.error && typeof (body.error as { code?: unknown }).code === 'string') {
    return (body.error as { code: string }).code
  }
  return ''
}

async function send(path: string, options: RequestInit, token: string | null) {
  const method = (options.method ?? 'GET').toUpperCase()
  const isReadRequest = ['GET', 'HEAD', 'OPTIONS'].includes(method)
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')
  if (!isReadRequest && token) headers.set('x-csrf-token', token)
  return fetch(`${apiBaseUrl}/api/v1${path}`, {
    ...options,
    body: options.body ?? (isReadRequest ? undefined : '{}'),
    credentials: 'include',
    headers,
  })
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const method = (options.method ?? 'GET').toUpperCase()
  const isReadRequest = ['GET', 'HEAD', 'OPTIONS'].includes(method)
  const token = isReadRequest ? null : await getCsrfToken()
  let response = await send(path, options, token)
  let body: unknown = await response.json().catch(() => null)

  // The CSRF cookie can be invalidated by a server restart or secret rotation.
  if (!response.ok && !isReadRequest && response.status === 403 && errorCode(body).startsWith('FST_CSRF')) {
    csrfToken = null
    response = await send(path, options, await getCsrfToken())
    body = await response.json().catch(() => null)
  }

  if (!response.ok) {
    const error = body && typeof body === 'object' && 'error' in body && body.error && typeof body.error === 'object' ? body.error as { code?: unknown; message?: unknown; details?: unknown } : undefined
    throw new ApiError(response.status, typeof error?.code === 'string' ? error.code : 'API_ERROR', typeof error?.message === 'string' ? error.message : 'The request could not be completed.', error?.details)
  }
  return body as T
}
