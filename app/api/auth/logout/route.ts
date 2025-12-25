import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_BASEURL || 'http://localhost:3000'

export async function POST(request: NextRequest) {
  try {
    // Forward request to backend
    const response = await fetch(`${BACKEND_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Forward cookies from the incoming request
        Cookie: request.headers.get('cookie') || '',
      },
      credentials: 'include',
    })

    const data = response.ok ? await response.json().catch(() => ({})) : {}

    // Create response with same status
    const nextResponse = NextResponse.json(data, { status: response.status })

    // Forward Set-Cookie headers from backend to client (for clearing cookies)
    const setCookieHeaders = response.headers.getSetCookie()
    setCookieHeaders.forEach((cookie) => {
      nextResponse.headers.append('Set-Cookie', cookie)
    })

    return nextResponse
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { message: 'Internal server error', error: 'Proxy request failed' },
      { status: 500 }
    )
  }
}

