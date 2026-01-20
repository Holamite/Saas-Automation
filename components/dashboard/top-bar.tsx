'use client'

import { Bell, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { getUserDisplayName, getUserInitials, getUserRole } from '@/lib/utils/user'

interface TopBarProps {
  onLogout: () => void
}

export function TopBar({ onLogout }: TopBarProps) {
  const { user } = useAuth()
  console.log('user', user)
  const name = getUserDisplayName(user)
  const role = getUserRole(user)
  const avatar = getUserInitials(user)

  return (
    <header className="bg-card border-b border-border px-8 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Welcome to Doolf</h2>
        <p className="text-sm text-muted-foreground">Manage your automated trading</p>
      </div>

      <div className="flex items-center gap-4">
        <button
          className="relative p-2 text-muted-foreground cursor-pointer hover:text-foreground hover:bg-secondary rounded-lg transition"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" aria-hidden="true" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" aria-hidden="true"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            {avatar}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-foreground">{name}</p>
            <p className="text-xs text-muted-foreground">{role}</p>
          </div>
        </div>

        <Button
          onClick={onLogout}
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
          aria-label="Logout"
        >
          <LogOut className="w-4 h-4" aria-hidden="true" />
        </Button>
      </div>
    </header>
  )
}
