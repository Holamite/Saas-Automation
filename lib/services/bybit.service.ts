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

/**
 * Get Bybit API key status
 */
export const getBybitKeyStatus = async (): Promise<BybitKeyStatusResponse> => {
  return api.get<BybitKeyStatusResponse>(BYBIT_ENDPOINTS.ADD_KEY)
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
