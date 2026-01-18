"use client"

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
import { WALLET_BANKS } from "./utils/constants"
import type { AddAccountForm, LinkedAccount } from "./utils/types"

interface AddAccountModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  form: AddAccountForm
  selectedBank: string
  editingAccount: LinkedAccount | null
  loading: boolean
  onFormChange: (form: AddAccountForm) => void
  onSelectedBankChange: (bank: string) => void
  onSave: () => void
  onCancel: () => void
}

export function AddAccountModal({
  open,
  onOpenChange,
  form,
  selectedBank,
  editingAccount,
  loading,
  onFormChange,
  onSelectedBankChange,
  onSave,
  onCancel,
}: AddAccountModalProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onOpenChange(false)}>
      <DialogContent className="bg-[#1a1a1a] border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-black">
            {editingAccount ? "Edit Account" : "Add New Account"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {editingAccount ? "Update your account details" : "Link a new bank account to your wallet"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase">Account Number</Label>
            <Input
              placeholder="Enter account number"
              value={form.accountNumber}
              onChange={(e) => onFormChange({ ...form, accountNumber: e.target.value })}
              className="bg-background/50 border-border text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase">Select Bank</Label>
            <Select value={selectedBank} onValueChange={onSelectedBankChange}>
              <SelectTrigger className="bg-background/50 border-border text-sm">
                <SelectValue placeholder="Choose a bank" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-border">
                {WALLET_BANKS.map((bank) => (
                  <SelectItem key={bank} value={bank}>
                    {bank}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase">Account Name</Label>
            <Input
              placeholder="Enter account name"
              value={form.accountName}
              onChange={(e) => onFormChange({ ...form, accountName: e.target.value })}
              className="bg-background/50 border-border text-sm"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" className="border-border bg-transparent" onClick={onCancel}>
            Cancel
          </Button>
          <Button className="bg-primary hover:bg-primary/90" onClick={onSave} disabled={loading}>
            {editingAccount ? "Update Account" : "Add Account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
