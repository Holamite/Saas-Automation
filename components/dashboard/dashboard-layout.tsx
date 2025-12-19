"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { DashboardPage } from "./pages/dashboard-page"
import { TransactionsPage } from "./pages/transactions-page"
import { OrdersPage } from "./pages/orders-page"
import { ConnectivityPage } from "./pages/connectivity-page"
import { SubscriptionPage } from "./pages/subscription-page"
import { SettingsPage } from "./pages/settings-page"
import { TopBar } from "./top-bar"

interface DashboardLayoutProps {
  onLogout: () => void
}

export function DashboardLayout({ onLogout }: DashboardLayoutProps) {
  const [currentPage, setCurrentPage] = useState<string>("dashboard")

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage />
      case "transactions":
        return <TransactionsPage />
      case "orders":
        return <OrdersPage />
      case "connectivity":
        return <ConnectivityPage />
      case "subscription":
        return <SubscriptionPage />
      case "settings":
        return <SettingsPage />
      default:
        return <DashboardPage />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar onLogout={onLogout} />
        <main className="flex-1 overflow-auto">{renderPage()}</main>
      </div>
    </div>
  )
}
