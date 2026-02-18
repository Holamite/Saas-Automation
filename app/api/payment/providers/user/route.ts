import { NextRequest } from 'next/server'
import { proxyGet } from '@/lib/api/server'

/**
 * GET /api/payment/providers/user
 * Proxies to backend GET /payment/providers/user to fetch all providers for the current user
 */
export async function GET(request: NextRequest) {
  return proxyGet(request, '/payment/providers/user')
}

