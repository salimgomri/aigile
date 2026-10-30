import Link from 'next/link'
import PremiumNavbar from '@/components/premium-navbar'
import PremiumFooter from '@/components/landing/premium-footer'

export const metadata = {
  title: 'Politique de confidentialité - AIgile',
  description: 'Politique de confidentialité et protection des données personnelles AIgile.',
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <PremiumNavbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="inline-flex items-center text-aigile-gold hover:text-book-orange text-sm font-medium mb-8">
            ← Retour à l&apos;accueil
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Politique de confidentialité
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-12">
            Dernière mise à jour : Mars 2026
          </p>

          <div className="prose prose-gray dark:prose-invert max-w-none space-y-8 text-gray-800 dark:text-gray-200">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Responsable du traitement</h2>
              <p>
                Le responsable du traitement des données est Salim Gomri, éditeur du service AIgile (aigile.lu). 
                Contact : <mark className="todo-mark">[À COMPLÉTER]</mark> (e-mail professionnel — plus de Gmail affiché ici).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Données collectées</h2>
              <p>
                Nous collectons les données nécessaires au fonctionnement du service : adresse email, nom, mot de passe (chiffré), 
                données de session, et les données que vous saisissez dans les outils (rétrospectives, métriques, etc.).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Finalités du traitement</h2>
              <p>
                Vos données sont utilisées pour : fournir le service, gérer votre compte, personnaliser les outils, 
                envoyer des emails transactionnels (vérification, réinitialisation de mot de passe), et améliorer le service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Base légale</h2>
              <p>
                Le traitement repose sur l&apos;exécution du contrat (utilisation du service), votre consentement (newsletter, cookies), 
                et notre intérêt légitime (sécurité, amélioration du service).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Durée de conservation</h2>
              <p>
                Les données sont conservées tant que votre compte est actif. Après suppression du compte, les données sont 
                supprimées ou anonymisées dans un délai raisonnable, sauf obligation légale de conservation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Vos droits (RGPD)</h2>
              <p>
                Vous disposez d&apos;un droit d&apos;accès, de rectification, de suppression, de limitation et de portabilité de vos données. 
                Vous pouvez exercer ces droits en nous contactant. Vous avez également le droit d&apos;introduire une réclamation auprès de la CNIL.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Sous-traitants</h2>
              <p>
                Nous utilisons des prestataires pour l&apos;hébergement (Supabase), l&apos;authentification (Better Auth), 
                l&apos;envoi d&apos;emails (Resend), et les paiements (Stripe). Ces prestataires sont conformes au RGPD.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Cookies</h2>
              <p>
                Le site utilise des cookies techniques nécessaires au fonctionnement (session, préférences). 
                Nous n&apos;utilisons pas de cookies publicitaires ou de tracking tiers sans votre consentement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">9. Nouvelles finalités</h2>
              <p>
                En plus des finalités ci-dessus : envoi du kit gratuit et de la séquence d&apos;e-mails
                associée ; traitement des formulaires diagnostic et formation ; cookies de mesure
                d&apos;audience (Google Analytics) uniquement après consentement. Durées de conservation :{' '}
                <mark className="todo-mark">[À COMPLÉTER]</mark>. Outil d&apos;e-mailing :{' '}
                <mark className="todo-mark">[À CHOISIR : Brevo / Kit / Mailchimp / none]</mark>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">10. Contact</h2>
              <p>
                Pour toute question sur vos données personnelles :{' '}
                <mark className="todo-mark">[À COMPLÉTER : e-mail de contact professionnel]</mark>
              </p>
            </section>
          </div>
        </div>
      </div>
      <PremiumFooter />
    </main>
  )
}
