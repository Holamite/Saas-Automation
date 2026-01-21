/**
 * Subscription service types
 * Matches backend DTOs and responses
 */

// Enums matching backend
export enum Tier {
  FREE = 'FREE',
  PRO = 'PRO',
}

export enum PaymentMethod {
  WALLET = 'WALLET',
  CARD = 'CARD',
}

export enum TierVC {
  FREE = 1000,
  PRO = 50000,
}

// DTOs
export interface CreateSubscriptionDto {
  tier: Tier
  paymentMethod: PaymentMethod
}

// Response types
export interface SubscriptionStatus {
  tier: Tier
  paymentReference: string | null | undefined
  paymentMethod: PaymentMethod
  startDate: Date | null
  endDate: Date | null | undefined
  nextBillingDate: Date | null | undefined
  monthlyPrice: number
}

export interface VCStatus {
  userId: string
  monthlyVC: TierVC
  usedVolume: number
  topupVC: number
  totalVC: number
  availableVC: number
  usagePercentage: number
}

export interface SubscriptionStatusResponse {
  subscriptionStatus: SubscriptionStatus
  vcStatus: VCStatus
}

export interface InitiateSubscriptionResponse {
  message: string
  paymentUrl?: string
  transactionReference?: string
  tier: Tier
  paymentMethod: PaymentMethod
}

export interface VerifyPaymentResponse {
  message: string
  status: string
  subscription: SubscriptionStatus
}
