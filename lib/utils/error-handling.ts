import { ApiClientError } from '@/lib/api-client'

/**
 * Extract error message from ApiClientError or unknown error
 */
export function extractErrorMessage(error: unknown, defaultMessage: string): string {
  if (error instanceof ApiClientError) {
    // Handle validation errors
    if (error.errors) {
      const errorValues = Object.values(error.errors)
      if (errorValues.length > 0) {
        const firstError = errorValues[0]
        if (Array.isArray(firstError) && firstError.length > 0) {
          return firstError[0]
        } else if (typeof firstError === 'string') {
          return firstError
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

