import { NextRequest } from 'next/server'
import { proxyPost } from '@/lib/api/server'

/**
 * POST /api/subscriptions/initiate
 * Proxies to backend POST /subscriptions/initiate
 * Initiates a subscription with tier and payment method
 */
export async function POST(request: NextRequest) {
  return proxyPost(request, '/subscriptions/initiate')
}
