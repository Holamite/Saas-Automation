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
 * Generate a random state parameter for CSRF protection
 */
function generateState(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Store OAuth state in sessionStorage for verification
 */
function storeOAuthState(state: string): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('oauth_state', state)
  }
}

/**
 * Verify OAuth state parameter
 */
export function verifyOAuthState(state: string): boolean {
  if (typeof window === 'undefined') return false
  const storedState = sessionStorage.getItem('oauth_state')
  if (storedState) {
    sessionStorage.removeItem('oauth_state')
    return storedState === state
  }
  return false
}

/**
 * Initiate Google OAuth flow with CSRF protection
 */
export function initiateGoogleAuth(): void {
  const BASE_URL = process.env.NEXT_PUBLIC_BASEURL || ''
  if (!BASE_URL) {
    throw new Error('NEXT_PUBLIC_BASEURL environment variable is not set')
  }

  // Generate state parameter for CSRF protection
  const state = generateState()
  storeOAuthState(state)

  // Get redirect URI (frontend callback URL)
  const redirectUri = typeof window !== 'undefined' 
    ? `${window.location.origin}/auth/callback`
    : `${BASE_URL}/auth/callback`

  // Build OAuth URL with state and redirect_uri
  const params = new URLSearchParams({
    state,
    redirect_uri: redirectUri,
  })

  const oauthUrl = `${BASE_URL}/auth/google?${params.toString()}`
  
  // Redirect to Google OAuth endpoint
  // Backend will handle OAuth and set HttpOnly cookies
  if (typeof window !== 'undefined') {
    window.location.href = oauthUrl
  }
}

