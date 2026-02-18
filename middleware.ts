import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }

  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      cookieName: process.env.NODE_ENV === 'production'
        ? '__Secure-next-auth.session-token'
        : 'next-auth.session-token'
    })

    const isAuthenticated = !!token
    const isAdmin = token?.role === 'ADMIN'
    const type = request.nextUrl.searchParams.get('type')

    // Handle admin routes
    if (pathname.startsWith('/admin')) {
      if (!isAuthenticated || !isAdmin) {
        const url = new URL('/auth/login', request.url)
        url.searchParams.set('type', 'admin')
        url.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(url)
      }
      return NextResponse.next()
    }

    // Handle account/checkout routes
    if (pathname.startsWith('/account') || pathname.startsWith('/checkout')) {
      if (!isAuthenticated || isAdmin) {
        const url = new URL('/auth/login', request.url)
        url.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(url)
      }
      return NextResponse.next()
    }

    // Handle auth routes
    if (pathname.startsWith('/auth')) {
      if (isAuthenticated) {
        if (type === 'admin' && isAdmin) {
          return NextResponse.redirect(new URL('/admin', request.url))
        }
        if (!type && !isAdmin) {
          return NextResponse.redirect(new URL('/account', request.url))
        }
      }
      return NextResponse.next()
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.next()
  }
}

// Routes where middleware applies
export const config = {
  matcher: [
    '/account/:path*',
    '/checkout/:path*',
    '/admin/:path*',
    '/auth/:path*'
  ],
}
