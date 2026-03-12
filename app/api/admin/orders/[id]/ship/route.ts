import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { isAdminEmail } from '@/lib/admin'
import { supabaseAdmin } from '@/lib/supabase'
import { sendShippingNotificationEmail } from '@/lib/emails/shipping-notification'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || !isAdminEmail(session.user.email)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  const { id } = await params
  const body = await request.json()
  const { trackingNumber, fulfillmentRef, notes } = body as {
    trackingNumber?: string
    fulfillmentRef?: string
    notes?: string
  }

  const { data: order, error: fetchError } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !order) {
    return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 })
  }

  if (order.product_type !== 'book_physical') {
    return NextResponse.json({ error: 'Action réservée aux commandes livre' }, { status: 400 })
  }

  if (order.status === 'shipped') {
    return NextResponse.json({ error: 'Déjà expédiée' }, { status: 400 })
  }

  const updates: Record<string, unknown> = {
    status: 'shipped',
    shipped_at: new Date().toISOString(),
  }
  if (trackingNumber) updates.tracking_number = trackingNumber
  if (fulfillmentRef) updates.fulfillment_ref = fulfillmentRef
  if (notes !== undefined) updates.notes = notes

  const { data: updated, error: updateError } = await supabaseAdmin
    .from('orders')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (updateError) {
    console.error('[API] admin order ship error:', updateError)
    return NextResponse.json({ error: 'Erreur' }, { status: 500 })
  }

  if (trackingNumber && order.buyer_email) {
    await sendShippingNotificationEmail({
      to: order.buyer_email,
      buyerName: order.buyer_name || order.buyer_email.split('@')[0],
      productTitle: order.product_title,
      trackingNumber,
    })
  }

  return NextResponse.json(updated)
}
