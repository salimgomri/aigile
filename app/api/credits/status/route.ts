import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { hasDevLocalAdminSimCookie } from '@/lib/admin'
import { getCreditStatus, ensureUserCredits } from '@/lib/credits/manager'

export async function GET() {
  try {
    const h = await headers()
    const session = await auth.api.getSession({ headers: h })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await ensureUserCredits(session.user.id)
    const status = await getCreditStatus(session.user.id)
    if (!status) {
      return NextResponse.json({ error: 'Credits not found' }, { status: 404 })
    }

    const cookieHeader = h.get('cookie')
    const merged = {
      ...status,
      isAdmin: !!(status.isAdmin || hasDevLocalAdminSimCookie(cookieHeader)),
    }

    return NextResponse.json(merged)
  } catch (err) {
    console.error('[API] credits status error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
