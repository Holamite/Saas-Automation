'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loading } from '@/components/ui/loading'
import { verifyOAuthState } from '@/lib/auth'
import { useAuth } from '@/contexts/auth-context'

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { checkAuth } = useAuth()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get state and code from URL
        const state = searchParams.get('state')
        const code = searchParams.get('code')
        const errorParam = searchParams.get('error')

        // Handle OAuth error
        if (errorParam) {
          setError(`OAuth error: ${errorParam}`)
          setTimeout(() => router.push('/login'), 3000)
          return
        }

        // Verify state parameter for CSRF protection
        if (!state || !verifyOAuthState(state)) {
          setError('Invalid state parameter. Please try again.')
          setTimeout(() => router.push('/login'), 3000)
          return
        }

        // If we have a code, the backend should have already processed it
        // and set the HttpOnly cookies. We just need to verify auth state.
        if (code) {
          // Re-check authentication state
          await checkAuth()

          // Redirect to dashboard
          router.push('/dashboard')
        } else {
          // No code means something went wrong
          setError('Authorization code not received. Please try again.')
          setTimeout(() => router.push('/login'), 3000)
        }
      } catch (err) {
        console.error('OAuth callback error:', err)
        setError('An error occurred during authentication. Please try again.')
        setTimeout(() => router.push('/login'), 3000)
      }
    }

    handleCallback()
  }, [searchParams, router, checkAuth])

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
