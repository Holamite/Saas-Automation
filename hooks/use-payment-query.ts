/**
 * React Query hooks for bank/payment providers
 * Keeps dashboard overlay and connectivity page in sync with backend state
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getUserPaymentProviders,
  getPrimaryPaymentProvider,
  addPaymentProvider,
  updatePaymentProvider,
  setPrimaryPaymentProvider,
} from '@/lib/services/payment.service'
import type {
  UserPaymentProvider,
  PrimaryPaymentProvider,
  PaymentProviderName,
  CreatePaymentDto,
  UpdatePaymentDto,
} from '@/lib/services/payment.service'

export const paymentKeys = {
  all: ['paymentProviders'] as const,
  list: () => [...paymentKeys.all, 'list'] as const,
  primary: () => [...paymentKeys.all, 'primary'] as const,
}

/**
 * Fetch all payment providers for the current user.
 */
export function usePaymentProviders(enabled = true) {
  return useQuery<UserPaymentProvider[]>({
    queryKey: paymentKeys.list(),
    queryFn: getUserPaymentProviders,
    retry: 1,
    enabled,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  })
}

/**
 * Fetch primary payment provider for the current user.
 */
export function usePrimaryPaymentProvider(enabled = true) {
  return useQuery<PrimaryPaymentProvider>({
    queryKey: paymentKeys.primary(),
    queryFn: getPrimaryPaymentProvider,
    retry: 1,
    enabled,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  })
}

/**
 * Add a payment provider configuration.
 */
export function useAddPaymentProvider() {
  const queryClient = useQueryClient()

  return useMutation<{ message: string }, Error, { name: PaymentProviderName; data: CreatePaymentDto }>({
    mutationFn: ({ name, data }) => addPaymentProvider(name, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.list() })
      queryClient.invalidateQueries({ queryKey: paymentKeys.primary() })
    },
  })
}

/**
 * Update a payment provider configuration.
 */
export function useUpdatePaymentProvider() {
  const queryClient = useQueryClient()

  return useMutation<{ message: string }, Error, { name: PaymentProviderName; data: UpdatePaymentDto }>({
    mutationFn: ({ name, data }) => updatePaymentProvider(name, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.list() })
      queryClient.invalidateQueries({ queryKey: paymentKeys.primary() })
    },
  })
}

/**
 * Set a provider as primary.
 * Refetches list and primary from backend so the UI shows only the new primary as active.
 */
export function useSetPrimaryPaymentProvider() {
  const queryClient = useQueryClient()

  return useMutation<{ message: string }, Error, PaymentProviderName>({
    mutationFn: (name) => setPrimaryPaymentProvider(name),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.list() })
      queryClient.invalidateQueries({ queryKey: paymentKeys.primary() })
      await Promise.all([
        queryClient.refetchQueries({ queryKey: paymentKeys.list() }),
        queryClient.refetchQueries({ queryKey: paymentKeys.primary() }),
      ])
    },
  })
}

