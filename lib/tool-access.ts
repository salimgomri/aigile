/**
 * Accès aux outils « gated » : admins, ou liste d’invités (tool_invites), ou public après lancement si invite_only = false.
 */
import { supabaseAdmin } from '@/lib/supabase'
import { isAdminEmail } from '@/lib/admin'
import { getFeatureFlag, isLiveAt } from '@/lib/feature-flags'

function normEmail(email: string) {
  return email.trim().toLowerCase()
}

/** Utilisateur autorisé à voir l’outil complet (après lancement, ou admin en preview). */
export async function canAccessTool(slug: string, email: string | null | undefined): Promise<boolean> {
  if (!email) return false
  if (isAdminEmail(email)) return true
  const row = await getFeatureFlag(slug)
  if (!row) return false
  if (!isLiveAt(row.launch_at)) return false
  const inviteOnly = row.invite_only ?? true
  if (!inviteOnly) return true
  const { data } = await supabaseAdmin
    .from('tool_invites')
    .select('id')
    .eq('tool_slug', slug)
    .eq('email', normEmail(email))
    .maybeSingle()
  return !!data
}
