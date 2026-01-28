import { LayoutDashboard, CreditCard, ShoppingCart, Zap, FileText, Settings, LucideIcon, Wallet } from 'lucide-react'

export interface DashboardMenuItem {
  id: string
  label: string
  icon: LucideIcon
  path: string
}

export const DASHBOARD_MENU_ITEMS: DashboardMenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'transactions', label: 'Transactions', icon: CreditCard, path: '/dashboard/transactions' },
  { id: 'orders', label: 'Orders', icon: ShoppingCart, path: '/dashboard/orders' },
  { id: 'connectivity', label: 'Connectivity', icon: Zap, path: '/dashboard/connectivity' },
  { id: 'subscription', label: 'Subscription', icon: FileText, path: '/dashboard/subscription' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/dashboard/settings' },
]

