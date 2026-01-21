import { NextRequest } from 'next/server'
import { proxyDelete } from '@/lib/api/server'

/**
 * DELETE /api/bybit/remove-key
 * Proxies to backend DELETE /bybit/remove-key to remove Bybit API key
 */
export async function DELETE(request: NextRequest) {
  return proxyDelete(request, '/bybit/remove-key')
}
