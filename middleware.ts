import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

// Routes that require authentication
const PROTECTED_ROUTES = ['/dashboard', '/create', '/my-polls', '/settings']

// Routes only accessible when NOT logged in
const AUTH_ROUTES = ['/login']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('pollhive_token')?.value

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  )
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))

  if (isProtected) {
    if (!token) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }

    const payload = await verifyToken(token)
    if (!payload) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('from', pathname)
      const response = NextResponse.redirect(loginUrl)
      // Clear invalid token
      response.cookies.delete('pollhive_token')
      return response
    }
  }

  if (isAuthRoute && token) {
    const payload = await verifyToken(token)
    if (payload) {
      // Already logged in — redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/create/:path*',
    '/my-polls/:path*',
    '/settings/:path*',
    '/login',
  ],
}
