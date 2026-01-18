"use client"

import { Lock, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

interface WalletSecurityCardProps {
  onSetTransferPin: () => void
}

export function WalletSecurityCard({ onSetTransferPin }: WalletSecurityCardProps) {
  return (
    <Card className="bg-[#1a1a1a] border-border overflow-hidden shadow-lg pt-0">
      <CardHeader className="bg-muted/20 pt-4 border-b border-border/50">
        <CardTitle className="text-xs font-black uppercase tracking-widest flex gap-2">
          <Shield className="w-4 h-4 text-primary" />
          Wallet Security
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-6">
        <div className="flex items-center justify-between group">
          <div className="space-y-1">
            <p className="text-xs font-black uppercase tracking-wider">Transfer pin</p>
            <p className="text-[10px] text-muted-foreground">Set a pin to secure your transfers</p>
          </div>
          <Switch defaultChecked className="data-[state=checked]:bg-primary cursor-pointer" />
        </div>
        <Button
          variant="tertiary"
          className="w-full text-[10px] font-black uppercase tracking-widest h-10 border-border hover:bg-muted/50 bg-background/50 gap-2"
          onClick={onSetTransferPin}
        >
          <Lock className="w-3.5 h-3.5" /> Set Transfer Pin
        </Button>
      </CardContent>
    </Card>
  )
}
