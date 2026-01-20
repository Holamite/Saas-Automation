/**
 * Centralized API client for Doolf
 * - HTTP-only cookies; credentials: 'include' on all requests
 * - Auto refresh on 401/403 with one retry of the original request
 * - Proxies /auth/* and /users/* to /api/auth/* and /api/users/*
 */

const USE_API_PROXY = true
const BACKEND_URL = process.env.NEXT_PUBLIC_BASEURL || "http://localhost:3000"

if (!BACKEND_URL && !USE_API_PROXY) {
  console.warn('NEXT_PUBLIC_BASEURL is not set')
}

export class ApiClientError extends Error {
  status?: number
  errors?: Record<string, string[]>

  constructor(message: string, status?: number, errors?: Record<string, string[]>) {
    super(message)
    this.name = 'ApiClientError'
    this.status = status
    this.errors = errors
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiClientError)
    }
  }
}

export class AuthenticationError extends ApiClientError {
  constructor(message = 'Authentication failed') {
    super(message, 401)
    this.name = 'AuthenticationError'
  }
}

interface RequestOptions extends RequestInit {
  skipAuth?: boolean
  skipRefresh?: boolean
}

let refreshPromise: Promise<boolean> | null = null
let isRefreshing = false
const MAX_RETRY_ATTEMPTS = 1

function createRequestId(url: string, options: RequestInit): string {
  return `${url}:${options.method || 'GET'}:${JSON.stringify(options.body || '')}`
}

const requestRetryMap = new Map<string, number>()

async function refreshAccessToken(): Promise<boolean> {
  if (isRefreshing && refreshPromise) return refreshPromise

  isRefreshing = true
  refreshPromise = (async () => {
    try {
      const url = USE_API_PROXY ? '/api/auth/refresh' : `${BACKEND_URL}/auth/refresh`
      const res = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      return res.ok
    } catch (e) {
      console.error('Token refresh failed:', e)
      return false
    } finally {
      isRefreshing = false
      refreshPromise = null
    }
  })()
  return refreshPromise
}

function buildUrl(endpoint: string): string {
  if (endpoint.startsWith('http')) return endpoint
  if (USE_API_PROXY && (endpoint.startsWith('/auth/') || endpoint.startsWith('/users/')))
    return `/api${endpoint}`
  const base = (BACKEND_URL || '').replace(/\/$/, '')
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  return base ? `${base}${path}` : path
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { skipAuth = false, skipRefresh = false, ...fetchOptions } = options
  const url = buildUrl(endpoint)

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  }

  const requestId = createRequestId(url, fetchOptions)
  const retryCount = requestRetryMap.get(requestId) || 0

  let response = await fetch(url, {
    ...fetchOptions,
    headers,
    credentials: 'include',
  })

  const shouldRetry =
    (response.status === 401 || response.status === 403) &&
    !skipAuth &&
    !skipRefresh &&
    retryCount < MAX_RETRY_ATTEMPTS

  if (shouldRetry) {
    requestRetryMap.set(requestId, retryCount + 1)
    const ok = await refreshAccessToken()
    if (ok) {
      response = await fetch(url, { ...fetchOptions, headers, credentials: 'include' })
      if (response.status === 401 || response.status === 403) {
        requestRetryMap.delete(requestId)
        throw new AuthenticationError('Authentication failed after token refresh')
      }
    } else {
      requestRetryMap.delete(requestId)
      throw new AuthenticationError('Token refresh failed')
    }
  } else if (response.status === 401) {
    requestRetryMap.delete(requestId)
    throw new AuthenticationError('Authentication required')
  }

  if (response.ok) requestRetryMap.delete(requestId)

  const contentType = response.headers.get('content-type')
  const isJson = contentType?.includes('application/json')

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`
    let errors: Record<string, string[]> | undefined

    if (isJson) {
      try {
        const data = (await response.json()) as Record<string, unknown>
        errors = data.errors as Record<string, string[]> | undefined
        if (Array.isArray(data.message) && data.message.length > 0) {
          const first = data.message[0]
          errorMessage = typeof first === 'string' ? first : String(first)
        } else if (typeof data.message === 'string' && data.message) {
          errorMessage = data.message
        } else if (typeof data.error === 'string' && data.error) {
          errorMessage = data.error
        } else if (typeof data.detail === 'string' && data.detail) {
          errorMessage = data.detail
        } else if (Array.isArray(data.detail) && data.detail.length > 0) {
          const d = data.detail[0] as Record<string, unknown> | string
          errorMessage = typeof d === 'string'
              ? d
              : typeof (d as Record<string, unknown>)?.msg === 'string'
                ? (d as Record<string, unknown>).msg as string
                : typeof (d as Record<string, unknown>)?.message === 'string'
                  ? (d as Record<string, unknown>).message as string
                  : String(d)
        }
      } catch {
        // ignore
      }
    }
    throw new ApiClientError(errorMessage, response.status, errors)
  }

  if (isJson) return response.json() as Promise<T>
  return response.text() as unknown as T
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data != null ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data != null ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data != null ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
}
