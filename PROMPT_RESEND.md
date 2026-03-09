# Prompt : Configurer Resend pour AIgile

**Objectif** : Obtenir `RESEND_API_KEY` et (optionnel) configurer `RESEND_FROM_EMAIL` pour l'envoi des emails (vérification, reset mot de passe).

---

## Instructions à suivre

1. Va sur **https://resend.com**
2. Crée un compte ou connecte-toi

### Créer une clé API

3. Menu → **API Keys** (ou https://resend.com/api-keys)
4. Clique sur **"Create API Key"**
5. **Name** : `AIgile` (ou autre)
6. **Permission** : `Sending access` (accès envoi uniquement)
7. Clique sur **"Add"**
8. **Copie la clé** immédiatement (elle ne sera plus visible ensuite)

### Configurer l'expéditeur (production)

En développement, Resend permet d'envoyer depuis `onboarding@resend.dev` sans configuration.

Pour la **production** (aigile.lu) :

9. Menu → **Domains**
10. Clique sur **"Add Domain"**
11. Saisis ton domaine : `aigile.lu`
12. Suis les instructions DNS (ajouter les enregistrements TXT/CNAME fournis)
13. Une fois le domaine vérifié, tu peux utiliser : `AIgile <noreply@aigile.lu>` ou `AIgile <hello@aigile.lu>`

### Ajouter dans .env.local

14. Ouvre `.env.local`
15. Ajoute ou modifie :
    ```
    RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    RESEND_FROM_EMAIL=AIgile <onboarding@resend.dev>
    ```
    En prod, remplace par ton email vérifié : `RESEND_FROM_EMAIL=AIgile <noreply@aigile.lu>`

16. Redémarre le serveur Next.js

---

## Variables utilisées par AIgile

| Variable | Obligatoire | Description |
|----------|-------------|-------------|
| `RESEND_API_KEY` | Oui | Clé API Resend (préfixe `re_`) |
| `RESEND_FROM_EMAIL` | Non | Expéditeur. Défaut : `AIgile <onboarding@resend.dev>` |

---

## Emails envoyés par l'app

- **Vérification email** : après inscription (email/password)
- **Reset mot de passe** : quand l'utilisateur demande une réinitialisation

---

## Vérification

1. Inscris-toi avec email/mot de passe sur `/register`
2. Vérifie ta boîte mail (et les spams)
3. Tu dois recevoir « Bienvenue sur AIgile — Validez votre email »
4. Clique sur le lien → redirection vers `/welcome`

---

## En cas d'erreur

- **Pas d'email reçu** : Vérifie les spams ; en dev, `onboarding@resend.dev` peut être limité (100 emails/jour)
- **"API key is invalid"** : Vérifie que `RESEND_API_KEY` est bien dans `.env.local` et sans espaces
- **"Domain not verified"** : En prod, configure le domaine dans Resend avant d'utiliser un email custom
