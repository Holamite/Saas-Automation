import { NextRequest } from 'next/server'
import { proxyGet } from '@/lib/api/server'

/**
 * GET /api/subscriptions/status
 * Proxies to backend GET /subscriptions/status
 * Gets subscription status and volume capacity
 */
export async function GET(request: NextRequest) {
  return proxyGet(request, '/subscriptions/status')
}
