import type { PaymentProviderName } from '@/lib/services/payment.service'
import type { MonnifyFields, PaystackFields, NombaFields } from '@/lib/validation/payment-provider'

export type SupportedBankValue = PaymentProviderName

export const SUPPORTED_BANKS = [
  { value: 'MONNIFY' as PaymentProviderName, label: 'Monnify' },
  { value: 'PAYSTACK' as PaymentProviderName, label: 'Paystack' },
  { value: 'NOMBA' as PaymentProviderName, label: 'Nomba' },
] as const

const createEmptyMonnify = (): MonnifyFields => ({
  apiKey: '',
  secretKey: '',
  contractCode: '',
  walletNumber: '',
  accountNumber: '',
  accountName: '',
  bankName: '',
  bankCode: '',
})

const createEmptyPaystack = (): PaystackFields => ({
  publicKey: '',
  secretKey: '',
  accountNumber: '',
  accountName: '',
  bankName: '',
  bankCode: '',
})

const createEmptyNomba = (): NombaFields => ({
  clientId: '',
  privateKey: '',
  accountId: '',
  accountNumber: '',
  accountName: '',
  bankName: '',
  bankCode: '',
})

export const EMPTY_PROVIDER_FIELDS = {
  MONNIFY: createEmptyMonnify(),
  PAYSTACK: createEmptyPaystack(),
  NOMBA: createEmptyNomba(),
} as const

export type ProviderFormState = {
  MONNIFY: MonnifyFields
  PAYSTACK: PaystackFields
  NOMBA: NombaFields
}
