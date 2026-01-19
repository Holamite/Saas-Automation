/**
 * Auth service: login, register, logout, getCurrentUser, initiateGoogleAuth
 * All types and API contracts for auth and /users/me
 */

import { api, ApiClientError } from '@/lib/api'

// --- Data contracts (from backend) ---

/** User from login/register/refresh: id, email, firstname, lastname, businessName?, role, createdAt */
export interface AuthUser {
  id: string
  email: string
  firstname: string
  lastname: string
  businessName?: string | null
  role: 'USER' | 'ADMIN'
  createdAt: string
}

/**
 * User from GET /users/me (canonical for dashboard, route protection, hydration).
 * Extends AuthUser-like fields with wallet, volumeCapacity, subscription, references.
 */
export interface User {
  id?: string
  email: string
  firstname: string
  lastname: string
  businessName?: string | null
  role?: 'USER' | 'ADMIN'
  createdAt?: string
  wallet?: {
    accountName: string
    accountNumber: string
    bankName: string
    bvn: string
  }
  volumeCapacity?: {
    monthlyVC: number
    usedVC: number
    availableVC: number
    usagePercentage: number
  }
  subscription?: {
    subscriptionStatus: string
    startDate: string
    endDate: string
    nextBillingDate: string
  }
  references?: {
    count: number
    referenceAccounts: Array<{
      accountNumber: string
      accountName: string
      bankName: string
    }>
  }
}

export interface RegisterResponse {
  message: string
  user: AuthUser
}

export interface LoginResponse {
  message: string
  user: AuthUser
}

export interface SignupData {
  firstname: string
  lastname: string
  email: string
  password: string
  businessName?: string
}

export interface LoginData {
  email: string
  password: string
}

// --- Service ---

export async function getCurrentUser(): Promise<User> {
  return api.get<User>('/users/me')
}

export async function register(data: SignupData): Promise<RegisterResponse> {
  try {
    return await api.post<RegisterResponse>(
      '/auth/register',
      {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: data.password,
        ...(data.businessName != null && data.businessName !== '' ? { businessName: data.businessName } : {}),
      },
      { skipRefresh: true }
    )
  } catch (e) {
    if (e instanceof ApiClientError) throw e
    throw new ApiClientError('Registration failed. Please try again.', 500)
  }
}

export async function login(data: LoginData): Promise<LoginResponse> {
  try {
    return await api.post<LoginResponse>('/auth/login', { email: data.email, password: data.password }, { skipRefresh: true })
  } catch (e) {
    if (e instanceof ApiClientError) throw e
    throw new ApiClientError('Login failed. Please try again.', 500)
  }
}

export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout', undefined, { skipRefresh: true })
  } catch (e) {
    console.error('Logout error:', e)
  }
}

/**
 * Redirects to /api/auth/google. Backend handles OAuth and redirects to
 * /auth/success or /auth/error?message=...
 */
export function initiateGoogleAuth(): void {
  if (typeof window === 'undefined') return
  window.location.href = '/api/auth/google'
}
