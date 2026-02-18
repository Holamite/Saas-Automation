'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'

export default function AuthSuccess() {
  const router = useRouter()
  const { refreshSession } = useAuth()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const verifySession = async () => {
      try {
        await refreshSession()
        setTimeout(() => router.push('/dashboard'), 100)
      } catch (err) {
        console.error('Session verification error:', err)
        setError('Failed to verify session. Please try again.')
        setTimeout(() => router.push('/login'), 3000)
      }
    }

    verifySession()
  }, [router, refreshSession])

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card rounded-lg border border-border p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Authentication Error</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <p className="text-sm text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center gap-8 max-w-md w-full mx-auto px-6">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <div className="inline-block">
            <div className="text-4xl font-bold bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Dolf
            </div>
          </div>
          <p className="text-muted-foreground text-sm font-medium tracking-wide">COMPLETING AUTHENTICATION</p>
        </div>

        {/* Animated Spinner */}
        <div className="flex items-center justify-center h-20">
          <div className="relative w-16 h-16">
            {/* Outer ring spinner */}
            <div className="absolute inset-0 rounded-full border-4 border-border/30 border-t-primary border-r-primary/80 animate-spin"></div>

            {/* Middle ring spinner - slower */}
            <div
              className="absolute inset-2 rounded-full border-2 border-transparent border-b-primary/60 animate-spin"
              style={{ animationDirection: "reverse", animationDuration: "2s" }}
            ></div>

            {/* Center dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
            </div>
          </div>
        </div>

        {/* Status Message */}
        <div className="text-center space-y-1">
          <p className="text-foreground font-medium text-sm">Setting up your account</p>
          <p className="text-muted-foreground text-xs">Please wait while we prepare your dashboard...</p>
        </div>

        {/* Progress indicators */}
        <div className="flex gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse"></div>
          <div
            className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.4s" }}></div>
        </div>
      </div>
    </div>
  )
}
