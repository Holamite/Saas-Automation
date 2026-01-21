/**
 * React Query hooks for subscription operations
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getSubscriptionStatus,
  initiateSubscription,
  verifySubscriptionPayment,
} from "@/lib/services/subscription.service"
import type {
  CreateSubscriptionDto,
  InitiateSubscriptionResponse,
  SubscriptionStatusResponse,
  VerifyPaymentResponse,
} from "@/lib/services/subscription.types"
import { ApiClientError } from "@/lib/api/client"

// Query Keys
export const subscriptionKeys = {
  all: ["subscription"] as const,
  status: () => [...subscriptionKeys.all, "status"] as const,
  verify: (transactionReference: string) =>
    [...subscriptionKeys.all, "verify", transactionReference] as const,
}

/**
 * Query: Get subscription status and volume capacity
 */
export function useSubscriptionStatus() {
  return useQuery<SubscriptionStatusResponse, ApiClientError>({
    queryKey: subscriptionKeys.status(),
    queryFn: getSubscriptionStatus,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  })
}

/**
 * Mutation: Initiate subscription (upgrade/downgrade)
 */
export function useInitiateSubscription() {
  const queryClient = useQueryClient()
  return useMutation<InitiateSubscriptionResponse, ApiClientError, CreateSubscriptionDto>({
    mutationFn: initiateSubscription,
    onSuccess: () => {
      // Invalidate subscription status to refetch after successful initiation
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.status() })
    },
  })
}

/**
 * Query: Verify subscription payment
 */
export function useVerifySubscriptionPayment(transactionReference: string | null) {
  return useQuery<VerifyPaymentResponse, ApiClientError>({
    queryKey: subscriptionKeys.verify(transactionReference || ""),
    queryFn: () => verifySubscriptionPayment(transactionReference!),
    enabled: !!transactionReference, // Only run if transactionReference exists
    staleTime: 0, // Always fetch fresh data
    retry: 3,
  })
}
