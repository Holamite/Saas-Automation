"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import {
  AddAccountModal,
  BvnVerificationModal,
  LinkedAccountsCard,
  SendFundsModal,
  TransferPinModal,
  WalletAlertCard,
  WalletBalanceCard,
  WalletSecurityCard,
  WalletTransactionsTable,
  WithdrawModal,
} from "@/components/dashboard/walletInfo/utils"
import type { AddAccountForm, LinkedAccount, WalletTransaction } from "@/components/dashboard/walletInfo/utils"
import { useWalletInfo, useWalletBalance, useCreateWallet } from "@/hooks/use-wallet-query"
import { ApiClientError } from "@/lib/api/client"
import { Loading } from "@/components/ui/loading"

const INITIAL_LINKED_ACCOUNTS: LinkedAccount[] = [
  { id: 1, name: "Adebara Olamide", bank: "GT BANK", number: "0123456789", active: true, verified: true },
  { id: 2, name: "Adebara Olamide", bank: "ZENITH BANK", number: "5544332211", active: false, verified: false },
  { id: 3, name: "Adebara Olamide", bank: "KUDA BANK", number: "2091223344", active: false, verified: true },
]

const MOCK_TRANSACTIONS: WalletTransaction[] = [
  {
    id: "TX-90123",
    date: "2025-06-15 14:30",
    type: "Bank Transfer",
    description: "Inbound from Kuda Bank",
    amount: 500000,
    currency: "NGN",
    status: "Completed",
    ref: "DOLF-WAL-001",
  },
  {
    id: "TX-90125",
    date: "2025-06-14 09:45",
    type: "Withdrawal",
    description: "Payout to GTBank",
    amount: 250000,
    currency: "NGN",
    status: "Pending",
    ref: "DOLF-PAY-441",
  },
]

