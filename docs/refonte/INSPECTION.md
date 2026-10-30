# Inspection du dépôt aigile.lu (phase 0)

*Date : 30/10/2026. Aucune modification métier dans ce commit : constat uniquement, plus copie des sources sous `docs/refonte/`.*

## Stack

| Élément | Valeur |
|---|---|
| Framework | **Next.js 15.1.6** (App Router) |
| UI | **React 18.3.1** |
| Langage | **TypeScript 5** |
| CSS | **Tailwind CSS 3.4** + feuilles dédiées (`app/landing.css`, `app/salim/salim.css`, …) |
| Charte | Bleu nuit `#0f2240` / `#07111f`, or `#FEBD10`, accent livre `#E8961E`. Landing actuelle : crème `#f3ede7` + or `#fedb10` (classes `.ld-*`) |
| Gestionnaire de paquets | **npm** (`package-lock.json`) et un `pnpm-lock.yaml` présent mais non utilisé comme source de vérité. Scripts : `node ./node_modules/next/dist/bin/next …` |
| Node | `>=20` |
| Tests | **Vitest 2** + Testing Library + jsdom |
| Lint | `next lint` (eslint-config-next 15.1.6) |
| Port dev | **3010** |

### Commandes

```bash
npm run dev          # next dev --port 3010
npm run build        # next build
npm start            # next start
npm run lint         # next lint
npm test             # vitest run
npm run test:watch   # vitest
```

## Hébergement détecté

- **Production actuelle :** VPS **Hetzner** (`deploy/server-info.txt`) — serveur `systeme-salim`, type CX23, Helsinki (`hel1`), IPv4 `204.168.181.120`, chemin `/var/www/aigile.lu`, déploiement via `deploy_aigile.sh` / `npm run deploy` (PM2).
- **Vercel :** `vercel.json` existe (cron `/api/cron/reset-credits` le 1er du mois) — configuration complémentaire, pas l’hébergeur HTML principal.
- **À confirmer par Salim** pour les mentions légales : nom commercial de l’hébergeur, adresse et téléphone. Proposition PR : **Hetzner Online GmbH, Industriestr. 25, 91710 Gunzenhausen, Allemagne** (hébergeur du VPS détecté). Téléphone : [À COMPLÉTER].

## Authentification

- **Bibliothèque :** Better Auth `^1.5.4` (`lib/auth.ts`, handler `app/api/auth/[...all]/route.ts`).
- **Base :** PostgreSQL via `pg` Pool (`DATABASE_URL` / construction depuis Supabase). Tables `"user"`, `"account"`, `"session"`, `"verification"`.
- **Cookies :** préfixe `aigile` ; session `aigile.session_token` ou `__Secure-aigile.session_token` en prod.
- **Middleware** (`middleware.ts`) : routes protégées `/dashboard`, `/dora`, `/niko-niko`, `/onboarding`, `/join`, `/settings`, `/start-scrum`, `/welcome`, `/admin`. **`/api/*` n’est jamais matché.** Exceptions publiques : `/dashboard/westrum`, `/dashboard/edmondson`.
- **Admin :** **pas un rôle en base**. Liste d’e-mails `ADMIN_EMAILS` (`lib/admin.ts` → `isAdminEmail` / `isAdminAccessAllowed`). Cookie `aigile.admin` posé par `GET /api/admin/check`. Simulation locale `aigile_dev_admin_sim` (dev only).
- **Garde API admin :** `requireAdminApiSession()` (`lib/admin/require-admin-api-session.ts`) — **non modifié** dans cette refonte ; les nouvelles routes admin le réutilisent.
- **E-mails auth :** Resend (`RESEND_API_KEY`, `RESEND_FROM_EMAIL`) — vérification de compte, reset mot de passe.

**Cette PR ne modifie pas** Better Auth, le middleware, `ADMIN_EMAILS`, les layouts/API admin existants (orders, flags, accès, stripe-sync, intelligence).

## Espace admin existant

