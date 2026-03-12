# Stripe — Produits & Price IDs (aigile.lu)

**Account:** acct_1T9oE52UwcloHrJN · **Currency:** EUR

---

## Produits configurés

| Produit | Product ID | Price ID | Montant |
|---------|------------|----------|---------|
| Pro Mensuel | prod_U8BrqtaV6xnfau | `price_1T9vTo2UwcloHrJNuCkGkPiW` | €19.99/mois |
| Pro Annuel | prod_U8BswLqQWfsFVY | `price_1T9vUU2UwcloHrJNjq0IHpsk` | €199.99/an |
| Pro Trimestriel | prod_U8BtTXQ1GLGHb7 | `price_1T9vVQ2UwcloHrJN0i1rpnip` | €59.99/3 mois |
| Le Système S.A.L.I.M (précommande) | prod_U8AmX3YZKnfnei | `price_1T9uQZ2UwcloHrJNf4NpuaTH` | €35.00 |
| Le Système S.A.L.I.M (vente) | prod_U8AmX3YZKnfnei | `price_1T9uQZ2UwcloHrJNk2gftA9n` | €40.00 |

**Livre :** précommande jusqu'au 1er avril 2025 → après : prix vente.

---

## À créer dans Stripe (si besoin)

- **Day Pass** — €9.99 one-time
- **Pack 10 crédits** — €4.99 one-time

---

## Codes promo

| Code | Type | Expiration | Redemptions |
|------|------|------------|-------------|
| AIGILE | 5% off once | — | 0/200 |
| EARLYBIRD | €8 off once | 31 mars | 0/30 |
| LAUNCH5 | €5 off once | 1er avril | 0/1 |
| SALIM10 | 10% off once | 1er avril | 0/50 |
| AIgile Pro Pre-order | 15% off forever | — | Illimité |

---

## Variables d'environnement

Copier dans `.env.local` :

```env
STRIPE_PRICE_ID_PREORDER=price_1T9uQZ2UwcloHrJNf4NpuaTH
STRIPE_PRICE_ID_SALE=price_1T9uQZ2UwcloHrJNk2gftA9n
STRIPE_PRICE_ID_PRO_MONTHLY=price_1T9vTo2UwcloHrJNuCkGkPiW
STRIPE_PRICE_ID_PRO_ANNUAL=price_1T9vUU2UwcloHrJNjq0IHpsk
PREORDER_END_DATE=2025-04-01
```
