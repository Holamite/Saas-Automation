/**
 * Subscription service: API calls for subscription management
 */

import { api } from '@/lib/api'
import type {
  CreateSubscriptionDto,
  InitiateSubscriptionResponse,
  SubscriptionStatusResponse,
  VerifyPaymentResponse,
} from './subscription.types'

const SUBSCRIPTION_ENDPOINTS = {
  INITIATE: '/subscriptions/initiate',
  STATUS: '/subscriptions/status',
  VERIFY: (transactionReference: string) => `/subscriptions/verify/${transactionReference}`,
} as const

/**
 * Initiate a subscription (upgrade/downgrade)
 */
export const initiateSubscription = async (
  dto: CreateSubscriptionDto
): Promise<InitiateSubscriptionResponse> => {
  return api.post<InitiateSubscriptionResponse>(SUBSCRIPTION_ENDPOINTS.INITIATE, dto)
}

/**
 * Get current subscription status and volume capacity
 */
export const getSubscriptionStatus = async (): Promise<SubscriptionStatusResponse> => {
  return api.get<SubscriptionStatusResponse>(SUBSCRIPTION_ENDPOINTS.STATUS)
}

/**
 * Verify subscription payment
 */
export const verifySubscriptionPayment = async (
  transactionReference: string
): Promise<VerifyPaymentResponse> => {
  return api.get<VerifyPaymentResponse>(SUBSCRIPTION_ENDPOINTS.VERIFY(transactionReference))
}
