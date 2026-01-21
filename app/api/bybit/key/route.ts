import { NextRequest } from 'next/server'
import { proxyGet, proxyPost } from '@/lib/api/server'

/**
 * GET /api/bybit/key
 * Proxies to backend GET /bybit/key to get Bybit API key status
 */
export async function GET(request: NextRequest) {
  return proxyGet(request, '/bybit/key')
}

/**
 * POST /api/bybit/key
 * Proxies to backend POST /bybit/key to add Bybit API key
 */
export async function POST(request: NextRequest) {
  return proxyPost(request, '/bybit/key')
}
