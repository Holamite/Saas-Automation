import { NextRequest } from 'next/server'
import { proxyGet } from '@/lib/api/server'

/**
 * GET /api/wallet/info
 * Proxies to backend GET /wallet/info
 * Gets wallet information
 */
export async function GET(request: NextRequest) {
  return proxyGet(request, '/wallet/info')
}
