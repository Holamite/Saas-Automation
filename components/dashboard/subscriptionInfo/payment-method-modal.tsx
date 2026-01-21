"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CreditCard, Wallet } from "lucide-react"
import { PaymentMethod, Tier } from "@/lib/services/subscription.types"
import { cn } from "@/lib/utils"

interface PaymentMethodModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tier: Tier
  tierPrice: string
  loading: boolean
  onConfirm: (paymentMethod: PaymentMethod) => void
  onCancel: () => void
}

export function PaymentMethodModal({
  open,
  onOpenChange,
  tier,
  tierPrice,
  loading,
  onConfirm,
  onCancel,
}: PaymentMethodModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)

  const handleConfirm = () => {
    if (selectedMethod) {
      onConfirm(selectedMethod)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">Choose Payment Method</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Select how you want to pay for your {tier} plan subscription
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-6">
          {/* Plan Summary */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Plan</p>
                <p className="text-lg font-bold text-foreground">{tier} Plan</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="text-lg font-bold text-primary">{tierPrice}</p>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Payment Method</p>
            
            {/* Wallet Option */}
            <button
              onClick={() => setSelectedMethod(PaymentMethod.WALLET)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all",
                selectedMethod === PaymentMethod.WALLET
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              <div className={cn(
                "p-3 rounded-full",
                selectedMethod === PaymentMethod.WALLET ? "bg-primary/20" : "bg-secondary"
              )}>
                <Wallet className={cn(
                  "w-6 h-6",
                  selectedMethod === PaymentMethod.WALLET ? "text-primary" : "text-muted-foreground"
                )} />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-foreground">Pay with Wallet</p>
                <p className="text-sm text-muted-foreground">Use your Doolf wallet balance</p>
              </div>
              {selectedMethod === PaymentMethod.WALLET && (
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
              )}
            </button>

            {/* Card Option */}
            <button
              onClick={() => setSelectedMethod(PaymentMethod.CARD)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all",
                selectedMethod === PaymentMethod.CARD
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              <div className={cn(
                "p-3 rounded-full",
                selectedMethod === PaymentMethod.CARD ? "bg-primary/20" : "bg-secondary"
              )}>
                <CreditCard className={cn(
                  "w-6 h-6",
                  selectedMethod === PaymentMethod.CARD ? "text-primary" : "text-muted-foreground"
                )} />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-foreground">Pay with Card</p>
                <p className="text-sm text-muted-foreground">Debit or credit card payment</p>
              </div>
              {selectedMethod === PaymentMethod.CARD && (
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleConfirm}
            disabled={!selectedMethod || loading}
          >
            {loading ? "Processing..." : "Confirm Payment"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
