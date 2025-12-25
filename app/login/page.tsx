'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loading } from '@/components/ui/loading'
import { OAuthButtons } from '@/components/auth/oauth-buttons'
import { FormDivider } from '@/components/auth/form-divider'
import { ErrorAlert } from '@/components/auth/error-alert'
import { BrandHeader } from '@/components/auth/brand-header'
import { Lock, Mail } from 'lucide-react'
import { login } from '@/lib/auth'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/auth-context'
import { useOAuthHandler } from '@/hooks/use-oauth-handler'
import { extractAuthErrorMessage } from '@/lib/utils/error-handling'

export default function Login() {
  const router = useRouter()
  const { isAuthenticated, isLoading, checkAuth, setUser } = useAuth()
  const { handleOAuth } = useOAuthHandler()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isFormLoading, setIsFormLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Redirect if already authenticated (use useEffect to avoid render-time navigation)
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isLoading, isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsFormLoading(true)

    try {
      const response = await login({
        email,
        password,
      })

      // Use response message if available, otherwise use default
      const successMessage = response.message || 'Logged in successfully!'

      // Store user data in sessionStorage for persistence
      if (response.user) {
        setUser(response.user)
      }

      toast({
        title: 'Success',
        description: successMessage,
      })

      router.push('/dashboard')
    } catch (err) {
      const errorMessage = extractAuthErrorMessage(
        err,
        'Failed to login. Please check your credentials and try again.'
      )

      setError(errorMessage)
      toast({
        title: 'Login Failed',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsFormLoading(false)
    }
  }

  if (isLoading) {
    return <Loading />
  }

  if (isAuthenticated) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <BrandHeader subtitle="Automated Trading Platform for Nigeria" />

        <div className="bg-card rounded-lg border border-border p-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h2>
          <p className="text-muted-foreground text-sm mb-6">Sign in to your merchant account</p>

          <OAuthButtons
            onGoogleClick={handleOAuth}
            onAppleClick={() => alert('Apple sign-in coming soon')}
            disabled={isFormLoading}
          />

          <FormDivider />

          <ErrorAlert error={error} />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="email"
                  type="email"
                  placeholder="merchant@example.ng"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  autoComplete="email"
                  aria-describedby={error ? 'email-error' : undefined}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  autoComplete="current-password"
                  aria-describedby={error ? 'password-error' : undefined}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-border" />
                <span className="text-foreground">Remember me</span>
              </label>
              <a href="#" className="text-primary hover:underline">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isFormLoading}
            >
              {isFormLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <button
              onClick={() => router.push('/signup')}
              className="text-primary font-medium cursor-pointer hover:underline"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
