import type { User } from '@/lib/services/auth'

/**
 * Get display name from user (from GET /users/me or auth responses)
 */
export function getUserDisplayName(user: User | null): string {
  if (!user) return 'User'
  const name = [user.firstname, user.lastname].filter(Boolean).join(' ').trim()
  return name || user.email
}

/**
 * Get user role with fallback to 'USER'
 */
export function getUserRole(user: User | null) {
  console.log('user', user)
  console.log('user?.role', user?.role)
  return user?.role || "MERCHANT"
}

/**
 * Check if user is an admin
 */
export function isAdmin(user: User | null): boolean {
  return user?.role === 'SUPERADMIN'
}


/**
 * Get user initials for avatar display
 */
export function getUserInitials(user: User | null): string {
  if (!user) return 'U'
  
  const firstname = user.firstname?.trim()
  const lastname = user.lastname?.trim()
  
  if (firstname && lastname) {
    return `${firstname[0]}${lastname[0]}`.toUpperCase()
  }
  
  if (firstname) {
    return firstname.slice(0, 2).toUpperCase()
  }
  
  if (user.email) {
    return user.email.slice(0, 2).toUpperCase()
  }
  
  return 'U'
}
