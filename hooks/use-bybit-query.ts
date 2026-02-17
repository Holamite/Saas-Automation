/**
 * React Query hooks for Bybit operations
 * Provides automatic caching, refetching, and error handling
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { 
  addBybitKey, 
  updateBybitKey,
  removeBybitKey, 
  getBybitKeyStatus 
} from "@/lib/services/bybit.service"
import type { 
  AddBybitKeyDto, 
  UpdateKeyDto,
  BybitKeyResponse,
  BybitKeyStatusResponse 
} from "@/lib/services/bybit.service"

// Query keys for cache management
export const bybitKeys = {
  all: ['bybit'] as const,
  status: () => [...bybitKeys.all, 'status'] as const,
}

/**
 * Hook to fetch Bybit key status
 * Auto-fetches on mount, caches result, and handles errors
 */
export function useBybitKeyStatus(enabled = true) {
  return useQuery<BybitKeyStatusResponse>({
    queryKey: bybitKeys.status(),
    queryFn: getBybitKeyStatus,
    retry: 1,
    enabled, // Only fetch when enabled (e.g., user is authenticated)
  })
}

/**
 * Hook to add Bybit API key
 * Automatically invalidates and refetches status on success
 */
export function useAddBybitKey() {
  const queryClient = useQueryClient()

  return useMutation<BybitKeyResponse, Error, AddBybitKeyDto>({
    mutationFn: addBybitKey,
    onSuccess: () => {
      // Update status cache to show connected
      queryClient.setQueryData<BybitKeyStatusResponse>(bybitKeys.status(), {
        hasKey: true,
      })
    },
  })
}

/**
 * Hook to update Bybit API key
 * Invalidates status cache on success (key remains connected)
 */
export function useUpdateBybitKey() {
  const queryClient = useQueryClient()

  return useMutation<BybitKeyResponse, Error, UpdateKeyDto>({
    mutationFn: updateBybitKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bybitKeys.status() })
    },
  })
}

/**
 * Hook to remove Bybit API key
 * Automatically invalidates and refetches status on success
 */
export function useRemoveBybitKey() {
  const queryClient = useQueryClient()

  return useMutation<BybitKeyResponse, Error>({
    mutationFn: removeBybitKey,
    onSuccess: () => {
      // Update status cache to show disconnected
      queryClient.setQueryData<BybitKeyStatusResponse>(bybitKeys.status(), {
        hasKey: false,
      })
    },
  })
}
