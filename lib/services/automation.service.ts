/**
 * Automation API service
 * Service layer for automation rules and start/stop (order + ad)
 */

import { api } from '@/lib/api/client'

const AUTOMATION_ENDPOINTS = {
  START: '/automation/start',
  STOP: '/automation/stop',
  ORDER_RULES: '/automation/order/rules',
  ORDER_ENABLE: (type: 'buy' | 'sell' | 'both') => `/automation/order/enable/${type}`,
  ORDER_DISABLE: '/automation/order/disable',
  AD_RULES: '/automation/ad/rules',
  AD_ENABLE: (type: 'buy' | 'sell' | 'both') => `/automation/ad/enable/${type}`,
  AD_DISABLE: '/automation/ad/disable',
  AD_RESET_VOLUME: '/automation/ad/reset-volume',
} as const

export type OrderAutomationType = 'buy' | 'sell' | 'both'

/** Order automation rules as returned by GET /automation/order/rules (AutomationRule entity) */
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
  webhookEnabled?: boolean
  pollInterval?: string
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

/** Ad strategy as returned by GET /automation/ad/rules */
export interface AdStrategyResponse {
  buyAdEnabled?: boolean
  sellAdEnabled?: boolean
  [key: string]: unknown
}

/** Payload for POST/PUT /automation/ad/rules */
export interface CreateAdStrategyDto {
  buyAdEnabled?: boolean
  sellAdEnabled?: boolean
  [key: string]: unknown
}

export type UpdateAdStrategyDto = CreateAdStrategyDto

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

/**
 * Enable order automation for buy, sell, or both
 */
export async function enableOrderType(
  type: OrderAutomationType
): Promise<AutomationMessageResponse> {
  return api.post<AutomationMessageResponse>(AUTOMATION_ENDPOINTS.ORDER_ENABLE(type))
}

/**
 * Disable order automation
 */
export async function disableOrderType(): Promise<AutomationMessageResponse> {
  return api.post<AutomationMessageResponse>(AUTOMATION_ENDPOINTS.ORDER_DISABLE)
}

/**
 * Fetch ad strategy for the current user
 */
export async function getAdStrategy(): Promise<AdStrategyResponse> {
  return api.get<AdStrategyResponse>(AUTOMATION_ENDPOINTS.AD_RULES)
}

/**
 * Create or update ad strategy (POST)
 */
export async function createAdStrategy(
  data: CreateAdStrategyDto
): Promise<AdStrategyResponse> {
  return api.post<AdStrategyResponse>(AUTOMATION_ENDPOINTS.AD_RULES, data)
}

/**
 * Update ad strategy (PUT)
 */
export async function updateAdStrategy(
  data: UpdateAdStrategyDto
): Promise<AdStrategyResponse> {
  return api.put<AdStrategyResponse>(AUTOMATION_ENDPOINTS.AD_RULES, data)
}

/**
 * Enable ad automation for buy, sell, or both
 */
export async function enableAdType(
  type: OrderAutomationType
): Promise<AutomationMessageResponse> {
  return api.post<AutomationMessageResponse>(AUTOMATION_ENDPOINTS.AD_ENABLE(type))
}

/**
 * Disable ad automation
 */
export async function disableAdAutomation(): Promise<AutomationMessageResponse> {
  return api.post<AutomationMessageResponse>(AUTOMATION_ENDPOINTS.AD_DISABLE)
}

/**
 * Reset ad volume tracking
 */
export async function resetVolumeTracking(): Promise<AutomationMessageResponse> {
  return api.post<AutomationMessageResponse>(AUTOMATION_ENDPOINTS.AD_RESET_VOLUME)
}
