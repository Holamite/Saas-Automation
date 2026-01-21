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

export interface BybitKeyResponse {
  message: string
}

/**
 * Add Bybit API key and secret
 */
export const addBybitKey = async (data: AddBybitKeyDto): Promise<BybitKeyResponse> => {
  return api.post<BybitKeyResponse>(BYBIT_ENDPOINTS.ADD_KEY, data)
}

/**
 * Remove Bybit API key
 */
export const removeBybitKey = async (): Promise<BybitKeyResponse> => {
  return api.delete<BybitKeyResponse>(BYBIT_ENDPOINTS.REMOVE_KEY)
}
