import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware runs ONLY on protected routes (positive matcher).
 * /api/* is never matched → no redirect on get-session, sign-in, etc.
 * Uses direct cookie access (aigile.session_token) — getSessionCookie can return null
 * in Edge even when the user is logged in. See: better-auth#2170
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

const SESSION_COOKIE_NAME = 'aigile.session_token'

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

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)

  if (!sessionCookie?.value) {
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
