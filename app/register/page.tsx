'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { signUp, requestPasswordReset } from '@/lib/auth-client'
import { Mail, AlertCircle, User as UserIcon } from 'lucide-react'

function generateTempPassword(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('')
}

const ROLES = [
  { value: 'manager', labelFr: 'Manager', labelEn: 'Manager' },
  { value: 'scrum_master', labelFr: 'Scrum Master', labelEn: 'Scrum Master' },
  { value: 'product_owner', labelFr: 'Product Owner', labelEn: 'Product Owner' },
  { value: 'agile_coach', labelFr: 'Coach Agile', labelEn: 'Agile Coach' },
  { value: 'dev_team', labelFr: 'Équipe Dev', labelEn: 'Dev Team' },
  { value: 'guest', labelFr: 'Invité', labelEn: 'Guest' },
  { value: 'other', labelFr: 'Autre', labelEn: 'Other' },
]

export default function RegisterPage() {
  const searchParams = useSearchParams()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  useEffect(() => {
    const e = searchParams.get('email')
    if (e) setEmail(decodeURIComponent(e))
  }, [searchParams])
  const [role, setRole] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!role) {
      setError('Veuillez sélectionner un rôle')
      setLoading(false)
      return
    }

    try {
      const tempPassword = generateTempPassword()
      const result = await signUp.email({
        email,
        password: tempPassword,
        name: `${firstName} ${lastName}`.trim(),
        callbackURL: '/welcome',
        // @ts-expect-error - additionalFields passed to server
        firstName,
        lastName,
        role: role === 'other' ? 'guest' : role,
      })

      if (result.error) {
        const msg = result.error.message || (result.error as { cause?: string })?.cause || 'Inscription échouée'
        setError(msg)
        console.error('[REGISTER]', result.error)
        setLoading(false)
        return
      }

      const resetResult = await requestPasswordReset({
        email,
        redirectTo: '/set-password',
      })

      if (resetResult.error) {
        setError(resetResult.error.message || 'Envoi de l\'email échoué')
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-aigile-gold mx-auto flex items-center justify-center shadow-lg">
            <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-foreground">Vérifiez votre email</h2>
          <p className="text-muted-foreground">
            Nous avons envoyé un lien à <strong className="text-foreground">{email}</strong> pour définir votre mot de passe.
          </p>
          <p className="text-sm text-muted-foreground">
            Cliquez sur le lien dans l&apos;email pour définir votre mot de passe et activer votre compte.
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-3 bg-aigile-gold hover:bg-book-orange text-black font-semibold rounded-xl transition-colors"
          >
            Retour à la connexion
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <div className="w-16 h-16 rounded-xl bg-aigile-gold mx-auto flex items-center justify-center shadow-lg">
              <span className="text-black font-bold text-2xl">A</span>
            </div>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-foreground">
            Créer un compte AIgile
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Prénom, nom, email et rôle. Le mot de passe sera défini via le lien envoyé par email.
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                  Prénom *
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="firstName"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-aigile-gold focus:border-transparent text-foreground"
                    placeholder="Salim"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
                  Nom *
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="lastName"
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-aigile-gold focus:border-transparent text-foreground"
                    placeholder="Gomri"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-aigile-gold focus:border-transparent text-foreground"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-foreground mb-2">
                Rôle *
              </label>
              <select
                id="role"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-aigile-gold focus:border-transparent text-foreground"
              >
                <option value="">Sélectionnez votre rôle</option>
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.labelFr}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-aigile-gold hover:bg-book-orange text-black font-semibold rounded-xl hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Création du compte...' : 'Créer mon compte'}
            </button>
          </form>

          <p className="text-xs text-center text-muted-foreground">
            En créant un compte, vous acceptez nos{' '}
            <Link href="/terms" className="text-aigile-gold hover:underline">
              Conditions d&apos;utilisation
            </Link>{' '}
            et notre{' '}
            <Link href="/privacy" className="text-aigile-gold hover:underline">
              Politique de confidentialité
            </Link>
          </p>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Vous avez déjà un compte ?{' '}
          <Link href="/login" className="font-medium text-aigile-gold hover:text-aigile-gold/80 transition-colors">
            Se connecter
          </Link>
        </p>

        <p className="text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Retour à l&apos;accueil
          </Link>
        </p>
      </div>
    </div>
  )
}
