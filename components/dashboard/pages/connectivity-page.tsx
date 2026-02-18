"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { useBybitKeyStatus, useAddBybitKey, useUpdateBybitKey, useRemoveBybitKey } from "@/hooks/use-bybit-query"
import { usePaymentProviders, useAddPaymentProvider, useUpdatePaymentProvider, useSetPrimaryPaymentProvider } from "@/hooks/use-payment-query"
import type { CreatePaymentDto, PaymentProviderName } from "@/lib/services/payment.service"
import { ApiClientError } from "@/lib/api/client"
import { extractErrorMessage } from "@/lib/utils/error-handling"
import { validatePaymentProvider } from "@/lib/validation/payment-provider"

const supportedBanks = [
  { value: "MONNIFY" as PaymentProviderName, label: "Monnify", endpoint: "https://api.monnify.com" },
  { value: "PAYSTACK" as PaymentProviderName, label: "Paystack" },
  { value: "NOMBA" as PaymentProviderName, label: "Nomba" },
] as const

type SupportedBankValue = (typeof supportedBanks)[number]["value"]

export function ConnectivityPage() {
  const [selectedBank, setSelectedBank] = useState<SupportedBankValue | "">("")
  const { toast } = useToast()
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth()

  // React Query hooks for Bybit - only when authenticated
  const { data: bybitStatus, isLoading: isCheckingStatus } = useBybitKeyStatus(isAuthenticated && !isAuthLoading)
  const addKeyMutation = useAddBybitKey()
  const updateKeyMutation = useUpdateBybitKey()
  const removeKeyMutation = useRemoveBybitKey()

  // React Query hooks for payment providers - only when authenticated
  const { data: paymentProviders, isLoading: isLoadingProviders } = usePaymentProviders(isAuthenticated && !isAuthLoading)
  const addProviderMutation = useAddPaymentProvider()
  const updateProviderMutation = useUpdatePaymentProvider()
  const setPrimaryProviderMutation = useSetPrimaryPaymentProvider()

  // Bybit state
  const [bybitApiKey, setBybitApiKey] = useState("")
  const [bybitApiSecret, setBybitApiSecret] = useState("")

  // Bank/provider form state (not persisted; backend is source of truth)
  const [monnifyApiKey, setMonnifyApiKey] = useState("")
  const [monnifySecretKey, setMonnifySecretKey] = useState("")
  const [monnifyContractCode, setMonnifyContractCode] = useState("")
  const [monnifyWalletNumber, setMonnifyWalletNumber] = useState("")
  const [monnifyAccountNumber, setMonnifyAccountNumber] = useState("")
  const [paystackPublicKey, setPaystackPublicKey] = useState("")
  const [paystackSecretKey, setPaystackSecretKey] = useState("")
  const [nombaClientId, setNombaClientId] = useState("")
  const [nombaPrivateKey, setNombaPrivateKey] = useState("")
  const [nombaAccountId, setNombaAccountId] = useState("")

  // Derived state
  const isConnected = bybitStatus?.hasKey ?? false
  const hasBankProviders = (paymentProviders?.length ?? 0) > 0
  const primaryProvider = paymentProviders?.find((p) => p.isPrimary) || null

  const primaryProviderLabel = primaryProvider
    ? supportedBanks.find((b) => b.value === primaryProvider.name)?.label || primaryProvider.name
    : null

  const handleAddBybitKey = () => {
    if (!bybitApiKey.trim() || !bybitApiSecret.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter both API Key and API Secret",
        variant: "destructive",
      })
      return
    }

    addKeyMutation.mutate(
      {
        apiKey: bybitApiKey.trim(),
        apiSecret: bybitApiSecret.trim(),
      },
      {
        onSuccess: (response) => {
          toast({
            title: "Success",
            description: response.message || "Bybit API key added successfully",
          })

          // Clear the input fields for security
          setBybitApiKey("")
          setBybitApiSecret("")
        },
        onError: (error) => {
          if (error instanceof ApiClientError) {
            toast({
              title: error.title || "Error",
              description: error.message || "Failed to add Bybit API key",
              variant: "destructive",
            })
          } else {
            toast({
              title: "Error",
              description: "An unexpected error occurred",
              variant: "destructive",
            })
          }
        },
      }
    )
  }

  const handleUpdateBybitKey = () => {
    if (!bybitApiKey.trim() || !bybitApiSecret.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter both API Key and API Secret",
        variant: "destructive",
      })
      return
    }

    updateKeyMutation.mutate(
      {
        apiKey: bybitApiKey.trim(),
        apiSecret: bybitApiSecret.trim(),
      },
      {
        onSuccess: (response) => {
          toast({
            title: "Success",
            description: response.message || "Bybit API key updated successfully",
          })
          setBybitApiKey("")
          setBybitApiSecret("")
        },
        onError: (error) => {
          if (error instanceof ApiClientError) {
            toast({
              title: error.title || "Error",
              description: error.message || "Failed to update Bybit API key",
              variant: "destructive",
            })
          } else {
            toast({
              title: "Error",
              description: "An unexpected error occurred",
              variant: "destructive",
            })
          }
        },
      }
    )
  }

  const handleRemoveBybitKey = () => {
    removeKeyMutation.mutate(undefined, {
      onSuccess: (response) => {
        toast({
          title: "Success",
          description: response.message || "Bybit API key removed successfully",
        })

        // Clear the input fields
        setBybitApiKey("")
        setBybitApiSecret("")
      },
      onError: (error) => {
        if (error instanceof ApiClientError) {
          toast({
            title: error.title || "Error",
            description: error.message || "Failed to remove Bybit API key",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Error",
            description: "An unexpected error occurred",
            variant: "destructive",
          })
        }
      },
    })
  }

  const handleConnectBankProvider = () => {
    if (!selectedBank) {
      toast({
        title: "Validation Error",
        description: "Please select a provider",
        variant: "destructive",
      })
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
      toast({
        title: "Validation Error",
        description: validation.errors.join(". "),
        variant: "destructive",
      })
      return
    }

    let payload: CreatePaymentDto

    if (selectedBank === "MONNIFY") {
      payload = {
        apiKey: monnifyApiKey.trim(),
        secretKey: monnifySecretKey.trim(),
        accountNumber: monnifyAccountNumber.trim(),
        accountName: "",
        bankName: "",
        bankCode: "",
        ...(monnifyWalletNumber.trim() && { walletNumber: monnifyWalletNumber.trim() }),
        ...(monnifyContractCode.trim() && { contractCode: monnifyContractCode.trim() }),
      }
    } else if (selectedBank === "PAYSTACK") {
      payload = {
        apiKey: paystackPublicKey.trim(),
        secretKey: paystackSecretKey.trim(),
        accountNumber: "",
        accountName: "",
        bankName: "Paystack",
        bankCode: "",
      }
    } else if (selectedBank === "NOMBA") {
      payload = {
        apiKey: nombaClientId.trim(),
        secretKey: nombaPrivateKey.trim(),
        accountNumber: nombaAccountId.trim(),
        accountName: "",
        bankName: "Nomba",
        bankCode: "",
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
          toast({
            title: "Success",
            description: response.message || "Bank provider connected successfully",
          })

          // Clear sensitive fields after submit
          setMonnifyApiKey("")
          setMonnifySecretKey("")
          setMonnifyContractCode("")
          setMonnifyWalletNumber("")
          setMonnifyAccountNumber("")
          setPaystackPublicKey("")
          setPaystackSecretKey("")
          setNombaClientId("")
          setNombaPrivateKey("")
          setNombaAccountId("")

          // If no primary is set yet, set this as primary
          if (!primaryProvider) {
            setPrimaryProviderMutation.mutate(selectedBank as PaymentProviderName)
          }
        },
        onError: (error) => {
          const message = extractErrorMessage(error, "Failed to connect bank provider")
          toast({
            title: "Error",
            description: message,
            variant: "destructive",
          })
        },
      }
    )
  }

  const handleSetPrimaryProvider = (name: PaymentProviderName) => {
    setPrimaryProviderMutation.mutate(name, {
      onSuccess: (response) => {
        toast({
          title: "Success",
          description: response.message || "Primary provider updated",
        })
      },
      onError: (error) => {
        if (error instanceof ApiClientError) {
          toast({
            title: error.title || "Error",
            description: error.message || "Failed to set primary provider",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Error",
            description: "An unexpected error occurred",
            variant: "destructive",
          })
        }
      },
    })
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">API Connectivity</h1>
        <p className="text-muted-foreground mt-2">Manage your API connections and webhooks</p>
      </div>

      {/* Bybit API */}
      <Card className="bg-card border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Bybit API</h2>
            <p className="text-muted-foreground text-sm mt-1">Automate your cryptocurrency trading</p>
          </div>
          {isCheckingStatus ? (
            <div className="flex items-center gap-2 bg-muted/20 text-muted-foreground px-3 py-2 rounded-lg">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">Checking...</span>
            </div>
          ) : isConnected ? (
            <div className="flex items-center gap-2 bg-primary/20 text-primary px-3 py-2 rounded-lg">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Connected</span>
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
            <label className="block text-sm font-medium text-foreground mb-2">API Key</label>
            <Input
              placeholder="Enter your Bybit API key"
              type="password"
              value={bybitApiKey}
              onChange={(e) => setBybitApiKey(e.target.value)}
              disabled={addKeyMutation.isPending || updateKeyMutation.isPending || removeKeyMutation.isPending}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">API Secret</label>
            <Input
              placeholder="Enter your Bybit API secret"
              type="password"
              value={bybitApiSecret}
              onChange={(e) => setBybitApiSecret(e.target.value)}
              disabled={addKeyMutation.isPending || updateKeyMutation.isPending || removeKeyMutation.isPending}
            />
          </div>
          <div className="flex gap-2">
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={isConnected ? handleUpdateBybitKey : handleAddBybitKey}
              disabled={addKeyMutation.isPending || updateKeyMutation.isPending || removeKeyMutation.isPending}
            >
              {(addKeyMutation.isPending || updateKeyMutation.isPending) ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isConnected ? "Updating..." : "Connecting..."}
                </>
              ) : (
                isConnected ? "Update" : "Enable"
              )}
            </Button>
            {isConnected && (
              <Button
                variant="ghost"
                onClick={handleRemoveBybitKey}
                disabled={addKeyMutation.isPending || updateKeyMutation.isPending || removeKeyMutation.isPending}
              >
                {removeKeyMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Removing...
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Bank API */}
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
                Connected{primaryProviderLabel ? ` • Primary: ${primaryProviderLabel}` : ""}
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
              {selectedBank === "MONNIFY" && (
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

              {selectedBank === "PAYSTACK" && (
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

              {selectedBank === "NOMBA" && (
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
                    "Connect"
                  )}
                </Button>
                <Button variant="outline">Test Connection</Button>
              </div>

              {hasBankProviders && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-muted-foreground">Connected providers</p>
                  <div className="flex flex-wrap gap-2">
                    {paymentProviders?.map((provider) => {
                      const label =
                        supportedBanks.find((b) => b.value === provider.name)?.label || provider.name
                      const isPrimary = provider.isPrimary
                      return (
                        <Button
                          key={provider.name}
                          variant={isPrimary ? "default" : "outline"}
                          size="sm"
                          className="px-3"
                          onClick={() => !isPrimary && handleSetPrimaryProvider(provider.name as PaymentProviderName)}
                          disabled={setPrimaryProviderMutation.isPending}
                        >
                          {label}
                          {isPrimary && <span className="ml-1 text-xs text-muted-foreground">(Primary)</span>}
                        </Button>
                      )
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      {/* Webhook Configuration */}
      <Card className="bg-card border-border p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Webhook URLs</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Order Webhook URL</label>
            <Input placeholder="https://your-domain.com/webhooks/orders" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Transaction Webhook URL</label>
            <Input placeholder="https://your-domain.com/webhooks/transactions" />
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Save Webhooks</Button>
        </div>
      </Card>

      {/* API Logs */}
      <Card className="bg-card border-border p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Recent API Events</h2>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          <div className="text-sm bg-secondary p-3 rounded border border-border">
            <p className="text-foreground font-medium">✓ Bybit API connection successful</p>
            <p className="text-muted-foreground text-xs mt-1">2025-12-10 14:32:15</p>
          </div>
          <div className="text-sm bg-secondary p-3 rounded border border-border">
            <p className="text-foreground font-medium">✓ Order webhook received</p>
            <p className="text-muted-foreground text-xs mt-1">2025-12-10 12:15:42</p>
          </div>
          <div className="text-sm bg-secondary p-3 rounded border border-border">
            <p className="text-foreground font-medium">⚠ Bank API connection timeout</p>
            <p className="text-muted-foreground text-xs mt-1">2025-12-10 09:45:01</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
