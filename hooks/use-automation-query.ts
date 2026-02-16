/**
 * React Query hooks for automation (order rules, start/stop)
 * Provides caching, refetching, and error handling
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getOrderRules,
  startAutomation,
  stopAutomation,
  updateOrderRules,
  enableOrderType,
  disableOrderType,
  getAdStrategy,
  createAdStrategy,
  updateAdStrategy,
  enableAdType,
  disableAdAutomation,
  resetVolumeTracking,
} from '@/lib/services/automation.service'
import type {
  OrderRulesResponse,
  UpdateOrderRulesDto,
  AutomationMessageResponse,
  AdStrategyResponse,
  CreateAdStrategyDto,
  UpdateAdStrategyDto,
  OrderAutomationType,
} from '@/lib/services/automation.service'

export const automationKeys = {
  all: ['automation'] as const,
  orderRules: () => [...automationKeys.all, 'orderRules'] as const,
  adStrategy: () => [...automationKeys.all, 'adStrategy'] as const,
}

/**
 * Fetch order automation rules. Enable when user is authenticated.
 */
export function useOrderRules(enabled = true) {
  return useQuery<OrderRulesResponse>({
    queryKey: automationKeys.orderRules(),
    queryFn: getOrderRules,
    retry: 1,
    enabled,
  })
}

/**
 * Start automation. Invalidates order rules on success.
 */
export function useStartAutomation() {
  const queryClient = useQueryClient()
  return useMutation<AutomationMessageResponse, Error>({
    mutationFn: startAutomation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: automationKeys.orderRules() })
    },
  })
}

/**
 * Stop automation. Invalidates order rules on success.
 */
export function useStopAutomation() {
  const queryClient = useQueryClient()
  return useMutation<AutomationMessageResponse, Error>({
    mutationFn: stopAutomation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: automationKeys.orderRules() })
    },
  })
}

/**
 * Update order rules. Updates cache on success.
 */
export function useUpdateOrderRules() {
  const queryClient = useQueryClient()
  return useMutation<OrderRulesResponse, Error, UpdateOrderRulesDto>({
    mutationFn: updateOrderRules,
    onSuccess: (data) => {
      queryClient.setQueryData<OrderRulesResponse>(
        automationKeys.orderRules(),
        (prev) => ({ ...prev, ...data })
      )
    },
  })
}

/**
 * Enable order automation for buy, sell, or both. Invalidates order rules on success.
 */
export function useEnableOrderType() {
  const queryClient = useQueryClient()
  return useMutation<AutomationMessageResponse, Error, OrderAutomationType>({
    mutationFn: enableOrderType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: automationKeys.orderRules() })
    },
  })
}

/**
 * Disable order automation. Invalidates order rules on success.
 */
export function useDisableOrderType() {
  const queryClient = useQueryClient()
  return useMutation<AutomationMessageResponse, Error>({
    mutationFn: disableOrderType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: automationKeys.orderRules() })
    },
  })
}

/**
 * Fetch ad strategy. Enable when user is authenticated.
 */
export function useAdStrategy(enabled = true) {
  return useQuery<AdStrategyResponse>({
    queryKey: automationKeys.adStrategy(),
    queryFn: getAdStrategy,
    retry: 1,
    enabled,
  })
}

/**
 * Create ad strategy. Invalidates ad strategy on success.
 */
export function useCreateAdStrategy() {
  const queryClient = useQueryClient()
  return useMutation<AdStrategyResponse, Error, CreateAdStrategyDto>({
    mutationFn: createAdStrategy,
    onSuccess: (data) => {
      queryClient.setQueryData<AdStrategyResponse>(automationKeys.adStrategy(), data)
    },
  })
}

/**
 * Update ad strategy. Invalidates ad strategy on success.
 */
export function useUpdateAdStrategy() {
  const queryClient = useQueryClient()
  return useMutation<AdStrategyResponse, Error, UpdateAdStrategyDto>({
    mutationFn: updateAdStrategy,
    onSuccess: (data) => {
      queryClient.setQueryData<AdStrategyResponse>(
        automationKeys.adStrategy(),
        (prev) => ({ ...prev, ...data })
      )
    },
  })
}

/**
 * Enable ad automation for buy, sell, or both. Invalidates ad strategy on success.
 */
export function useEnableAdType() {
  const queryClient = useQueryClient()
  return useMutation<AutomationMessageResponse, Error, OrderAutomationType>({
    mutationFn: enableAdType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: automationKeys.adStrategy() })
    },
  })
}

/**
 * Disable ad automation. Invalidates ad strategy on success.
 */
export function useDisableAdAutomation() {
  const queryClient = useQueryClient()
  return useMutation<AutomationMessageResponse, Error>({
    mutationFn: disableAdAutomation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: automationKeys.adStrategy() })
    },
  })
}

/**
 * Reset ad volume tracking. Invalidates ad strategy on success.
 */
export function useResetVolumeTracking() {
  const queryClient = useQueryClient()
  return useMutation<AutomationMessageResponse, Error>({
    mutationFn: resetVolumeTracking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: automationKeys.adStrategy() })
    },
  })
}
