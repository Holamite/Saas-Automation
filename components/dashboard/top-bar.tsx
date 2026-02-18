'use client'

import { Bell, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { getUserDisplayName, getUserInitials, getUserRole } from '@/lib/utils/user'
import { Switch } from '../ui/switch'
// import { ThemeToggleButton } from '@/components/ui/theme-toggle-button'

interface TopBarProps {
  onLogout: () => void
}

export function TopBar({ onLogout }: TopBarProps) {
  const { user } = useAuth()
  const name = getUserDisplayName(user)
  const role = getUserRole(user)
  const avatar = getUserInitials(user)

  return (
    <header className="bg-card border-b border-border px-8 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Welcome to Dolf</h2>
        <p className="text-sm text-muted-foreground">Manage your automated trading</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center gap-2 sm:flex-col">
          <Switch defaultChecked className="data-[state=checked]:bg-primary cursor-pointer  h-4 w-6 [&>span]:h-3 [&>span]:w-3" />
          <span className="text-muted-foreground text-xs">Automation</span>
        </div>

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
