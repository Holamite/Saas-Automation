'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api-client'
import type { User } from '@/lib/auth'

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
    try {
      // Since /auth/me doesn't exist, we use sessionStorage for persistence
      // and verify cookies by attempting a refresh
      const storedUser = typeof window !== 'undefined' 
        ? sessionStorage.getItem('auth_user')
        : null

      if (storedUser) {
        try {
          const user = JSON.parse(storedUser)
          // Verify cookies are still valid by attempting refresh
          // Use API proxy route to avoid CORS issues
          const refreshResponse = await fetch('/api/auth/refresh', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          })

          if (refreshResponse.ok) {
            // Cookies are valid, restore user from storage
            setUser(user)
          } else {
            // Cookies invalid, clear storage
            if (typeof window !== 'undefined') {
              sessionStorage.removeItem('auth_user')
            }
            setUser(null)
          }
        } catch {
          // Invalid stored data or refresh failed, clear storage
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('auth_user')
          }
          setUser(null)
        }
      } else {
        // No stored user, not authenticated
        setUser(null)
      }
    } catch (error) {
      // Error checking auth, clear state
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
