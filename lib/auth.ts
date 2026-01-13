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
 * Get linked accounts for the current authenticated user
 * Backend returns linked accounts if cookies are valid
 */
export async function getLinkedAccounts(): Promise<Account[]> {
  try {
    const response = await api.get<Account[]>('/auth/linked-accounts')
    return Array.isArray(response) ? response : []
  } catch (error) {
    // If linked accounts endpoint fails, return empty array
    return []
  }
}

/**
 * Get list of all users
 * Backend returns list of users if cookies are valid and user has permission
 */
export async function getUsers(): Promise<User[]> {
  try {
    const response = await api.get<User[]>('/auth/users')
    return Array.isArray(response) ? response : []
  } catch (error) {
    // If users endpoint fails, return empty array
    return []
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

