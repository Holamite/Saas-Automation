"use client"

import { useState } from "react"
import {
  Copy,
  QrCode,
  Send,
  Search,
  Filter,
  Shield,
  Bell,
  Lock,
  ExternalLink,
  MoreVertical,
  Banknote,
  Info,
  History,
  CreditCard,
  ArrowUpCircle,
  Users,
  ShieldCheck,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export function WalletPage() {
  const { toast } = useToast()
  const [activeModal, setActiveModal] = useState<"send" | "set-transfer-pin" | "withdraw" | "bvn-verification" | null>(
    null,
  )
  const [loading, setLoading] = useState(false)
  const [isAccountLoading, setIsAccountLoading] = useState(false)
  const [hasLinkedAccounts, setHasLinkedAccounts] = useState(false)

  useState(() => {
    if (!hasLinkedAccounts) {
      setActiveModal("bvn-verification")
    }
  }, [])

  const handleAction = (type: string) => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setActiveModal(null)
      toast({
        title: "Success",
        description: `${type} request processed successfully.`,
      })
    }, 1500)
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    })
  }

  const transactions = [
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

  return (
    <div className="p-8 space-y-8 bg-background min-h-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">Wallet & Accounts</h1>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-2 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mr-1.5 animate-pulse" />
              Main Wallet
            </Badge>
          </div>
          <p className="text-muted-foreground">Unified management for your NGN balance and Virtual Accounts.</p>
        </div>
      </div>

      {/* Wallet Overview & Virtual Account */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Realistic Virtual Account Panel */}
        <Card className="bg-[#1a1a1a] border-border shadow-xl relative overflow-hidden lg:col-span-2">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-orange-600" />
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-extrabold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Banknote className="w-5 h-5 text-primary" />
                NGN Virtual Account
              </div>
              <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-none text-[10px]">VERIFIED</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="p-4 bg-background/60 rounded-xl border border-border/60 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">
                    Account Number
                  </p>
                  <Copy
                    className="w-3.5 h-3.5 text-primary cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => copyToClipboard("8293019284", "Account Number")}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-mono font-black tracking-[0.15em] text-foreground">8293019284</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 px-1">
                <div className="flex justify-between items-center group">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Bank Name</span>
                  <span className="text-sm font-black group-hover:text-primary transition-colors">
                    Monnify Microfinance Bank
                  </span>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Account Name</span>
                  <span className="text-sm font-black uppercase group-hover:text-primary transition-colors truncate max-w-[160px]">
                    DOLF / Adebara Olamide
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <div className="bg-primary/5 rounded-lg p-3 border border-primary/20 flex gap-3">
                <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-[10px] leading-normal text-muted-foreground">
                  Transfers to this account will be credited to your NGN balance instantly.
                  <span className="text-primary font-bold ml-1">Daily Limit: ₦5,000,000</span>
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1 text-[10px] font-black uppercase border-border h-10 bg-background/40 hover:bg-background"
                onClick={() => copyToClipboard("8293019284", "Account Details")}
              >
                Copy Details
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 border-border bg-background/40 hover:bg-background"
              >
                <QrCode className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className=" bg-[#141414] border-border relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full -mr-40 -mt-40 blur-3xl opacity-50 transition-all duration-500 group-hover:opacity-70" />
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                Available Liquidity
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-3.5 h-3.5" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-popover border-border">
                      Total tradeable funds across all sub-accounts
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="relative z-10 pt-4">
            <div className="space-y-8">
              <div className="space-y-2">
                <h2 className="text-4xl font-black text-primary tracking-tighter transition-all">₦24,850,200.00</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Nigerian Naira Balance</span>
                  <Badge variant="outline" className="text-[10px] h-4 px-1.5 ml-2 border-primary/20 text-primary">
                    ACTIVE
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col gap-10 pt-6 border-t border-border/40">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Wallet Balance
                  </p>
                  <p className="text-xl font-bold">₦18,400,000</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Other Bank Balance
                  </p>
                  <p className="text-xl font-bold text-orange-400">₦6,450,200</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Primary Actions Grid */}
      <div className="gap-6 mb-8">
        {/* Connected Accounts display - Primary Focus */}
        <Card className="bg-[#1a1a1a] border-border shadow-lg h-full">
          <CardHeader className="py-4 px-5 border-b border-border/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2.5 text-foreground">
                <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                Your Linked Accounts
              </CardTitle>
              <div className="text-[11px] font-black uppercase tracking-tighter text-muted-foreground bg-muted/40 px-2.5 py-1 rounded">
                Active: 1
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5">
            <div className="space-y-2.5">
              {[
                { name: "Adebara Olamide", bank: "GT BANK", number: "0123456789", active: true, verified: true },
                { name: "Adebara Olamide", bank: "ACCESS BANK", number: "9876543210", active: false, verified: true },
                { name: "Adebara Olamide", bank: "ZENITH BANK", number: "5544332211", active: false, verified: false },
                { name: "Adebara Olamide", bank: "KUDA BANK", number: "2091223344", active: false, verified: true },
              ].map((account, i) => (
                <div
                  key={i}
                  className={`p-3.5 rounded-lg border transition-all group ${
                    account.active
                      ? "bg-primary/8 border-primary/30"
                      : "bg-background/50 border-border/40 hover:border-border/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* Account Status Indicator */}
                      <div className="pt-0.5">
                        {account.active ? (
                          <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_6px_rgba(255,165,0,0.6)]" />
                        ) : (
                          <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
                        )}
                      </div>

                      {/* Account Details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-xs font-black text-foreground">{account.name}</p>
                          <Badge
                            variant="outline"
                            className={`text-[9px] h-5 px-2 font-black uppercase tracking-tighter ${
                              account.active
                                ? "border-primary/40 bg-primary/10 text-primary"
                                : "border-border/50 text-muted-foreground"
                            }`}
                          >
                            {account.bank}
                          </Badge>
                          {account.verified && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                              </TooltipTrigger>
                              <TooltipContent className="text-xs">Verified Account</TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                        <p className="text-[10px] font-mono text-muted-foreground mt-1 tracking-tight">
                          {account.number.replace(/(\d{3})\d{4}(\d{3})/, "$1••••$2")}
                        </p>
                        {account.active && (
                          <p className="text-[9px] font-bold uppercase tracking-wider text-primary mt-1.5 flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-primary" />
                            Active Transfer Account
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Menu */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    >
                      <MoreVertical className="w-3.5 h-3.5 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 mt-4 pt-4 border-t border-border/40">
              <Button
                size="sm"
                className="flex-1 h-9 text-xs font-black uppercase tracking-wider bg-primary/10 text-primary border border-primary/30 hover:bg-primary/15 transition-all gap-1.5"
                onClick={() => setActiveModal("send")}
              >
                <Send className="w-3 h-3" />
                Send
              </Button>
              <Button
                size="sm"
                className="flex-1 h-9 text-xs font-black uppercase tracking-wider bg-orange-500/10 text-orange-500 border border-orange-500/30 hover:bg-orange-500/15 transition-all gap-1.5"
                onClick={() => setActiveModal("withdraw")}
              >
                <CreditCard className="w-3 h-3" />
                Withdraw
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History & Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3 bg-[#1a1a1a] border-border shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <History className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg font-black uppercase tracking-tight">Recent Activity</CardTitle>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search references..."
                  className="pl-9 h-9 w-[240px] bg-background/50 border-border text-xs"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-9 border-border bg-background/50 text-xs font-bold gap-2"
              >
                <Filter className="w-3.5 h-3.5" /> Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/10 border-b border-border hover:bg-muted/10">
                  <TableHead className="py-4 text-[10px] font-black uppercase tracking-widest pl-6">
                    Transaction ID
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Type</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Description</TableHead>
                  <TableHead className="text-right text-[10px] font-black uppercase tracking-widest">Amount</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-center">Status</TableHead>
                  <TableHead className="w-[80px] pr-6"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id} className="border-border hover:bg-muted/20 transition-colors">
                    <TableCell className="py-5 pl-6">
                      <div className="space-y-0.5">
                        <p className="font-mono text-xs font-bold">{tx.id}</p>
                        <p className="text-[10px] text-muted-foreground">{tx.date}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="text-[9px] font-black uppercase tracking-tighter bg-muted/40"
                      >
                        {tx.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-medium text-muted-foreground">{tx.description}</TableCell>
                    <TableCell
                      className={`text-right font-black text-sm ${tx.type === "Bank Transfer" ? "text-emerald-500" : "text-foreground"}`}
                    >
                      {tx.type === "Bank Transfer" ? "+" : "-"}₦{tx.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Badge
                          variant="outline"
                          className={`text-[9px] font-black uppercase ${
                            tx.status === "Completed"
                              ? "text-emerald-400 border-emerald-400/20 bg-emerald-400/5"
                              : tx.status === "Pending"
                                ? "text-orange-400 border-orange-400/20 bg-orange-400/5"
                                : "text-destructive border-destructive/20 bg-destructive/5"
                          }`}
                        >
                          {tx.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="p-4 border-t border-border/30 text-center bg-muted/5">
              <Button
                variant="ghost"
                className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary gap-2"
              >
                View Transaction Report
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security & Quick Controls Sidebar */}
        <div className="space-y-6">
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
                onClick={() => setActiveModal("set-transfer-pin")}
              >
                <Lock className="w-3.5 h-3.5" /> Set Transfer Pin
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border border-primary/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full -mr-10 -mt-10 blur-xl group-hover:bg-primary/20 transition-all" />
            <CardContent className="p-5 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-black text-primary uppercase tracking-widest">Active Alert</p>
                <p className="text-xs leading-relaxed font-bold">
                  Withdrawal of <span className="text-primary font-black">₦250,000</span> is currently pending
                  processing.
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
        </div>
      </div>

      {/* Re-implemented Modals with Enhanced Realism */}
      {/* Send Funds Modal */}
      <Dialog open={activeModal === "send"} onOpenChange={(open) => !open && setActiveModal(null)}>
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
                <div className="absolute right-4 top-4 px-2 py-0.5 rounded bg-muted/50 text-[10px] font-black">NGN</div>
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
            <Button
              variant="ghost"
              className="text-xs font-black uppercase tracking-widest h-11"
              onClick={() => setActiveModal(null)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-primary text-black font-black uppercase tracking-widest h-11 shadow-lg shadow-primary/20"
              onClick={() => handleAction("Transfer")}
            >
              {loading ? "Processing..." : "Confirm Transfer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transfer PIN Modal */}
      <Dialog open={activeModal === "set-transfer-pin"} onOpenChange={(open) => !open && setActiveModal(null)}>
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
                This PIN will be required for all outgoing transfers and withdrawals to ensure your funds remain secure.
              </p>
            </div>
          </div>
          <DialogFooter className="p-6 bg-muted/10 border-t border-border/50">
            <Button
              className="w-full bg-primary text-black font-black uppercase tracking-widest h-12 shadow-xl shadow-primary/20"
              onClick={() => handleAction("Security PIN set")}
            >
              {loading ? "Securing Account..." : "Save Secure PIN"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Withdraw Modal - Simplified and Realistic */}
      <Dialog open={activeModal === "withdraw"} onOpenChange={(open) => !open && setActiveModal(null)}>
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
                    <p className="text-[10px] font-mono font-bold text-muted-foreground tracking-widest">029****192</p>
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
              onClick={() => handleAction("Withdrawal")}
            >
              {loading ? "Verifying Transaction..." : "Submit Payout Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* BVN Verification Modal for first-time users */}
      <Dialog open={activeModal === "bvn-verification"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="sm:max-w-[500px] bg-[#1a1a1a] border-border p-0 overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-primary/15 to-primary/5 p-6 border-b border-border/50">
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
            {/* BVN Input */}
            <div className="space-y-3">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                Bank Verification Number (BVN)
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3.5 h-3.5 text-muted-foreground/60 cursor-help" />
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
                type="text"
              />
            </div>

            {/* DOB Input */}
            <div className="space-y-3">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                Date of Birth (BVN Registration)
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3.5 h-3.5 text-muted-foreground/60 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="text-xs max-w-xs">
                    Must match the date used during BVN registration
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Input placeholder="DD/MM/YYYY" className="bg-background border-border h-12 text-sm" type="date" />
            </div>

            {/* Security Disclaimer */}
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

            {/* Additional Info */}
            <div className="bg-muted/40 rounded-lg p-3.5 border border-border/50">
              <p className="text-xs font-bold text-muted-foreground leading-relaxed">
                <span className="text-primary font-black">Why we need this?</span> BVN verification is mandated by the
                Central Bank of Nigeria (CBN) for all financial transactions. This ensures compliance and protects your
                account.
              </p>
            </div>
          </div>

          <DialogFooter className="p-6 bg-muted/10 border-t border-border/50 gap-3">
            <Button
              variant="ghost"
              className="text-xs font-black uppercase tracking-widest h-11"
              onClick={() => setActiveModal(null)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-primary text-black font-black uppercase tracking-widest h-11 shadow-lg shadow-primary/20"
              onClick={() => {
                handleAction("BVN Verification")
                setHasLinkedAccounts(true)
              }}
            >
              {loading ? "Verifying..." : "Complete Verification"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
