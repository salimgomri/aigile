import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { isAdminAccessAllowed } from '@/lib/admin'

const ADMIN_COOKIE_NAME = 'aigile.admin'
const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 jours

export async function GET() {
  try {
    const h = await headers()
    const session = await auth.api.getSession({ headers: h })
    const email = session?.user?.email ?? null
    const cookieHeader = h.get('cookie')
    const isAdmin = !!session?.user && isAdminAccessAllowed(email, cookieHeader)

    const res = NextResponse.json({ admin: isAdmin })

    if (isAdmin) {
      res.cookies.set(ADMIN_COOKIE_NAME, '1', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: ADMIN_COOKIE_MAX_AGE,
      })
    } else {
      res.cookies.delete(ADMIN_COOKIE_NAME)
    }

    return res
  } catch {
    return NextResponse.json({ admin: false })
  }
}
