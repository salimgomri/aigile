import {
  SALIM_CONTACT_EMAIL_AIGILE,
  SALIM_CONTACT_EMAIL_GMAIL,
} from '@/lib/salim-contact'

export function SalimContactLinks({ className = '' }: { className?: string }) {
  return (
    <span className={className}>
      <a href={`mailto:${SALIM_CONTACT_EMAIL_AIGILE}`} className="hover:underline">
        {SALIM_CONTACT_EMAIL_AIGILE}
      </a>
      {' · '}
      <a href={`mailto:${SALIM_CONTACT_EMAIL_GMAIL}`} className="hover:underline">
        {SALIM_CONTACT_EMAIL_GMAIL}
      </a>
    </span>
  )
}
