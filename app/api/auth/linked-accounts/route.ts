import { NextRequest } from 'next/server'
import { proxyGet } from '@/lib/api/server'

export async function GET(request: NextRequest) {
  return proxyGet(request, '/auth/linked-accounts')
}
