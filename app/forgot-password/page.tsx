'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { requestPasswordReset } from '@/lib/auth-client'
import { Mail, AlertCircle, CheckCircle } from 'lucide-react'

function ForgotPasswordContent() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!email.trim()) {
      setError('Veuillez entrer votre adresse email')
      setLoading(false)
      return
    }

    try {
      const result = await requestPasswordReset({
        email: email.trim(),
        redirectTo: '/set-password',
      })

      if (result.error) {
        setError(result.error.message || 'Une erreur est survenue. Vérifiez votre email.')
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
          <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Email envoyé</h2>
          <p className="text-muted-foreground">
            Si un compte existe pour <strong className="text-foreground">{email}</strong>, vous recevrez un lien pour réinitialiser votre mot de passe.
          </p>
          <p className="text-sm text-muted-foreground">
            Vérifiez votre boîte de réception et vos spams.
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
            Mot de passe oublié
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Entrez votre email pour recevoir un lien de réinitialisation
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <div className="bg-card border border-border rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email
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

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-aigile-gold hover:bg-book-orange text-black font-semibold rounded-xl hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
            </button>
          </form>
        </div>

        <p className="text-center">
          <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Retour à la connexion
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Chargement...</div>}>
      <ForgotPasswordContent />
    </Suspense>
  )
}
