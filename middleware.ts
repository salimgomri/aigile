import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware runs ONLY on protected routes (positive matcher).
 * /api/* is never matched → no redirect on get-session, sign-in, etc.
 * Uses direct cookie access (aigile.session_token ou __Secure-aigile.session_token en prod).
 *
 * Lancement: /niko-niko et /dora redirigés vers /dashboard (outils en "Bientôt")
 */
const PROTECTED_ROUTES = [
  '/dashboard',
  '/dora',
  '/niko-niko',
  '/onboarding',
  '/join',
  '/settings',
  '/start-scrum',
  '/welcome',
]

const COMING_SOON_REDIRECT = ['/niko-niko', '/dora']
const ADMIN_COOKIE_NAME = 'aigile.admin'

// En prod (useSecureCookies), Better Auth préfixe avec __Secure-
const SESSION_COOKIE_NAMES = ['aigile.session_token', '__Secure-aigile.session_token'] as const

function getSessionCookie(request: NextRequest): string | undefined {
  for (const name of SESSION_COOKIE_NAMES) {
    const value = request.cookies.get(name)?.value
    if (value) return value
  }
  return undefined
}

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'))
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!isProtectedRoute(pathname)) {
    return NextResponse.next()
  }

  // Lancement: rediriger niko-niko et dora vers dashboard (sauf si admin)
  const isAdmin = !!request.cookies.get(ADMIN_COOKIE_NAME)?.value
  if (!isAdmin && COMING_SOON_REDIRECT.some(r => pathname === r || pathname.startsWith(r + '/'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  const sessionToken = getSessionCookie(request)

  if (!sessionToken) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/dora/:path*',
    '/niko-niko/:path*',
    '/onboarding/:path*',
    '/join/:path*',
    '/settings/:path*',
    '/start-scrum/:path*',
    '/welcome/:path*',
  ],
}
