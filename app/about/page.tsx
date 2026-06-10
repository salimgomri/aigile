import type { Metadata } from 'next'
import Image from 'next/image'

const GOLD = '#FEBD10'
const NAVY = '#0f2240'
const NAVY_LIGHT = '#1a3a6b'
const MUTED_BLUE = '#8ab4d4'
const SYSTEM_FONT =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'

export const metadata: Metadata = {
  title: { absolute: 'Salim Gomri — Agile Coach & Auteur | AIgile' },
  description:
    "Coaching agile, livre Le Système S.A.L.I.M., 21 ans d'expérience terrain. Luxembourg et remote.",
}

type QrCardProps = {
  qrSrc: string
  label: string
  href: string
  linkText: string
  badge?: string
}

function QrCard({ qrSrc, label, href, linkText, badge }: QrCardProps) {
  return (
    <div
      className="relative flex flex-col items-center gap-4 rounded-xl p-6 text-center"
      style={{ backgroundColor: NAVY }}
    >
      {badge ? (
        <span
          className="absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide"
          style={{ backgroundColor: GOLD, color: NAVY }}
        >
          {badge}
        </span>
      ) : null}
      <div className="rounded-lg bg-white p-3">
        <Image
          src={qrSrc}
          alt={`QR code — ${label}`}
          width={200}
          height={200}
          unoptimized
          className="h-auto w-full max-w-[160px]"
        />
      </div>
      <p className="text-base font-semibold" style={{ color: GOLD }}>
        {label}
      </p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium underline underline-offset-4"
        style={{ color: MUTED_BLUE }}
      >
        {linkText}
      </a>
    </div>
  )
}

export default function MoiPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: NAVY, fontFamily: SYSTEM_FONT }}>
      {/* 1. HERO */}
      <section className="px-6 py-16 sm:py-24" style={{ backgroundColor: NAVY }}>
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold sm:text-6xl" style={{ color: GOLD }}>
            Salim Gomri
          </h1>
          <p className="mt-3 text-lg font-medium sm:text-xl" style={{ color: '#ffffff' }}>
            Agile Coach &amp; Auteur — Luxembourg
          </p>
          <p className="mt-5 text-xl italic sm:text-2xl" style={{ color: GOLD }}>
            On mesure la vélocité. Je rends visible la solidité.
          </p>
          <p className="mt-5 text-sm sm:text-base" style={{ color: MUTED_BLUE }}>
            21 ans d&apos;expérience terrain · 300+ rétrospectives · 16 équipes
          </p>
        </div>
      </section>

      {/* 2. BOOK */}
      <section className="px-6 py-16" style={{ backgroundColor: GOLD }}>
        <div className="mx-auto max-w-3xl">
          <span
            className="inline-block rounded-full px-3 py-1 text-xs font-bold tracking-widest"
            style={{ backgroundColor: NAVY, color: GOLD }}
          >
            NOUVEAU LIVRE
          </span>
          <h2 className="mt-5 text-3xl font-bold sm:text-4xl" style={{ color: NAVY }}>
            Le Système S.A.L.I.M.
          </h2>
          <p className="mt-2 text-lg font-semibold" style={{ color: NAVY }}>
            Scrum Augmenté, Livré en Incrémental et Mesuré
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed sm:text-base" style={{ color: NAVY }}>
            Construit sur 300+ rétrospectives réelles. Pour les Scrum Masters, coaches agiles et
            managers en transition qui veulent sortir du Scrum de façade.
          </p>
          <a
            href="https://aigile.lu"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex w-full items-center justify-center rounded-lg px-6 py-3.5 text-base font-bold sm:w-auto"
            style={{ backgroundColor: NAVY, color: GOLD }}
          >
            Découvrir le livre
          </a>
        </div>
      </section>

      {/* 3. STATS */}
      <section className="px-6 py-12" style={{ backgroundColor: NAVY }}>
        <div className="mx-auto grid max-w-3xl grid-cols-3 gap-3 sm:gap-6">
          {[
            { value: '300+', label: 'rétros menées' },
            { value: '16', label: 'équipes coachées' },
            { value: '2 000', label: 'personnes impliquées' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl px-3 py-5 text-center"
              style={{ backgroundColor: NAVY_LIGHT }}
            >
              <p className="text-2xl font-bold sm:text-4xl" style={{ color: GOLD }}>
                {stat.value}
              </p>
              <p className="mt-1 text-xs sm:text-sm" style={{ color: MUTED_BLUE }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. QR + LINKS */}
      <section className="px-6 py-16" style={{ backgroundColor: GOLD }}>
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-bold sm:text-3xl" style={{ color: NAVY }}>
            Me retrouver &amp; prendre RDV
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <QrCard
              qrSrc="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://www.linkedin.com/in/salimgomri/&color=0f2240&bgcolor=ffffff"
              label="LinkedIn"
              href="https://www.linkedin.com/in/salimgomri/"
              linkText="/in/salimgomri"
            />
            <QrCard
              qrSrc="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://aigile.lu/salim&color=0f2240&bgcolor=ffffff"
              label="Mon profil"
              href="https://aigile.lu/salim"
              linkText="aigile.lu/salim"
            />
            <QrCard
              qrSrc="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://calendly.com/salimdulux/30min&color=0f2240&bgcolor=ffffff"
              label="Session 30 min"
              href="https://calendly.com/salimdulux/30min"
              linkText="Calendly"
              badge="GRATUIT"
            />
          </div>
        </div>
      </section>

      {/* 5. COACHING CTA */}
      <section className="px-6 py-16" style={{ backgroundColor: NAVY }}>
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold sm:text-3xl" style={{ color: GOLD }}>
            Tu veux qu&apos;on travaille ensemble ?
          </h2>
          <p className="mt-4 text-sm leading-relaxed sm:text-base" style={{ color: MUTED_BLUE }}>
            Coaching d&apos;équipe Scrum, formation Agile, diagnostic de livraison. Luxembourg et
            remote.
          </p>
          <a
            href="https://calendly.com/salimdulux/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex w-full items-center justify-center rounded-lg px-6 py-3.5 text-base font-bold"
            style={{ backgroundColor: GOLD, color: NAVY }}
          >
            Réserver une session découverte
          </a>
          <div className="mt-5">
            <a
              href="https://www.linkedin.com/in/salimgomri/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium underline underline-offset-4"
              style={{ color: GOLD }}
            >
              Me contacter sur LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer
        className="flex flex-col gap-2 px-6 py-8 sm:flex-row sm:items-center sm:justify-between"
        style={{ backgroundColor: NAVY }}
      >
        <span className="font-bold" style={{ color: GOLD }}>
          aigile.lu
        </span>
        <span className="text-sm" style={{ color: MUTED_BLUE }}>
          Coaching Scrum &amp; Agile · Luxembourg
        </span>
      </footer>
    </main>
  )
}
