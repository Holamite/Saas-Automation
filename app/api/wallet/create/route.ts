import { NextRequest } from 'next/server'
import { proxyPost } from '@/lib/api/server'

/**
 * POST /api/wallet/create
 * Proxies to backend POST /wallet/create
 * Creates a new wallet with BVN verification
 */
export async function POST(request: NextRequest) {
  return proxyPost(request, '/wallet/create')
}
