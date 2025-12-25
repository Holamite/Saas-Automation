'use client'

import { LandingPage } from '@/components/landing/landing-page'
import { Loading } from '@/components/ui/loading'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  // Redirect to dashboard if authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return <Loading />
  }

  if (isAuthenticated) {
    return null // Will redirect
  }

  return (
    <LandingPage
      onGetStarted={() => router.push('/signup')}
      onSignIn={() => router.push('/login')}
    />
  )
}
