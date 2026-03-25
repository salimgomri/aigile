import { NextResponse } from 'next/server'
import { getAuthedUserId, jsonError, mapSessionRow } from '@/lib/scoring/http'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const userId = await getAuthedUserId()
    if (!userId) {
      return jsonError(401, 'AUTH_REQUIRED', 'Authentication required')
    }

    const { data: row, error } = await supabaseAdmin
      .from('scoring_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'draft')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error('[scoring/sessions/draft]:', error)
      return jsonError(500, 'INTERNAL_ERROR', 'Failed to load draft')
    }

    return NextResponse.json({
      session: row ? mapSessionRow(row as Record<string, unknown>) : null,
    })
  } catch (e) {
    console.error('[scoring/sessions/draft] GET:', e)
    return jsonError(500, 'INTERNAL_ERROR', 'Unexpected error')
  }
}
