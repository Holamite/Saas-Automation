'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api-client'
import type { User, Account } from '@/lib/auth'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  checkAuth: () => Promise<void>
  logout: () => Promise<void>
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const checkAuth = useCallback(async () => {
    setIsLoading(true)
    try {
      // Since /auth/me doesn't exist, we use sessionStorage for persistence
      // First, verify cookies are valid by attempting refresh
      const refreshResponse = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!refreshResponse.ok) {
        // Cookies invalid, clear storage and state
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('auth_user')
        }
        setUser(null)
        setIsLoading(false)
        return
      }

      // Cookies are valid, try to get user data
      // First check sessionStorage for cached user (from login/register responses)
      let userData: User | null = null
      const storedUser = typeof window !== 'undefined' 
        ? sessionStorage.getItem('auth_user')
        : null

      if (storedUser) {
        try {
          userData = JSON.parse(storedUser)
        } catch {
          // Invalid stored data, clear it
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('auth_user')
          }
        }
      }

      // If no user in storage but cookies are valid (e.g., after OAuth),
      // try to get user info from linked accounts or use a minimal user object
      // For now, we'll set a minimal user if we have valid cookies but no stored user
      // The actual user data will be populated on next login/register
      if (!userData) {
        // After OAuth, we might not have user data yet
        // Try to fetch linked accounts to verify session
        try {
          const linkedAccountsResponse = await api.get<Account[]>('/auth/linked-accounts')
          if (linkedAccountsResponse && Array.isArray(linkedAccountsResponse)) {
            // We have valid session but no user data
            // Create a minimal user object - this will be updated on next full auth
            // For OAuth flow, the backend should have set user data, but if not,
            // we'll rely on the fact that cookies are valid
            userData = {
              id: 'temp',
              email: '',
              name: '',
              role: 'user',
              businessName: null,
              accounts: linkedAccountsResponse.map(acc => ({
                provider: acc.provider,
                linkedAt: acc.linkedAt,
              })),
            }
          }
        } catch {
          // Linked accounts failed, but cookies are valid
          // This might happen right after OAuth before user data is fully set
          // We'll set a minimal user to prevent redirect loop
          userData = {
            id: 'temp',
            email: '',
            name: '',
            role: 'user',
            businessName: null,
            accounts: [],
          }
        }
      } else {
        // We have stored user, optionally fetch fresh linked accounts
        try {
          const linkedAccountsResponse = await api.get<Account[]>('/auth/linked-accounts')
          if (linkedAccountsResponse && Array.isArray(linkedAccountsResponse)) {
            // Update user with fresh linked accounts data
            userData = {
              ...userData,
              accounts: linkedAccountsResponse.map(acc => ({
                provider: acc.provider,
                linkedAt: acc.linkedAt,
              })),
            }
          }
        } catch {
          // Linked accounts endpoint might fail, that's okay
          // We'll use the cached user data
        }
      }

      // Set user data if we have it
      if (userData) {
        setUser(userData)
        // Cache user data
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('auth_user', JSON.stringify(userData))
        }
      } else {
        // No user data available, clear state
        setUser(null)
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('auth_user')
        }
      }
    } catch (error) {
      // Error checking auth, clear state
      console.error('Auth check error:', error)
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('auth_user')
      }
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout', undefined, { skipRefresh: true })
    } catch (error) {
      // Log error but continue with logout
      console.error('Logout error:', error)
    } finally {
      // Always clear frontend state and storage, even if logout request fails
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('auth_user')
      }
      setUser(null)
      setIsLoading(false)
      router.push('/')
    }
  }, [router])

  // Check auth on mount
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // Helper to update user and persist to sessionStorage
  const updateUser = useCallback((newUser: User | null) => {
    setUser(newUser)
    if (typeof window !== 'undefined') {
      if (newUser) {
        sessionStorage.setItem('auth_user', JSON.stringify(newUser))
      } else {
        sessionStorage.removeItem('auth_user')
      }
    }
  }, [])

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    checkAuth,
    logout,
    setUser: updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
