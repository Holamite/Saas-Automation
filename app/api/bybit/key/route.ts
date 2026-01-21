import { NextRequest } from 'next/server'
import { proxyPost } from '@/lib/api/server'

/**
 * POST /api/bybit/key
 * Proxies to backend POST /bybit/key to add Bybit API key
 */
export async function POST(request: NextRequest) {
  return proxyPost(request, '/bybit/key')
}
