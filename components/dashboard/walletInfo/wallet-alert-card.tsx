"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface WalletAlertCardProps {
  amount: string
}

export function WalletAlertCard({ amount }: WalletAlertCardProps) {
  return (
    <Card className="bg-primary/5 border border-primary/20 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full -mr-10 -mt-10 blur-xl group-hover:bg-primary/20 transition-all" />
      <CardContent className="p-5 flex gap-4">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
          <Bell className="w-5 h-5 text-primary" />
        </div>
        <div className="space-y-1.5">
          <p className="text-[10px] font-black text-primary uppercase tracking-widest">Active Alert</p>
          <p className="text-xs leading-relaxed font-bold">
            Withdrawal of <span className="text-primary font-black">{amount}</span> is currently pending processing.
          </p>
          <Button
            variant="link"
            className="p-0 h-auto text-[10px] font-black uppercase text-primary/80 hover:text-primary"
          >
            Track Status
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
