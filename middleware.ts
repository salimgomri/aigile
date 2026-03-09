import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Public routes that don't require authentication
const publicRoutes = ['/', '/manifesto', '/login', '/register', '/welcome', '/api/auth']

// Routes that allow one free generation without account
const freeTrialRoutes = ['/retro']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }
  
  // Check for session cookie
  const sessionCookie = request.cookies.get('aigile-session')
  
  // Allow free trial on specific routes (track by IP or cookie)
  if (freeTrialRoutes.some(route => pathname.startsWith(route))) {
    if (!sessionCookie) {
      // Allow access but limit features (handled in the page component)
      return NextResponse.next()
    }
  }
  
  // Redirect to login if no session
  if (!sessionCookie) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (*.png, *.jpg, *.svg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
