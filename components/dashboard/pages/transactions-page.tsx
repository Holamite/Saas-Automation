"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const bankTransactions = [
  {
    id: "TXN-001",
    type: "Bank Transfer",
    description: "Transfer to GTB Account",
    amount: "₦2,617,250",
    status: "success",
    date: "2025-12-10 14:32",
  },
  {
    id: "TXN-003",
    type: "Internal Transfer",
    description: "Account consolidation",
    amount: "₦500,000",
    status: "pending",
    date: "2025-12-10 10:45",
  },
]

const cryptoTransactions = [
  {
    id: "TXN-002",
    type: "Crypto Transaction",
    description: "BTC Purchase",
    amount: "$2,500.00 USDT",
    status: "success",
    date: "2025-12-10 12:15",
  },
  {
    id: "TXN-004",
    type: "Crypto Transaction",
    description: "ETH Sale",
    amount: "$3,750.25 USDT",
    status: "failed",
    date: "2025-12-09 16:20",
  },
]

export function TransactionsPage() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Transactions</h1>
        <p className="text-muted-foreground mt-2">View all your bank transfers and crypto transactions</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search transactions..." className="pl-10" />
        </div>
        <Button variant="outline" className="flex items-center gap-2 bg-transparent">
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      <Tabs defaultValue="bank" className="w-full">
        <TabsList className="bg-secondary border-b border-border rounded-none">
          <TabsTrigger value="bank">Bank Transfers</TabsTrigger>
          <TabsTrigger value="crypto">Crypto Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="bank" className="mt-6">
          <Card className="bg-card border-border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-6 text-muted-foreground font-medium">Transaction ID</th>
                    <th className="text-left py-4 px-6 text-muted-foreground font-medium">Type</th>
                    <th className="text-left py-4 px-6 text-muted-foreground font-medium">Description</th>
                    <th className="text-left py-4 px-6 text-muted-foreground font-medium">Amount</th>
                    <th className="text-left py-4 px-6 text-muted-foreground font-medium">Status</th>
                    <th className="text-left py-4 px-6 text-muted-foreground font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {bankTransactions.length > 0 ? (
                    bankTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-border hover:bg-secondary transition">
                        <td className="py-4 px-6 text-foreground font-medium">{transaction.id}</td>
                        <td className="py-4 px-6 text-foreground">{transaction.type}</td>
                        <td className="py-4 px-6 text-foreground">{transaction.description}</td>
                        <td className="py-4 px-6 text-foreground font-bold">{transaction.amount}</td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              transaction.status === "success"
                                ? "bg-primary/20 text-primary"
                                : transaction.status === "pending"
                                  ? "bg-yellow-500/20 text-yellow-500"
                                  : "bg-red-500/20 text-red-500"
                            }`}
                          >
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-muted-foreground">{transaction.date}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted-foreground">
                        No bank transfers
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="crypto" className="mt-6">
          <Card className="bg-card border-border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-6 text-muted-foreground font-medium">Transaction ID</th>
                    <th className="text-left py-4 px-6 text-muted-foreground font-medium">Type</th>
                    <th className="text-left py-4 px-6 text-muted-foreground font-medium">Description</th>
                    <th className="text-left py-4 px-6 text-muted-foreground font-medium">Amount (USDT)</th>
                    <th className="text-left py-4 px-6 text-muted-foreground font-medium">Status</th>
                    <th className="text-left py-4 px-6 text-muted-foreground font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {cryptoTransactions.length > 0 ? (
                    cryptoTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-border hover:bg-secondary transition">
                        <td className="py-4 px-6 text-foreground font-medium">{transaction.id}</td>
                        <td className="py-4 px-6 text-foreground">{transaction.type}</td>
                        <td className="py-4 px-6 text-foreground">{transaction.description}</td>
                        <td className="py-4 px-6 text-foreground font-bold">{transaction.amount}</td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              transaction.status === "success"
                                ? "bg-primary/20 text-primary"
                                : transaction.status === "pending"
                                  ? "bg-yellow-500/20 text-yellow-500"
                                  : "bg-red-500/20 text-red-500"
                            }`}
                          >
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-muted-foreground">{transaction.date}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted-foreground">
                        No crypto transactions
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
