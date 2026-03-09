# Prompt : Configurer Google OAuth pour AIgile

**Objectif** : Obtenir `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET` (pas `placeholder`) pour activer la connexion "Continuer avec Google" sur aigile.lu.

---

## Prompt rapide (copier-coller)

```
Crée les credentials Google OAuth pour aigile.lu :
1. Va sur console.cloud.google.com → Créer un projet "AIgile Auth"
2. APIs & Services → OAuth consent screen → Externe → Nom "AIgile", email salim.gomri@gmail.com
3. Credentials → Create credentials → OAuth client ID → Web application
4. Authorized JavaScript origins : http://localhost:3010 et https://aigile.lu
5. Authorized redirect URIs : http://localhost:3010/api/auth/callback/google et https://aigile.lu/api/auth/callback/google
6. Récupère Client ID et Client Secret
7. Mets-les dans .env.local (GOOGLE_CLIENT_ID et GOOGLE_CLIENT_SECRET) - jamais placeholder
8. Pour la prod : copie aussi sur le serveur /var/www/aigile/.env.local puis pm2 restart aigile
```

---

## Instructions détaillées

1. Va sur **https://console.cloud.google.com**
2. Connecte-toi avec ton compte Google

### Créer un projet (ou utiliser un existant)

3. Clique sur le **sélecteur de projet** (en haut à gauche)
4. Clique sur **"Nouveau projet"**
5. Nom : `AIgile Auth` (ou autre)
6. Clique sur **"Créer"**
7. Sélectionne ce projet une fois créé

### Configurer l'écran de consentement OAuth

8. Menu gauche → **APIs & Services** → **OAuth consent screen**
9. Type : **Externe** (pour tester avec n'importe quel compte Google)
10. Clique sur **"Créer"**
11. Remplis :
    - **Nom de l'application** : `AIgile`
    - **E-mail d'assistance utilisateur** : `salim.gomri@gmail.com`
    - **E-mail du développeur** : `salim.gomri@gmail.com`
12. Clique sur **"Enregistrer et continuer"**
13. **Scopes** : Clique sur **"Enregistrer et continuer"** (par défaut suffisant)
14. **Utilisateurs de test** : Clique sur **"Ajouter des utilisateurs"** → ajoute `salim.gomri@gmail.com`
15. Clique sur **"Enregistrer et continuer"** puis **"Retour au tableau de bord"**

### Créer les identifiants OAuth

16. Menu gauche → **Credentials** (Identifiants)
17. Clique sur **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
18. **Application type** : `Web application`
19. **Name** : `AIgile Web Client`
20. **Authorized JavaScript origins** → **"+ ADD URI"** :
    - En local : `http://localhost:3010`
    - En prod : `https://aigile.lu`
21. **Authorized redirect URIs** → **"+ ADD URI"** :
    - En local : `http://localhost:3010/api/auth/callback/google`
    - En prod : `https://aigile.lu/api/auth/callback/google`
22. Clique sur **"CREATE"**

### Récupérer les credentials

23. Une fenêtre s'affiche avec :
    - **Client ID** : `xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com`
    - **Client Secret** : `GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx`
24. Copie ces deux valeurs

### Ajouter dans .env.local (local)

25. Ouvre `/Volumes/T9/aigile/.env.local`
26. Remplace les lignes (ne jamais laisser `placeholder`) :
    ```
    GOOGLE_CLIENT_ID=xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
    GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx
    ```
27. Redémarre le serveur : `npm run dev -- --port 3010`

### Ajouter sur le serveur (production aigile.lu)

28. **IMPORTANT** : Le serveur doit avoir les mêmes credentials. Le deploy n'envoie pas `.env.local`.
29. Sur le serveur, édite `/var/www/aigile/.env.local` :
    ```bash
    ssh root@144.91.91.88
    cd /var/www/aigile
    nano .env.local   # ou vim, etc.
    ```
30. Ajoute ou remplace (avec tes vraies valeurs, pas placeholder) :
    ```
    GOOGLE_CLIENT_ID=ta_vraie_valeur_client_id
    GOOGLE_CLIENT_SECRET=ta_vraie_valeur_client_secret
    BETTER_AUTH_URL=https://aigile.lu
    NEXT_PUBLIC_APP_URL=https://aigile.lu
    ```
31. Redémarre PM2 : `pm2 restart aigile`

---

## Résumé des URIs à configurer

| Type | Local | Production |
|------|-------|------------|
| **Authorized JavaScript origins** | `http://localhost:3010` | `https://aigile.lu` |
| **Authorized redirect URIs** | `http://localhost:3010/api/auth/callback/google` | `https://aigile.lu/api/auth/callback/google` |

---

## Vérification

1. Ouvre http://localhost:3010/login
2. Clique sur **"Continuer avec Google"**
3. Tu dois être redirigé vers Google pour te connecter
4. Après autorisation → redirection vers `/onboarding/role` pour choisir ton rôle
5. Puis → `/dashboard`

---

## En cas d'erreur

- **"redirect_uri_mismatch"** : Vérifie que l'URL de redirection est exactement celle configurée (pas de slash final, bon port)
- **"access_denied"** : Vérifie que ton email est dans les "Utilisateurs de test" (mode Externe en développement)
- **"invalid_client"** : Vérifie que Client ID et Client Secret sont corrects dans `.env.local`
- **500 sur /api/auth/sign-in/social** : Le serveur a probablement `GOOGLE_CLIENT_ID=placeholder`. Copie les vraies valeurs depuis ton `.env.local` local vers le serveur.
