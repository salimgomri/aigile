import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase'
import { PATTERNS, type PatternCode } from '@/lib/retro/patterns'

const VALID_CODES = ['P1', 'P2', 'P3', 'P4', 'P5', 'PA', 'PB', 'PC', 'PD'] as const

/** Retourne le pattern uniquement si l'utilisateur a consommé retro_ai_plan ou retro_random récemment (1h) */
export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code') as PatternCode | null

    if (!code || !VALID_CODES.includes(code)) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
    }

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()

    const { data: tx } = await supabaseAdmin
      .from('credit_transactions')
      .select('id')
      .eq('user_id', session.user.id)
      .in('action', ['retro_ai_plan', 'retro_random'])
      .gte('created_at', oneHourAgo)
      .limit(1)
      .maybeSingle()

    if (!tx?.id) {
      return NextResponse.json({ error: 'No recent retro consumption' }, { status: 403 })
    }

    const pattern = PATTERNS[code]
    return NextResponse.json({
      name: pattern.name,
      nameFr: pattern.nameFr,
      description: pattern.description,
      descriptionFr: pattern.descriptionFr,
    })
  } catch (err) {
    console.error('[API] retro pattern error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
