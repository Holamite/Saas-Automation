'use client'

import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { DASHBOARD_MENU_ITEMS } from '@/lib/constants/dashboard-menu'

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleNavigate = (path: string) => {
    router.push(path)
  }

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname === path
  }

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold">D</span>
          </div>
          <h1 className="text-xl font-bold text-sidebar-foreground">Doolf</h1>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2" aria-label="Main navigation">
        {DASHBOARD_MENU_ITEMS.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.path)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer',
                active
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="w-5 h-5" aria-hidden="true" />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="bg-sidebar-accent rounded-lg p-4 text-center">
          <p className="text-sm text-sidebar-foreground font-medium">Premium Plan</p>
          <p className="text-xs text-sidebar-foreground/70 mt-1">Active until Dec 31, 2025</p>
        </div>
      </div>
    </aside>
  )
}
