/**
 * React Query hooks for wallet operations
 * Provides automatic caching, refetching, and error handling
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { 
  createWallet, 
  getWalletBalance, 
  getWalletInfo,
  withdrawFromWallet,
  getWalletTransactions,
  deleteWallet
} from "@/lib/services/wallet.service"
import type { 
  CreateWalletDto, 
  WalletResponse,
  WalletInfoResponse, 
  WalletBalanceResponse,
  TransactionResponse,
  WithdrawDto 
} from "@/lib/services/wallet.types"

// Query keys for cache management
export const walletKeys = {
  all: ['wallet'] as const,
  info: () => [...walletKeys.all, 'info'] as const,
  balance: () => [...walletKeys.all, 'balance'] as const,
  transactions: () => [...walletKeys.all, 'transactions'] as const,
}

/**
 * Hook to fetch wallet information
 * Auto-fetches on mount, caches result, and handles errors
 */
export function useWalletInfo() {
  return useQuery<WalletInfoResponse>({
    queryKey: walletKeys.info(),
    queryFn: getWalletInfo,
    retry: 1,
  })
}

/**
 * Hook to fetch wallet balance
 * Auto-fetches on mount, caches result, and handles errors
 */
export function useWalletBalance() {
  return useQuery<WalletBalanceResponse>({
    queryKey: walletKeys.balance(),
    queryFn: getWalletBalance,
    retry: 1,
  })
}

/**
 * Hook to fetch wallet transactions
 * Auto-fetches on mount, caches result, and handles errors
 * Note: Backend implementation pending
 */
export function useWalletTransactions() {
  return useQuery<TransactionResponse[]>({
    queryKey: walletKeys.transactions(),
    queryFn: getWalletTransactions,
    enabled: false, // Disabled until backend is implemented
    retry: 1,
  })
}

/**
 * Hook to create a new wallet with BVN verification
 * Automatically invalidates and refetches wallet data on success
 */
export function useCreateWallet() {
  const queryClient = useQueryClient()

  return useMutation<WalletResponse, Error, CreateWalletDto>({
    mutationFn: createWallet,
    onSuccess: (data) => {
      // Update wallet info cache with new data
      queryClient.setQueryData<WalletInfoResponse>(walletKeys.info(), {
        walletId: data.id,
        walletReference: data.walletReference,
        bvn: data.bvn,
        bvnDateOfBirth: data.bvnDateOfBirth,
        accountNumber: data.accountNumber,
        accountName: data.accountName,
        bankCode: data.bankCode,
        bankName: data.bankName,
        walletStatus: data.status,
      })
      
      // Refetch balance to get initial balance
      queryClient.invalidateQueries({ queryKey: walletKeys.balance() })
    },
  })
}

/**
 * Hook to withdraw funds from wallet
 * Automatically refetches balance and transactions on success
 * Note: Backend implementation pending
 */
export function useWithdrawFunds() {
  const queryClient = useQueryClient()

  return useMutation<any, Error, WithdrawDto>({
    mutationFn: withdrawFromWallet,
    onSuccess: () => {
      // Refetch balance after withdrawal
      queryClient.invalidateQueries({ queryKey: walletKeys.balance() })
      // Refetch transactions to show new withdrawal
      queryClient.invalidateQueries({ queryKey: walletKeys.transactions() })
    },
  })
}

/**
 * Hook to delete wallet
 * Clears all wallet cache on success
 * Note: Backend implementation pending
 */
export function useDeleteWallet() {
  const queryClient = useQueryClient()

  return useMutation<void, Error>({
    mutationFn: deleteWallet,
    onSuccess: () => {
      // Clear all wallet cache
      queryClient.removeQueries({ queryKey: walletKeys.all })
    },
  })
}
