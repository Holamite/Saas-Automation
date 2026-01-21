import { NextRequest } from 'next/server'
import { proxyGet } from '@/lib/api/server'

/**
 * GET /api/wallet/transactions
 * Proxies to backend GET /wallet/transactions
 * Gets wallet transactions (NOT YET IMPLEMENTED IN BACKEND)
 */
export async function GET(request: NextRequest) {
  return proxyGet(request, '/wallet/transactions')
}
