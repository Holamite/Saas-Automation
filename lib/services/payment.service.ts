import { api } from '@/lib/api/client'

export type PaymentProviderName = 'NOMBA' | 'MONNIFY' | 'PAYSTACK'

const PAYMENT_ENDPOINTS = {
  USER_PROVIDERS: '/payment/providers/user',
  PRIMARY: '/payment/providers/primary',
  PROVIDER: (name: PaymentProviderName) => `/payment/providers/${name}`,
  SET_PRIMARY: (name: PaymentProviderName) => `/payment/providers/primary/${name}`,
} as const

/** Matches backend CreatePaymentDto (shared across NOMBA, MONNIFY, PAYSTACK) */
export interface CreatePaymentDto {
  apiKey: string
  secretKey: string
  accountNumber: string
  accountName: string
  bankName: string
  bankCode: string
  walletNumber?: string
  isPrimary?: boolean
  /** Monnify-specific; send if backend supports it */
  contractCode?: string
  [key: string]: unknown
}

export type UpdatePaymentDto = CreatePaymentDto

export interface UserPaymentProvider {
  name: PaymentProviderName
  isPrimary?: boolean
  // Other backend fields are allowed but not required on the frontend
  [key: string]: unknown
}

export type PrimaryPaymentProvider = UserPaymentProvider | null

/**
 * Get all payment providers configured for the current user.
 */
export async function getUserPaymentProviders(): Promise<UserPaymentProvider[]> {
  const data = await api.get<unknown>(PAYMENT_ENDPOINTS.USER_PROVIDERS)
  if (!Array.isArray(data)) return []
  return data as UserPaymentProvider[]
}

/**
 * Get the current primary payment provider for the user.
 */
export async function getPrimaryPaymentProvider(): Promise<PrimaryPaymentProvider> {
  const data = await api.get<unknown>(PAYMENT_ENDPOINTS.PRIMARY)
  if (!data || typeof data !== 'object') return null
  return data as UserPaymentProvider
}

/**
 * Add a payment provider configuration for the given provider name.
 */
export async function addPaymentProvider(
  name: PaymentProviderName,
  dto: CreatePaymentDto,
) {
  return api.post<{ message: string }>(PAYMENT_ENDPOINTS.PROVIDER(name), dto)
}

/**
 * Update an existing payment provider configuration.
 */
export async function updatePaymentProvider(
  name: PaymentProviderName,
  dto: UpdatePaymentDto,
) {
  return api.put<{ message: string }>(PAYMENT_ENDPOINTS.PROVIDER(name), dto)
}

/**
 * Mark a provider as primary for the user.
 */
export async function setPrimaryPaymentProvider(name: PaymentProviderName) {
  return api.post<{ message: string }>(PAYMENT_ENDPOINTS.SET_PRIMARY(name))
}

