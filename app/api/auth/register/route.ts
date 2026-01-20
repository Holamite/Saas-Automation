import { NextRequest } from 'next/server'
import { proxyPost } from '@/lib/api/server'

export async function POST(request: NextRequest) {
  return proxyPost(request, '/auth/register')
}
