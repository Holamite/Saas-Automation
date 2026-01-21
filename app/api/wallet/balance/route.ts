import { NextRequest } from 'next/server'
import { proxyGet } from '@/lib/api/server'

/**
 * GET /api/wallet/balance
 * Proxies to backend GET /wallet/balance
 * Gets current wallet balance
 */
export async function GET(request: NextRequest) {
  return proxyGet(request, '/wallet/balance')
}