| Route | Rôle |
|---|---|
| `/admin` | Redirige vers `/admin/orders` |
| `/admin/orders` | Suivi des achats (`orders`) + stats (`/api/admin/stats`) |
| `/admin/feature-flags` | Feature flags |
| `/admin/access` | Invites / promos / early access |
| `/admin/stripe-sync` | Backfill Checkout Sessions → `orders` |
| `/admin/intelligence` | Collecteur / feed |

Source des achats : table **`orders`** (Stripe Checkout), vues `v_user_purchases`, `v_tool_usage_*`. Layout `app/admin/layout.tsx` : session + `isAdminAccessAllowed`, sinon redirect `/login` ou `/dashboard`.

## Stripe

- Package `stripe` `^20.4.1`. **Pas d’`apiVersion` explicite** dans le code (défaut SDK).
- **Checkout Sessions** serveur (`app/api/checkout/create-session`) — **aucun Payment Link** dans le dépôt aujourd’hui.
- **Pas de Stripe.js côté client** (`STRIPE_PUBLISHABLE_KEY` documenté, non utilisé pour un Elements).
- Variables (noms) : `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID_*`, `PRICE_LIVRE_SALIM`, `PRICE_FICHES_SALIM`, `PRICE_BUNDLE_SALIM`, `STRIPE_ADMIN_PORTAL_CUSTOMER_ID`.
- Webhook `POST /api/webhooks/stripe` : `checkout.session.completed`, `customer.subscription.created|deleted`, `invoice.payment_failed`. Idempotence table `stripe_webhook_events`.
- Catalogue existant : `lib/payments/catalog.ts` (livre papier, fiches, bundle, Pro, Day Pass, crédits, café). **Ne pas le casser** : le catalogue PDF (`lib/products.ts`) est **additif**.
- Mode de travail de cette PR : **test uniquement**. Aucune création live.

## Base de données / e-mail / fichiers

- **Supabase JS** (`supabaseAdmin`, service role) pour les données applicatives ; **Better Auth** sur le même Postgres.
- Migrations `supabase/migrations/000` → `045`.
- E-mail transactionnel : **Resend** (`lib/email.ts`, `lib/emails/*`).
- Fichiers publics : `public/`. Aucun stockage privé PDF payant existant (à créer : `PRIVATE_FILES_DIR`, défaut `private/files`).

## Google Analytics

- ID public **`G-WMG8QLND8X`** (défaut) ou `NEXT_PUBLIC_GA_ID`.
- Chargé **globalement** dans `app/layout.tsx` via `next/script` (`gtag.js` + `gtag('config')`) — **sans bandeau de consentement** (écart avec `/privacy` §8).
- Helper `lib/gtag.ts` (`trackEvent`, `trackPageView`) ; SPA : `components/analytics/GaRouteTracker.tsx`.
- **À faire (lot 2) :** ne plus injecter gtag avant consentement.

## SEO

- `app/sitemap.ts` : `/`, `/tools`, `/pricing`, `/manifesto`, `/retro`, `/parcours` uniquement.
- `public/robots.txt` : Allow all + sitemap.
- Métadonnées Next `Metadata` + JSON-LD `ProfessionalService` dans `app/layout.tsx` (**pas** d’`aggregateRating`).
- Pas de `app/robots.ts`.

## Chiffres à unifier

| Constat | Emplacements |
|---|---|
| Années | **Déjà dynamiques** via `lib/salim-experience.ts` (`SALIM_CAREER_START_YEAR = 2003`) → 23 en 2026. Compteur `/salim` part de **0** dans le HTML client (`hooks/use-counter.ts`). |
| 415 pages | `components/salim/salim-hero.tsx`, `salim-offers.tsx`, `salim-personas.tsx`, `lib/payments/salim-cross-sell.ts` → **477** |
| 4.9/5 | `app/tools/page.tsx` → **supprimer** |
| 1000+ agilists | `app/tools/page.tsx`, `components/landing/newsletter-contact.tsx` → **1 000+ personnes accompagnées** |
| Amazon 79 / 59 / 138 € | `/salim` (`salim-offers.tsx`, `book-config.ts`, `countdown-banner.tsx`) — **conserver**, ajouter lien + date |
| Témoignages nominatifs Nicolas Schell / Nouna Sehili / David Mansy | **Absents du code actuel** (présents dans `docs/refonte/page-de-vente.*` et l’audit du 27/10). Fonctions non publiées dans le dépôt → ne pas inventer ; citations reprises, fonctions `[À COMPLÉTER]` si absentes. |
| `/diagnostic` | **Route inexistante** (le brief la suppose). À créer sans toucher aux outils Retro/Scoring. |

