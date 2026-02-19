'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useCallback, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  usePaymentProviders,
  usePaymentProviderStatus,
  useAddPaymentProvider,
  useUpdatePaymentProvider,
  useSetPrimaryPaymentProvider,
} from '@/hooks/use-payment-query'
import type { CreatePaymentDto, PaymentProviderName } from '@/lib/services/payment.service'
import { getProviderId } from '@/lib/services/payment.service'
import { ApiClientError } from '@/lib/api/client'
import { extractErrorMessage } from '@/lib/utils/error-handling'
import { validatePaymentProvider } from '@/lib/validation/payment-provider'
import type { MonnifyFields, NombaFields, PaystackFields } from '@/lib/validation/payment-provider'
import {
  EMPTY_PROVIDER_FIELDS,
  SUPPORTED_BANKS,
  type ProviderFormState,
  type SupportedBankValue,
} from '../../lib/types/bankApiCard.types'
import { MonnifyForm, NombaForm, PaystackForm } from './provider-forms'
import PaymentProvider from './paymentProvider'

export interface BankApiCardProps {
  isAuthenticated: boolean
  onSuccess: (message: string) => void
  onError: (message: string) => void
}

function buildPayload(
  provider: SupportedBankValue,
  fields: MonnifyFields | PaystackFields | NombaFields
): CreatePaymentDto {
  const base = {
    accountNumber: fields.accountNumber.trim(),
    accountName: fields.accountName.trim(),
    bankName: fields.bankName.trim(),
    bankCode: fields.bankCode.trim(),
  }

  if (provider === 'MONNIFY') {
    const f = fields as MonnifyFields
    return {
      ...base,
      apiKey: f.apiKey.trim(),
      secretKey: f.secretKey.trim(),
      ...(f.walletNumber.trim() && { walletNumber: f.walletNumber.trim() }),
      ...(f.contractCode.trim() && { contractCode: f.contractCode.trim() }),
    }
  }
  if (provider === 'PAYSTACK') {
    const f = fields as PaystackFields
    return {
      ...base,
      apiKey: f.publicKey.trim(),
      secretKey: f.secretKey.trim(),
    }
  }
  const f = fields as NombaFields
  return {
    ...base,
    apiKey: f.clientId.trim(),
    secretKey: f.privateKey.trim(),
    accountNumber: f.accountNumber.trim() || f.accountId.trim(),
  }
}

