/**
 * Password validation — MUST stay in sync with backend /auth/register validation.
 *
 * When the backend changes its rules, update PASSWORD_RULES and the logic below.
 * If the backend exposes e.g. GET /auth/password-rules, consider loading rules
 * from there instead of duplicating.
 */

export const PASSWORD_RULES = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireDigit: true,
  requireSpecial: true,
  /** At least one character matching this (non-alphanumeric). */
  specialPattern: /[^A-Za-z0-9]/,
} as const

export interface PasswordValidationResult {
  valid: boolean
  errors: string[]
}

function oneUpper(s: string): boolean {
  return /[A-Z]/.test(s)
}

function oneLower(s: string): boolean {
  return /[a-z]/.test(s)
}

function oneDigit(s: string): boolean {
  return /[0-9]/.test(s)
}

function oneSpecial(s: string): boolean {
  return PASSWORD_RULES.specialPattern.test(s)
}

/**
 * Validates password against PASSWORD_RULES. Use this before submit to avoid
 * generic 400 from the backend.
 */
export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = []
  const {
    minLength,
    maxLength,
    requireUppercase,
    requireLowercase,
    requireDigit,
    requireSpecial,
  } = PASSWORD_RULES

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters`)
  }
  if (password.length > maxLength) {
    errors.push(`Password must be no more than ${maxLength} characters`)
  }
  if (requireUppercase && !oneUpper(password)) {
    errors.push('Password must include at least one uppercase letter')
  }
  if (requireLowercase && !oneLower(password)) {
    errors.push('Password must include at least one lowercase letter')
  }
  if (requireDigit && !oneDigit(password)) {
    errors.push('Password must include at least one number')
  }
  if (requireSpecial && !oneSpecial(password)) {
    errors.push('Password must include at least one special character (e.g. !@#$%^&*)')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/** Human-readable requirement strings for the UI. */
export function getPasswordRequirementMessages(): string[] {
  const {
    minLength,
    maxLength,
    requireUppercase,
    requireLowercase,
    requireDigit,
    requireSpecial,
  } = PASSWORD_RULES
  const list: string[] = []
  list.push(`At least ${minLength} characters (max ${maxLength})`)
  if (requireUppercase) list.push('One uppercase letter')
  if (requireLowercase) list.push('One lowercase letter')
  if (requireDigit) list.push('One number')
  if (requireSpecial) list.push('One special character (!@#$%^&* etc.)')
  return list
}

/**
 * Returns which of the static requirements the password satisfies.
 * Used for live hints (e.g. checkmarks) next to each requirement.
 */
export function getPasswordRequirementStatus(password: string): Record<string, boolean> {
  return {
    length: password.length >= PASSWORD_RULES.minLength && password.length <= PASSWORD_RULES.maxLength,
    uppercase: !PASSWORD_RULES.requireUppercase || oneUpper(password),
    lowercase: !PASSWORD_RULES.requireLowercase || oneLower(password),
    digit: !PASSWORD_RULES.requireDigit || oneDigit(password),
    special: !PASSWORD_RULES.requireSpecial || oneSpecial(password),
  }
}
