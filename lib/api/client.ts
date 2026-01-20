/**
 * Centralized Axios client for Doolf
 * - HTTP-only cookies; withCredentials: true on all requests
 * - Auto refresh on 401/403 with one retry of the original request
 * - Proxies /auth/* and /users/* to /api/auth/* and /api/users/*
 */

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'

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

interface RequestConfig extends InternalAxiosRequestConfig {
  skipAuth?: boolean
  skipRefresh?: boolean
  _retry?: boolean
}

let refreshPromise: Promise<boolean> | null = null
let isRefreshing = false

function buildUrl(endpoint: string): string {
  if (endpoint.startsWith('http')) return endpoint
  if (USE_API_PROXY && (endpoint.startsWith('/auth/') || endpoint.startsWith('/users/')))
    return `/api${endpoint}`
  const base = (BACKEND_URL || '').replace(/\/+$/, '')
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  return base ? `${base}${path}` : path
}

async function refreshAccessToken(): Promise<boolean> {
  if (isRefreshing && refreshPromise) return refreshPromise

  isRefreshing = true
  refreshPromise = (async () => {
    try {
      const url = USE_API_PROXY ? '/api/auth/refresh' : `${BACKEND_URL}/auth/refresh`
      const response = await axios.post(url, {}, { 
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      })
      return response.status >= 200 && response.status < 300
    } catch (e) {
      // 401 is expected when user is not logged in - don't log it
      // Log other unexpected errors
      if (axios.isAxiosError(e) && e.response?.status !== 401) {
        console.error('Unexpected refresh error', e)
      }
      return false
    } finally {
      isRefreshing = false
      refreshPromise = null
    }
  })()
  return refreshPromise
}

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to transform URLs
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Only transform if not already prefixed (prevents /api/api/... on retry)
    if (config.url && !config.url.startsWith('/api') && !config.url.startsWith('http')) {
      config.url = buildUrl(config.url)
    }
    return config
  },
  (error: unknown) => Promise.reject(error)
)

// Response interceptor to handle auth errors and retry
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RequestConfig

    if (!originalRequest) {
      return Promise.reject(error)
    }

    // Don't retry if request is to refresh endpoint itself (prevent loops)
    const isRefreshEndpoint = originalRequest.url?.includes('/auth/refresh')

    const shouldRetry =
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      !originalRequest.skipAuth &&
      !originalRequest.skipRefresh &&
      !originalRequest._retry &&
      !isRefreshEndpoint

    if (shouldRetry) {
      originalRequest._retry = true
      const ok = await refreshAccessToken()
      
      if (ok) {
        return axiosInstance(originalRequest)
      }
      // If refresh failed, return the original error without throwing
      // 401 is expected when user is not logged in - handle silently
      return Promise.reject(error)
    }

    // Only throw AuthenticationError for 401s that weren't skipped or refresh endpoint
    if (
      error.response?.status === 401 &&
      !originalRequest.skipAuth &&
      !isRefreshEndpoint
    ) {
      throw new AuthenticationError('Authentication required')
    }

    // Transform error to ApiClientError
    let errorMessage = `Request failed with status ${error.response?.status || 'unknown'}`
    let errors: Record<string, string[]> | undefined

    if (error.response?.data) {
      const data = error.response.data as Record<string, unknown>
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
    }

    throw new ApiClientError(errorMessage, error.response?.status, errors)
  }
)

interface RequestOptions {
  skipAuth?: boolean
  skipRefresh?: boolean
}

export const api = {
  get: async <T>(endpoint: string, options?: RequestOptions): Promise<T> => {
    const response = await axiosInstance.get<T>(endpoint, {
      ...(options ?? {}),
    } as RequestConfig)
    return response.data
  },

  post: async <T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> => {
    const response = await axiosInstance.post<T>(endpoint, data, {
      ...(options ?? {}),
    } as RequestConfig)
    return response.data
  },

  put: async <T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> => {
    const response = await axiosInstance.put<T>(endpoint, data, {
      ...(options ?? {}),
    } as RequestConfig)
    return response.data
  },

  patch: async <T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> => {
    const response = await axiosInstance.patch<T>(endpoint, data, {
      ...(options ?? {}),
    } as RequestConfig)
    return response.data
  },

  delete: async <T>(endpoint: string, options?: RequestOptions): Promise<T> => {
    const response = await axiosInstance.delete<T>(endpoint, {
      ...(options ?? {}),
    } as RequestConfig)
    return response.data
  },
}
