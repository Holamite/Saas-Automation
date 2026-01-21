"use client"

import { Card } from "@/components/ui/card"
import { ArrowUpRight, TrendingUp, Wallet, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import {
  InventoryCard,
  LiveOrdersTable,
  RequestMetricsCard,
  SetupOverlay,
} from "@/components/dashboard/dashboardInfo"
import { useWalletInfo } from "@/hooks/use-wallet-query"
import { useBybitKeyStatus } from "@/hooks/use-bybit-query"
import { Loading } from "@/components/ui/loading"

// TODO: Replace with API call to fetch orders
// Example: const { data: orders, isLoading, error } = useOrders()
const MOCK_ORDERS = [
  {
    id: "00028766381",
    account: "Trading Account 1",
    bank: "Bybit",
    amount: "₦2,450,000",
    status: "completed",
    timestamp: "2025-12-10 14:32",
    pnl: "+₦234,500",
    type: "auto",
  },
  {
    id: "00028766382",
    account: "Trading Account 2",
    bank: "Guaranty Trust Bank",
    amount: "₦1,500,000",
    status: "pending",
    timestamp: "2025-12-10 12:15",
    pnl: "+₦125,000",
    type: "manual",
  },
  {
    id: "00028766383",
    account: "Trading Account 1",
    bank: "Bybit",
    amount: "₦3,750,000",
    status: "completed",
    timestamp: "2025-12-09 09:45",
    pnl: "+₦187,500",
    type: "auto",
  },
]

export function DashboardPage() {
  const { user } = useAuth()
  
  // React Query hooks for setup status
  const { data: walletInfo, isLoading: isLoadingWallet } = useWalletInfo()
  const { data: bybitStatus, isLoading: isLoadingBybit } = useBybitKeyStatus()
  
  const [isClient, setIsClient] = useState<boolean>(false)

  // Derived state from backend
  const walletSetup = !!walletInfo
  const bybitConnected = bybitStatus?.hasKey ?? false
  const isInitialized = !isLoadingWallet && !isLoadingBybit
  
  // Derived state - show overlay if either setup is incomplete
  const [showOverlay, setShowOverlay] = useState<boolean>(!walletSetup || !bybitConnected)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsClient(true)
    }
  }, [])

  const handleWalletSetupComplete = () => {
    // No action needed - React Query will automatically refetch wallet info
    // when user returns from wallet page
  }

  const handleBybitConnect = () => {
    // No action needed - React Query will automatically refetch Bybit status
    // when user returns from connectivity page
  }

  const handleSkipSetup = () => {
    // User chooses to skip setup for now
    // No localStorage needed - backend is source of truth
    setShowOverlay(false)
  }

  // Don't render until client-side hydration is complete
  if (!isClient || !isInitialized) {
    return (
        <div className="p-8 space-y-8">
          <div className="flex justify-center items-center h-full">
            <Loading message="Loading dashboard..." />
          </div>
        </div>
    )
  }

 
  const orders = MOCK_ORDERS

  return (
    <TooltipProvider>
      <SetupOverlay
        open={showOverlay}
        onOpenChange={() => {}}
        walletSetup={walletSetup}
        bybitConnected={bybitConnected}
        onWalletSetupComplete={handleWalletSetupComplete}
        onBybitConnect={handleBybitConnect}
        onSkip={handleSkipSetup}
      />

      <div className="p-8 space-y-8">
        <div className={cn(
        "grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-300 ease-out",
        showOverlay && "blur-sm scale-[0.99] pointer-events-none select-none"
      )}>
          <InventoryCard />
          <RequestMetricsCard />
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <Card className="bg-card border-border p-4">
            <Tooltip>
              <div className="flex items-center gap-1 mb-2">
                <p className="text-muted-foreground text-sm">Transferred (NGN)</p>
                <TooltipTrigger asChild>
                  <Info className="w-3 h-3 text-muted-foreground cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Total amount transferred in NGN</p>
                </TooltipContent>
              </div>
              <p className="text-2xl font-bold text-foreground">₦6,025,000</p>
            </Tooltip>
          </Card>

          <Card className="bg-card border-border p-4">
            <Tooltip>
              <div className="flex items-center gap-1 mb-2">
                <p className="text-muted-foreground text-sm">Transferred (USDT)</p>
                <TooltipTrigger asChild>
                  <Info className="w-3 h-3 text-muted-foreground cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Total amount transferred in USDT</p>
                </TooltipContent>
              </div>
              <p className="text-2xl font-bold text-foreground">$3,765.80</p>
            </Tooltip>
          </Card>

          <Card className="bg-card border-border p-4">
            <p className="text-muted-foreground text-sm mb-2">Active Orders</p>
            <p className="text-2xl font-bold text-foreground">12</p>
          </Card>

          <Card className="bg-card border-border p-4">
            <p className="text-muted-foreground text-sm mb-2">Total Transfers</p>
            <p className="text-2xl font-bold text-foreground">342</p>
          </Card>

          <Card className="bg-card border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <p className="text-muted-foreground text-sm">Total PnL</p>
            </div>
            <p className="text-2xl font-bold text-primary">+₦842,500</p>
          </Card>

          <Card className="bg-card border-border p-4">
            <Tooltip>
              <div className="flex items-center gap-1 mb-2">
                <p className="text-muted-foreground text-sm">Completion Rate</p>
                <TooltipTrigger asChild>
                  <Info className="w-3 h-3 text-muted-foreground cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Percentage of orders completed successfully</p>
                </TooltipContent>
              </div>
              <p className="text-2xl font-bold text-foreground">98.5%</p>
            </Tooltip>
          </Card>
        </div>

        {/* User Information Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card border-border p-6 lg:col-span-2">
            <div className="flex items-center gap-1 mb-2">
              <ArrowUpRight className="w-4 h-4 text-primary" />
              <p className="text-foreground text-lg font-semibold">Selected Account Details</p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bank Name</span>
                <span className="text-foreground font-medium">Guaranty Trust Bank (GTB)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Number</span>
                <span className="text-foreground font-medium">0123456789</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Holder</span>
                <span className="text-foreground font-medium">Chioma Trading Ltd</span>
              </div>
            </div>
          </Card>

          <Card className="bg-card border-border p-6">
            <p className="text-muted-foreground text-sm mb-2">Total Accounts</p>
            <p className="text-3xl font-bold text-foreground">3</p>
            <p className="text-xs text-muted-foreground mt-2">All connected</p>
          </Card>

          <Card className="bg-linear-to-br from-primary/20 to-primary/5 border-primary/20 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Wallet className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Risk Exposure</h3>
            </div>
            <p className="text-3xl font-bold text-primary mb-2">Low</p>
            <p className="text-xs text-muted-foreground">Within acceptable limits</p>
          </Card>
        </div>

        <LiveOrdersTable orders={orders} />
      </div>
    </TooltipProvider>
  )
}
