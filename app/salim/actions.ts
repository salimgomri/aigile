'use server'

import { redirect } from 'next/navigation'
import {
  createCheckoutSession,
  type SalimCheckoutProduct,
} from '@/lib/payments/create-checkout-session'

function withAddon(formData: FormData): boolean {
  return formData.get('withAddon') === '1'
}

async function startCheckout(product: SalimCheckoutProduct, formData: FormData): Promise<never> {
  const result = await createCheckoutSession(product, { withAddon: withAddon(formData) })
  if ('url' in result) {
    redirect(result.url)
  }
  throw new Error(result.error)
}

export async function checkoutLivre(formData: FormData) {
  return startCheckout('livre', formData)
}

export async function checkoutFiches(formData: FormData) {
  return startCheckout('fiches', formData)
}

export async function checkoutBundle(formData: FormData) {
  return startCheckout('bundle', formData)
}
