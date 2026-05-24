'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { CheckInSchema } from '@/lib/okr/checkin-schema'
import { createCheckInRecord, getCheckInsByTeam } from '@/lib/okr/checkin-store'
import { assertTeamMember } from '@/lib/okr/team-access'
import { getFeatureFlag, isLiveAt } from '@/lib/feature-flags'
import { canAccessTool } from '@/lib/tool-access'

async function requireCheckInAccess(teamId: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) {
    return { error: 'Non connecté' as const }
  }

  const flag = await getFeatureFlag('okr_checkin')
  if (!flag || !isLiveAt(flag.launch_at)) {
    return { error: 'Outil indisponible' as const }
  }

  const inviteOnly = flag.invite_only ?? true
  if (
    inviteOnly &&
    !(await canAccessTool('okr_checkin', session.user.email, { userId: session.user.id }))
  ) {
    return { error: 'Accès refusé' as const }
  }

  const member = await assertTeamMember(session.user.id, teamId)
  if (!member) {
    return { error: 'Équipe inaccessible' as const }
  }

  return { userId: session.user.id }
}

export async function createCheckIn(
  teamId: string,
  raw: { sprintId: string; avance: string; frein: string; ajustement: string }
) {
  const access = await requireCheckInAccess(teamId)
  if ('error' in access) {
    return { success: false as const, error: access.error }
  }

  const parsed = CheckInSchema.safeParse(raw)
  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return { success: false as const, error: issue?.message ?? 'Données invalides' }
  }

  const { row, error } = await createCheckInRecord(teamId, access.userId, parsed.data)
  if (!row) {
    return { success: false as const, error: error ?? 'Erreur' }
  }

  revalidatePath(`/dashboard/${teamId}/checkin`)
  revalidatePath(`/dashboard/${teamId}/checkin/${row.id}`)

  return { success: true as const, id: row.id }
}

export async function getCheckInsForTeam(teamId: string) {
  const access = await requireCheckInAccess(teamId)
  if ('error' in access) {
    return { error: access.error, checkIns: [] }
  }

  const checkIns = await getCheckInsByTeam(teamId)
  return { checkIns }
}
