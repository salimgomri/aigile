import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { getCreditStatus, ensureUserCredits } from '@/lib/credits/manager'

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await ensureUserCredits(session.user.id)
    const status = await getCreditStatus(session.user.id)
    if (!status) {
      return NextResponse.json({ error: 'Credits not found' }, { status: 404 })
    }

    return NextResponse.json(status)
  } catch (err) {
    console.error('[API] credits status error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
