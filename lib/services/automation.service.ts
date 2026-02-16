/**
 * Automation API service
 * Service layer for automation rules and start/stop (order + ad)
 */

import { api } from '@/lib/api/client'

const AUTOMATION_ENDPOINTS = {
  START: '/automation/start',
  STOP: '/automation/stop',
  ORDER_RULES: '/automation/order/rules',
} as const

/** Order automation rules as returned by GET /automation/order/rules */
export interface OrderRulesResponse {
  automationEnabled?: boolean
  autoPayEnabled?: boolean
  autoReleaseEnabled?: boolean
  requireAmountMatch?: boolean
  amountTolerance?: number
  minPaymentConfirmationTime?: number
  notifyOnAutomation?: boolean
  notifyOnManualReview?: boolean
  notifyOnErrors?: boolean
  pollIntervalMs?: number
  pollActive?: boolean
}

/** Payload for creating or updating order rules (POST/PUT /automation/order/rules) */
export interface UpdateOrderRulesDto {
  autoPayEnabled?: boolean
  autoReleaseEnabled?: boolean
  requireAmountMatch?: boolean
  amountTolerance?: number
  minPaymentConfirmationTime?: number
  notifyOnAutomation?: boolean
  notifyOnManualReview?: boolean
  notifyOnErrors?: boolean
  pollIntervalMs?: number
  pollActive?: boolean
}

export interface AutomationMessageResponse {
  message: string
}

/**
 * Fetch current order automation rules for the current user
 */
export async function getOrderRules(): Promise<OrderRulesResponse> {
  return api.get<OrderRulesResponse>(AUTOMATION_ENDPOINTS.ORDER_RULES)
}

/**
 * Start automation (order polling and/or ad polling if enabled)
 */
export async function startAutomation(): Promise<AutomationMessageResponse> {
  return api.post<AutomationMessageResponse>(AUTOMATION_ENDPOINTS.START)
}

/**
 * Stop automation
 */
export async function stopAutomation(): Promise<AutomationMessageResponse> {
  return api.post<AutomationMessageResponse>(AUTOMATION_ENDPOINTS.STOP)
}

/**
 * Create or update order rules
 */
export async function updateOrderRules(
  data: UpdateOrderRulesDto
): Promise<OrderRulesResponse> {
  return api.put<OrderRulesResponse>(AUTOMATION_ENDPOINTS.ORDER_RULES, data)
}
