"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { BybitCard } from "@/components/connectivityInfo/bybitCard"
import { BankApiCard } from "@/components/connectivityInfo/bankApiCard"

export function ConnectivityPage() {
  const { toast } = useToast()
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth()

  const isReady = isAuthenticated && !isAuthLoading

  const handleSuccess = (message: string) => {
    toast({ title: "Success", description: message })
  }

  const handleError = (message: string) => {
    toast({ title: "Error", description: message, variant: "destructive" })
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">API Connectivity</h1>
        <p className="text-muted-foreground mt-2">Manage your API connections and webhooks</p>
      </div>

      <BybitCard
        isAuthenticated={isReady}
        onSuccess={handleSuccess}
        onError={handleError}
      />

      <BankApiCard
        isAuthenticated={isReady}
        onSuccess={handleSuccess}
        onError={handleError}
      />

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
