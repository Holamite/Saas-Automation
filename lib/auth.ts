/**
 * Authentication utilities
 */

import { api, ApiClientError, AuthenticationError } from './api-client'

// Re-export error classes from api-client (single source of truth)
export { ApiClientError, AuthenticationError }

/**
 * Account information from backend
 */
export interface Account {
  provider: string
  linkedAt: string
}

/**
 * User type matching backend response contract
 */
export interface User {
  id: string
  email: string
  name: string
  role: string
  businessName: string | null | undefined
  accounts: Pick<Account, 'provider' | 'linkedAt'>[]
}

/**
 * Backend response contract for register endpoint
 */
export interface RegisterResponse {
  status: number | string
  message: string
  user: User
}

/**
 * Backend response contract for login endpoint (same structure)
 */
export interface LoginResponse {
  status: number | string
  message: string
  user: User
}


/**
 * Signup form data
 */
export interface SignupData {
  name: string
  email: string
  password: string
  businessName?: string
}

/**
 * Login form data
 */
export interface LoginData {
  email: string
  password: string
}

/**
 * Register a new user
 * Backend will set HttpOnly cookies automatically
 */
export async function signup(data: SignupData): Promise<RegisterResponse> {
  try {
    const response = await api.post<RegisterResponse>(
      '/auth/register',
      {
        name: data.name,
        email: data.email,
        password: data.password,
        businessName: data.businessName || null,
      },
      { skipAuth: true }
    )

    return response
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }
    throw new ApiClientError('Signup failed. Please try again.', 500)
  }
}

/**
 * Login with email and password
 * Backend will set HttpOnly cookies automatically
 */
export async function login(data: LoginData): Promise<LoginResponse> {
  try {
    const response = await api.post<LoginResponse>(
      '/auth/login',
      {
        email: data.email,
        password: data.password,
      },
      { skipAuth: true }
    )

    return response
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }
    throw new ApiClientError('Login failed. Please try again.', 500)
  }
}

/**
 * Logout
 * Backend will clear HttpOnly cookies automatically
 */
export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout', undefined, { skipRefresh: true })
  } catch (error) {
    // Log error but don't throw - backend will clear cookies
    console.error('Logout error:', error)
  }
}

/**
 * Get current authenticated user
 * Backend should return user data if cookies are valid
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    // Try to get user from /auth/me endpoint
    // If that doesn't exist, we'll use refresh endpoint response
    const response = await api.get<User>('/auth/me')
    return response
  } catch (error) {
    // If /auth/me doesn't exist, return null
    // The auth context will handle verification via refresh
    return null
  }
}

/**
 * Initiate Google OAuth flow
 * Simply redirects to backend OAuth endpoint
 * Backend handles the entire OAuth flow and redirects to /auth/success or /auth/error
 */
export function initiateGoogleAuth(): void {
  const BASE_URL = process.env.NEXT_PUBLIC_BASEURL || ''
  if (!BASE_URL) {
    throw new Error('NEXT_PUBLIC_BASEURL environment variable is not set')
  }

  // Redirect to backend Google OAuth endpoint
  // Backend will handle OAuth flow and redirect to /auth/success or /auth/error
  if (typeof window !== 'undefined') {
    window.location.href = `${BASE_URL}/auth/google`
  }
}

