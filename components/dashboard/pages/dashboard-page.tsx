"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { Card } from "@/components/ui/card"
import { ArrowUpRight, TrendingUp, Wallet, Activity, Info, X } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect, useMemo } from "react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"

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
  const [walletSetup, setWalletSetup] = useState<boolean>(false)
  const [bybitConnected, setBybitConnected] = useState<boolean>(false)
  const [isClient, setIsClient] = useState<boolean>(false)
  const [isInitialized, setIsInitialized] = useState<boolean>(false)

  // Derived state - show overlay if either setup is incomplete
  const showOverlay = !walletSetup || !bybitConnected

  // TODO: Replace localStorage with API calls
  // Example: const { data: setupStatus } = useSetupStatus()
  // walletSetup = setupStatus?.walletCreated ?? false
  // bybitConnected = setupStatus?.exchangeConnected ?? false
  useEffect(() => {
    // Ensure we're on the client before accessing localStorage
    if (typeof window === 'undefined') return

    setIsClient(true)

    try {
      // Check user accounts from context if available
      // TODO: Replace with proper API integration
      // const hasWallet = user?.accounts?.some(acc => acc.provider === 'wallet')
      // const hasBybit = user?.accounts?.some(acc => acc.provider === 'bybit')
      
      // For now, fallback to localStorage
      const userWalletSetup = localStorage.getItem("walletSetup") === "true"
      const userBybitConnected = localStorage.getItem("bybitConnected") === "true"

      setWalletSetup(userWalletSetup)
      setBybitConnected(userBybitConnected)
    } catch (error) {
      // Handle localStorage errors (e.g., private browsing mode)
      console.error("Failed to read setup status:", error)
      // Default to false if localStorage is unavailable
      setWalletSetup(false)
      setBybitConnected(false)
    } finally {
      setIsInitialized(true)
    }
  }, [user])

  const handleWalletSetupComplete = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem("walletSetup", "true")
      }
      setWalletSetup(true)
    } catch (error) {
      console.error("Failed to save wallet setup status:", error)
      // Still update state even if localStorage fails
      setWalletSetup(true)
    }
  }

  const handleBybitConnect = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem("bybitConnected", "true")
      }
      setBybitConnected(true)
    } catch (error) {
      console.error("Failed to save Bybit connection status:", error)
      // Still update state even if localStorage fails
      setBybitConnected(true)
    }
  }

  const handleSkipSetup = () => {
    // Allow user to skip setup
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem("walletSetup", "true")
        localStorage.setItem("bybitConnected", "true")
      }
      setWalletSetup(true)
      setBybitConnected(true)
    } catch (error) {
      console.error("Failed to save skip status:", error)
      // Still update state even if localStorage fails
      setWalletSetup(true)
      setBybitConnected(true)
    }
  }

  // Don't render until client-side hydration is complete
  if (!isClient || !isInitialized) {
    return (
      <TooltipProvider>
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Wallet className="w-6 h-6 text-primary" aria-hidden="true" />
                <h3 className="text-xl font-semibold text-foreground">Inventory</h3>
              </div>
            </Card>
          </div>
        </div>
      </TooltipProvider>
    )
  }

 
  const orders = MOCK_ORDERS

  return (
    <TooltipProvider>
      <Dialog.Root
        open={showOverlay}
        onOpenChange={(open) => {
          if (!open) {
            handleSkipSetup()
          }
        }}
      >
    <Dialog.Portal>
      {/* Backdrop */}
      <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md animate-in fade-in" />

      {/* Content Wrapper */}
      <Dialog.Content
        className="fixed inset-0 z-50 flex items-center justify-center p-4 outline-none"
      >
        <div className="w-full max-w-2xl">
          {/* Main Card */}
          <div className="relative rounded-2xl border border-primary/20 shadow-2xl overflow-hidden bg-gradient-to-br from-card via-card/80 to-card/60 p-8 animate-in zoom-in-95">
            {/* Header */}
            <div className="mb-6">
              <Dialog.Title className="text-2xl font-bold text-foreground mb-2">
                Complete Your Setup
              </Dialog.Title>
              <Dialog.Description className="text-muted-foreground">
                Connect your wallet and link your Bybit account to get started with Doolf automation.
              </Dialog.Description>
            </div>

            {/* Steps */}
            <div className="space-y-4 mb-8">
              {/* Wallet Step */}
              <div
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  walletSetup
                    ? "border-primary/50 bg-primary/10"
                    : "border-border bg-secondary/30 hover:border-primary/30 hover:bg-secondary/50"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                      walletSetup
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {walletSetup ? "✓" : "1"}
                  </div>
                  <div>
                    <h4 className={`font-semibold ${walletSetup ? "text-primary" : "text-foreground"}`}>
                      Set Up Your Wallet
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Create and verify your NGN Wallet for seamless transactions.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bybit Step */}
              <div
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  bybitConnected
                    ? "border-primary/50 bg-primary/10"
                    : "border-border bg-secondary/30 hover:border-primary/30 hover:bg-secondary/50"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                      bybitConnected
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {bybitConnected ? "✓" : "2"}
                  </div>
                  <div>
                    <h4 className={`font-semibold ${bybitConnected ? "text-primary" : "text-foreground"}`}>
                      Connect Bybit Account
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Link your Bybit API keys to enable automated trading.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              {!walletSetup && (
                <Link href="/dashboard/wallet" onClick={handleWalletSetupComplete}>
                  <Button className="w-full py-5 font-semibold">
                    Set Up Wallet <ArrowUpRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              )}

              {!bybitConnected && (
                <Link href="/dashboard/connectivity" onClick={handleBybitConnect}>
                  <Button variant="outline" className="w-full py-5 font-semibold">
                    Link Bybit Account <ArrowUpRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              )}
            </div>

            {/* Close */}
            <Dialog.Close asChild>
              <button
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm transition"
                aria-label="Close setup dialog"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>

          {/* Skip */}
          <div className="text-center mt-4">
            <Dialog.Close asChild>
              <button
                className="text-sm text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm px-2 py-1 transition"
                aria-label="Skip setup for now"
              >
                Skip for now →
              </button>
            </Dialog.Close>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>

      <div className="p-8 space-y-8">
        <div className={cn(
        "grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-300 ease-out",
        showOverlay && "blur-sm scale-[0.99] pointer-events-none select-none"
      )}>
          {/* Inventory Card */}
          <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Wallet className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-semibold text-foreground">Inventory</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Total Crypto Balance</p>
                <p className="text-3xl font-bold text-primary">$45,230.50</p>
                <p className="text-xs text-muted-foreground mt-1">≈ ₦72,368,800</p>
              </div>
              <div className="border-t border-border pt-4">
                <p className="text-sm text-muted-foreground mb-2">Total Bank Balance</p>
                <p className="text-3xl font-bold text-foreground">₦35,680,000</p>
                <p className="text-xs text-muted-foreground mt-1">Across all accounts</p>
              </div>
            </div>
          </Card>

          {/* Request Metrics Card */}
          <Card className="bg-card border-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-semibold text-foreground">Request Metrics</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Requests</p>
                <p className="text-2xl font-bold text-foreground">1,245</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Failed Requests</p>
                <p className="text-2xl font-bold text-red-500">18</p>
              </div>
              <div>
                <Tooltip>
                  <div className="flex items-center gap-1">
                    <p className="text-sm text-muted-foreground mb-1">Successful</p>
                    <TooltipTrigger asChild>
                      <Info className="w-3 h-3 text-muted-foreground cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Number of successful API requests</p>
                    </TooltipContent>
                  </div>
                  <p className="text-2xl font-bold text-primary">1,227</p>
                </Tooltip>
              </div>
              <div>
                <Tooltip>
                  <div className="flex items-center gap-1">
                    <p className="text-sm text-muted-foreground mb-1">Success Rate</p>
                    <TooltipTrigger asChild>
                      <Info className="w-3 h-3 text-muted-foreground cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Percentage of successful requests out of total requests</p>
                    </TooltipContent>
                  </div>
                  <p className="text-2xl font-bold text-foreground">98.6%</p>
                </Tooltip>
              </div>
            </div>

            <div>
              <Tooltip>
                <div className="flex justify-between text-sm mb-2">
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Computation Units</span>
                    <TooltipTrigger asChild>
                      <Info className="w-3 h-3 text-muted-foreground cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Monthly computation power usage for API operations</p>
                    </TooltipContent>
                  </div>
                  <span className="text-foreground font-medium">180,000 / 200,000 ops</span>
                </div>
              </Tooltip>
              <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                <div className="h-full w-[90%] bg-primary rounded-full transition-all duration-300" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">20,000 ops remaining (10%)</p>
            </div>
          </Card>
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

          <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Wallet className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Risk Exposure</h3>
            </div>
            <p className="text-3xl font-bold text-primary mb-2">Low</p>
            <p className="text-xs text-muted-foreground">Within acceptable limits</p>
          </Card>
        </div>

        {/* Live Orders Table */}
        <Card className="bg-card border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Live Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Order ID</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Account</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Bank</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Amount</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Timestamp</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">PnL</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Type</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-muted-foreground">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="border-b border-border hover:bg-secondary transition-colors">
                      <td className="py-3 px-4 text-foreground font-medium">{order.id}</td>
                      <td className="py-3 px-4 text-foreground">{order.account}</td>
                      <td className="py-3 px-4 text-foreground">{order.bank}</td>
                      <td className="py-3 px-4 text-foreground font-medium">{order.amount}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === "completed"
                              ? "bg-primary/20 text-primary"
                              : "bg-yellow-500/20 text-yellow-500"
                          }`}
                          aria-label={`Order status: ${order.status}`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{order.timestamp}</td>
                      <td className="py-3 px-4 text-primary font-medium">{order.pnl}</td>
                      <td className="py-3 px-4 text-foreground">{order.type === "auto" ? "Auto" : "Manual"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </TooltipProvider>
  )
}
