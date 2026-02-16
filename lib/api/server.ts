/**
 * Server-side Axios utility for Next.js API routes
 * Handles cookie forwarding between client and backend
 */

import axios, { AxiosRequestConfig } from 'axios'
import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = (process.env.NEXT_PUBLIC_BASEURL || 'http://localhost:3000').replace(/\/$/, '')

interface ProxyOptions {
  method?: string
  headers?: Record<string, string>
  data?: unknown
  forwardCookies?: boolean
  forwardSetCookies?: boolean
}

/**
 * Proxies a request to the backend and forwards cookies
 * @param request - Next.js request object
 * @param backendPath - Backend endpoint path (e.g., '/auth/login')
 * @param options - Proxy request options
 * @returns NextResponse with forwarded cookies
 */
export async function proxyRequest(
  request: NextRequest,
  backendPath: string,
  options: ProxyOptions = {}
): Promise<NextResponse> {
  const {
    method,
    headers: customHeaders = {},
    data: customData,
    forwardCookies = true,
    forwardSetCookies = true,
  } = options

  try {
    const url = `${BACKEND_URL}${backendPath}`
    
    // Build headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders,
    }

    // Forward cookies from incoming request
    if (forwardCookies) {
      const cookieHeader = request.headers.get('cookie')
      if (cookieHeader) {
        headers['Cookie'] = cookieHeader
      }
    }

    // Parse body if present and not already provided
    let data = customData
    if (!data && request.body && (request.method === 'POST' || request.method === 'PUT' || request.method === 'PATCH')) {
      try {
        data = await request.json()
      } catch {
        // Body already consumed or not JSON
      }
    }

    // Make request to backend
    const axiosConfig: AxiosRequestConfig = {
      url,
      method: method || request.method,
      headers,
      data,
      withCredentials: true,
      validateStatus: () => true, // Don't throw on any status
    }

    const response = await axios(axiosConfig)

    // Create Next.js response
    const nextResponse = NextResponse.json(response.data || {}, { status: response.status })

    // Forward Set-Cookie headers from backend to client
    if (forwardSetCookies && response.headers['set-cookie']) {
      const setCookies = Array.isArray(response.headers['set-cookie'])
        ? response.headers['set-cookie']
        : [response.headers['set-cookie']]
      
      setCookies.forEach((cookie: string) => {
        nextResponse.headers.append('Set-Cookie', cookie)
      })
    }

    return nextResponse
  } catch (error) {
    console.error('Proxy request error:', error)
    return NextResponse.json(
      { message: 'Internal server error', error: 'Proxy request failed' },
      { status: 500 }
    )
  }
}

/**
 * Simple GET proxy helper
 */
export async function proxyGet(request: NextRequest, backendPath: string): Promise<NextResponse> {
  return proxyRequest(request, backendPath, { method: 'GET' })
}

/**
 * Simple POST proxy helper
 */
export async function proxyPost(request: NextRequest, backendPath: string): Promise<NextResponse> {
  return proxyRequest(request, backendPath, { method: 'POST' })
}

/**
 * Simple PUT proxy helper
 */
export async function proxyPut(request: NextRequest, backendPath: string): Promise<NextResponse> {
  return proxyRequest(request, backendPath, { method: 'PUT' })
}

/**
 * Simple DELETE proxy helper
 */
export async function proxyDelete(request: NextRequest, backendPath: string): Promise<NextResponse> {
  return proxyRequest(request, backendPath, { method: 'DELETE' })
}
