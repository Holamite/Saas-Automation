"use client"

import { Lock, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface TransferPinModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  loading: boolean
  onSave: () => void
}

export function TransferPinModal({ open, onOpenChange, loading, onSave }: TransferPinModalProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onOpenChange(false)}>
      <DialogContent className="sm:max-w-[420px] bg-[#1a1a1a] border-border p-0 overflow-hidden shadow-2xl">
        <div className="bg-muted/30 p-6 border-b border-border/50 text-center">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase tracking-tight flex items-center justify-center gap-2">
              <Lock className="w-6 h-6 text-primary" />
              Security PIN
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground uppercase font-bold tracking-wider pt-1">
              Set or update your 6-digit transfer PIN
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="p-8 space-y-8">
          <div className="space-y-4 text-center">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">
              Enter New PIN
            </Label>
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="w-10 h-12 rounded-lg border-2 border-border bg-background flex items-center justify-center focus-within:border-primary transition-all"
                >
                  <input
                    type="password"
                    maxLength={1}
                    className="w-full h-full bg-transparent text-center font-black text-xl focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary/5 rounded-lg p-4 border border-primary/20 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-[10px] font-bold text-primary/80 leading-relaxed">
              This PIN will be required for all outgoing transfers and withdrawals to ensure your funds remain
              secure.
            </p>
          </div>
        </div>
        <DialogFooter className="p-6 bg-muted/10 border-t border-border/50">
          <Button
            className="w-full bg-primary text-black font-black uppercase tracking-widest h-12 shadow-xl shadow-primary/20"
            onClick={onSave}
          >
            {loading ? "Securing Account..." : "Save Secure PIN"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
