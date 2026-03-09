/**
 * Envoie un email de test avec le template AIgile
 * Usage: npx tsx scripts/send-test-email.ts
 */
import { config } from 'dotenv'

config({ path: '.env.local' })

// --fallback : utiliser onboarding@resend.dev (domaine non vérifié)
if (process.argv.includes('--fallback')) {
  process.env.RESEND_FROM_EMAIL = 'AIgile <onboarding@resend.dev>'
}

async function main() {
  const { sendVerificationEmail } = await import('../lib/email')

  const useFallback = process.argv.includes('--fallback')
  const to = useFallback
    ? 'salim.aigile.off@gmail.com'
    : process.argv.find((a) => !a.startsWith('-') && a.includes('@')) || 'salim.gocoach@gmail.com'

  if (useFallback) {
    console.log('Mode fallback → envoi à', to)
  }
  const url = 'https://aigile.lu/verify?token=test123'

  console.log('Envoi email de test à', to, '...')
  await sendVerificationEmail({ to, url, userName: 'Salim' })
  console.log('✓ Email envoyé')
}

main().catch((err) => {
  console.error('Erreur:', err)
  process.exit(1)
})
