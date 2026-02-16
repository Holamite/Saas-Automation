import { NextRequest } from 'next/server'
import { proxyRequest } from '@/lib/api/server'

type RouteContext = { params: Promise<{ path: string[] }> }

/**
 * Proxies /api/automation/* to backend /automation/*
 * Supports GET, POST, PUT for automation/order/rules, automation/start, automation/stop, etc.
 */
async function handle(
  request: NextRequest,
  context: RouteContext,
  method: 'GET' | 'POST' | 'PUT'
): Promise<Response> {
  const { path } = await context.params
  const pathSegments = Array.isArray(path) ? path : path ? [path] : []
  const backendPath = `/automation/${pathSegments.join('/')}`
  return proxyRequest(request, backendPath, { method })
}

export async function GET(request: NextRequest, context: RouteContext) {
  return handle(request, context, 'GET')
}

export async function POST(request: NextRequest, context: RouteContext) {
  return handle(request, context, 'POST')
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return handle(request, context, 'PUT')
}
