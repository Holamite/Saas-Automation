"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { addBybitKey, removeBybitKey, getBybitKeyStatus } from "@/lib/services/bybit.service"
import { ApiClientError } from "@/lib/api/client"

const supportedBanks = [
  { value: "gtb", label: "Guaranty Trust Bank (GTB)", endpoint: "https://api.gtbank.com" },
  { value: "firstbank", label: "First Bank Nigeria", endpoint: "https://api.firstbanknigeria.com" },
  { value: "access", label: "Access Bank", endpoint: "https://api.accessbankplc.com" },
  { value: "zenith", label: "Zenith Bank", endpoint: "https://api.zenithbank.com" },
  { value: "uba", label: "United Bank for Africa (UBA)", endpoint: "https://api.ubagroup.com" },
]

export function ConnectivityPage() {
  const [selectedBank, setSelectedBank] = useState<string>("")
  const { toast } = useToast()
  
  // Bybit state
  const [bybitApiKey, setBybitApiKey] = useState("")
  const [bybitApiSecret, setBybitApiSecret] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isCheckingStatus, setIsCheckingStatus] = useState(true)

  // Fetch connection status from backend on mount
  useEffect(() => {
    const fetchConnectionStatus = async () => {
      try {
        const status = await getBybitKeyStatus()
        setIsConnected(status.hasKey)
      } catch (error) {
        // If error, assume not connected
        setIsConnected(false)
      } finally {
        setIsCheckingStatus(false)
      }
    }

    fetchConnectionStatus()
  }, [])

  const handleAddBybitKey = async () => {
    if (!bybitApiKey.trim() || !bybitApiSecret.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter both API Key and API Secret",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await addBybitKey({
        apiKey: bybitApiKey.trim(),
        apiSecret: bybitApiSecret.trim(),
      })

      toast({
        title: "Success",
        description: response.message || "Bybit API key added successfully",
      })

      // Update connection status
      setIsConnected(true)
      
      // Clear the input fields for security
      setBybitApiKey("")
      setBybitApiSecret("")
    } catch (error) {
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
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveBybitKey = async () => {
    setIsDeleting(true)
    try {
      const response = await removeBybitKey()

      toast({
        title: "Success",
        description: response.message || "Bybit API key removed successfully",
      })

      // Update connection status
      setIsConnected(false)
      
      // Clear the input fields
      setBybitApiKey("")
      setBybitApiSecret("")
    } catch (error) {
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
    } finally {
      setIsDeleting(false)
    }
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
              disabled={isLoading || isDeleting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">API Secret</label>
            <Input 
              placeholder="Enter your Bybit API secret" 
              type="password"
              value={bybitApiSecret}
              onChange={(e) => setBybitApiSecret(e.target.value)}
              disabled={isLoading || isDeleting}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleAddBybitKey}
              disabled={isLoading || isDeleting}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                isConnected ? "Update" : "Enable"
              )}
            </Button>
            {isConnected && (
              <Button 
                variant="ghost"
                onClick={handleRemoveBybitKey}
                disabled={isLoading || isDeleting}
              >
                {isDeleting ? (
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
          <div className="flex items-center gap-2 bg-yellow-500/20 text-yellow-500 px-3 py-2 rounded-lg">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Not Connected</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Select Your Bank</label>
            <Select value={selectedBank} onValueChange={setSelectedBank}>
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
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Bank API Key</label>
                <Input placeholder="Enter your bank API key" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">API Endpoint</label>
                <Input
                  placeholder="API endpoint"
                  value={supportedBanks.find((b) => b.value === selectedBank)?.endpoint || ""}
                  readOnly
                  className="bg-secondary"
                />
              </div>
              <div className="flex gap-2">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Connect</Button>
                <Button variant="outline">Test Connection</Button>
              </div>
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
