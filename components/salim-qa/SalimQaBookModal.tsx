'use client'

import { X } from 'lucide-react'
import CheckoutSheet from '@/components/checkout/CheckoutSheet'
import { formatBookPrice } from '@/lib/book-config'
import { trackEvent } from '@/lib/gtag'
import type { Product } from '@/lib/payments/catalog'

type SalimQaBookModalProps = {
  open: boolean
  onClose: () => void
  book: Product | null
  language: 'fr' | 'en'
}

export function SalimQaBookModal({ open, onClose, book, language }: SalimQaBookModalProps) {
  if (!open) return null

  const price = book ? formatBookPrice(book.amount) : '69,00 €'

  const copy =
    language === 'fr'
      ? {
          tag: 'LE LIVRE',
          title: 'Le Système S.A.L.I.M.',
          author: 'par Salim Gomri · 19 chapitres',
          perks: [
            'Les réponses complètes à toutes vos questions',
            'Toutes les fiches pratiques et leurs schémas',
            'La méthode complète, chapitre par chapitre',
          ],
          priceNote: 'livre · paiement unique',
          cta: 'Acheter Le Système S.A.L.I.M.',
          paywallTitle: 'La solution complète est développée dans le livre.',
          paywallSub: 'Réponse détaillée, fiche pratique et schéma du Système S.A.L.I.M.',
        }
      : {
          tag: 'THE BOOK',
          title: 'The S.A.L.I.M. System',
          author: 'by Salim Gomri · 19 chapters',
          perks: [
            'Full answers to all your questions',
            'All practical sheets and diagrams',
            'The complete method, chapter by chapter',
          ],
          priceNote: 'book · one-time payment',
          cta: 'Buy The S.A.L.I.M. System',
          paywallTitle: 'The full solution is developed in the book.',
          paywallSub: 'Detailed answer, practical sheet and S.A.L.I.M. diagram.',
        }

  const handleBookClick = () => {
    trackEvent('salim_qa_book_click', { source: 'book_modal' })
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-6"
      style={{
        background: 'rgba(20,20,18,0.5)',
        backdropFilter: 'blur(8px)',
        animation: 'salimFade 0.2s ease',
      }}
      onClick={onClose}
      role="presentation"
    >
      <div className="sq-book-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div
          style={{
            background: '#0A0A0A',
            color: '#fff',
            padding: 30,
            position: 'relative',
            display: 'flex',
            gap: 20,
            alignItems: 'center',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            style={{
              position: 'absolute',
              top: 18,
              right: 18,
              width: 32,
              height: 32,
              border: 'none',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.12)',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X className="h-4 w-4" />
          </button>
          <div
            style={{
              width: 74,
              height: 104,
              borderRadius: 5,
              background: 'linear-gradient(140deg,#FEDB10,#e6c40a)',
              flex: 'none',
              boxShadow: '0 12px 28px -8px rgba(0,0,0,0.6)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: 10,
            }}
          >
            <span style={{ fontFamily: 'var(--sq-serif)', fontSize: 28, color: '#0A0A0A', lineHeight: 0.9 }}>
              S.
            </span>
            <span
              style={{
                fontFamily: 'var(--sq-mono)',
                fontSize: 7,
                letterSpacing: '0.1em',
                color: '#0A0A0A',
                lineHeight: 1.3,
              }}
            >
              LE SYSTÈME
              <br />
              SALIM
            </span>
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontFamily: 'var(--sq-mono)',
                fontSize: 10,
                letterSpacing: '0.2em',
                color: '#FEDB10',
                marginBottom: 8,
              }}
            >
              {copy.tag}
            </div>
            <div style={{ fontFamily: 'var(--sq-serif)', fontSize: 27, lineHeight: 1.05, marginBottom: 4 }}>
              {copy.title}
            </div>
            <div style={{ fontSize: 13, color: '#9C9C95' }}>{copy.author}</div>
          </div>
        </div>
        <div style={{ padding: '26px 30px 30px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 22 }}>
            {copy.perks.map((p) => (
              <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 11, fontSize: 14.5 }}>
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 999,
                    background: '#FEDB10',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 800,
                    flex: 'none',
                  }}
                >
                  ✓
                </span>
                {p}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.03em' }}>{price}</span>
            <span style={{ fontSize: 13, color: '#9A9A93' }}>{copy.priceNote}</span>
          </div>
          {book ? (
            <CheckoutSheet
              product={book}
              checkoutSource="salim_qa"
              trigger={
                <button type="button" className="sq-btn-gold-lg w-full" onClick={handleBookClick}>
                  <span style={{ position: 'relative' }}>{copy.cta}</span>
                </button>
              }
            />
          ) : (
            <button type="button" className="sq-btn-gold-lg w-full" disabled>
              {copy.cta}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/** Bloc paywall réutilisable dans cartes / modal détail */
export function SalimQaPaywallBlock({
  onBuyBook,
  onUnlock,
  language,
  hasFiche,
  page,
  canUnlock,
  cost = 1,
}: {
  onBuyBook: () => void
  onUnlock: () => void
  language: 'fr' | 'en'
  hasFiche?: boolean
  page?: string | number | null
  canUnlock: boolean
  cost?: number
}) {
  const unlockLabel = canUnlock
    ? language === 'fr'
      ? `Débloquer la réponse complète (${cost} crédit)`
      : `Unlock full answer (${cost} credit)`
    : language === 'fr'
      ? 'Recharger des crédits'
      : 'Top up credits'

  return (
    <div className="sq-paywall">
      <p style={{ margin: '0 0 12px', fontSize: 13, lineHeight: 1.5, color: '#3A3A36' }}>
        {language === 'fr' ? (
          <>
            Aperçu seulement — réponse complète{hasFiche ? ' et fiche (schéma)' : ''} dans{' '}
            <em>Le Système S.A.L.I.M.</em>
            {page ? ` · page ${page}` : ''}
          </>
        ) : (
          <>
            Preview only — full answer{hasFiche ? ' and sheet (diagram)' : ''} in{' '}
            <em>The S.A.L.I.M. System</em>
            {page ? ` · page ${page}` : ''}
          </>
        )}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button type="button" className="sq-btn-gold w-full" onClick={onUnlock}>
          {unlockLabel}
        </button>
        <button
          type="button"
          onClick={onBuyBook}
          style={{
            width: '100%',
            padding: 10,
            border: '1px solid rgba(0,0,0,0.12)',
            borderRadius: 11,
            background: '#fff',
            fontFamily: 'inherit',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {language === 'fr' ? 'Acheter le livre' : 'Buy the book'}
        </button>
      </div>
    </div>
  )
}