## Pages « bientôt » / menu

- `/pricing` : **non vide** (abonnements Pro / Day Pass) — à retirer du menu + `noindex` + hors sitemap, conformément au brief.
- `/skill-matrix` : coming soon / stub selon feature flag.
- `/prompts` : « Bientôt disponible ».
- `/parcours` : contenu réel, mais brief = hors menu / noindex / hors sitemap.
- `/salim-qa` : invitation / feature flag — **logique inchangée**, hors menu.

## Accueil actuel

- `app/page.tsx` → `SystemSalimLanding` (`components/landing-v2/`) : landing **livre**, CTA achat dans le hero, outils à crédits, footer minimal.
- Ancienne landing : `archives/landing-v1/`.
- Bascule prévue : `HOME_VARIANT=legacy|v2`, prévisualisation `/home-v2`, ancienne sur `/home-legacy` si v2.

## Tests existants (avant modification)

Fichiers : `tests/auth.test.ts`, `tests/checkout-handler.test.ts`, `tests/handle-checkout-completed.test.ts`, `tests/parse-checkout-session.test.ts`, `tests/register.test.tsx`, `tests/stripe-*.ts`, `lib/scoring/__tests__/engine.test.ts`.

Les résultats du `npm test` / `npm run build` **avant** les lots sont notés ci-dessous (à remplir au moment de l’exécution).

## Choix techniques (pour la suite de la PR)

| Sujet | Choix (simple, réversible) |
|---|---|
| PDF kit gratuit | `public/kit/aigile-kit-5-signaux.pdf` + en-tête `X-Robots-Tag: noindex` |
| PDF payants | Dossier serveur `PRIVATE_FILES_DIR` (défaut `private/files`), jamais sous `public/` |
| Leads / kit | Tables Supabase `leads`, `kit_subscribers`, `digital_downloads`, `lead_rate_limits` (migration 046) |
| E-mails kit | `NEWSLETTER_PROVIDER=none` (défaut) → Resend J0 uniquement ; séquence J2–J10 à programmer dans l’outil choisi par Salim |
| Consentement cookies | Implémentation maison (`localStorage` `aigile_consent`), pas de CMP payant |
| Lecture Stripe admin / téléchargement | `STRIPE_RESTRICTED_KEY` si définie, sinon `STRIPE_SECRET_KEY` (dev/test uniquement) |
| Accueil v2 | Route `/home-v2` + variable `HOME_VARIANT`, composant legacy **non réécrit** |

## Baseline build / tests

Exécuté **avant** les lots métier, après `npm ci` (826 packages).

### `npm test` (vitest run)

- **6 fichiers OK / 2 en échec** ; **28 tests OK / 3 en échec**.
- Échecs **préexistants** (non corrigés ici — hors périmètre auth / env) :
  1. `tests/register.test.tsx` (3 tests) — `useLanguage must be used within LanguageProvider` (le test n’enveloppe pas `LanguageProvider`).
  2. `tests/checkout-handler.test.ts` (suite) — `Missing Supabase environment variables` au chargement de `lib/supabase.ts` via `app/api/webhooks/stripe/route.ts`.
- Suites qui passent : `tests/auth.test.ts`, `tests/handle-checkout-completed.test.ts`, `tests/parse-checkout-session.test.ts`, `tests/stripe-metadata.test.ts`, `tests/stripe-webhook-persistence.test.ts`, `lib/scoring/__tests__/engine.test.ts`.

### `npm run build`

Lancé ensuite dans l’environnement agent (sans secrets Stripe/Supabase de prod). Tout échec de compilation **préexistant** sera noté dans la PR ; les lots de cette branche n’y touchent pas sauf s’ils introduisent une erreur nouvelle.
