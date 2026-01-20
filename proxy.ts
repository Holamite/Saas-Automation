import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import axios from 'axios'

/**
 * Proxy to protect routes and handle authentication.
 * Replaces the deprecated middleware convention (Next.js 16+).
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/signup', '/auth/success', '/auth/error']
  const isPublicRoute = publicRoutes.includes(pathname)

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard']
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // If it's a protected route, check authentication
  if (isProtectedRoute) {
    try {
      const cookieHeader = request.headers.get('cookie') || ''

      if (!cookieHeader) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
      }

      // Verify cookies by attempting refresh
      const refreshUrl = `${request.nextUrl.origin}/api/auth/refresh`
      const response = await axios.post(refreshUrl, {}, {
        headers: {
          Cookie: cookieHeader,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
        validateStatus: () => true, // Don't throw on non-2xx status
      })

      if (response.status < 200 || response.status >= 300) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
      }

      return NextResponse.next()
    } catch (error) {
      console.error('Proxy auth check error:', error)
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
