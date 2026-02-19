import { api, ApiClientError } from '@/lib/api/client'

export type PaymentProviderName = 'NOMBA' | 'MONNIFY' | 'PAYSTACK'

const PAYMENT_ENDPOINTS = {
  USER_PROVIDERS: '/payment/providers/user',
  PRIMARY: '/payment/providers/primary',
  PROVIDER: (name: PaymentProviderName) => `/payment/providers/${name}`,
  SET_PRIMARY: (name: PaymentProviderName) => `/payment/providers/primary/${name}`,
} as const

/** Status response for a single provider (matches Bybit pattern: hasKey -> hasProvider) */
export interface PaymentProviderStatusResponse {
  hasProvider: boolean
}

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
  name?: PaymentProviderName
  /** Backend may return provider instead of name */
  provider?: PaymentProviderName
  isPrimary?: boolean
  [key: string]: unknown
}

/** Normalize provider id from backend response (handles both name and provider fields) */
export function getProviderId(
  p: UserPaymentProvider
): PaymentProviderName | undefined {
  const id = (p.name ?? p.provider) as string | undefined
  if (id === 'MONNIFY' || id === 'PAYSTACK' || id === 'NOMBA') return id
  return undefined
}

export type PrimaryPaymentProvider = UserPaymentProvider | null

/**
 * Get all payment providers configured for the current user.
 * Handles backend response shapes: raw array, { providers: [...] }, { data: [...] }
 */
export async function getUserPaymentProviders(): Promise<UserPaymentProvider[]> {
  const data = await api.get<unknown>(PAYMENT_ENDPOINTS.USER_PROVIDERS)
  const arr = Array.isArray(data)
    ? data
    : (data as Record<string, unknown>)?.providers ?? (data as Record<string, unknown>)?.data
  if (!Array.isArray(arr)) return []
  return arr as UserPaymentProvider[]
}

/**
 * Check if a specific payment provider exists for the current user.
 * Uses GET /payment/providers/:name - 200 = exists, 404 = not exists.
 * Matches Bybit pattern: getBybitKeyStatus -> getPaymentProviderStatus.
 */
export async function getPaymentProviderStatus(
  name: PaymentProviderName
): Promise<PaymentProviderStatusResponse> {
  try {
    await api.get<unknown>(PAYMENT_ENDPOINTS.PROVIDER(name))
    return { hasProvider: true }
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 404) {
      return { hasProvider: false }
    }
    throw error
  }
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

