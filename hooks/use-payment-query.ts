/**
 * React Query hooks for bank/payment providers
 * Keeps dashboard overlay and connectivity page in sync with backend state
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getUserPaymentProviders,
  getPrimaryPaymentProvider,
  getPaymentProviderStatus,
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
  status: (name: PaymentProviderName) => [...paymentKeys.all, 'status', name] as const,
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
 * Check if a specific provider exists (source of truth for Connect vs Update).
 * Matches Bybit pattern: useBybitKeyStatus -> usePaymentProviderStatus.
 * Only fetches when a provider is selected.
 */
export function usePaymentProviderStatus(providerName: PaymentProviderName | '', enabled: boolean) {
  const isValid = providerName === 'MONNIFY' || providerName === 'PAYSTACK' || providerName === 'NOMBA'
  const name = isValid ? providerName : 'MONNIFY'
  return useQuery({
    queryKey: paymentKeys.status(name),
    queryFn: () => getPaymentProviderStatus(providerName as PaymentProviderName),
    retry: 1,
    enabled: enabled && isValid,
    refetchOnMount: true,
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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.list() })
      queryClient.invalidateQueries({ queryKey: paymentKeys.primary() })
      queryClient.invalidateQueries({ queryKey: paymentKeys.status(variables.name) })
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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.list() })
      queryClient.invalidateQueries({ queryKey: paymentKeys.primary() })
      queryClient.invalidateQueries({ queryKey: paymentKeys.status(variables.name) })
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.list() })
      queryClient.invalidateQueries({ queryKey: paymentKeys.primary() })
    },
  })
}

