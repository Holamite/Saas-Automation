import { NextRequest } from 'next/server'
import { proxyPost } from '@/lib/api/server'

/**
 * POST /api/wallet/withdraw
 * Proxies to backend POST /wallet/withdraw
 * Withdraws funds from wallet (NOT YET IMPLEMENTED IN BACKEND)
 */
export async function POST(request: NextRequest) {
  return proxyPost(request, '/wallet/withdraw')
}
