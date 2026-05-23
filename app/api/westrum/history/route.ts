import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { getLatestWestrumResult, getWestrumHistory } from '@/lib/supabase/westrum'

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user?.id) {
      return NextResponse.json({ history: [], latest: null })
    }

    const [history, latest] = await Promise.all([
      getWestrumHistory(session.user.id),
      getLatestWestrumResult(session.user.id),
    ])

    return NextResponse.json({ history, latest })
  } catch (e) {
    console.error('[api/westrum/history]', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
