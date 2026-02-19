'use client'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { NIGERIAN_BANKS } from '@/lib/constants/nigerian-banks'
import type { MonnifyFields, NombaFields, PaystackFields } from '@/lib/validation/payment-provider'

interface FormInputProps {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: 'text' | 'password'
}

function FormInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: FormInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">{label}</label>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
      />
    </div>
  )
}

interface BankAccountFieldsProps {
  accountNumber: string
  accountName: string
  bankCode: string
  onAccountNumberChange: (v: string) => void
  onAccountNameChange: (v: string) => void
  onBankChange: (code: string, name: string) => void
}

function BankAccountFields({
  accountNumber,
  accountName,
  bankCode,
  onAccountNumberChange,
  onAccountNameChange,
  onBankChange,
}: BankAccountFieldsProps) {
  return (
    <>
      <FormInput
        label="Account number"
        value={accountNumber}
        onChange={onAccountNumberChange}
        placeholder="Enter your 10-digit account number"
      />
      <FormInput
        label="Account name"
        value={accountName}
        onChange={onAccountNameChange}
        placeholder="Enter account holder name"
      />
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Bank name</label>
        <Select
          value={bankCode || undefined}
          onValueChange={(code) => {
            const bank = NIGERIAN_BANKS.find((b) => b.code === code)
            if (bank) onBankChange(bank.code, bank.name)
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your bank" />
          </SelectTrigger>
          <SelectContent>
            {NIGERIAN_BANKS.map((bank) => (
              <SelectItem key={bank.code} value={bank.code}>
                {bank.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  )
}

export interface MonnifyFormProps {
  fields: MonnifyFields
  onChange: (fields: MonnifyFields) => void
}

export function MonnifyForm({ fields, onChange }: MonnifyFormProps) {
  const update = (key: keyof MonnifyFields, value: string) =>
    onChange({ ...fields, [key]: value })
  const updateBank = (code: string, name: string) =>
    onChange({ ...fields, bankCode: code, bankName: name })

  return (
    <>
      <FormInput
        label="API key"
        value={fields.apiKey}
        onChange={(v) => update('apiKey', v)}
        placeholder="Enter your Monnify API key"
        type="password"
      />
      <FormInput
        label="Secret key"
        value={fields.secretKey}
        onChange={(v) => update('secretKey', v)}
        placeholder="Enter your Monnify secret key"
        type="password"
      />
      <FormInput
        label="Contract code"
        value={fields.contractCode}
        onChange={(v) => update('contractCode', v)}
        placeholder="Enter contract code"
      />
      <FormInput
        label="Wallet number"
        value={fields.walletNumber}
        onChange={(v) => update('walletNumber', v)}
        placeholder="Enter wallet number"
      />
      <BankAccountFields
        accountNumber={fields.accountNumber}
        accountName={fields.accountName}
        bankCode={fields.bankCode}
        onAccountNumberChange={(v) => update('accountNumber', v)}
        onAccountNameChange={(v) => update('accountName', v)}
        onBankChange={updateBank}
      />
    </>
  )
}

export interface PaystackFormProps {
  fields: PaystackFields
  onChange: (fields: PaystackFields) => void
}

export function PaystackForm({ fields, onChange }: PaystackFormProps) {
  const update = (key: keyof PaystackFields, value: string) =>
    onChange({ ...fields, [key]: value })
  const updateBank = (code: string, name: string) =>
    onChange({ ...fields, bankCode: code, bankName: name })

  return (
    <>
      <FormInput
        label="Public key"
        value={fields.publicKey}
        onChange={(v) => update('publicKey', v)}
        placeholder="Enter your Paystack public key"
        type="password"
      />
      <FormInput
        label="Secret key"
        value={fields.secretKey}
        onChange={(v) => update('secretKey', v)}
        placeholder="Enter your Paystack secret key"
        type="password"
      />
      <BankAccountFields
        accountNumber={fields.accountNumber}
        accountName={fields.accountName}
        bankCode={fields.bankCode}
        onAccountNumberChange={(v) => update('accountNumber', v)}
        onAccountNameChange={(v) => update('accountName', v)}
        onBankChange={updateBank}
      />
    </>
  )
}

export interface NombaFormProps {
  fields: NombaFields
  onChange: (fields: NombaFields) => void
}

export function NombaForm({ fields, onChange }: NombaFormProps) {
  const update = (key: keyof NombaFields, value: string) =>
    onChange({ ...fields, [key]: value })
  const updateBank = (code: string, name: string) =>
    onChange({ ...fields, bankCode: code, bankName: name })

  return (
    <>
      <FormInput
        label="Client ID"
        value={fields.clientId}
        onChange={(v) => update('clientId', v)}
        placeholder="Enter your Nomba client ID"
      />
      <FormInput
        label="Private key"
        value={fields.privateKey}
        onChange={(v) => update('privateKey', v)}
        placeholder="Enter your Nomba private key"
        type="password"
      />
      <FormInput
        label="Account ID"
        value={fields.accountId}
        onChange={(v) => update('accountId', v)}
        placeholder="Enter your Nomba account ID"
      />
      <BankAccountFields
        accountNumber={fields.accountNumber}
        accountName={fields.accountName}
        bankCode={fields.bankCode}
        onAccountNumberChange={(v) => update('accountNumber', v)}
        onAccountNameChange={(v) => update('accountName', v)}
        onBankChange={updateBank}
      />
    </>
  )
}
