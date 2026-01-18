/** Wallet & linked account types. Ready for backend substitution. */

export interface LinkedAccount {
  id: number
  name: string
  bank: string
  number: string
  active: boolean
  verified: boolean
}

export interface WalletTransaction {
  id: string
  date: string
  type: string
  description: string
  amount: number
  currency: string
  status: string
  ref: string
}

export interface AddAccountForm {
  accountNumber: string
  bank: string
  accountName: string
}

export type WalletModalType =
  | "send"
  | "set-transfer-pin"
  | "withdraw"
  | "bvn-verification"
  | "add-account"
  | null