export function WalletPage() {
  const { toast } = useToast()
  
  // React Query hooks for wallet data
  const { data: walletInfo, isLoading: isLoadingInfo, error: walletError } = useWalletInfo()
  const { data: walletBalance, isLoading: isLoadingBalance } = useWalletBalance()
  const createWalletMutation = useCreateWallet()
  
  const [activeModal, setActiveModal] = useState<
    "send" | "set-transfer-pin" | "withdraw" | "bvn-verification" | "add-account" | null
  >(null)
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>(INITIAL_LINKED_ACCOUNTS)
  const [editingAccount, setEditingAccount] = useState<LinkedAccount | null>(null)
  const [newAccountForm, setNewAccountForm] = useState<AddAccountForm>({
    accountNumber: "",
    bank: "",
    accountName: "",
  })
  const [selectedBank, setSelectedBank] = useState("")

  // Derived state
  const isLoadingWallet = isLoadingInfo || isLoadingBalance

  // Show BVN modal if wallet doesn't exist (404 error)
  useEffect(() => {
    if (walletError && walletError instanceof Error) {
      const apiError = walletError as ApiClientError
      if (apiError.status === 404) {
        setActiveModal("bvn-verification")
      }
    }
  }, [walletError])

  const handleCreateWallet = (bvn: string, bvnDateOfBirth: string) => {
    createWalletMutation.mutate(
      { bvn, bvnDateOfBirth },
      {
        onSuccess: () => {
          toast({ 
            title: "Success", 
            description: "Wallet created successfully! Your virtual account is now active." 
          })
          setActiveModal(null)
        },
        onError: (error) => {
          if (error instanceof ApiClientError) {
            toast({
              title: error.title || "Error",
              description: error.message || "Failed to create wallet. Please try again.",
              variant: "destructive",
            })
          } else {
            toast({
              title: "Error",
              description: "An unexpected error occurred. Please try again.",
              variant: "destructive",
            })
          }
        },
      }
    )
  }

  const handleAction = (type: string) => {
    toast({ title: "Success", description: `${type} request processed successfully.` })
    setActiveModal(null)
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({ title: "Copied!", description: `${label} copied to clipboard` })
  }

  const handleAddAccount = () => {
    if (!newAccountForm.accountNumber || !selectedBank || !newAccountForm.accountName) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" })
      return
    }
    if (editingAccount) {
      setLinkedAccounts(
        linkedAccounts.map((acc) =>
          acc.id === editingAccount.id
            ? { ...acc, number: newAccountForm.accountNumber, bank: selectedBank, name: newAccountForm.accountName }
            : acc,
        ),
      )
      toast({ title: "Success", description: "Account updated successfully" })
    } else {
      setLinkedAccounts([
        ...linkedAccounts,
        {
          id: Math.max(...linkedAccounts.map((a) => a.id), 0) + 1,
          name: newAccountForm.accountName,
          bank: selectedBank,
          number: newAccountForm.accountNumber,
          active: false,
          verified: false,
        },
      ])
      toast({ title: "Success", description: "Account added successfully" })
    }
    setNewAccountForm({ accountNumber: "", bank: "", accountName: "" })
    setSelectedBank("")
    setEditingAccount(null)
    setActiveModal(null)
  }

  const handleDeleteAccount = (accountId: number) => {
    setLinkedAccounts(linkedAccounts.filter((acc) => acc.id !== accountId))
    toast({ title: "Success", description: "Account deleted successfully" })
  }

  const handleEditAccount = (account: LinkedAccount) => {
    setEditingAccount(account)
    setNewAccountForm({ accountNumber: account.number, bank: account.bank, accountName: account.name })
    setSelectedBank(account.bank)
    setActiveModal("add-account")
  }

  const openAddAccount = () => {
    setEditingAccount(null)
    setNewAccountForm({ accountNumber: "", bank: "", accountName: "" })
    setSelectedBank("")
    setActiveModal("add-account")
  }

  if (isLoadingWallet) {
    return <Loading message="Loading wallet..." />
  }

  return (
    <TooltipProvider>
      <div
        className={cn(
          "p-8 space-y-8 bg-background min-h-full relative transition-all duration-300 ease-out",
          activeModal === "bvn-verification" && "blur-sm scale-[0.99] pointer-events-none select-none",
        )}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">Wallet & Accounts</h1>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-2 py-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mr-1.5 animate-pulse" />
                Main Wallet
              </Badge>
            </div>
            <p className="text-muted-foreground">Unified management for your NGN balance and Wallet Accounts.</p>
          </div>
        </div>

        <div className="gap-6">
          <WalletBalanceCard
            balance={
              isLoadingWallet 
                ? "Loading..." 
                : walletBalance 
                  ? `₦${walletBalance.availableBalance.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : "₦0.00"
            }
            accountNumber={walletInfo?.accountNumber || "N/A"}
            bankName={walletInfo?.bankName || "Monnify Microfinance Bank"}
            accountName={walletInfo?.accountName || "N/A"}
            dailyLimit="₦5,000,000"
            onCopy={copyToClipboard}
          />
        </div>

        <div className="gap-6 mb-8">
          <LinkedAccountsCard
            accounts={linkedAccounts}
            onAdd={openAddAccount}
            onEdit={handleEditAccount}
            onDelete={handleDeleteAccount}
            onSend={() => setActiveModal("send")}
            onWithdraw={() => setActiveModal("withdraw")}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <WalletTransactionsTable transactions={MOCK_TRANSACTIONS} />
          <div className="space-y-6">
            <WalletSecurityCard onSetTransferPin={() => setActiveModal("set-transfer-pin")} />
            <WalletAlertCard amount="₦250,000" />
          </div>
        </div>

        <SendFundsModal
          open={activeModal === "send"}
          onOpenChange={(o) => setActiveModal(o ? "send" : null)}
          loading={false}
          onConfirm={() => handleAction("Transfer")}
          onCancel={() => setActiveModal(null)}
        />
        <TransferPinModal
          open={activeModal === "set-transfer-pin"}
          onOpenChange={(o) => setActiveModal(o ? "set-transfer-pin" : null)}
          loading={false}
          onSave={() => handleAction("Security PIN set")}
        />
        <WithdrawModal
          open={activeModal === "withdraw"}
          onOpenChange={(o) => setActiveModal(o ? "withdraw" : null)}
          loading={false}
          onSubmit={() => handleAction("Withdrawal")}
        />
        <BvnVerificationModal
          open={activeModal === "bvn-verification"}
          onOpenChange={(o) => setActiveModal(o ? "bvn-verification" : null)}
          loading={createWalletMutation.isPending}
          onComplete={handleCreateWallet}
          onCancel={() => setActiveModal(null)}
        />
        <AddAccountModal
          open={activeModal === "add-account"}
          onOpenChange={(o) => setActiveModal(o ? "add-account" : null)}
          form={newAccountForm}
          selectedBank={selectedBank}
          editingAccount={editingAccount}
          loading={false}
          onFormChange={setNewAccountForm}
          onSelectedBankChange={setSelectedBank}
          onSave={handleAddAccount}
          onCancel={() => setActiveModal(null)}
        />
      </div>
    </TooltipProvider>
  )
}
