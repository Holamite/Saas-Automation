import { NextRequest } from 'next/server'
import { proxyGet } from '@/lib/api/server'

/**
 * GET /api/users/me
 * Proxies to backend GET /users/me. Requires valid access_token cookie.
 */
export async function GET(request: NextRequest) {
  return proxyGet(request, '/users/me')
}
