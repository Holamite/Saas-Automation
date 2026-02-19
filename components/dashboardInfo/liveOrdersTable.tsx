"use client"

import { Card } from "@/components/ui/card"

export interface DashboardOrder {
  id: string
  account: string
  bank: string
  amount: string
  status: string
  timestamp: string
  pnl: string
  type: string
}

interface LiveOrdersTableProps {
  orders: DashboardOrder[]
}

export function LiveOrdersTable({ orders }: LiveOrdersTableProps) {
  return (
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
  )
}
