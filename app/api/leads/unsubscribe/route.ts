import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('token')
  if (!token) {
    return NextResponse.json({ error: 'Lien invalide' }, { status: 400 })
  }

  const { data } = await supabaseAdmin
    .from('kit_subscribers')
    .select('id, unsubscribed_at')
    .eq('unsubscribe_token', token)
    .maybeSingle()

  if (!data) {
    return NextResponse.json({ error: 'Lien invalide' }, { status: 400 })
  }

  if (!data.unsubscribed_at) {
    await supabaseAdmin
      .from('kit_subscribers')
      .update({ unsubscribed_at: new Date().toISOString() })
      .eq('id', data.id)
  }

  return new NextResponse(
    `<!DOCTYPE html><html lang="fr"><body style="font-family:sans-serif;padding:40px;color:#0f2240;">
<h1>Désinscription confirmée</h1>
<p>Vous ne recevrez plus les e-mails du kit AIgile.</p>
<p><a href="/">Retour à l'accueil</a></p>
</body></html>`,
    {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Robots-Tag': 'noindex, nofollow',
        'Cache-Control': 'no-store',
      },
    },
  )
}
