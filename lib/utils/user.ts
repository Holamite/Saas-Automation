import type { User } from '@/lib/auth'

/**
 * Get display name from user object
 * Uses the `name` field from backend response contract
 */
export function getUserDisplayName(user: User | null): string {
  if (!user) {
    return 'User'
  }

  // Backend provides `name` field, use it directly
  return user.name || user.email
}
