import { supabaseAdmin } from '@/lib/supabase'

const MASTER_KEY = 'master'
const CRITICAL_THRESHOLD = 98

export type IntelligencePulsePayload = {
  critical: boolean
  vitalityScore: number | null
}

/** Démo locale : définir INTEL_VITALITY_DEMO_CRITICAL=1 pour forcer le mode pulsation sans ligne en base. */
export async function getIntelligencePulsePayload(): Promise<IntelligencePulsePayload> {
  if (process.env.INTEL_VITALITY_DEMO_CRITICAL === '1') {
    return { critical: true, vitalityScore: 99 }
  }

  const { data, error } = await supabaseAdmin
    .from('intel_master_signals')
    .select('vitality_score, read_at')
    .eq('source_key', MASTER_KEY)
    .maybeSingle()

  if (error) {
    console.error('[intelligence-pulse]', error.message)
    return { critical: false, vitalityScore: null }
  }

  if (!data) {
    return { critical: false, vitalityScore: null }
  }

  const unread = data.read_at == null
  const score = Number(data.vitality_score)
  const critical = unread && score > CRITICAL_THRESHOLD

  return { critical, vitalityScore: Number.isFinite(score) ? score : null }
}

export async function acknowledgeMasterIntelSignal(): Promise<void> {
  const now = new Date().toISOString()
  await supabaseAdmin
    .from('intel_master_signals')
    .update({ read_at: now, updated_at: now })
    .eq('source_key', MASTER_KEY)
    .is('read_at', null)
}
