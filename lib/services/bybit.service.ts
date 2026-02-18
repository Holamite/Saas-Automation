/**
 * Bybit API service
 * Service layer for Bybit exchange integration operations
 */

import { api } from "@/lib/api/client"

const BYBIT_ENDPOINTS = {
  ADD_KEY: "/bybit/key",
  REMOVE_KEY: "/bybit/remove-key",
} as const

export interface AddBybitKeyDto {
  apiKey: string
  apiSecret: string
}

export type UpdateKeyDto = AddBybitKeyDto

export interface BybitKeyResponse {
  message: string
}

export interface BybitKeyStatusResponse {
  hasKey: boolean
  apiKey?: string
}

/** Backend may return hasKey or indicate key presence via apiKey; normalize to hasKey */
function normalizeBybitStatus(data: unknown): BybitKeyStatusResponse {
  if (data && typeof data === 'object' && 'hasKey' in data && typeof (data as { hasKey: unknown }).hasKey === 'boolean') {
    return data as BybitKeyStatusResponse
  }
  const obj = data as Record<string, unknown> | null | undefined
  return {
    hasKey: !!(obj?.hasKey === true || (obj?.apiKey != null && obj.apiKey !== '')),
    apiKey: typeof obj?.apiKey === 'string' ? obj.apiKey : undefined,
  }
}

/**
 * Get Bybit API key status from backend (source of truth for connected state)
 */
export const getBybitKeyStatus = async (): Promise<BybitKeyStatusResponse> => {
  const data = await api.get<unknown>(BYBIT_ENDPOINTS.ADD_KEY)
  return normalizeBybitStatus(data)
}

/**
 * Add Bybit API key and secret
 */
export const addBybitKey = async (data: AddBybitKeyDto): Promise<BybitKeyResponse> => {
  return api.post<BybitKeyResponse>(BYBIT_ENDPOINTS.ADD_KEY, data)
}

/**
 * Update Bybit API key and secret
 */
export const updateBybitKey = async (data: UpdateKeyDto): Promise<BybitKeyResponse> => {
  return api.put<BybitKeyResponse>(BYBIT_ENDPOINTS.ADD_KEY, data)
}

/**
 * Remove Bybit API key
 */
export const removeBybitKey = async (): Promise<BybitKeyResponse> => {
  return api.delete<BybitKeyResponse>(BYBIT_ENDPOINTS.REMOVE_KEY)
}
