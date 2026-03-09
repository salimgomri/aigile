import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) return NextResponse.json({ error: 'Non connecté' }, { status: 401 })

    const q = new URL(request.url).searchParams.get('q')?.trim()
    if (!q || q.length < 2) return NextResponse.json({ users: [] })

    const { data } = await supabaseAdmin
      .from('user')
      .select('id, name, email')
      .or(`email.ilike.%${q}%,name.ilike.%${q}%`)
      .limit(10)

    const users = (data ?? []).map((u) => ({
      id: u.id,
      name: u.name || u.email?.split('@')[0] || '—',
      email: u.email ?? '',
    }))

    return NextResponse.json({ users })
  } catch (err) {
    console.error('[API] search-users:', err)
    return NextResponse.json({ error: 'Erreur' }, { status: 500 })
  }
}
