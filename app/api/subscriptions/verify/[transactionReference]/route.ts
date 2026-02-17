import { NextRequest } from 'next/server'
import { proxyGet } from '@/lib/api/server'

type RouteContext = { params: Promise<{ transactionReference: string }> }

/**
 * GET /api/subscriptions/verify/:transactionReference
 * Proxies to backend GET /subscriptions/verify/:transactionReference
 * Verifies subscription payment
 */
export async function GET(request: NextRequest, context: RouteContext) {
  const { transactionReference } = await context.params
  return proxyGet(request, `/subscriptions/verify/${transactionReference}`)
}
