"use client"

import { Bell, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TopBarProps {
  onLogout: () => void
}

export function TopBar({ onLogout }: TopBarProps) {
  return (
    <header className="bg-card border-b border-border px-8 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Welcome to Doolf</h2>
        <p className="text-sm text-muted-foreground">Manage your automated trading</p>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-foreground">Adebara Olamide</p>
            <p className="text-xs text-muted-foreground">Merchant</p>
          </div>
        </div>

        <Button onClick={onLogout} variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </header>
  )
}
