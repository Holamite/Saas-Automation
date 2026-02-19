/**
 * Payment provider form validation.
 * Keeps client-side rules in one place and produces clear, user-facing error messages.
 * Backend may enforce additional rules; these are for UX and reducing invalid requests.
 */

import type { PaymentProviderName } from '@/lib/services/payment.service'

export const PAYMENT_PROVIDER_RULES = {
  /** Max length for API keys, secrets, and other single-line credentials */
  maxCredentialLength: 512,
  /** Max length for account/wallet/contract identifiers */
  maxIdLength: 64,
  /** Nigerian bank account numbers are typically 10 digits */
  accountNumberLength: 10,
  /** Account number must be digits only when format is enforced */
  accountNumberDigitsOnly: true,
} as const

export interface PaymentProviderValidationResult {
  valid: boolean
  errors: string[]
}

function required(value: string, fieldName: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return `${fieldName} is required`
  return null
}

function maxLength(value: string, fieldName: string, max: number): string | null {
  const trimmed = value.trim()
  if (trimmed.length > max) return `${fieldName} must be at most ${max} characters`
  return null
}

function digitsOnly(value: string, fieldName: string): string | null {
  const trimmed = value.trim()
  if (!/^\d+$/.test(trimmed)) return `${fieldName} must contain only digits`
  return null
}

function exactLength(value: string, fieldName: string, len: number): string | null {
  const trimmed = value.trim()
  if (trimmed.length !== len) return `${fieldName} must be exactly ${len} digits`
  return null
}

function validateBankAccountFields(fields: BankAccountFields): string[] {
  const errors: string[] = []
  const { maxIdLength, accountNumberLength, accountNumberDigitsOnly } = PAYMENT_PROVIDER_RULES

  const r1 = required(fields.accountNumber, 'Account number')
  if (r1) errors.push(r1)
  else {
    const r2 = maxLength(fields.accountNumber, 'Account number', maxIdLength)
    if (r2) errors.push(r2)
    else if (accountNumberDigitsOnly) {
      const r3 = digitsOnly(fields.accountNumber, 'Account number')
      if (r3) errors.push(r3)
      else {
        const r4 = exactLength(fields.accountNumber, 'Account number', accountNumberLength)
        if (r4) errors.push(r4)
      }
    }
  }

  const an = required(fields.accountName, 'Account name')
  if (an) errors.push(an)
  else {
    const an2 = maxLength(fields.accountName, 'Account name', 128)
    if (an2) errors.push(an2)
  }

  const bn = required(fields.bankName, 'Bank name')
  if (bn) errors.push(bn)

  const bc = required(fields.bankCode, 'Bank code')
  if (bc) errors.push(bc)

  return errors
}

/** Common bank account fields shared by all providers */
export interface BankAccountFields {
  accountNumber: string
  accountName: string
  bankName: string
  bankCode: string
}

/** Monnify form fields */
export interface MonnifyFields extends BankAccountFields {
  apiKey: string
  secretKey: string
  contractCode: string
  walletNumber: string
}

/** Paystack form fields (publicKey = apiKey for backend) */
export interface PaystackFields extends BankAccountFields {
  publicKey: string
  secretKey: string
}

/** Nomba form fields (clientId = apiKey, accountId used for accountNumber in backend) */
export interface NombaFields extends BankAccountFields {
  clientId: string
  privateKey: string
  accountId: string
}

export function validateMonnifyFields(fields: MonnifyFields): PaymentProviderValidationResult {
  const errors: string[] = []
  const { maxCredentialLength, maxIdLength, accountNumberDigitsOnly } = PAYMENT_PROVIDER_RULES

  const r1 = required(fields.apiKey, 'API key')
  if (r1) errors.push(r1)
  else {
    const r2 = maxLength(fields.apiKey, 'API key', maxCredentialLength)
    if (r2) errors.push(r2)
  }

  const s1 = required(fields.secretKey, 'Secret key')
  if (s1) errors.push(s1)
  else {
    const s2 = maxLength(fields.secretKey, 'Secret key', maxCredentialLength)
    if (s2) errors.push(s2)
  }

  errors.push(...validateBankAccountFields(fields))

  if (fields.contractCode.trim()) {
    const c = maxLength(fields.contractCode, 'Contract code', maxIdLength)
    if (c) errors.push(c)
  }
  if (fields.walletNumber.trim()) {
    const w = maxLength(fields.walletNumber, 'Wallet number', maxIdLength)
    if (w) errors.push(w)
    else if (accountNumberDigitsOnly) {
      const wd = digitsOnly(fields.walletNumber, 'Wallet number')
      if (wd) errors.push(wd)
    }
  }

  return { valid: errors.length === 0, errors }
}

export function validatePaystackFields(fields: PaystackFields): PaymentProviderValidationResult {
  const errors: string[] = []
  const { maxCredentialLength } = PAYMENT_PROVIDER_RULES

  const p1 = required(fields.publicKey, 'Public key')
  if (p1) errors.push(p1)
  else {
    const p2 = maxLength(fields.publicKey, 'Public key', maxCredentialLength)
    if (p2) errors.push(p2)
  }

  const s1 = required(fields.secretKey, 'Secret key')
  if (s1) errors.push(s1)
  else {
    const s2 = maxLength(fields.secretKey, 'Secret key', maxCredentialLength)
    if (s2) errors.push(s2)
  }

  errors.push(...validateBankAccountFields(fields))

  return { valid: errors.length === 0, errors }
}

export function validateNombaFields(fields: NombaFields): PaymentProviderValidationResult {
  const errors: string[] = []
  const { maxCredentialLength, maxIdLength } = PAYMENT_PROVIDER_RULES

  const c1 = required(fields.clientId, 'Client ID')
  if (c1) errors.push(c1)
  else {
    const c2 = maxLength(fields.clientId, 'Client ID', maxCredentialLength)
    if (c2) errors.push(c2)
  }

  const p1 = required(fields.privateKey, 'Private key')
  if (p1) errors.push(p1)
  else {
    const p2 = maxLength(fields.privateKey, 'Private key', maxCredentialLength)
    if (p2) errors.push(p2)
  }

  const a1 = required(fields.accountId, 'Account ID')
  if (a1) errors.push(a1)
  else {
    const a2 = maxLength(fields.accountId, 'Account ID', maxIdLength)
    if (a2) errors.push(a2)
  }

  errors.push(...validateBankAccountFields(fields))

  return { valid: errors.length === 0, errors }
}

/**
 * Run validation for the given provider and form fields.
 * Use this before submit to show a single toast with all validation errors.
 */
export function validatePaymentProvider(
  provider: PaymentProviderName,
  fields: MonnifyFields | PaystackFields | NombaFields,
): PaymentProviderValidationResult {
  switch (provider) {
    case 'MONNIFY':
      return validateMonnifyFields(fields as MonnifyFields)
    case 'PAYSTACK':
      return validatePaystackFields(fields as PaystackFields)
    case 'NOMBA':
      return validateNombaFields(fields as NombaFields)
    default:
      return { valid: false, errors: ['Unknown provider'] }
  }
}
