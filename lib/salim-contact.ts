import { getContactEmail } from '@/lib/site-facts'

/** Contact public : constante unique. Gmail conservé uniquement si CONTACT_EMAIL n'est pas encore renseigné (pages non légales). */
const LEGACY_GMAIL = 'salim.gomri@gmail.com'

export function formatSalimContactLine(): string {
  const email = getContactEmail()
  return email.includes('@') ? email : LEGACY_GMAIL
}

export const SALIM_CONTACT_EMAIL_GMAIL = formatSalimContactLine()
