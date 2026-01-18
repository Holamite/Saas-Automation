"use client"

import { ArrowUpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface SendFundsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  loading: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function SendFundsModal({ open, onOpenChange, loading, onConfirm, onCancel }: SendFundsModalProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onOpenChange(false)}>
      <DialogContent className="sm:max-w-[480px] bg-[#1a1a1a] border-border p-0 overflow-hidden shadow-2xl">
        <div className="bg-muted/30 p-6 border-b border-border/50">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
              <ArrowUpCircle className="w-6 h-6 text-primary" />
              Transfer Funds
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              Send NGN to external bank accounts
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Transfer Method
            </Label>
            <Select defaultValue="bank">
              <SelectTrigger className="bg-background border-border h-12">
                <SelectValue placeholder="Select destination type" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="bank">Nigerian Bank Account (Instasend)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Amount to Send
              </Label>
              <span className="text-[10px] font-bold text-primary">BAL: ₦18,400,000</span>
            </div>
            <div className="relative">
              <Input
                placeholder="0.00"
                className="bg-background border-border h-14 text-2xl font-black tracking-tight pr-16"
                type="number"
              />
              <div className="absolute right-4 top-4 px-2 py-0.5 rounded bg-muted/50 text-[10px] font-black">
                NGN
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Recipient Account/Address
            </Label>
            <div className="relative">
              <Input placeholder="Enter details..." className="bg-background border-border h-12 text-sm" />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1.5 h-9 text-[10px] font-black uppercase text-primary"
              >
                Verify
              </Button>
            </div>
          </div>

          <div className="bg-muted/20 rounded-lg p-4 border border-border/50">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-muted-foreground uppercase font-bold tracking-wider">Network Fee</span>
              <span className="font-black text-primary">₦100.00</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-border/30">
              <span className="font-black uppercase tracking-wider">Total Deduction</span>
              <span className="font-black">₦0.00</span>
            </div>
          </div>
        </div>
        <DialogFooter className="p-6 bg-muted/10 border-t border-border/50 gap-3">
          <Button variant="ghost" className="text-xs font-black uppercase tracking-widest h-11" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            className="flex-1 bg-primary text-black font-black uppercase tracking-widest h-11 shadow-lg shadow-primary/20"
            onClick={onConfirm}
          >
            {loading ? "Processing..." : "Confirm Transfer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
