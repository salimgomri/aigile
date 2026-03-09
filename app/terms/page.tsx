import Link from 'next/link'
import PremiumNavbar from '@/components/premium-navbar'
import PremiumFooter from '@/components/landing/premium-footer'

export const metadata = {
  title: 'Conditions d\'utilisation - AIgile',
  description: 'Conditions générales d\'utilisation du service AIgile.',
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <PremiumNavbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="inline-flex items-center text-aigile-gold hover:text-book-orange text-sm font-medium mb-8">
            ← Retour à l&apos;accueil
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Conditions d&apos;utilisation
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-12">
            Dernière mise à jour : Mars 2026
          </p>

          <div className="prose prose-gray dark:prose-invert max-w-none space-y-8 text-gray-800 dark:text-gray-200">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Acceptation des conditions</h2>
              <p>
                En accédant et en utilisant le service AIgile (aigile.lu), vous acceptez d&apos;être lié par ces conditions d&apos;utilisation. 
                Si vous n&apos;acceptez pas ces conditions, veuillez ne pas utiliser le service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Description du service</h2>
              <p>
                AIgile est une plateforme proposant des outils Agile augmentés par l&apos;IA, notamment des rétrospectives personnalisées, 
                des métriques DORA, et d&apos;autres fonctionnalités pour les équipes de développement. Le service est fourni par Salim Gomri.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Compte utilisateur</h2>
              <p>
                Pour accéder à certaines fonctionnalités, vous devez créer un compte. Vous êtes responsable de la confidentialité 
                de vos identifiants et de toutes les activités réalisées sous votre compte.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Utilisation acceptable</h2>
              <p>
                Vous vous engagez à utiliser le service de manière légale et conforme à ces conditions. Toute utilisation abusive, 
                frauduleuse ou nuisible au service ou à d&apos;autres utilisateurs est interdite.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Propriété intellectuelle</h2>
              <p>
                Le contenu, les marques et les logiciels d&apos;AIgile sont protégés par le droit de la propriété intellectuelle. 
                Vous ne pouvez pas copier, modifier ou distribuer le contenu sans autorisation écrite.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Limitation de responsabilité</h2>
              <p>
                Le service est fourni &quot;tel quel&quot;. AIgile ne garantit pas l&apos;absence d&apos;erreurs ou d&apos;interruptions. 
                En aucun cas, AIgile ne pourra être tenu responsable des dommages indirects résultant de l&apos;utilisation du service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Contact</h2>
              <p>
                Pour toute question concernant ces conditions :{' '}
                <a href="mailto:salim.gomri@gmail.com" className="text-aigile-gold hover:underline">
                  salim.gomri@gmail.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
      <PremiumFooter />
    </main>
  )
}
