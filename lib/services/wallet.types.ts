/**
 * Wallet service type definitions
 * Matches backend API contracts for wallet operations
 */

/**
 * DTO for creating a new wallet
 * Backend: CreateWalletDto
 * Required fields: bvn, bvnDateOfBirth
 */
export interface CreateWalletDto {
  bvn: string
  bvnDateOfBirth: string // Format: YYYY-MM-DD
}

/**
 * Response from wallet creation
 * Backend: Wallet entity
 */
export interface WalletResponse {
  id: string
  userId: string
  walletReference: string
  accountNumber: string
  accountName: string
  bankCode: string
  bankName: string
  bvn: string
  bvnDateOfBirth: string
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  createdAt: string
  updatedAt: string
}

/**
 * Response from GET /wallet/balance
 * Backend: MonifyService.getWalletBalance response
 */
export interface WalletBalanceResponse {
  availableBalance: number
  ledgerBalance: number
}

/**
 * Response from GET /wallet/info
 * Backend: WalletService.getWalletInfo
 */
export interface WalletInfoResponse {
  walletId: string
  walletReference: string
  bvn: string
  bvnDateOfBirth: string
  accountNumber: string
  accountName: string
  bankCode: string
  bankName: string
  walletStatus: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
}

/**
 * DTO for withdrawing funds
 * Backend: WithdrawDto (NOT YET IMPLEMENTED)
 */
export interface WithdrawDto {
  amount: number
  accountNumber: string
  bankCode: string
  narration?: string
}

/**
 * Response from withdrawal
 * Backend: (NOT YET IMPLEMENTED)
 */
export interface WithdrawResponse {
  message: string
  transactionReference: string
  status: string
}

/**
 * Transaction response
 * Backend: (NOT YET IMPLEMENTED)
 */
export interface TransactionResponse {
  id: string
  transactionReference: string
  amount: number
  type: 'CREDIT' | 'DEBIT'
  status: 'PENDING' | 'COMPLETED' | 'FAILED'
  description: string
  createdAt: string
}
