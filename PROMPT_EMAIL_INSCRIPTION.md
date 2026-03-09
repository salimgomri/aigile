# Instructions email inscription AIgile

## Ce que tu dois faire maintenant

1. **Redémarrer le serveur Next.js** (pour que `sendOnSignUp: true` soit pris en compte) :
   ```bash
   # Arrête le serveur (Ctrl+C) puis relance
   npm run dev
   ```

2. **Vérifier Resend** : va sur https://resend.com/emails
   - Si tu es en mode sandbox (gratuit), tu ne peux envoyer qu’aux adresses que tu as ajoutées dans ton compte
   - Pour tester : Resend Dashboard → Audience → Add contact → ajoute ton email

3. **Tester l’inscription** :
   - Inscris-toi avec ton email sur l’app
   - Vérifie ta boîte mail (et les spams)
   - Tu devrais recevoir l’email « Validez votre email »

---

## Prompt pour Claude : créer le template HTML de l’email

Copie-colle ce prompt à Claude :

```
Je développe une app SaaS "AIgile" (Scrum augmenté par l’IA, aigile.lu). J’ai besoin d’un template HTML d’email responsive et professionnel pour les emails transactionnels (vérification email, reset password).

Contraintes :
- HTML inline (pas de CSS externe) pour compatibilité clients mail
- Largeur max ~600px
- Couleur principale : #c9973a (or/doré)
- Police : système (sans-serif)
- Structure : header avec logo/titre, corps, CTA (bouton), footer discret
- Le bouton CTA doit être bien visible, fond #c9973a, texte noir
- Footer : "AIgile — Scrum Augmenté par l’IA · aigile.lu"

Génère un template réutilisable avec des placeholders :
- {{greeting}} : ex. "Bonjour Jean,"
- {{body}} : le texte principal (HTML simple)
- {{ctaUrl}} : URL du bouton
- {{ctaLabel}} : texte du bouton
- {{footerNote}} : note optionnelle (ex. "Ce lien expire dans 24h")
```

---

## Prompt pour Claude : rédiger le contenu des emails

Copie-colle ce prompt à Claude :

```
Je développe AIgile (aigile.lu), une app Scrum augmentée par l’IA. J’ai besoin du contenu pour 2 emails transactionnels, en français ET en anglais.

### Email 1 : Vérification d’email (après inscription)
- Objet (FR) : 
- Objet (EN) :
- Corps (FR) : message court qui explique qu’il faut cliquer pour valider l’email. Ton professionnel mais chaleureux.
- Corps (EN) : même chose en anglais
- CTA : "Valider mon email" / "Verify my email"
- Note footer : le lien expire dans 24h

### Email 2 : Choisir son mot de passe (première connexion ou reset)
- Objet (FR) :
- Objet (EN) :
- Corps (FR) : message qui invite à définir ou réinitialiser le mot de passe. Clair et rassurant.
- Corps (EN) : même chose en anglais
- CTA : "Définir mon mot de passe" / "Set my password"
- Note footer : le lien expire dans 1h

Format de réponse : un tableau ou une structure claire avec FR et EN côte à côte pour chaque champ.
```
