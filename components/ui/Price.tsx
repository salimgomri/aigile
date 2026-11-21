import { VAT_MENTION } from '@/lib/site-facts'

type PriceAudience = 'b2b' | 'b2c'

type PriceProps = {
  /** Montant déjà formaté (ex. « 2 000 € ») ou nombre en euros */
  amount: string | number
  audience: PriceAudience
  className?: string
  /** Masquer la mention TVA (déjà en note de section) */
  hideVat?: boolean
}

function formatAmount(amount: string | number, audience: PriceAudience): string {
  if (typeof amount === 'number') {
    const formatted = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount)
    return audience === 'b2b' ? formatted.replace('€', '€ HT').replace(/\s+HT/, ' € HT') : formatted
  }
  return amount
}

/**
 * Affichage des prix — franchise de TVA, cohérent partout.
 * B2B : « 2 000 € HT » + mention 293 B.
 * B2C : « 19 € (TVA non applicable) ».
 */
export function Price({ amount, audience, className = '', hideVat = false }: PriceProps) {
  const label = formatAmount(amount, audience)

  if (audience === 'b2b') {
    return (
      <span className={className}>
        <span>{label.includes('HT') ? label : `${label} HT`}</span>
        {!hideVat ? <span className="block text-xs text-gray-500 mt-1">{VAT_MENTION}</span> : null}
      </span>
    )
  }

  return (
    <span className={className}>
      {label.includes('TVA') ? label : `${label} (TVA non applicable)`}
    </span>
  )
}
