"use client"

import { ExternalLink, Filter, History, MoreVertical, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { WalletTransaction } from "./utils/types"

interface WalletTransactionsTableProps {
  transactions: WalletTransaction[]
}

export function WalletTransactionsTable({ transactions }: WalletTransactionsTableProps) {
  return (
    <Card className="lg:col-span-3 bg-[#1a1a1a] border-border shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <History className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg font-black uppercase tracking-tight">Recent Activity</CardTitle>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search references..." className="pl-9 h-9 w-[240px] bg-background/50 border-border text-xs" />
          </div>
          <Button variant="outline" size="sm" className="h-9 border-border bg-background/50 text-xs font-bold gap-2">
            <Filter className="w-3.5 h-3.5" /> Filter
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/10 border-b border-border hover:bg-muted/10">
              <TableHead className="py-4 text-[10px] font-black uppercase tracking-widest pl-6">Transaction ID</TableHead>
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
                  <Badge variant="secondary" className="text-[9px] font-black uppercase tracking-tighter bg-muted/40">
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
  )
}
