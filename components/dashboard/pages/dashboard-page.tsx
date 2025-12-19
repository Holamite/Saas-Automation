"use client"

import { Card } from "@/components/ui/card"
import { ArrowUpRight, TrendingUp, Wallet, Activity, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const orders = [
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
  return (
    <TooltipProvider>
      <div className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    {/* </TooltipTrigger> */}
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
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-border hover:bg-secondary transition">
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
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{order.timestamp}</td>
                    <td className="py-3 px-4 text-primary font-medium">{order.pnl}</td>
                    <td className="py-3 px-4 text-foreground">{order.type === "auto" ? "Auto" : "Manual"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </TooltipProvider>
  )
}
