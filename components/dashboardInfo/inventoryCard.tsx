"use client"

import { Wallet } from "lucide-react"
import { Card } from "@/components/ui/card"

export function InventoryCard() {

  return (
    <Card className="bg-linear-to-br from-primary/20 to-primary/5 border-primary/20 p-6">
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
          <p className="text-3xl font-bold text-foreground">₦45,466,644.00</p>
          <p className="text-xs text-muted-foreground mt-1">Across all accounts</p>
        </div>
      </div>
    </Card>
  )
}
