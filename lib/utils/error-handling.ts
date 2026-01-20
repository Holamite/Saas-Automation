import { ApiClientError } from '@/lib/api'

/**
 * Extract error message from ApiClientError or unknown error.
 * Surfaces backend validation messages (e.g. 400) instead of generic "Request failed with status 400".
 */
export function extractErrorMessage(error: unknown, defaultMessage: string): string {
  if (error instanceof ApiClientError) {
    // Prefer backend details array (e.g. ["Password must contain 8 characters..."])
    if (Array.isArray(error.details) && error.details.length > 0) {
      return error.details[0]
    }
    
    // Use backend message if available
    if (error.message && !error.message.startsWith('Request failed with status')) {
      return error.message
    }
    
    // Fall back to field-level validation errors (e.g. { password: ["Must include special char"] })
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
    
    return error.message || defaultMessage
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
    // Use backend message for 401 errors (e.g. "Invalid credentials")
    // This preserves the exact backend error message
    return extractErrorMessage(error, defaultMessage)
  }

  return extractErrorMessage(error, defaultMessage)
}

/**
 * Extract all error details from ApiClientError
 * Useful for displaying multiple validation errors
 */
export function extractErrorDetails(error: unknown): string[] {
  if (error instanceof ApiClientError) {
    // Return all details if available
    if (Array.isArray(error.details)) {
      return error.details
    }
    
    // Return single detail as array
    if (typeof error.details === 'string') {
      return [error.details]
    }
    
    // Fall back to message
    if (error.message) {
      return [error.message]
    }
  }

  if (error instanceof Error) {
    return [error.message]
  }

  return []
}

