/**
 * React Query hooks for Bybit operations
 * Provides automatic caching, refetching, and error handling
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { 
  addBybitKey, 
  removeBybitKey, 
  getBybitKeyStatus 
} from "@/lib/services/bybit.service"
import type { 
  AddBybitKeyDto, 
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
export function useBybitKeyStatus() {
  return useQuery<BybitKeyStatusResponse>({
    queryKey: bybitKeys.status(),
    queryFn: getBybitKeyStatus,
    retry: 1,
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
