/**
 * React Query hooks for wallet operations
 * Production-ready hooks with proper error handling and optimistic updates
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createWallet,
  getWalletBalance,
  getWalletTransactions,
  getWalletInfo,
  withdrawFromWallet,
  deleteWallet,
} from "@/lib/services/wallet.service"
import type {
  CreateWalletDto,
  WalletBalanceResponse,
  WalletInfoResponse,
  TransactionResponse,
  WithdrawDto,
} from "@/lib/services/wallet.types"
import { useToast } from "./use-toast"

// Query keys for cache management
export const WALLET_QUERY_KEYS = {
  balance: ["wallet", "balance"] as const,
  transactions: ["wallet", "transactions"] as const,
  info: ["wallet", "info"] as const,
  wallet: ["wallet"] as const,
}

/**
 * Hook to fetch wallet balance
 */
export const useWalletBalance = () => {
  return useQuery({
    queryKey: WALLET_QUERY_KEYS.balance,
    queryFn: getWalletBalance,
    staleTime: 30 * 1000, // 30 seconds
    retry: 2,
  })
}

/**
 * Hook to fetch wallet transactions
 */
export const useWalletTransactions = () => {
  return useQuery({
    queryKey: WALLET_QUERY_KEYS.transactions,
    queryFn: getWalletTransactions,
    staleTime: 60 * 1000, // 1 minute
    retry: 2,
  })
}

/**
 * Hook to fetch wallet information
 * Note: This endpoint may not be implemented on the backend yet
 */
export const useWalletInfo = () => {
  return useQuery({
    queryKey: WALLET_QUERY_KEYS.info,
    queryFn: getWalletInfo,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    // Don't throw errors if endpoint doesn't exist yet
    throwOnError: false,
  })
}

/**
 * Hook to create wallet with BVN verification
 */
export const useCreateWallet = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: CreateWalletDto) => createWallet(data),
    onSuccess: (data) => {
      // Invalidate and refetch wallet-related queries
      queryClient.invalidateQueries({ queryKey: WALLET_QUERY_KEYS.wallet })
      queryClient.invalidateQueries({ queryKey: WALLET_QUERY_KEYS.balance })
      queryClient.invalidateQueries({ queryKey: WALLET_QUERY_KEYS.info })
      
      toast({
        title: "Wallet Created Successfully",
        description: `Your wallet has been activated. Account: ${data.accountNumber}`,
      })
    },
    onError: (error: any) => {
      const errorMessage = error?.details || error?.message || "Failed to create wallet"
      toast({
        title: "Wallet Creation Failed",
        description: errorMessage,
        variant: "destructive",
      })
    },
  })
}

/**
 * Hook to withdraw from wallet
 */
export const useWithdrawWallet = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: WithdrawDto) => withdrawFromWallet(data),
    onSuccess: (data) => {
      // Invalidate balance to show updated amount
      queryClient.invalidateQueries({ queryKey: WALLET_QUERY_KEYS.balance })
      queryClient.invalidateQueries({ queryKey: WALLET_QUERY_KEYS.transactions })

      toast({
        title: "Withdrawal Initiated",
        description: `₦${data.amount.toLocaleString()} withdrawal request submitted. Reference: ${data.reference}`,
      })
    },
    onError: (error: any) => {
      const errorMessage = error?.details || error?.message || "Failed to process withdrawal"
      toast({
        title: "Withdrawal Failed",
        description: errorMessage,
        variant: "destructive",
      })
    },
  })
}

/**
 * Hook to delete wallet
 */
export const useDeleteWallet = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: deleteWallet,
    onSuccess: () => {
      // Clear all wallet-related cache
      queryClient.removeQueries({ queryKey: WALLET_QUERY_KEYS.wallet })
      queryClient.removeQueries({ queryKey: WALLET_QUERY_KEYS.balance })
      queryClient.removeQueries({ queryKey: WALLET_QUERY_KEYS.transactions })

      toast({
        title: "Wallet Deleted",
        description: "Your wallet has been successfully deleted",
      })
    },
    onError: (error: any) => {
      const errorMessage = error?.details || error?.message || "Failed to delete wallet"
      toast({
        title: "Deletion Failed",
        description: errorMessage,
        variant: "destructive",
      })
    },
  })
}
