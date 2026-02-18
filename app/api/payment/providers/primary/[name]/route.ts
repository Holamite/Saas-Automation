import { NextRequest } from 'next/server'
import { proxyPost } from '@/lib/api/server'

type RouteContext = { params: Promise<{ name: string }> }

/**
 * POST /api/payment/providers/primary/:name
 * Proxies to backend POST /payment/providers/primary/:name to set primary provider
 */
export async function POST(request: NextRequest, context: RouteContext) {
  const { name } = await context.params
  return proxyPost(request, `/payment/providers/primary/${name}`)
}

