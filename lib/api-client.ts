/**
 * API Client for Doolf
 * Handles all API requests with automatic token refresh via HttpOnly cookies
 */

// Use API routes as proxy to avoid CORS issues
// API routes forward requests to backend and handle cookies
const USE_API_PROXY = true
const BACKEND_URL = process.env.NEXT_PUBLIC_BASEURL || ''
const BASE_URL = USE_API_PROXY ? '' : BACKEND_URL

if (!BACKEND_URL && !USE_API_PROXY) {
  console.warn('NEXT_PUBLIC_BASEURL environment variable is not set')
}

export class ApiClientError extends Error {
  status?: number
  errors?: Record<string, string[]>

  constructor(message: string, status?: number, errors?: Record<string, string[]>) {
    super(message)
    this.name = 'ApiClientError'
    this.status = status
    this.errors = errors
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiClientError)
    }
  }
}

export class AuthenticationError extends ApiClientError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401)
    this.name = 'AuthenticationError'
  }
}

interface RequestOptions extends RequestInit {
  skipAuth?: boolean
  skipRefresh?: boolean
}

// Track refresh state
let refreshPromise: Promise<boolean> | null = null
let isRefreshing = false

// Track retry attempts per request to prevent infinite loops
const MAX_RETRY_ATTEMPTS = 1

/**
 * Refresh access token using HttpOnly cookies
 */
async function refreshAccessToken(): Promise<boolean> {
  // Prevent multiple simultaneous refresh attempts
  if (isRefreshing && refreshPromise) {
    return refreshPromise
  }

  isRefreshing = true
  refreshPromise = (async () => {
    try {
      // Use API proxy route to avoid CORS
      const refreshUrl = USE_API_PROXY ? '/api/auth/refresh' : `${BACKEND_URL}/auth/refresh`
      const response = await fetch(refreshUrl, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        // Refresh failed
        return false
      }

      return true
    } catch (error) {
      console.error('Token refresh failed:', error)
      return false
    } finally {
      isRefreshing = false
      refreshPromise = null
    }
  })()

  return refreshPromise
}

/**
 * Create a unique request identifier for tracking retries
 */
function createRequestId(url: string, options: RequestInit): string {
  return `${url}:${options.method || 'GET'}:${JSON.stringify(options.body || '')}`
}

// Track retry attempts by request ID
const requestRetryMap = new Map<string, number>()

/**
 * Make API request with automatic token refresh and retry guard
 */
async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { skipAuth = false, skipRefresh = false, ...fetchOptions } = options

  // Build URL - use API proxy routes to avoid CORS
  let url: string
  if (endpoint.startsWith('http')) {
    url = endpoint
  } else if (USE_API_PROXY && endpoint.startsWith('/auth/')) {
    // Use Next.js API routes as proxy for auth endpoints
    url = `/api${endpoint}`
  } else {
    url = `${BASE_URL}${endpoint}`
  }

  // Prepare headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  }

  // Create request ID for tracking retries
  const requestId = createRequestId(url, fetchOptions)
  const currentRetryCount = requestRetryMap.get(requestId) || 0

  // Make request with credentials to include HttpOnly cookies
  let response = await fetch(url, {
    ...fetchOptions,
    headers,
    credentials: 'include',
  })

  // Handle 401 Unauthorized - try to refresh token
  if (response.status === 401 && !skipAuth && !skipRefresh && currentRetryCount < MAX_RETRY_ATTEMPTS) {
    // Increment retry count
    requestRetryMap.set(requestId, currentRetryCount + 1)

    const refreshSucceeded = await refreshAccessToken()
    if (refreshSucceeded) {
      // Retry request with refreshed cookies
      response = await fetch(url, {
        ...fetchOptions,
        headers,
        credentials: 'include',
      })

      // If retried request still returns 401, throw AuthenticationError
      if (response.status === 401) {
        requestRetryMap.delete(requestId)
        throw new AuthenticationError('Authentication failed after token refresh')
      }
    } else {
      // Refresh failed, throw authentication error
      requestRetryMap.delete(requestId)
      throw new AuthenticationError('Token refresh failed')
    }
  } else if (response.status === 401) {
    // Already retried or refresh skipped, throw error
    requestRetryMap.delete(requestId)
    throw new AuthenticationError('Authentication required')
  }

  // Clear retry count on success
  if (response.ok) {
    requestRetryMap.delete(requestId)
  }

  // Parse response
  const contentType = response.headers.get('content-type')
  const isJson = contentType?.includes('application/json')

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`
    let errors: Record<string, string[]> | undefined

    if (isJson) {
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorData.error || errorMessage
        errors = errorData.errors
      } catch {
        // Failed to parse error JSON
      }
    }

    throw new ApiClientError(errorMessage, response.status, errors)
  }

  if (isJson) {
    return response.json()
  }

  return response.text() as unknown as T
}

/**
 * API Client methods
 */
export const api = {
  /**
   * GET request
   */
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  /**
   * POST request
   */
  post: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  /**
   * PUT request
   */
  put: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  /**
   * PATCH request
   */
  patch: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  /**
   * DELETE request
   */
  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
}
