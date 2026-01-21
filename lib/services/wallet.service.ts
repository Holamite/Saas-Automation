/**
 * Wallet API service
 * Production-ready service layer for wallet operations
 */

import { api } from "@/lib/api/client"
import type {
  CreateWalletDto,
  WalletResponse,
  WalletBalanceResponse,
  TransactionResponse,
  WithdrawDto,
  WithdrawResponse,
} from "./wallet.types"

const WALLET_ENDPOINTS = {
  CREATE: "/wallet/create",
  WITHDRAW: "/wallet/withdraw",
  BALANCE: "/wallet/balance",
  DELETE: "/wallet/delete",
  TRANSACTIONS: "/wallet/transactions",
  INFO: "/wallet/info",
} as const

/**
 * Create a new wallet with BVN verification
 */
export const createWallet = async (data: CreateWalletDto): Promise<WalletResponse> => {
  return api.post<WalletResponse>(WALLET_ENDPOINTS.CREATE, data)
}

/**
 * Withdraw funds from wallet to linked account
 */
export const withdrawFromWallet = async (data: WithdrawDto): Promise<WithdrawResponse> => {
  return api.post<WithdrawResponse>(WALLET_ENDPOINTS.WITHDRAW, data)
}

/**
 * Get current wallet balance
 */
export const getWalletBalance = async (): Promise<WalletBalanceResponse> => {
  return api.get<WalletBalanceResponse>(WALLET_ENDPOINTS.BALANCE)
}

/**
 * Get wallet transactions
 */
export const getWalletTransactions = async (): Promise<TransactionResponse[]> => {
  return api.get<TransactionResponse[]>(WALLET_ENDPOINTS.TRANSACTIONS)
}

/**
 * Get wallet information
 */
export const getWalletInfo = async (): Promise<import("./wallet.types").WalletInfoResponse> => {
  return api.get<import("./wallet.types").WalletInfoResponse>(WALLET_ENDPOINTS.INFO)
}

/**
 * Delete wallet
 */
export const deleteWallet = async (): Promise<void> => {
  return api.delete<void>(WALLET_ENDPOINTS.DELETE)
}
