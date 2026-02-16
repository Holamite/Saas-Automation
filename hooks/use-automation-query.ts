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
} from '@/lib/services/automation.service'
import type {
  OrderRulesResponse,
  UpdateOrderRulesDto,
  AutomationMessageResponse,
} from '@/lib/services/automation.service'

export const automationKeys = {
  all: ['automation'] as const,
  orderRules: () => [...automationKeys.all, 'orderRules'] as const,
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
