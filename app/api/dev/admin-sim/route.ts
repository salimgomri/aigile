import { NextResponse, type NextRequest } from 'next/server'
import { DEV_ADMIN_SIM_COOKIE_NAME } from '@/lib/admin'
import { isAigileDevAdminSimEnabled } from '@/lib/dev-admin-sim-toggle-env'
import { isHostHeaderLocalDev } from '@/lib/dev-local-host'

const ADMIN_COOKIE_NAME = 'aigile.admin'

function assertDevLocalhost(req: NextRequest): NextResponse | null {
  if (!isAigileDevAdminSimEnabled()) {
    return NextResponse.json({ error: 'Not available' }, { status: 404 })
  }
  if (!isHostHeaderLocalDev(req.headers.get('host'))) {
    return NextResponse.json({ error: 'localhost only' }, { status: 403 })
  }
  return null
}

export async function POST(req: NextRequest) {
  const denied = assertDevLocalhost(req)
  if (denied) return denied

  let simulate = false
  try {
    const body = (await req.json()) as { simulate?: boolean }
    simulate = !!body.simulate
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const res = NextResponse.json({ ok: true, simulate })

  if (simulate) {
    res.cookies.set(DEV_ADMIN_SIM_COOKIE_NAME, '1', {
      path: '/',
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    })
    res.cookies.set(ADMIN_COOKIE_NAME, '1', {
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    })
  } else {
    res.cookies.delete(DEV_ADMIN_SIM_COOKIE_NAME)
    res.cookies.delete(ADMIN_COOKIE_NAME)
  }

  return res
}
