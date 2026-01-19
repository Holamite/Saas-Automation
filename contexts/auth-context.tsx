'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useRouter } from 'next/navigation'
import {
  getCurrentUser,
  login as loginService,
  logout as logoutService,
  register as registerService,
} from '@/lib/services/auth'
import type { LoginData, SignupData, User } from '@/lib/services/auth'

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (data: LoginData) => Promise<void>
  register: (data: SignupData) => Promise<void>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const refreshSession = useCallback(async () => {
    setIsLoading(true)
    try {
      const u = await getCurrentUser()
      setUser(u)
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = useCallback(
    async (data: LoginData) => {
      await loginService(data)
      await refreshSession()
    },
    [refreshSession]
  )

  const register = useCallback(
    async (data: SignupData) => {
      await registerService(data)
      await refreshSession()
    },
    [refreshSession]
  )

  const logout = useCallback(async () => {
    await logoutService()
    setUser(null)
    setIsLoading(false)
    router.push('/login')
  }, [router])

  useEffect(() => {
    refreshSession()
  }, [refreshSession])

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshSession,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (ctx === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
