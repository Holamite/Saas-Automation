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
        return
      }

      // Cookies are valid, try to fetch user data
      // First check sessionStorage for cached user
      const storedUser = typeof window !== 'undefined' 
        ? sessionStorage.getItem('auth_user')
        : null

      if (storedUser) {
        try {
          const user = JSON.parse(storedUser)
          setUser(user)
        } catch {
          // Invalid stored data, clear it
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('auth_user')
          }
        }
      }

      // Try to fetch fresh user data from /auth/me endpoint
      try {
        const userResponse = await api.get<User>('/auth/me')
        if (userResponse) {
          setUser(userResponse)
          // Cache user data
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('auth_user', JSON.stringify(userResponse))
          }
        }
      } catch {
        // /auth/me endpoint might not exist, that's okay
        // We'll rely on sessionStorage if available
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
