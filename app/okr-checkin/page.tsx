import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

/** Entrée feature flag `/okr-checkin` → check-in de la première équipe de l'utilisateur */
export default async function OkrCheckinEntryPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    redirect('/login?redirect=%2Fokr-checkin')
  }

  const { data: membership } = await supabaseAdmin
    .from('team_members')
    .select('team_id')
    .eq('user_id', session.user.id)
    .limit(1)
    .maybeSingle()

  if (!membership?.team_id) {
    redirect('/settings/team')
  }

  redirect(`/dashboard/${membership.team_id}/checkin`)
}
