import { NextRequest } from 'next/server'
import { proxyGet, proxyPost, proxyPut } from '@/lib/api/server'

type RouteContext = { params: Promise<{ name: string }> }

/**
 * GET /api/payment/providers/:name
 * Proxies to backend GET /payment/providers/:name
 */
export async function GET(request: NextRequest, context: RouteContext) {
  const { name } = await context.params
  return proxyGet(request, `/payment/providers/${name}`)
}

/**
 * POST /api/payment/providers/:name
 * Proxies to backend POST /payment/providers/:name
 */
export async function POST(request: NextRequest, context: RouteContext) {
  const { name } = await context.params
  return proxyPost(request, `/payment/providers/${name}`)
}

/**
 * PUT /api/payment/providers/:name
 * Proxies to backend PUT /payment/providers/:name
 */
export async function PUT(request: NextRequest, context: RouteContext) {
  const { name } = await context.params
  return proxyPut(request, `/payment/providers/${name}`)
}

