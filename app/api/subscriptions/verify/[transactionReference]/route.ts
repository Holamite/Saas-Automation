import { NextRequest } from 'next/server'
import { proxyGet } from '@/lib/api/server'

/**
 * GET /api/subscriptions/verify/:transactionReference
 * Proxies to backend GET /subscriptions/verify/:transactionReference
 * Verifies subscription payment
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { transactionReference: string } }
) {
  return proxyGet(request, `/subscriptions/verify/${params.transactionReference}`)
}
