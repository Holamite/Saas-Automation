import { ApiClientError } from '@/lib/api'

/**
 * Extract error message from ApiClientError or unknown error.
 * Surfaces backend validation messages (e.g. 400) instead of generic "Request failed with status 400".
 */
export function extractErrorMessage(error: unknown, defaultMessage: string): string {
  if (error instanceof ApiClientError) {
    // Prefer field-level validation errors (e.g. { password: ["Must include special char"] })
    if (error.errors && typeof error.errors === 'object') {
      const errorValues = Array.isArray(error.errors) ? error.errors : Object.values(error.errors)
      if (errorValues.length > 0) {
        const first = errorValues[0]
        if (Array.isArray(first) && first.length > 0) {
          return typeof first[0] === 'string' ? first[0] : String(first[0])
        }
        if (typeof first === 'string') return first
        if (typeof first === 'object' && first !== null) {
          const obj = first as Record<string, unknown>
          if (typeof obj.msg === 'string') return obj.msg
          if (typeof obj.message === 'string') return obj.message
        }
      }
    }
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return defaultMessage
}

/**
 * Extract error message for authentication errors
 */
export function extractAuthErrorMessage(error: unknown, defaultMessage: string): string {
  if (error instanceof ApiClientError) {
    if (error.status === 401) {
      return 'Invalid email or password'
    }
    return extractErrorMessage(error, defaultMessage)
  }

  return extractErrorMessage(error, defaultMessage)
}

