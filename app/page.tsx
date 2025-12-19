"use client"

import { useState } from "react"
import { LandingPage } from "@/components/landing/landing-page"
import { LoginPage } from "@/components/auth/login-page"
import { SignupPage } from "@/components/auth/signup-page"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

export default function Home() {
  const [currentPage, setCurrentPage] = useState<"landing" | "login" | "signup" | "dashboard">("landing")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLogin = () => {
    setIsAuthenticated(true)
    setCurrentPage("dashboard")
  }

  if (currentPage === "landing" && !isAuthenticated) {
    return <LandingPage onGetStarted={() => setCurrentPage("signup")} onSignIn={() => setCurrentPage("login")} />
  }

  if (!isAuthenticated) {
    return currentPage === "login" ? (
      <LoginPage onLoginSuccess={handleLogin} onSwitchToSignup={() => setCurrentPage("signup")} />
    ) : (
      <SignupPage onSignupSuccess={handleLogin} onSwitchToLogin={() => setCurrentPage("login")} />
    )
  }

  return (
    <DashboardLayout
      onLogout={() => {
        setIsAuthenticated(false)
        setCurrentPage("landing")
      }}
    />
  )
}
