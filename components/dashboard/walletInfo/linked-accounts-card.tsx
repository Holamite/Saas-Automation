"use client"

import { CheckCircle, CreditCard, MoreVertical, Send, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { LinkedAccount } from "./utils/types"

interface LinkedAccountsCardProps {
  accounts: LinkedAccount[]
  onAdd: () => void
  onEdit: (account: LinkedAccount) => void
  onDelete: (accountId: number) => void
  onSend: () => void
  onWithdraw: () => void
}

export function LinkedAccountsCard({
  accounts,
  onAdd,
  onEdit,
  onDelete,
  onSend,
  onWithdraw,
}: LinkedAccountsCardProps) {
  return (
    <Card className="bg-[#1a1a1a] border-border shadow-lg h-full">
      <CardHeader className="py-4 px-5 border-b border-border/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2.5 text-foreground">
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <Users className="w-4 h-4 text-primary" />
            </div>
            Your Linked Accounts
          </CardTitle>
          <Button
            size="sm"
            className="h-7 px-2.5 text-xs font-black uppercase tracking-wider bg-primary/10 text-primary border border-primary/30 hover:bg-primary/15 transition-all gap-1"
            onClick={onAdd}
          >
            <Users className="w-3 h-3" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <div className="space-y-2.5">
          {accounts.map((account) => (
            <div
              key={account.id}
              className={`p-3.5 rounded-lg border transition-all group ${
                account.active
                  ? "bg-primary/8 border-primary/30"
                  : "bg-background/50 border-border/40 hover:border-border/60"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="pt-0.5">
                    {account.active ? (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_6px_rgba(255,165,0,0.6)]" />
                    ) : (
                      <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
                    )}
                  </div>
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
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                        </TooltipTrigger>
                        <TooltipContent className="text-xs">Verified Account</TooltipContent>
                      </Tooltip>
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
                <div className="relative group/menu">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  >
                    <MoreVertical className="w-3.5 h-3.5 text-muted-foreground" />
                  </Button>
                  <div className="absolute right-0 top-8 bg-[#1a1a1a] border border-border rounded-lg shadow-lg opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-20 w-48">
                    <button
                      onClick={() => onEdit(account)}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-foreground hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-2"
                    >
                      <CreditCard className="w-3 h-3" />
                      Edit Account
                    </button>
                    <button
                      onClick={() => onDelete(account.id)}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-2 border-t border-border"
                    >
                      <span>Delete Account</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-4 pt-4 border-t border-border/40">
          <Button
            size="sm"
            className="flex-1 h-9 text-xs font-black uppercase tracking-wider bg-primary/10 text-primary border border-primary/30 hover:bg-primary/15 transition-all gap-1.5"
            onClick={onSend}
          >
            <Send className="w-3 h-3" />
            Send
          </Button>
          <Button
            size="sm"
            className="flex-1 h-9 text-xs font-black uppercase tracking-wider bg-orange-500/10 text-orange-500 border border-orange-500/30 hover:bg-orange-500/15 transition-all gap-1.5"
            onClick={onWithdraw}
          >
            <CreditCard className="w-3 h-3" />
            Withdraw
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
