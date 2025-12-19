"use client"

import { LayoutDashboard, CreditCard, ShoppingCart, Zap, FileText, Settings } from "lucide-react"

interface SidebarProps {
  currentPage: string
  onNavigate: (page: string) => void
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "transactions", label: "Transactions", icon: CreditCard },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "connectivity", label: "Connectivity", icon: Zap },
    { id: "subscription", label: "Subscription", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ]

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

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <Icon className="w-5 h-5" />
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
