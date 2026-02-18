import { NextRequest } from 'next/server'
import { proxyGet } from '@/lib/api/server'

/**
 * GET /api/payment/providers/primary
 * Proxies to backend GET /payment/providers/primary to fetch the primary provider
 */
export async function GET(request: NextRequest) {
  return proxyGet(request, '/payment/providers/primary')
}

