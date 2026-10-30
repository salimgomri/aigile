import Image from 'next/image'
import Link from 'next/link'
import { AigileLogo } from '@/components/brand/AigileLogo'
import { KitForm } from '@/components/kit/KitForm'
import { ExitIntentKit } from '@/components/home-v2/ExitIntentKit'
import { CtaLink } from '@/components/home-v2/CtaLink'
import { LegalFooterLinks } from '@/components/legal/LegalFooterLinks'
import { Price } from '@/components/ui/Price'
import { HighlightTodos } from '@/components/legal/TodoMark'
import {
  BANK_TEAMS_PHRASE,
  BOOK_PAGES,
  DIAGNOSTIC_URL,
  LINKEDIN_URL,
  OPENCLASSROOMS,
  PEOPLE_COACHED_PHRASE,
  PROBLEM_SIGNALS,
  SALIM_METHOD_STEPS,
  TAGLINE_IA,
  TAGLINE_LIVRE_COACHING,
  TESTIMONIALS,
  VAT_MENTION,
  WORK_STEPS,
  getContactEmail,
  yearsOfExperience,
} from '@/lib/site-facts'

export function HomeV2() {
  const years = yearsOfExperience()
  const contact = getContactEmail()

  return (
    <div className="ld-page hv2">
      <header className="ld-chrome">
        <div className="ld-shell flex h-[72px] items-center justify-between gap-4">
          <Link href="/" aria-label="AIgile accueil">
            <AigileLogo size="nav" priority />
          </Link>
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-aigile-navy">
            <a href="#offres">Offres</a>
            <Link href="/formations">Formations</Link>
            <a href="#livre">Le livre</a>
            <a href="#kit">Kit</a>
          </nav>
          <CtaLink
            href={`${DIAGNOSTIC_URL}?from=home-v2`}
            cta="diagnostic-nav"
            variant="home-v2"
            className="ld-btn ld-btn--gold text-sm"
          >
            Réserver un diagnostic
          </CtaLink>
        </div>
      </header>
      <div className="ld-chrome-spacer" />

      <section id="hero" className="ld-hero">
        <div className="ld-hero__inner ld-shell">
          <div>
            <h1 className="ld-hero__title">
              Vos équipes agiles livrent mieux avec l&apos;IA, sans casser ce qui marche
            </h1>
            <p className="ld-hero__sub">
              Coach agile augmenté par l&apos;IA depuis 2003 – formations intra et accompagnement
            </p>
            <p className="mt-3 italic text-aigile-navy/80">{TAGLINE_LIVRE_COACHING}</p>
            <div className="ld-hero__cta mt-6 flex flex-wrap gap-3">
              <CtaLink
                href={`${DIAGNOSTIC_URL}?from=home-v2`}
                cta="diagnostic-hero"
                variant="home-v2"
                className="ld-btn ld-btn--gold"
              >
                Réserver un diagnostic flash (30 min)
              </CtaLink>
              <a href="#offres" className="ld-btn ld-btn--ghost" data-cta="formations-hero">
                Voir les formations intra
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="ld-shell py-10" aria-label="Preuves">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 text-sm">
          {[
            `${years} ans de terrain (depuis 2003)`,
            BANK_TEAMS_PHRASE,
            PEOPLE_COACHED_PHRASE,
            `Auteur du Système S.A.L.I.M. (${BOOK_PAGES} pages)`,
            OPENCLASSROOMS,
          ].map((item) => (
            <li key={item} className="rounded-2xl border border-black/8 bg-white px-4 py-3 font-medium">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section id="signaux" className="ld-shell py-12">
        <h2 className="text-3xl font-bold mb-3">L&apos;IA produit plus vite. Votre équipe relit après coup.</h2>
        <p className="text-gray-700 max-w-2xl mb-8">
          Les démos s&apos;enchaînent, la vélocité est stable, les tableaux de bord sont verts. Et
          pourtant le client hésite. Ce n&apos;est pas un problème de méthode : c&apos;est un
          problème de lecture.
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PROBLEM_SIGNALS.map((s) => (
            <article key={s.title} className="rounded-2xl border border-black/8 bg-white p-5">
              <h3 className="font-bold mb-2">{s.title}</h3>
              <p className="text-sm text-gray-700">{s.body}</p>
            </article>
          ))}
        </div>
        <CtaLink
          href={`${DIAGNOSTIC_URL}?from=home-v2`}
          cta="diagnostic-signaux"
          variant="home-v2"
          className="inline-block mt-6 ld-btn ld-btn--gold"
        >
          Si deux signaux vous parlent, parlons-en
        </CtaLink>
      </section>

      <section id="offres" className="ld-shell py-12">
        <h2 className="text-3xl font-bold mb-8">Commencer petit, mesurer, puis décider</h2>
        <div className="grid gap-5 md:grid-cols-3">
          <article className="rounded-2xl border border-black/8 bg-white p-6 flex flex-col">
            <h3 className="text-xl font-bold">Formation intra 1 à 3 jours</h3>
            <p className="mt-2 text-sm text-gray-700 grow">
              À partir de <Price amount="2 000 €" audience="b2b" hideVat /> pour 8 personnes.
            </p>
            <p className="text-xs text-gray-500 mt-2">{VAT_MENTION}</p>
            <CtaLink
              href="/formations"
              cta="demande-programme"
              variant="home-v2"
              className="mt-4 ld-btn ld-btn--gold text-center"
            >
              Demander un programme
            </CtaLink>
            <p className="mt-3 text-sm">
              <Link href="/formations/agile-ia-demarrer" className="underline">
                Fiche A
              </Link>
              {' · '}
              <Link href="/formations/livraison-fiable-ia" className="underline">
                Fiche B
              </Link>
            </p>
          </article>
          <article className="rounded-2xl border-2 border-aigile-gold bg-white p-6 flex flex-col">
            <h3 className="text-xl font-bold">Diagnostic flash</h3>
            <p className="mt-2 text-sm text-gray-700 grow">30 min, gratuit. 2 à 3 priorités.</p>
            <CtaLink
              href={`${DIAGNOSTIC_URL}?from=home-v2`}
              cta="diagnostic-offres"
              variant="home-v2"
              className="mt-4 ld-btn ld-btn--gold text-center"
            >
              Réserver un diagnostic
            </CtaLink>
          </article>
          <article className="rounded-2xl border border-black/8 bg-white p-6 flex flex-col">
            <h3 className="text-xl font-bold">Coaching, mission ou product management</h3>
            <p className="mt-2 text-sm text-gray-700 grow">Sur devis.</p>
            <CtaLink
              href={`${DIAGNOSTIC_URL}?motif=coaching&from=home-v2`}
              cta="coaching-offres"
              variant="home-v2"
              className="mt-4 ld-btn ld-btn--ghost text-center"
            >
              En parler
            </CtaLink>
          </article>
        </div>
      </section>

      <section id="methode" className="ld-shell py-12">
        <h2 className="text-3xl font-bold mb-3">Un système, pas un énième framework</h2>
        <p className="text-gray-700 max-w-2xl mb-2">{TAGLINE_IA}</p>
        <ol className="grid gap-4 md:grid-cols-5 mt-8">
          {SALIM_METHOD_STEPS.map((step) => (
            <li key={step.letter} className="rounded-2xl bg-white border border-black/8 p-4">
              <p className="text-2xl font-bold text-book-orange">{step.letter}</p>
              <h3 className="font-bold">{step.title}</h3>
              <p className="text-sm text-gray-700 mt-1">{step.body}</p>
            </li>
          ))}
        </ol>
        <ol className="mt-8 space-y-3 text-sm">
          {WORK_STEPS.map((s, i) => (
            <li key={s.title}>
              <strong>
                {i + 1}. {s.title}.
              </strong>{' '}
              {s.body}
            </li>
          ))}
        </ol>
        <p className="mt-6 text-sm">
          Démonstrations :{' '}
          <Link href="/retro" className="underline">
            Rétro IA
          </Link>
          {' · '}
          <Link href="/scoring-deliverable" className="underline">
            Scoring
          </Link>
        </p>
      </section>

      <section id="temoignages" className="ld-shell py-12">
        <h2 className="text-3xl font-bold mb-8">Ils en parlent</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <blockquote key={t.name} className="rounded-2xl bg-white border border-black/8 p-5">
              <p className="text-sm leading-relaxed">« {t.quote} »</p>
              <footer className="mt-4 text-sm font-semibold">
                {t.name}
                <span className="block font-normal text-gray-600">
                  <HighlightTodos text={t.role} />
                </span>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section id="livre" className="ld-shell py-12">
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <Image
            src="/images/system-salim-hero-detoure.png"
            alt={`Couverture du Système S.A.L.I.M., ${BOOK_PAGES} pages`}
            width={480}
            height={480}
            className="w-full max-w-sm mx-auto"
          />
          <div>
            <h2 className="text-3xl font-bold mb-3">Le Système S.A.L.I.M.</h2>
            <p className="text-gray-700">
              {BOOK_PAGES} pages. Le livre expose le système. Le coaching l&apos;installe.
            </p>
            <p className="mt-3">
              <Price amount="69 €" audience="b2c" /> en direct ou via Amazon.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/salim" className="ld-btn ld-btn--gold">
                Voir le livre
              </Link>
              <a href={LINKEDIN_URL} className="ld-btn ld-btn--ghost" target="_blank" rel="noopener noreferrer">
                LinkedIn de Salim
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="kit" className="ld-shell py-12">
        <div className="grid gap-8 md:grid-cols-2 items-start">
          <div>
            <h2 className="text-3xl font-bold mb-3">Kit gratuit : 5 signaux que votre livraison dérape</h2>
            <p className="text-gray-700">
              Auto-diagnostic en 10 minutes, 5 prompts IA prêts à l&apos;emploi, checklist DoR/DoD.
              Pour managers, Scrum Masters et PO.
            </p>
          </div>
          <div className="rounded-2xl bg-white border border-black/8 p-6">
            <KitForm compact source="home-v2" contactEmail={contact} />
          </div>
        </div>
      </section>

      <section id="faq" className="ld-shell py-12">
        <h2 className="text-3xl font-bold mb-6">Questions fréquentes</h2>
        <dl className="space-y-4">
          <div className="rounded-2xl bg-white border border-black/8 p-5">
            <dt className="font-bold">Intra ou distanciel ?</dt>
            <dd className="text-sm text-gray-700 mt-1">
              Les formations intra se font sur site ou à distance, selon votre contexte. Le
              diagnostic flash est en visio.
            </dd>
          </div>
          <div className="rounded-2xl bg-white border border-black/8 p-5">
            <dt className="font-bold">Quels prix ?</dt>
            <dd className="text-sm text-gray-700 mt-1">
              Formations intra à partir de 2 000 € HT pour 8 personnes ; diagnostic flash gratuit ;
              accompagnement sur devis. {VAT_MENTION}.
            </dd>
          </div>
        </dl>
      </section>

      <section className="ld-shell py-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Prêt à y voir clair en 30 minutes ?</h2>
        <CtaLink
          href={`${DIAGNOSTIC_URL}?from=home-v2`}
          cta="diagnostic-final"
          variant="home-v2"
          className="ld-btn ld-btn--gold"
        >
          Réserver un diagnostic flash (30 min)
        </CtaLink>
        <p className="mt-4 text-sm">
          {contact.includes('@') ? (
            <a href={`mailto:${contact}`} className="underline">
              {contact}
            </a>
          ) : (
            <mark className="todo-mark">{contact}</mark>
          )}
        </p>
      </section>

      <footer className="ld-footer">
        <div className="ld-footer__brand">
          <AigileLogo size="md" />
        </div>
        <p className="text-sm">
          {TAGLINE_IA} · {TAGLINE_LIVRE_COACHING}
        </p>
        <p className="text-xs mt-2">
          <Link href="/manifesto" className="underline">
            Manifeste AIgile
          </Link>
          {' · '}
          <Link href="/retro" className="underline">
            Rétro IA
          </Link>
        </p>
        <LegalFooterLinks className="mt-4" />
      </footer>

      <div className="ld-sticky md:hidden">
        <CtaLink
          href={`${DIAGNOSTIC_URL}?from=home-v2`}
          cta="diagnostic-sticky"
          variant="home-v2"
          className="ld-btn ld-btn--gold ld-btn--sticky"
        >
          Diagnostic 30 min
        </CtaLink>
      </div>
      <ExitIntentKit />
    </div>
  )
}
