import { NextRequest } from 'next/server'
import { proxyDelete } from '@/lib/api/server'

/**
 * DELETE /api/wallet/delete
 * Proxies to backend DELETE /wallet/delete
 * Deletes wallet (NOT YET IMPLEMENTED IN BACKEND)
 */
export async function DELETE(request: NextRequest) {
  return proxyDelete(request, '/wallet/delete')
}
