"use client"

import { CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface WithdrawModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  loading: boolean
  onSubmit: () => void
}

export function WithdrawModal({ open, onOpenChange, loading, onSubmit }: WithdrawModalProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onOpenChange(false)}>
      <DialogContent className="sm:max-w-[480px] bg-[#1a1a1a] border-border p-0 overflow-hidden">
        <div className="bg-muted/30 p-6 border-b border-border/50">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-primary" />
              Request Payout
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              Withdraw your NGN earnings to your linked bank
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Select Destination Bank
            </Label>
            <div className="p-4 bg-background border-2 border-primary/40 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded bg-primary/10 flex items-center justify-center font-black text-primary text-xs tracking-tighter`}
                >
                  GTB
                </div>
                <div>
                  <p className="text-sm font-black">Guaranty Trust Bank</p>
                  <p className="text-[10px] font-mono font-bold text-muted-foreground tracking-widest">
                    029****192
                  </p>
                </div>
              </div>
              <Button variant="ghost" className="text-[10px] font-black uppercase text-primary p-0">
                Change
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Withdrawal Amount
            </Label>
            <div className="relative">
              <Input
                placeholder="0.00"
                className="bg-background border-border h-14 text-2xl font-black tracking-tight"
                type="number"
              />
            </div>
          </div>
        </div>
        <DialogFooter className="p-6 bg-muted/10 border-t border-border/50">
          <Button
            className="w-full bg-primary text-black font-black uppercase tracking-widest h-12"
            onClick={onSubmit}
          >
            {loading ? "Verifying Transaction..." : "Submit Payout Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
