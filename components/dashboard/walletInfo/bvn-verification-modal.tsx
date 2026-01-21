"use client"

import { Info, Shield, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog"

interface BvnVerificationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  loading: boolean
  onComplete: () => void
  onCancel: () => void
}

export function BvnVerificationModal({
  open,
  onOpenChange,
  loading,
  onComplete,
  onCancel,
}: BvnVerificationModalProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onOpenChange(false)}>
      <DialogOverlay className="bg-black/50 cursor-pointer transition-opacity data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <DialogContent className="sm:max-w-[500px] bg-[#1a1a1a] border-border p-0 overflow-hidden shadow-2xl">
        <div className="bg-linear-to-r from-primary/15 to-primary/5 p-6 border-b border-border/50">
          <DialogHeader className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-lg font-black uppercase tracking-tight">
                  Link Your Bank Account
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground uppercase font-bold tracking-wider pt-1">
                  Complete BVN verification to activate your virtual account
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              Bank Verification Number (BVN)
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-3.5 h-3.5 text-muted-foreground/60 cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent className="text-xs max-w-xs">
                  Your unique 11-digit BVN issued by your bank
                </TooltipContent>
              </Tooltip>
            </Label>
            <Input
              placeholder="00000000000"
              maxLength={11}
              className="bg-background border-border h-12 text-sm font-mono tracking-wider"
              type="Number"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              Date of Birth (BVN Registration)
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-3.5 h-3.5 text-muted-foreground/60 cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent className="text-xs max-w-xs">
                  Must match the date used during BVN registration
                </TooltipContent>
              </Tooltip>
            </Label>
            <Input placeholder="DD/MM/YYYY" className="bg-background border-border h-12 text-sm" type="date" />
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-xs font-black uppercase tracking-wider text-primary">Data Security & Privacy</p>
                <p className="text-xs font-bold leading-relaxed text-primary/80">
                  We do not store your BVN (Bank Verification Number). This information is required by the Central
                  Bank of Nigeria and Monnify (our third-party payment provider) solely for wallet creation and
                  verification purposes. Your data is encrypted and handled with the highest security standards.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted/40 rounded-lg p-3.5 border border-border/50">
            <p className="text-xs font-bold text-muted-foreground leading-relaxed">
              <span className="text-primary font-black">Why we need this?</span> BVN verification is mandated by the
              Central Bank of Nigeria (CBN) for all financial transactions. This ensures compliance and protects
              your account.
            </p>
          </div>
        </div>

        <DialogFooter className="p-6 bg-muted/10 border-t border-border/50 gap-3">
          <Button variant="ghost" className="text-xs font-black uppercase tracking-widest h-11" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            className="flex-1 bg-primary text-black font-black uppercase tracking-widest h-11 shadow-lg shadow-primary/20"
            onClick={onComplete}
          >
            {loading ? "Verifying..." : "Complete Verification"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
