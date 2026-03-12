import { NextResponse } from 'next/server'
import { getProduct } from '@/lib/payments/catalog'

export async function GET() {
  const credits = getProduct('credits_10')
  const dayPass = getProduct('day_pass')
  const proMonthly = getProduct('pro_monthly')
  const proAnnual = getProduct('pro_annual')

  return NextResponse.json({
    credits_10: credits,
    day_pass: dayPass,
    pro_monthly: proMonthly,
    pro_annual: proAnnual,
  })
}
