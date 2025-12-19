"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const allOrders = [
  {
    id: "ORD-001",
    orderNumber: "#BUY-2025-001",
    account: "Trading Account 1",
    bank: "Guaranty Trust Bank (GTB)",
    amount: "₦2,617,250",
    branch: "Lagos, Nigeria",
    date: "2025-12-10 14:32",
    type: "buy",
    status: "success",
  },
  {
    id: "ORD-002",
    orderNumber: "#SELL-2025-002",
    account: "Trading Account 2",
    bank: "First Bank Nigeria",
    amount: "₦1,550,000",
    branch: "Abuja, Nigeria",
    date: "2025-12-10 12:15",
    type: "sell",
    status: "success",
  },
  {
    id: "ORD-003",
    orderNumber: "#PAYOUT-2025-003",
    account: "Trading Account 1",
    bank: "Guaranty Trust Bank (GTB)",
    amount: "₦3,925,125",
    branch: "Lagos, Nigeria",
    date: "2025-12-09 09:45",
    type: "payout",
    status: "pending",
  },
]

function OrderCard({ order }: { order: (typeof allOrders)[0] }) {
  return (
    <Card className="bg-card border-border p-3">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-sm truncate">{order.orderNumber}</h3>
          <p className="text-muted-foreground text-[10px] mt-0.5 truncate">{order.account}</p>
        </div>
        <span
          className={`px-1.5 py-0.5 rounded text-[10px] font-medium ml-2 whitespace-nowrap ${
            order.status === "success" ? "bg-primary/20 text-primary" : "bg-yellow-500/20 text-yellow-500"
          }`}
        >
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>

      <div className="space-y-1.5 ">
        <div>
          <p className="text-muted-foreground text-[10px]">Bank</p>
          <p className="text-foreground font-medium text-xs truncate">{order.bank}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-[10px]">Amount</p>
          <p className="text-foreground font-semibold text-sm">{order.amount}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-[10px]">Branch</p>
          <p className="text-foreground text-xs truncate">{order.branch}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-[10px]">Date</p>
          <p className="text-foreground text-xs">{order.date}</p>
        </div>
      </div>
      
      <div className="flex gap-0.5">
         <Button variant="destructive" className="w-1/2">
          Pay
        </Button>
        <Button variant="secondary" className="w-1/2">
          Cancel
        </Button>
       </div>
    </Card>
  )
}

export function OrdersPage() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground mt-2">Manage all your buy/sell orders and payouts</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-secondary border-b border-border rounded-none">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          <TabsTrigger value="failed">Failed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3">
            {allOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3">
            {allOrders
              .filter((o) => o.status === "success")
              .map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="ongoing" className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3">
            {allOrders
              .filter((o) => o.status === "pending")
              .map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="cancelled" className="mt-6">
          <p className="text-muted-foreground">No cancelled orders</p>
        </TabsContent>

        <TabsContent value="failed" className="mt-6">
          <p className="text-muted-foreground">No failed orders</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
