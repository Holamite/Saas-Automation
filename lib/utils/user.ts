import type { User } from '@/lib/services/auth'

/**
 * Get display name from user (from GET /users/me or auth responses)
 */
export function getUserDisplayName(user: User | null): string {
  if (!user) return 'User'
  const name = [user.firstname, user.lastname].filter(Boolean).join(' ').trim()
  return name || user.email
}
