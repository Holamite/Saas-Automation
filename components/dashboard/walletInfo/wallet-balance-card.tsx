"use client"

import { Banknote, Copy, Info, QrCode } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface WalletBalanceCardProps {
  balance: string
  accountNumber: string
  bankName: string
  accountName: string
  dailyLimit: string
  onCopy: (text: string, label: string) => void
}

export function WalletBalanceCard({
  balance,
  accountNumber,
  bankName,
  accountName,
  dailyLimit,
  onCopy,
}: WalletBalanceCardProps) {
  const fullDetails = `${accountNumber} | ${bankName} | ${accountName}`

  return (
    <Card className="bg-[#1a1a1a] border-border shadow-xl relative overflow-hidden lg:col-span-2">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-orange-600" />
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-extrabold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Banknote className="w-5 h-5 text-primary" />
            Wallet Account
          </div>
          <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-none text-[10px]">
            VERIFIED
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3 pb-4 border-b border-border/30">
          <h2 className="text-5xl font-black text-foreground tracking-tighter leading-tight">{balance}</h2>
          <p className="text-xs text-primary font-bold uppercase tracking-wider">Available Balance</p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-background/60 rounded-xl border border-border/60 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">
                Account Number
              </p>
              <Copy
                className="w-3.5 h-3.5 text-primary cursor-pointer hover:scale-110 transition-transform"
                onClick={() => onCopy(accountNumber, "Account Number")}
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-mono font-black tracking-[0.15em] text-foreground">{accountNumber}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 px-1">
            <div className="flex justify-between items-center group">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Bank Name</span>
              <span className="text-sm font-black group-hover:text-primary transition-colors">{bankName}</span>
            </div>
            <div className="flex justify-between items-center group">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Account Name</span>
              <span className="text-sm font-black uppercase group-hover:text-primary transition-colors ">
                {accountName}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <div className="bg-primary/5 rounded-lg p-3 border border-primary/20 flex gap-3">
            <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-[10px] leading-normal text-muted-foreground">
              Transfers to this account will be credited to your NGN balance instantly.
              <span className="text-primary font-bold ml-1">Daily Limit: {dailyLimit}</span>
            </p>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            className="flex-1 text-[10px] font-black uppercase border-border h-10 bg-background/40 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all"
            onClick={() => onCopy(fullDetails, "Account Details")}
          >
            Copy Details
          </Button>
          <Button variant="outline" size="icon" className="h-10 w-10 border-border bg-background/40 hover:bg-background">
            <QrCode className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
