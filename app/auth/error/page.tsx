'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function AuthError() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [errorMessage, setErrorMessage] = useState<string>('Authentication failed')

  useEffect(() => {
    // Get error message from URL query parameter
    const message = searchParams.get('message')
    if (message) {
      // Decode the message if it's URL encoded
      setErrorMessage(decodeURIComponent(message))
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card rounded-lg border border-border p-8 text-center">
        <div className="flex justify-center mb-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Authentication Error</h2>
        <p className="text-muted-foreground mb-6">{errorMessage}</p>
        <div className="flex flex-col gap-3">
          <Button
            onClick={() => router.push('/login')}
            className="w-full"
          >
            Return to Login
          </Button>
        </div>
      </div>
    </div>
  )
}
