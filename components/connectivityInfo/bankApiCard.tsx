'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { usePaymentProviders, usePrimaryPaymentProvider, useAddPaymentProvider, useUpdatePaymentProvider, useSetPrimaryPaymentProvider } from '@/hooks/use-payment-query'
import type { CreatePaymentDto, PaymentProviderName } from '@/lib/services/payment.service'
import { cn } from '@/lib/utils'
import { extractErrorMessage } from '@/lib/utils/error-handling'
import { validatePaymentProvider } from '@/lib/validation/payment-provider'

const supportedBanks = [
  { value: 'MONNIFY' as PaymentProviderName, label: 'Monnify', endpoint: 'https://api.monnify.com' },
  { value: 'PAYSTACK' as PaymentProviderName, label: 'Paystack' },
  { value: 'NOMBA' as PaymentProviderName, label: 'Nomba' },
] as const

type SupportedBankValue = (typeof supportedBanks)[number]['value']

export interface BankApiCardProps {
  isAuthenticated: boolean
  onSuccess: (message: string) => void
  onError: (message: string) => void
}

export function BankApiCard({ isAuthenticated, onSuccess, onError }: BankApiCardProps) {
  const { data: paymentProviders, isLoading: isLoadingProviders } = usePaymentProviders(isAuthenticated)
  const { data: primaryFromBackend } = usePrimaryPaymentProvider(isAuthenticated)
  const addProviderMutation = useAddPaymentProvider()
  const updateProviderMutation = useUpdatePaymentProvider()
  const setPrimaryProviderMutation = useSetPrimaryPaymentProvider()

  const [selectedBank, setSelectedBank] = useState<SupportedBankValue | ''>('')

  const [monnifyApiKey, setMonnifyApiKey] = useState('')
  const [monnifySecretKey, setMonnifySecretKey] = useState('')
  const [monnifyContractCode, setMonnifyContractCode] = useState('')
  const [monnifyWalletNumber, setMonnifyWalletNumber] = useState('')
  const [monnifyAccountNumber, setMonnifyAccountNumber] = useState('')
  const [paystackPublicKey, setPaystackPublicKey] = useState('')
  const [paystackSecretKey, setPaystackSecretKey] = useState('')
  const [nombaClientId, setNombaClientId] = useState('')
  const [nombaPrivateKey, setNombaPrivateKey] = useState('')
  const [nombaAccountId, setNombaAccountId] = useState('')

  const hasBankProviders = (paymentProviders?.length ?? 0) > 0
  const primaryProvider = primaryFromBackend ?? paymentProviders?.find((p) => p.isPrimary) ?? null
  const selectedPrimary = primaryProvider?.name ?? ''
  const primaryProviderLabel = primaryProvider
    ? supportedBanks.find((b) => b.value === primaryProvider.provider)?.label ?? primaryProvider.provider
    : null

  useEffect(() => {
    if (primaryProvider?.name) {
      // sync side-effects if needed
    }
  }, [primaryProvider?.name])

  const clearProviderFields = () => {
    setMonnifyApiKey('')
    setMonnifySecretKey('')
    setMonnifyContractCode('')
    setMonnifyWalletNumber('')
    setMonnifyAccountNumber('')
    setPaystackPublicKey('')
    setPaystackSecretKey('')
    setNombaClientId('')
    setNombaPrivateKey('')
    setNombaAccountId('')
  }

  const handleConnectBankProvider = () => {
    if (!selectedBank) {
      onError('Please select a provider')
      return
    }

    const validation = validatePaymentProvider(selectedBank, {
      MONNIFY: {
        apiKey: monnifyApiKey,
        secretKey: monnifySecretKey,
        contractCode: monnifyContractCode,
        walletNumber: monnifyWalletNumber,
        accountNumber: monnifyAccountNumber,
      },
      PAYSTACK: { publicKey: paystackPublicKey, secretKey: paystackSecretKey },
      NOMBA: {
        clientId: nombaClientId,
        privateKey: nombaPrivateKey,
        accountId: nombaAccountId,
      },
    }[selectedBank])

    if (!validation.valid) {
      onError(validation.errors.join('. '))
      return
    }

    let payload: CreatePaymentDto

    if (selectedBank === 'MONNIFY') {
      payload = {
        apiKey: monnifyApiKey.trim(),
        secretKey: monnifySecretKey.trim(),
        accountNumber: monnifyAccountNumber.trim(),
        accountName: '',
        bankName: '',
        bankCode: '',
        ...(monnifyWalletNumber.trim() && { walletNumber: monnifyWalletNumber.trim() }),
        ...(monnifyContractCode.trim() && { contractCode: monnifyContractCode.trim() }),
      }
    } else if (selectedBank === 'PAYSTACK') {
      payload = {
        apiKey: paystackPublicKey.trim(),
        secretKey: paystackSecretKey.trim(),
        accountNumber: '',
        accountName: '',
        bankName: 'Paystack',
        bankCode: '',
      }
    } else if (selectedBank === 'NOMBA') {
      payload = {
        apiKey: nombaClientId.trim(),
        secretKey: nombaPrivateKey.trim(),
        accountNumber: nombaAccountId.trim(),
        accountName: '',
        bankName: 'Nomba',
        bankCode: '',
      }
    } else {
      return
    }

    const existing = paymentProviders?.some((p) => p.name === selectedBank) ?? false
    const mutation = existing ? updateProviderMutation : addProviderMutation

    mutation.mutate(
      { name: selectedBank as PaymentProviderName, data: payload },
      {
        onSuccess: (response) => {
          onSuccess(response.message || 'Bank provider connected successfully')
          clearProviderFields()
          if (!primaryProvider) {
            setPrimaryProviderMutation.mutate(selectedBank as PaymentProviderName)
          }
        },
        onError: (error) => {
          const message = extractErrorMessage(error, 'Failed to connect bank provider')
          onError(message)
        },
      }
    )
  }

  const handleSetPrimaryProvider = (name: PaymentProviderName) => {
    setPrimaryProviderMutation.mutate(name, {
      onSuccess: (response) => {
        onSuccess(response.message || 'Primary provider updated')
      },
      onError: (error) => {
        const message = extractErrorMessage(error, 'Failed to set primary provider')
        onError(message)
      },
    })
  }

  return (
    <Card className="bg-card border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Bank API</h2>
          <p className="text-muted-foreground text-sm mt-1">Connect your Nigerian bank for transfers</p>
        </div>
        {isLoadingProviders ? (
          <div className="flex items-center gap-2 bg-muted/20 text-muted-foreground px-3 py-2 rounded-lg">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm font-medium">Checking...</span>
          </div>
        ) : hasBankProviders ? (
          <div className="flex items-center gap-2 bg-primary/20 text-primary px-3 py-2 rounded-lg">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">
              Connected{primaryProviderLabel ? ` • Primary: ${primaryProviderLabel}` : ''}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-yellow-500/20 text-yellow-500 px-3 py-2 rounded-lg">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Not Connected</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Select Your Bank</label>
          <Select value={selectedBank} onValueChange={(value: SupportedBankValue) => setSelectedBank(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a supported bank" />
            </SelectTrigger>
            <SelectContent>
              {supportedBanks.map((bank) => (
                <SelectItem key={bank.value} value={bank.value}>
                  {bank.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedBank && (
          <>
            {selectedBank === 'MONNIFY' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">API key</label>
                  <Input
                    placeholder="Enter your Monnify API key"
                    value={monnifyApiKey}
                    onChange={(e) => setMonnifyApiKey(e.target.value)}
                    type="password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Secret key</label>
                  <Input
                    placeholder="Enter your Monnify secret key"
                    value={monnifySecretKey}
                    onChange={(e) => setMonnifySecretKey(e.target.value)}
                    type="password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Contract code</label>
                  <Input
                    placeholder="Enter contract code"
                    value={monnifyContractCode}
                    onChange={(e) => setMonnifyContractCode(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Wallet number</label>
                  <Input
                    placeholder="Enter wallet number"
                    value={monnifyWalletNumber}
                    onChange={(e) => setMonnifyWalletNumber(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Account number</label>
                  <Input
                    placeholder="Enter account number"
                    value={monnifyAccountNumber}
                    onChange={(e) => setMonnifyAccountNumber(e.target.value)}
                  />
                </div>
              </>
            )}

            {selectedBank === 'PAYSTACK' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Public Key</label>
                  <Input
                    placeholder="Enter your Paystack public key"
                    value={paystackPublicKey}
                    onChange={(e) => setPaystackPublicKey(e.target.value)}
                    type="password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Secret Key</label>
                  <Input
                    placeholder="Enter your Paystack secret key"
                    value={paystackSecretKey}
                    onChange={(e) => setPaystackSecretKey(e.target.value)}
                    type="password"
                  />
                </div>
              </>
            )}

            {selectedBank === 'NOMBA' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Client ID</label>
                  <Input
                    placeholder="Enter your Nomba client ID"
                    value={nombaClientId}
                    onChange={(e) => setNombaClientId(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Private Key</label>
                  <Input
                    placeholder="Enter your Nomba private key"
                    value={nombaPrivateKey}
                    onChange={(e) => setNombaPrivateKey(e.target.value)}
                    type="password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Account ID</label>
                  <Input
                    placeholder="Enter your Nomba account ID"
                    value={nombaAccountId}
                    onChange={(e) => setNombaAccountId(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="flex gap-2">
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleConnectBankProvider}
                disabled={
                  addProviderMutation.isPending ||
                  updateProviderMutation.isPending ||
                  setPrimaryProviderMutation.isPending
                }
              >
                {(addProviderMutation.isPending || updateProviderMutation.isPending) ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Connect'
                )}
              </Button>
            </div>

            {hasBankProviders && (
              <div className="mt-4 space-y-3">
                <p className="text-sm font-medium text-foreground">Primary provider</p>
                <p className="text-sm text-muted-foreground">
                  Choose which connected provider to use as primary. Only one can be active.
                </p>
                <RadioGroup
                  value={selectedPrimary}
                  onValueChange={(value) => {
                    if (!value || value === selectedPrimary) return
                    handleSetPrimaryProvider(value as PaymentProviderName)
                  }}
                  disabled={setPrimaryProviderMutation.isPending}
                  className="flex gap-2 justify-end"
                >
                  {paymentProviders?.map((provider) => {
                    const label =
                      supportedBanks.find((b) => b.value === provider.name)?.label || provider.name
                    const isPrimary = primaryProvider?.name === provider.name
                    return (
                      <label
                        key={provider.name}
                        className={cn(
                          'flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors',
                          'hover:bg-muted/50 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
                          isPrimary ? 'border-primary bg-primary/5' : 'border-border'
                        )}
                        htmlFor={`primary-${provider.name}`}
                      >
                        <RadioGroupItem
                          id={`primary-${provider.name}`}
                          value={provider.name}
                          disabled={setPrimaryProviderMutation.isPending}
                        />
                        <span className="text-sm font-medium">{label}</span>
                        {isPrimary && (
                          <span className="text-xs text-muted-foreground">(Primary)</span>
                        )}
                      </label>
                    )
                  })}
                </RadioGroup>
                {setPrimaryProviderMutation.isPending && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating primary...
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  )
}