export function BankApiCard({ isAuthenticated, onSuccess, onError }: BankApiCardProps) {
  const { data: paymentProviders, isLoading: isLoadingProviders } = usePaymentProviders(
    isAuthenticated
  )
  const [selectedBank, setSelectedBank] = useState<SupportedBankValue | ''>('')
  const { data: providerStatus, isLoading: isCheckingStatus } = usePaymentProviderStatus(
    selectedBank,
    isAuthenticated && !!selectedBank
  )
  const addProviderMutation = useAddPaymentProvider()
  const updateProviderMutation = useUpdatePaymentProvider()
  const setPrimaryProviderMutation = useSetPrimaryPaymentProvider()

  const [formState, setFormState] = useState<ProviderFormState>(() => ({
    MONNIFY: { ...EMPTY_PROVIDER_FIELDS.MONNIFY },
    PAYSTACK: { ...EMPTY_PROVIDER_FIELDS.PAYSTACK },
    NOMBA: { ...EMPTY_PROVIDER_FIELDS.NOMBA },
  }))

  const isConnected = providerStatus?.hasProvider ?? false
  const isCheckingProviderStatus = !!selectedBank && isCheckingStatus
  const hasBankProviders = (paymentProviders?.length ?? 0) > 0
  const primaryProvider = paymentProviders?.find((p) => p.isPrimary) ?? null
  const primaryProviderId: PaymentProviderName | null = primaryProvider
    ? (getProviderId(primaryProvider) ?? null)
    : null
  const primaryProviderLabel = primaryProviderId
    ? SUPPORTED_BANKS.find((b) => b.value === primaryProviderId)?.label ?? primaryProviderId
    : null

  const clearForm = useCallback(() => {
    setFormState({
      MONNIFY: { ...EMPTY_PROVIDER_FIELDS.MONNIFY },
      PAYSTACK: { ...EMPTY_PROVIDER_FIELDS.PAYSTACK },
      NOMBA: { ...EMPTY_PROVIDER_FIELDS.NOMBA },
    })
  }, [])

  const updateForm = useCallback(
    <P extends SupportedBankValue>(
      provider: P,
      fields: ProviderFormState[P] | Partial<ProviderFormState[P]>
    ) => {
      setFormState((prev) => ({
        ...prev,
        [provider]: { ...prev[provider], ...fields },
      }))
    },
    []
  )

  const handleAddProvider = () => {
    if (!selectedBank) {
      onError('Please select a provider')
      return
    }
    const fields = formState[selectedBank]
    const validation = validatePaymentProvider(selectedBank, fields)
    if (!validation.valid) {
      onError(validation.errors.join('. '))
      return
    }
    const payload = buildPayload(selectedBank, fields)
    addProviderMutation.mutate(
      { name: selectedBank as PaymentProviderName, data: payload },
      {
        onSuccess: (response) => {
          onSuccess(response.message ?? 'Bank provider connected successfully')
          clearForm()
          if (!primaryProvider) {
            setPrimaryProviderMutation.mutate(selectedBank as PaymentProviderName)
          }
        },
        onError: (error) => {
          if (error instanceof ApiClientError) {
            onError(error.message ?? 'Failed to connect bank provider')
          } else {
            onError(extractErrorMessage(error, 'Failed to connect bank provider'))
          }
        },
      }
    )
  }

  const handleUpdateProvider = () => {
    if (!selectedBank) {
      onError('Please select a provider')
      return
    }
    const fields = formState[selectedBank]
    const validation = validatePaymentProvider(selectedBank, fields)
    if (!validation.valid) {
      onError(validation.errors.join('. '))
      return
    }
    const payload = buildPayload(selectedBank, fields)
    updateProviderMutation.mutate(
      { name: selectedBank as PaymentProviderName, data: payload },
      {
        onSuccess: (response) => {
          onSuccess(response.message ?? 'Provider updated successfully')
          clearForm()
        },
        onError: (error) => {
          if (error instanceof ApiClientError) {
            onError(error.message ?? 'Failed to update provider')
          } else {
            onError(extractErrorMessage(error, 'Failed to update provider'))
          }
        },
      }
    )
  }

  const handleSetPrimaryProvider = (name: PaymentProviderName) => {
    setPrimaryProviderMutation.mutate(name, {
      onSuccess: (response) => {
        onSuccess(response.message ?? 'Primary provider updated')
      },
      onError: (error) => {
        const message = extractErrorMessage(error, 'Failed to set primary provider')
        onError(message)
      },
    })
  }

  const isPending =
    addProviderMutation.isPending ||
    updateProviderMutation.isPending ||
    setPrimaryProviderMutation.isPending

  return (
    <>

      <Card className="bg-card border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Bank API</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Connect your Nigerian bank for transfers
            </p>
          </div>
          {isLoadingProviders || isCheckingProviderStatus ? (
            <div className="flex items-center gap-2 bg-muted/20 text-muted-foreground px-3 py-2 rounded-lg">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">Checking...</span>
            </div>
          ) : hasBankProviders ? (
            <div className="flex items-center gap-2 bg-primary/20 text-primary px-3 py-2 rounded-lg">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">
                Connected
                {primaryProviderLabel ? ` • Primary: ${primaryProviderLabel}` : ''}
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
            <label className="block text-sm font-medium text-foreground mb-2">
              Select Payment Provider
            </label>
            <Select
              value={selectedBank || undefined}
              onValueChange={(value: SupportedBankValue) => setSelectedBank(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a supported provider" />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_BANKS.map((bank) => (
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
                <MonnifyForm
                  fields={formState.MONNIFY}
                  onChange={(fields) => updateForm('MONNIFY', fields)}
                />
              )}
              {selectedBank === 'PAYSTACK' && (
                <PaystackForm
                  fields={formState.PAYSTACK}
                  onChange={(fields) => updateForm('PAYSTACK', fields)}
                />
              )}
              {selectedBank === 'NOMBA' && (
                <NombaForm
                  fields={formState.NOMBA}
                  onChange={(fields) => updateForm('NOMBA', fields)}
                />
              )}

              <div className="flex gap-2">
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={isConnected ? handleUpdateProvider : handleAddProvider}
                  disabled={isPending || isCheckingProviderStatus}
                >
                  {addProviderMutation.isPending || updateProviderMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {isConnected ? 'Updating...' : 'Connecting...'}
                    </>
                  ) : (
                    isConnected ? 'Update' : 'Connect'
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>

      <PaymentProvider
        providers={paymentProviders ?? []}
        primaryProviderId={primaryProviderId}
        onSetPrimary={handleSetPrimaryProvider}
        onSelectForUpdate={(name) => setSelectedBank(name)}
        isSettingPrimary={setPrimaryProviderMutation.isPending}
      />
    </>
  )
}
