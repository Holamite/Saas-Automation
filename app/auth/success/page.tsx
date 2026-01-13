'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'

export default function AuthSuccess() {
  const router = useRouter()
  const { checkAuth } = useAuth()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const verifySession = async () => {
      try {
        // Backend already validated cookies and set them
        // Just verify session via checkAuth which handles cookie validation
        await checkAuth()
        
        // Small delay to ensure state is updated
        setTimeout(() => {
          router.push('/dashboard')
        }, 100)
      } catch (err) {
        console.error('Session verification error:', err)
        setError('Failed to verify session. Please try again.')
        setTimeout(() => router.push('/login'), 3000)
      }
    }

    verifySession()
  }, [router, checkAuth])

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
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="text-muted-foreground mb-2">Completing authentication...</div>
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  )
}
