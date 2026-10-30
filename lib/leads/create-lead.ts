import { supabaseAdmin } from '@/lib/supabase'
import { sendLeadNotifyEmail } from '@/lib/emails/kit-welcome'
import type { Utm } from '@/lib/leads/utm'
import { type LeadStatus } from '@/lib/leads/status'

export type { LeadStatus }
export { LEAD_STATUSES } from '@/lib/leads/status'

export type LeadType = 'diagnostic' | 'formation'

export type LeadInput = {
  type: LeadType
  name?: string
  email: string
  company?: string
  role?: string
  motif?: string
  formation_slug?: string
  people_count?: string
  period?: string
  format?: string
  message?: string
  source?: string
  utm?: Utm
  from_param?: string
  consent_text: string
}

export async function insertLead(input: LeadInput) {
  const row = {
    type: input.type,
    name: input.name || null,
    email: input.email.trim().toLowerCase(),
    company: input.company || null,
    role: input.role || null,
    motif: input.motif || null,
    formation_slug: input.formation_slug || null,
    people_count: input.people_count || null,
    period: input.period || null,
    format: input.format || null,
    message: input.message || null,
    source: input.source || null,
    utm: input.utm || {},
    from_param: input.from_param || null,
    status: 'nouveau' as LeadStatus,
    consent_at: new Date().toISOString(),
    consent_text: input.consent_text,
  }

  const { data, error } = await supabaseAdmin.from('leads').insert(row).select('id').maybeSingle()
  if (error) throw new Error(error.message)

  await sendLeadNotifyEmail({
    subject: `Nouvelle demande ${input.type} — ${row.email}`,
    html: `<p>Type : ${input.type}</p>
<p>Nom : ${row.name ?? '—'}</p>
<p>Email : ${row.email}</p>
<p>Entreprise : ${row.company ?? '—'}</p>
<p>Rôle : ${row.role ?? '—'}</p>
<p>Motif : ${row.motif ?? '—'}</p>
<p>Source : ${row.source ?? '—'} / ${row.from_param ?? '—'}</p>
<p>Message :<br/>${(row.message ?? '').replace(/\n/g, '<br/>')}</p>`,
  }).catch((err) => console.warn('[leads] notify failed', err))

  return data?.id as string | undefined
}
