import { NextResponse } from 'next/server'

const BACKEND_URL = (process.env.NEXT_PUBLIC_BASEURL || '').replace(/\/$/, '')

/**
 * GET /api/auth/google
 * Redirects to backend Google OAuth entry. Backend handles flow and
 * redirects to /auth/success or /auth/error?message=...
 */
export async function GET() {
  if (!BACKEND_URL) {
    return NextResponse.json(
      { message: 'OAuth not configured', error: 'NEXT_PUBLIC_BASEURL is not set' },
      { status: 500 }
    )
  }
  return NextResponse.redirect(`${BACKEND_URL}/auth/google`)
}
