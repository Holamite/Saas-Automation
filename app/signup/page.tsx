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
import { Mail, Lock, User, Building } from 'lucide-react'
import { signup } from '@/lib/auth'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/auth-context'
import { useOAuthHandler } from '@/hooks/use-oauth-handler'
import { extractErrorMessage } from '@/lib/utils/error-handling'

const MIN_PASSWORD_LENGTH = 8

export default function Signup() {
  const router = useRouter()
  const { isAuthenticated, isLoading, checkAuth, setUser } = useAuth()
  const { handleOAuth } = useOAuthHandler()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isFormLoading, setIsFormLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Redirect if already authenticated (use useEffect to avoid render-time navigation)
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isLoading, isAuthenticated, router])

  const validateForm = (): string | null => {
    if (password !== confirmPassword) {
      return 'Passwords do not match'
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      return `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      toast({
        title: 'Validation Error',
        description: validationError,
        variant: 'destructive',
      })
      return
    }

    setIsFormLoading(true)

    try {
      // Combine firstName and lastName into name field (backend contract)
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim()
      
      if (!fullName) {
        setError('First name and last name are required')
        toast({
          title: 'Validation Error',
          description: 'First name and last name are required',
          variant: 'destructive',
        })
        setIsFormLoading(false)
        return
      }

      const response = await signup({
        name: fullName,
        email,
        password,
        businessName: businessName.trim() || undefined,
      })

      // Use response message if available, otherwise use default
      const successMessage = response.message || 'Account created successfully!'

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
      const errorMessage = extractErrorMessage(err, 'Failed to create account. Please try again.')

      setError(errorMessage)
      toast({
        title: 'Signup Failed',
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
        <BrandHeader subtitle="Join the Nigerian trading revolution" />

        <div className="bg-card rounded-lg border border-border p-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Create Merchant Account</h2>
          <p className="text-muted-foreground text-sm mb-6">Start automating your Bybit trades today</p>

          <OAuthButtons
            onGoogleClick={handleOAuth}
            onAppleClick={() => alert('Apple sign-in coming soon')}
            disabled={isFormLoading}
            googleVariant="tertiary"
          />

          <FormDivider />

          <ErrorAlert error={error} />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" aria-hidden="true" />
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Olamide"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="pl-10"
                    required
                    autoComplete="given-name"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" aria-hidden="true" />
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Adebara"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="pl-10"
                    required
                    autoComplete="family-name"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-foreground mb-2">
                Business Name <span className="text-muted-foreground text-xs">(Optional)</span>
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="businessName"
                  type="text"
                  placeholder="Your business name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="pl-10"
                  autoComplete="organization"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.ng"
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
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  autoComplete="new-password"
                  aria-describedby={error ? 'password-error' : undefined}
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  required
                  autoComplete="new-password"
                  aria-describedby={error ? 'confirm-password-error' : undefined}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <input type="checkbox" id="terms" className="rounded border-border" required />
              <label htmlFor="terms" className="text-muted-foreground cursor-pointer">
                I agree to the{' '}
                <a href="#" className="text-primary hover:underline">
                  Terms of Service
                </a>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isFormLoading}
            >
              {isFormLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <button
              onClick={() => router.push('/login')}
              className="text-primary font-medium cursor-pointer hover:underline"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
