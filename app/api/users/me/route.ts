import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = (process.env.NEXT_PUBLIC_BASEURL || 'http://localhost:3000').replace(/\/$/, '')

/**
 * GET /api/users/me
 * Proxies to backend GET /users/me. Requires valid access_token cookie.
 */
export async function GET(request: NextRequest) {
  try {
    const res = await fetch(`${BACKEND_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: request.headers.get('cookie') || '',
      },
      credentials: 'include',
    })

    const contentType = res.headers.get('content-type')
    let data: unknown = {}
    if (contentType?.includes('application/json')) {
      try {
        data = await res.json()
      } catch {
        // ignore
      }
    }

    const nextRes = NextResponse.json(data, { status: res.status })

    const setCookies = res.headers.getSetCookie()
    setCookies.forEach((c) => nextRes.headers.append('Set-Cookie', c))

    return nextRes
  } catch (e) {
    console.error('Proxy /users/me error:', e)
    return NextResponse.json(
      { message: 'Internal server error', error: 'Proxy request failed' },
      { status: 500 }
    )
  }
}
