# Brief final — agent de code sur le dépôt aigile.lu
*Version finale du 30/10/2026 (heure de Luxembourg). Remplace la version du 27/10/2026. Destiné à un agent de code (Cursor, mode Agent ou agent cloud) qui travaille sur le dépôt du site aigile.lu. **Rien n'est déployé, rien n'est publié : une branche dédiée et une pull request, c'est tout.***

> **Pour Salim (mode d'emploi)**
> 1. Joignez à l'agent tout le dossier `/workspace/aigile-brief-final/` (liste en fin de brief). L'agent le copie dans le dépôt sous `docs/refonte/`.
> 2. Collez le bloc « PROMPT » ci-dessous.
> 3. Ne collez **jamais** de clé Stripe, de mot de passe ou de jeton dans le chat : mettez-les vous-même dans `.env.local` (local) puis dans les variables d'environnement de l'hébergeur.
> 4. Relisez la PR, testez la prévisualisation, remplissez les `[À COMPLÉTER]`, puis seulement décidez de fusionner et de déployer.

---

## PROMPT

### 0. Rôle et règles d'or (non négociables)

Tu es un agent de code qui travaille sur le dépôt du site **aigile.lu** (marque AIgile de Salim Gomri, coach agile « augmenté par l'IA », auteur du livre *Le Système S.A.L.I.M.*). Le propriétaire n'est pas développeur : explique simplement, fais des changements petits, testables et réversibles.

1. **Branche dédiée** `feat/aigile-conversion-legal` créée depuis la branche principale. Commits petits et thématiques (un lot = un ou plusieurs commits). **Une seule pull request**, en brouillon (draft) tant que les tests ne passent pas.
2. **Aucun déploiement**, aucun push sur la branche principale, aucune modification de configuration de production chez l'hébergeur, aucune promotion de prévisualisation en production.
3. **Aucun secret dans le code ni dans l'historique Git** : clés, jetons, mots de passe, ID de webhook secrets uniquement en variables d'environnement serveur. Mets à jour `.env.example` (noms seulement, sans valeur). Vérifie avant chaque commit (`git diff --cached`) qu'aucun secret n'est ajouté ; vérifie que `.env*` (sauf `.env.example`) est dans `.gitignore`.
4. **Design conservé** : Salim aime le design actuel. Réutilise la charte, les composants, les polices, les couleurs et le style existants (bleu nuit et jaune). **Pas de refonte graphique**, pas de nouvelle librairie UI. Les fichiers HTML fournis (`page-de-vente.html`, `page-inscription.html`, `kit.html`) sont des **références de contenu et de structure**, pas des maquettes graphiques à recopier : reconstruis les sections avec les composants du site.
5. **Ne touche pas à l'authentification ni à l'espace admin** (suivi des achats) : ni leurs routes, ni leur middleware, ni leurs variables d'environnement, ni leurs modèles de données. Tu peux **ajouter** des pages admin (lot 10) derrière la protection existante, sans la modifier. Teste que la connexion et l'admin fonctionnent toujours.
6. **Stripe** : réutilise l'intégration Stripe existante du dépôt (client, helpers, webhooks). **Ne crée jamais** de produit, de prix ou de lien de paiement en mode live, n'effectue aucune opération de paiement réelle, aucun remboursement, aucune modification dans le Dashboard Stripe. Travaille en **mode test** uniquement. Liste dans la PR les produits/prix/liens à créer (section 6).
7. **Ne casse aucune route existante** (au minimum : `/`, `/retro`, `/retro/questionnaire`, `/retro/random`, `/scoring-deliverable`, `/dashboard-manager`, `/dashboard/westrum`, `/salim-qa`, `/framework`, `/manifesto`, `/diagnostic`, `/salim`, `/tools`, `/parcours`, `/login`, `/privacy`, `/about`, les routes d'auth et d'admin que tu découvriras).
8. **N'invente rien** : aucun chiffre, avis, note, témoignage, logo client ou mention légale non fournis ici. Tout texte non vérifié est écrit `[À COMPLÉTER]` (ou `[À CONFIRMER]`, `[À CHOISIR]`, `[LIEN STRIPE]`, `[LIEN AMAZON]`) et rendu **visible et surligné** dans l'interface (style « todo » discret mais lisible).
9. Ton, langue : français, **vouvoiement** côté entreprises ; formule de marque à conserver : **« L'IA propose, l'humain décide. »** et **« Le livre expose le système. Le coaching l'installe. »**
10. Si un choix d'architecture important n'est pas évident (stockage, fournisseur d'e-mail, hébergement des fichiers), choisis l'option la plus simple compatible avec l'existant, **documente-la dans la PR** et rends-la facile à changer. N'installe pas de service payant.

### 1. Phase 0 — Inspection (avant tout code)

La stack est **inconnue** : inspecte le dépôt et écris `docs/refonte/INSPECTION.md` (premier commit), avec :
- framework, version, routeur, gestionnaire de paquets, commandes `dev` / `build` / `test` / `lint` ;
- hébergement détecté (fichiers `vercel.json`, `netlify.toml`, `Dockerfile`, workflows CI…) → sert à remplir l'hébergeur dans les mentions légales (à confirmer par Salim) ;
- **authentification** : bibliothèque, middleware, routes protégées, comment un admin est reconnu (rôle, liste d'e-mails, variable…) ;
- **espace admin** existant : routes, données affichées (suivi des achats), source des données ;
- **intégration Stripe** existante : client, version d'API, clés utilisées (noms de variables seulement), webhooks existants et événements traités, Payment Links ou Checkout ;
- base de données / stockage (ORM, KV, fichiers…) et fournisseur d'e-mail transactionnel déjà utilisé (le site envoie des e-mails de vérification de compte) ;
- chargement de **Google Analytics** (`G-WMG8QLND8X` d'après l'audit) : où et comment ;
- génération du `sitemap.xml` et du `robots.txt`, gestion des métadonnées (`robots`, title, Open Graph, JSON-LD) ;
- emplacements de tous les chiffres à unifier (recherche : `23 ans`, `22 ans`, `21 ans`, `années`, `415`, `393`, `477`, `4.9`, `4,9`, `1000+`, `1 000`, `2 000`, `700+`, `agilists`, `Amazon`, compteurs animés) ;
- tests existants et comment les lancer.

Puis exécute l'installation et `build` + tests existants **avant** tes modifications, pour avoir une base de comparaison (note les échecs préexistants dans INSPECTION.md, ne les « corrige » pas en touchant à l'auth/admin).

### 2. Source unique de vérité (config)

Crée un module de configuration unique (ex. `lib/site-facts.ts` ou équivalent dans la stack) importé partout :

| Clé | Valeur | Règle |
|---|---|---|
| `START_YEAR` | `2003` | |
| `yearsOfExperience()` | année courante − 2003 (= 23 en 2026) | **Calcul automatique** au rendu serveur (ou au build **et** recalculé côté client si le site est statique, pour ne pas rester figé). Valeur finale présente dans le HTML servi (pas de compteur animé qui part de 0). |
| `BOOK_PAGES` | `477` | Partout (remplacer 415, 393 et toute autre valeur). |
| `BOOK_CHAPTERS` | `19` | |
| `PEOPLE_COACHED_LABEL` | `"1 000+"` | **Confirmé par Salim.** Libellé unique : « 1 000+ personnes accompagnées ». Remplace 2 000, 700+, « 1000+ agilists ». |
| `BANK_TEAMS` | `16` | **Confirmé par Salim** : « 16 équipes en banque ». |
| `OPENCLASSROOMS` | « Mentor Product Manager chez OpenClassrooms » | **Confirmé par Salim.** Pas de logo OpenClassrooms. |
| `RATING` | — | **Supprimer « 4.9/5 » partout** (pages, composants, JSON-LD `aggregateRating`/`review`). |
| `TESTIMONIALS` | Nicolas Schell, Nouna Sehili, David Mansy | **Autorisés par Salim** (textes existants du site, inchangés). Fonctions exactes : reprendre celles déjà publiées ; ne rien ajouter. |
| `LEGAL` | identité de l'éditeur (section 3) | |
| `VAT_MENTION` | « TVA non applicable, art. 293 B du CGI » | + `[À CONFIRMER si le seuil de franchise est dépassé]` en commentaire dans la config et visible sur `/mentions-legales` et `/cgv`. |
| `CONTACT_EMAIL` | `[À COMPLÉTER]` | Remplacer partout l'adresse Gmail affichée par cette constante (garder le comportement actuel si la constante est vide, mais afficher `[À COMPLÉTER]` dans les pages légales). |
| `DIAGNOSTIC_URL` | `/diagnostic` | CTA principal. Plus de lien Calendly brut sur l'accueil. |
| `HOME_VARIANT` | `"legacy"` par défaut | Voir lot 5. |

**Affichage des prix (franchise de TVA, cohérent partout)** :
- offres aux entreprises (formations intra, diagnostic payant, coaching, licence équipe) : « **2 000 € HT** » + mention « TVA non applicable, art. 293 B du CGI » dans le bloc ou en note de bas de section ;
- produits et places vendus aux particuliers (PDF, livre, place inter) : « **19 € (TVA non applicable)** » ;
- un composant `<Price amount="…" audience="b2b|b2c" />` (ou équivalent) applique ce format pour éviter les incohérences.

### 3. Lot 1 — Mentions légales et CGV (priorité 1)

Pages **`/mentions-legales`** et **`/cgv`** (CGV en 2 sections ou 2 sous-pages : produits numériques ; formations et prestations), contenu **mot pour mot** depuis :
- `docs/refonte/mentions-legales.md`
- `docs/refonte/cgv-produits-numeriques.md`
- `docs/refonte/cgv-formations-prestations.md`

Informations **vérifiées fournies par Salim** (à reprendre exactement) :
- **GOMRI SALIM**, nom commercial **GO-COACH**, **Entrepreneur individuel (EI)**, micro-entrepreneur ; écrire « Salim GOMRI EI » dans l'identité.
- SIREN **891 268 245** · SIRET (siège) **891 268 245 00018**
- TVA intracommunautaire **FR38891268245** · régime : **TVA non applicable, art. 293 B du CGI** `[À CONFIRMER si le seuil de franchise est dépassé]`
- **Non inscrit au RCS** · **inscrit au RNE le 13/11/2020**
- Activité **70.22Z** — Conseil pour les affaires et autres conseils de gestion · exercice **libéral non réglementé**
- Adresse **50 Grand'Rue, 57280 Maizières-lès-Metz, France**
- Directeur de la publication : Salim GOMRI

Laisser visibles : `[À COMPLÉTER]` hébergeur (nom, adresse, téléphone — propose dans la PR celui que tu as détecté), e-mail de contact, médiateur de la consommation, dates de mise à jour, conditions d'annulation, délais.

Ajouter dans le **pied de page commun à toutes les pages** (layout) : Mentions légales · CGV · Politique de confidentialité · Gestion des cookies · Contact. Ajouter `/mentions-legales` et `/cgv` au sitemap. Dans `/privacy`, ajouter (sans réécrire le reste) les finalités nouvelles : kit gratuit + e-mails, formulaires diagnostic/formation, cookies de mesure, en `[À COMPLÉTER]` pour les durées et l'outil d'e-mailing.

### 4. Lot 2 — Bandeau de consentement cookies (Google Analytics)

- **Aucun script Google Analytics (gtag.js) chargé ni cookie `_ga` déposé avant consentement.** Charger GA seulement après « Accepter ».
- Bandeau sobre, dans le style du site : boutons **« Accepter »** et **« Refuser »** de même niveau visuel (refuser aussi simple qu'accepter), lien « Personnaliser » facultatif, lien vers `/privacy`. Pas de case précochée, pas de « continuer la navigation vaut accord ».
- Choix mémorisé (cookie ou localStorage `aigile_consent`, avec date) ; nouvelle demande au plus tard après [À CONFIRMER : 6] mois ; lien **« Gestion des cookies »** dans le pied de page pour rouvrir le bandeau et retirer le consentement (supprimer alors les cookies `_ga*`).
- Si le site utilise déjà un outil de consentement, réutilise-le. Sinon, petite implémentation maison ou bibliothèque open source légère, sans service payant. Option : Google Consent Mode v2 en mode « denied » par défaut **sans** charger gtag avant consentement.
- Les outils (Rétro IA, Scoring…) et l'auth ne doivent pas dépendre du consentement GA.
- Test : navigateur vierge → onglet Réseau : aucune requête vers `googletagmanager.com` / `google-analytics.com` avant « Accepter » ; après « Refuser », toujours rien.

### 5. Lot 3 — Chiffres, crédibilité et page `/salim`

- Appliquer la section 2 partout (pages, composants, métadonnées, JSON-LD, Open Graph, textes alternatifs) : années calculées depuis 2003, 477 pages, « 1 000+ personnes accompagnées », « 16 équipes en banque », mentor OpenClassrooms, **suppression du 4.9/5**.
- Remplacer les **compteurs animés** qui valent 0 dans le HTML servi par la valeur finale (une animation éventuelle doit partir de la valeur finale déjà présente dans le HTML).
- Remplacer les boutons d'achat `disabled` dans le HTML serveur par de vrais liens `<a href>`.
- **GARDER les comparaisons « vs Amazon » sur `/salim`** : Salim confirme qu'une fiche Amazon du livre existe.
  - Ajoute une constante `AMAZON_URL` = `[LIEN AMAZON]` et `AMAZON_PRICES` (prix affichés aujourd'hui : 79 € / 59 € / 138 € d'après l'audit) avec `AMAZON_PRICES_CHECKED_AT` = `[À COMPLÉTER : date de vérification]`.
  - Ajoute à côté de chaque comparaison un lien « Voir sur Amazon » vers `AMAZON_URL` (si absent sur la page) et la mention « Prix constaté sur Amazon le [date] ».
  - Si tu peux consulter la fiche publique, vérifie que les prix affichés correspondent et signale tout écart dans la PR ; ne modifie pas les prix sans accord. Sinon, liste-le comme vérification à faire par Salim.
  - Le comparatif « vs Amazon » reste **uniquement sur `/salim`**, jamais sur l'accueil.

### 6. Lot 4 — Pages vides ou « bientôt »

Pages concernées : `/pricing` (vide), `/skill-matrix` (« 31 décembre 2099 »), `/prompts` (« Bientôt disponible »), `/parcours` (« Très bientôt… »), et `/salim-qa` (« sur invitation ») pour le menu.
- Les **retirer du menu** principal et du pied de page.
- Les passer en **`noindex`** (balise meta `robots` et/ou en-tête `X-Robots-Tag`), et les **retirer du `sitemap.xml`**. Ne pas les bloquer dans `robots.txt` (sinon Google ne voit pas le `noindex`).
- Ne pas les supprimer (routes conservées). Option si simple : remplacer le contenu « bientôt » par un court bloc « Être prévenu » qui renvoie vers le formulaire du kit (lot 6). `/pricing` peut rediriger (302) vers la section offres de l'accueil v2 **uniquement quand la v2 est active** ; sinon `noindex`.
- `/salim-qa` : garder le fonctionnement « sur invitation » intact (peut dépendre de l'auth : ne pas toucher à la logique).

### 7. Lot 5 — Page d'accueil alternative (v2), ancienne conservée

**Principe** : l'ancienne page d'accueil reste **intacte et récupérable**. La nouvelle est une **version alternative**.
- Crée la v2 sur une route de prévisualisation **`/home-v2`** (`noindex`, absente du sitemap tant qu'elle n'est pas activée).
- Bascule par **une seule variable** : `HOME_VARIANT=legacy|v2` (variable d'environnement, lue côté serveur, défaut `legacy`). Avec `v2`, `/` affiche la v2 et l'ancienne reste accessible sur `/home-legacy` (`noindex`). Ne supprime et ne réécris pas le composant de l'ancienne page : déplace-le au besoin dans un composant importé par les deux routes.
- Mesure (sans outil nouveau) : chaque CTA porte `data-cta="diagnostic-hero"` etc. et un paramètre `?from=home-v2` / `?from=home-legacy` vers `/diagnostic` ; si GA est consenti, envoie un événement `cta_click` avec `variant` et `cta`. But : comparer ancienne et nouvelle version sur 4 semaines.

**Spécification (synthèse du conseil, `docs/refonte/synthese-conseil-homepage.md`, mise à jour avec les réponses de Salim)** — un seul parcours, celui du décideur (DSI, Head of Delivery, RH/formation) :

1. **Hero** — Titre : « **Vos équipes agiles livrent mieux avec l'IA, sans casser ce qui marche** ». Sous-titre : « **Coach agile augmenté par l'IA depuis 2003 – formations intra et accompagnement** » (**aucun secteur ni zone géographique dans le titre ni le sous-titre**). **CTA principal unique** : « Réserver un diagnostic flash (30 min) » → `/diagnostic`. CTA secondaire : « Voir les formations intra » → section offres / `/formations`. **Pas de bouton livre dans le hero.**
2. **Bandeau de preuves** (uniquement des preuves confirmées) : depuis 2003 (`yearsOfExperience()` ans de terrain) · 16 équipes en banque · 1 000+ personnes accompagnées · auteur du *Système S.A.L.I.M.* (477 pages) · mentor Product Manager chez OpenClassrooms. **Pas de logos clients** (non confirmés).
3. **3 à 5 signaux de problèmes**, repris de la page `/diagnostic` existante (réutilise ses textes/composants), avec lien vers `/diagnostic`.
4. **3 cartes d'offres** :
   - **Formation intra 1 à 3 jours** — « à partir de 2 000 € HT pour 8 personnes » (+ mention TVA) — CTA « Demander un programme » → formulaire de demande formation (lot 7) ou `/diagnostic?motif=formation` ; liens vers les fiches A et B.
   - **Diagnostic flash** — 30 min, gratuit — CTA → `/diagnostic`.
   - **Coaching, mission ou product management** — « sur devis » — CTA → `/diagnostic`.
5. **Méthode S.A.L.I.M.** en 4–5 étapes (textes de `page-de-vente.md` §[4]-[5]), avec **Rétro IA** et **Scoring** présentés comme démonstrations (liens vers `/retro` et `/scoring-deliverable`).
6. **Les 3 témoignages nominatifs existants** (Nicolas Schell, Nouna Sehili, David Mansy), autorisés par Salim, textes inchangés.
7. **Bloc livre** (vitrine de légitimité) : couverture existante, « 477 pages », « 69 € en direct ou via Amazon » (prix du site actuel ; format b2c « 69 € (TVA non applicable) »), liens vers `/salim` et le LinkedIn de Salim. **Pas de comparatif « vs Amazon » ici.** Jamais dans le hero.
8. **Kit gratuit** en bas de page (formulaire du lot 6) + une version en **sortie de page** discrète (bandeau ou encart qui apparaît une seule fois par session, fermable, jamais de pop-up bloquante, pas sur mobile si gênant).
9. **FAQ courte** : intra ou distanciel, prix (« formations intra à partir de 2 000 € HT pour 8 personnes ; diagnostic flash gratuit ; accompagnement sur devis »). **Rien sur OPCO, Qualiopi, CPF ou INFPC.**
10. **CTA final** diagnostic, e-mail de contact professionnel (`CONTACT_EMAIL`), pied de page avec mentions légales, CGV, confidentialité, gestion des cookies.

**À retirer de la v2 et du menu** : « 4.9/5 » ; les chiffres non unifiés ; le bouton livre dans le hero ; les outils à crédits et le manifeste complet (lien en pied de page seulement) ; les pages vides ; le lien Calendly brut ; le jargon au-dessus de la ligne de flottaison ; tout chiffre sans source ; l'apporteur d'affaires (une ligne en pied de page au maximum).
Métadonnées v2 : title « Coach agile augmenté par l'IA – formations intra et diagnostic | AIgile » [À CONFIRMER par Salim], description reprenant le sous-titre, Open Graph ; JSON-LD `Person`/`ProfessionalService`/`Book` conservés, **sans** `aggregateRating`.

### 8. Lot 6 — Capture e-mail du kit gratuit

Sources : `docs/refonte/kit/capture-page.md` (textes du formulaire, consentement, mentions), `docs/refonte/kit/sequence-emails.md` (5 e-mails J0–J10), `docs/refonte/kit/kit.pdf` et `kit.html`.
- Page **`/kit`** (titre, bénéfices, formulaire) + bloc réduit sur l'accueil v2. Formulaire : prénom (facultatif), e-mail (obligatoire), case **obligatoire non précochée** « kit + 4 e-mails sur 10 jours », case **facultative non précochée** newsletter, honeypot, limite de fréquence par IP, validation serveur.
- Route serveur `POST /api/leads/kit` (adapter au framework) : enregistre le contact **avec la preuve de consentement** (date, texte des cases, source/UTM) dans le stockage existant (ou à défaut une table/collection `kit_subscribers` simple), puis :
  - si `NEWSLETTER_PROVIDER` = `brevo` | `kit` | `mailchimp` (outil **[À CHOISIR par Salim]**) : ajoute le contact à la liste `KIT_LIST_ID` via l'API (double opt-in recommandé si l'outil le permet) ; la séquence J0–J10 est programmée dans l'outil par Salim ;
  - si `none` (défaut) : envoie l'e-mail J0 avec le lien du PDF via le fournisseur d'e-mail transactionnel déjà présent, et notifie `LEADS_NOTIFY_EMAIL`. Ne programme pas d'envoi automatique de la séquence sans outil choisi.
- **Stockage du PDF du kit** : fichier gratuit, peut être servi publiquement (ex. `/kit/aigile-kit-5-signaux.pdf`) avec en-tête `X-Robots-Tag: noindex`, ou dans le stockage de fichiers existant ; URL dans `KIT_PDF_URL`.
- Désinscription : lien dans chaque e-mail (géré par l'outil, ou route `/api/leads/unsubscribe?token=` signée si envoi maison).
- Message de succès sur la page (« Vérifiez votre boîte mail »), sans redirection.

### 9. Lot 7 — Pages formations

Sources : `docs/refonte/formations/fiche-formation-A.md`, `fiche-formation-B.md`, `page-inscription.html` (version mise à jour avec la mention TVA et l'identité de l'éditeur).
- **`/formations`** : présentation courte des deux formations, offre intra « à partir de 2 000 € HT pour 8 personnes », CTA « Demander un programme ».
- **`/formations/agile-ia-demarrer`** (fiche A) et **`/formations/livraison-fiable-ia`** (fiche B) : contenu des fiches (public, prérequis, objectifs, programme heure par heure, méthodes, livrables, évaluation, prix, modalités, FAQ). Ne pas publier les notes internes (« hypothèse », « à valider par Salim ») sauf sous forme `[À CONFIRMER]` surligné.
- **`/formations/inscription`** (session inter, particuliers) : contenu de `page-inscription.html` ; bouton de paiement vers `STRIPE_LINK_FORMATION_A_URL` = **`[LIEN STRIPE]`** (si vide : bouton « Être prévenu de la prochaine session » vers `/kit` ou formulaire). Prix « 290 € (TVA non applicable) » marqué `[hypothèse à valider]`. Case de demande expresse d'exécution avant la fin du délai de rétractation à prévoir côté Stripe (voir CGV partie B).
- Ces pages restent **`noindex`** tant que `FORMATIONS_PUBLISHED` ≠ `true` (Salim les ouvrira après relecture).
- Formulaire « Demander un programme / devis formation » → `POST /api/leads/formation` (champs : nom, e-mail pro, entreprise, rôle, formation A/B/sur mesure, nombre de personnes, période souhaitée, intra sur site ou distanciel, message, consentement) → stockage + notification `LEADS_NOTIFY_EMAIL` → alimente le mini-CRM (lot 10).

### 10. Lot 8 — Diagnostic (sans casser `/diagnostic`)

La page `/diagnostic` existante est la meilleure du site : **ne pas la refondre.** Seulement :
- accepter les paramètres `?from=` / `?motif=` / UTM et les transmettre au formulaire existant (champ caché) ;
- si le formulaire existant n'enregistre pas les demandes, ajouter l'enregistrement côté serveur (même stockage que les leads) **sans changer son apparence ni son enchaînement vers la prise de rendez-vous** ;
- les demandes alimentent le mini-CRM (lot 10).

### 11. Lot 9 — Téléchargement sécurisé des PDF payants (`/telechargement`)

À brancher sur l'intégration Stripe existante (si une page de livraison existe déjà, l'étendre plutôt que la dupliquer).
- Les Payment Links / Checkout redirigent vers `https://aigile.lu/telechargement?session_id={CHECKOUT_SESSION_ID}`.
- **Page serveur** : sans `session_id` → « Lien invalide » + e-mail de support. Avec : `checkout.sessions.retrieve(session_id, { expand: ['line_items'] })` **côté serveur** avec une **clé restreinte** `STRIPE_RESTRICTED_KEY` (lecture des Checkout Sessions et des Payment Links/Prices uniquement), **jamais** exposée au client ni écrite dans le code. Vérifier `payment_status === 'paid'` **et** que le Payment Link (ou le Price) correspond à un produit connu du catalogue (`lib/products`). Sinon : « Paiement non confirmé », sans détail technique.
- Affichage : merci + prénom, produit, bouton « Télécharger », rappel « Votre reçu arrive par e-mail », support, et deux suites : « Recevoir le kit gratuit » et « Réserver un diagnostic de 30 min ».
- **Route de téléchargement** `GET /api/telechargement?session_id=…&produit=slug` : revérifie le paiement à chaque appel ; les **PDF sont stockés hors du dossier public** (dossier serveur privé `PRIVATE_FILES_DIR`, ou stockage privé avec URL signée de courte durée, selon l'hébergement : explique ton choix) ; réponse `application/pdf`, `Content-Disposition: attachment`, `Cache-Control: no-store`. Limite simple de partage (ex. 5 téléchargements par session) si faisable avec le stockage existant ; sinon, propose dans la PR sans implémenter.
- Page et route : `noindex, nofollow`, `Referrer-Policy: no-referrer`, `Cache-Control: no-store`.
- **Webhook e-mail de secours** : dans le webhook Stripe existant (ou un nouveau endpoint si aucun n'existe), sur `checkout.session.completed` (et `checkout.session.async_payment_succeeded`) payé : vérification de signature (`STRIPE_WEBHOOK_SECRET`, corps brut), idempotence (ignorer un événement déjà traité), envoi à l'acheteur d'un e-mail contenant le lien `/telechargement?session_id=…` et la mention de renonciation au droit de rétractation (support durable), notification à `SALES_NOTIFY_EMAIL`. Journaux sans données de carte. **Ne pas casser** les traitements existants du webhook (suivi des achats de l'admin).
- Catalogue `lib/products` : `{ slug, nom, prix, audience: 'b2c'|'b2b', paymentLinkUrlEnv, paymentLinkIdEnv, fichierCle, nomFichier }` pour : cahier, livre-pdf, pack, licence-equipe (+ livre-papier : lien seulement, pas de fichier ; + formation-a-place : lien seulement). Lien manquant → bouton « Bientôt disponible » vers `/kit` (jamais de lien cassé).

### 12. Lot 10 — Outils admin « quick win »

**Réservés aux admins, derrière l'authentification et le contrôle d'accès existants, sans les modifier** (réutiliser le garde/middleware/layout admin actuel ; chaque nouvelle route API admin revérifie le rôle admin côté serveur). Style : composants admin existants (tableaux simples), pas de librairie de graphiques nouvelle. Lecture Stripe via la clé restreinte (lecture seule).

| Priorité | Outil | Impact | Effort | Contenu |
|---|---|---|---|---|
| **1** | **Mini-CRM des demandes** (diagnostic + formation) | Très fort (chaque demande = mission potentielle) | Faible à moyen | Liste des demandes (date, nom, entreprise, rôle, motif, source/UTM), **statut** (nouveau → contacté → RDV fait → devis envoyé → gagné / perdu), **notes** libres, **date de relance** (mise en évidence quand dépassée), filtre par statut, export CSV. Une table `leads` (ou réutiliser l'existant) avec `type: diagnostic|formation`. |
| **2** | **Tableau des ventes Stripe** | Fort | Faible | Ventes payées par **jour**, par **mois**, par **produit** (montant, nombre), filtre de période, **export CSV**. Source : Checkout Sessions payées (lecture seule, pagination) ou les données d'achats déjà stockées par l'admin si elles existent (préférer l'existant). Montants en euros, mention « TVA non applicable ». |
| **3** | **Inscrits au kit gratuit** | Moyen à fort | Faible | Liste (date, prénom, e-mail, consentement kit / newsletter + date, source/UTM, statut désinscrit), recherche, **export CSV**. Ne pas afficher les inscrits désinscrits dans l'export « actifs ». |
| **4** | **Liens de paiement et produits Stripe en un coup d'œil** | Moyen (évite les liens cassés) | Très faible | Lecture seule : Payment Links (URL, actif/inactif, produit, prix, mode test/live), produits et prix, et correspondance avec les variables `STRIPE_LINK_*` du site (alerte si une variable pointe vers un lien inactif ou absent). **Aucun bouton de création/modification.** |

Ordre recommandé : 1 → 2 → 3 → 4 (le 4 peut être fait en premier s'il ne prend que quelques minutes). Exports CSV : séparateur `;`, UTF-8 avec BOM (lecture Excel FR), dates au format JJ/MM/AAAA HH:mm (Europe/Paris). Pas de suppression de données depuis ces écrans dans cette PR. Ces écrans manipulent des données personnelles : accès admin uniquement, pas de cache public, `noindex`.

### 13. Lot 11 — Qualité, contrôle, tests

- Script `check:todo` (npm ou équivalent) : liste toutes les occurrences de `[À COMPLÉTER]`, `[À CONFIRMER]`, `[À CHOISIR]`, `[LIEN STRIPE]`, `[LIEN AMAZON]` dans le code et les contenus publiés ; **échoue en build de production** s'il en reste dans une page indexable (empêche une mise en ligne avec des trous).
- Accessibilité : un seul H1 par page, labels sur tous les champs, focus visible, contrastes AA, liens explicites. Mobile : lisible à 390 px, sans débordement horizontal, CTA diagnostic collant en bas sur mobile si le site en a déjà un (le réutiliser).
- Tests automatisés (avec le framework de test existant, sinon le plus léger compatible) :
  - téléchargement : sans session → 400/lien invalide ; session non payée → 403 ; mauvais produit/lien → 403 ; payée → 200 (Stripe mocké) ; aucun PDF accessible par URL publique ;
  - webhook : signature invalide → 400 ; événement rejoué → traité une seule fois ;
  - formulaires kit/formation/diagnostic : consentement manquant → refus ; honeypot rempli → ignoré ; e-mail invalide → refus ;
  - routes admin : non connecté → redirection/401 ; utilisateur non admin → 403 ; admin → 200 ;
  - `yearsOfExperience()` : 2026 → 23, 2027 → 24 (horloge mockée) ;
  - consentement cookies : GA non injecté avant acceptation ;
  - bascule `HOME_VARIANT` : `legacy` → ancienne page sur `/`, `v2` → nouvelle page sur `/` et ancienne sur `/home-legacy`.
- Non-régression manuelle documentée dans la PR : connexion, déconnexion, vérification d'e-mail, espace admin (suivi des achats), outils (Rétro IA, Scoring, Dashboard, Westrum), `/diagnostic`, `/salim`.

### 14. Variables d'environnement

Ajoute à `.env.example` (noms + commentaire, **sans valeur**), en **réutilisant** les noms Stripe déjà présents dans le dépôt si équivalents (ne renomme pas les variables existantes) :

| Variable | Rôle |
|---|---|
| `HOME_VARIANT` | `legacy` (défaut) ou `v2` |
| `FORMATIONS_PUBLISHED` | `true` pour indexer les pages formations (défaut : vide) |
| `SITE_URL` | `https://aigile.lu` |
| `CONTACT_EMAIL`, `SUPPORT_EMAIL` | [À COMPLÉTER] |
| `LEADS_NOTIFY_EMAIL`, `SALES_NOTIFY_EMAIL` | notifications à Salim |
| `STRIPE_RESTRICTED_KEY` | clé restreinte, lecture seule (Checkout Sessions, Payment Links, Products, Prices) |
| `STRIPE_WEBHOOK_SECRET` | secret de signature du webhook (réutiliser l'existant si présent) |
| `STRIPE_LINK_CAHIER_URL` / `_ID` | Payment Link Cahier |
| `STRIPE_LINK_LIVRE_PDF_URL` / `_ID` | Payment Link Livre PDF |
| `STRIPE_LINK_PACK_URL` / `_ID` | Payment Link Pack Système |
| `STRIPE_LINK_LICENCE_URL` / `_ID` | Payment Link Licence équipe |
| `STRIPE_LINK_LIVRE_PAPIER_URL` | Payment Link livre papier (existant ?) |
| `STRIPE_LINK_FORMATION_A_URL` / `_ID` | [LIEN STRIPE] place inter formation A |
| `PRIVATE_FILES_DIR` ou identifiants du stockage privé existant | PDF payants hors public |
| `KIT_PDF_URL` | URL du PDF du kit |
| `NEWSLETTER_PROVIDER` | `none` (défaut) / `brevo` / `kit` / `mailchimp` — [À CHOISIR par Salim] |
| `NEWSLETTER_API_KEY`, `KIT_LIST_ID` | si un outil est choisi |
| `GA_MEASUREMENT_ID` | `G-WMG8QLND8X` (identifiant public, peut rester en config) |
| `AMAZON_URL` | [LIEN AMAZON] (peut aussi être une constante) |
| Fournisseur d'e-mail transactionnel | réutiliser les variables existantes |

Les variables d'auth, d'admin et de base de données existantes ne changent pas.

### 15. Produits / prix / liens Stripe à lister dans la PR (à créer par Salim, d'abord en mode test)

Dans la description de la PR, un tableau « **À créer par Salim dans Stripe (mode test, puis live après validation)** » : nom du produit, prix, audience, redirection après paiement (`/telechargement?session_id={CHECKOUT_SESSION_ID}` pour les PDF), case CGV / renonciation obligatoire (custom field ou acceptation des CGV), collecte du nom de l'entreprise / n° TVA pour le B2B, variable d'environnement à remplir. Prix de départ (**hypothèses à valider par Salim**, ne pas les créer toi-même) : Cahier PDF 19 € · Livre PDF 39 € · Pack Système 79 € · Licence équipe 249 € HT · Place inter formation A 290 € · Livre papier 69 € + port (lien existant ?). Rappel : les liens de test ne se copient pas en live.

### 16. Description de la pull request (gabarit)

1. Résumé par lot, fichiers créés/modifiés.
2. Résultat de l'inspection (lien vers `INSPECTION.md`) et choix techniques (stockage PDF, e-mails, consentement).
3. Comment tester en local (commandes), avec Stripe CLI en mode test : `stripe listen --forward-to localhost:<port>/<route webhook>` puis `stripe trigger checkout.session.completed`.
4. Comment basculer l'accueil (`HOME_VARIANT`) et revenir en arrière.
5. Captures d'écran : accueil legacy, `/home-v2` (desktop + 390 px), `/mentions-legales`, `/cgv`, bandeau cookies, `/kit`, formations, écrans admin.
6. Tableau Stripe à créer (section 15).
7. Liste complète des `[À COMPLÉTER]` restants (sortie de `check:todo`).
8. Points de non-régression vérifiés (auth, admin, outils).
9. Confirmation explicite : **aucun déploiement, aucun secret commité, aucune opération Stripe live**.

```
FIN DU PROMPT
```

---

## Checklist de recette (Salim, avant toute fusion)
- [ ] Connexion, vérification d'e-mail et **espace admin (suivi des achats)** fonctionnent comme avant.
- [ ] `/` affiche l'ancienne page avec `HOME_VARIANT=legacy` ; `/home-v2` montre la nouvelle ; la bascule `v2` fonctionne et `/home-legacy` reste accessible.
- [ ] Design identique au site actuel (couleurs, polices, composants).
- [ ] Hero v2 sans secteur ; CTA principal → `/diagnostic` ; pas de bouton livre dans le hero.
- [ ] Années = année courante − 2003 partout ; 477 pages partout ; « 1 000+ personnes accompagnées » partout ; « 16 équipes en banque » ; plus aucun « 4.9/5 ».
- [ ] `/salim` : comparatif « vs Amazon » conservé, lien Amazon présent, prix vérifiés à la date indiquée.
- [ ] `/pricing`, `/skill-matrix`, `/prompts`, `/parcours` : hors menu, `noindex`, hors sitemap.
- [ ] `/mentions-legales` et `/cgv` en ligne en prévisualisation, liées dans tous les pieds de page, identité exacte (SIREN, SIRET, TVA, RNE, adresse), mention 293 B.
- [ ] Navigateur vierge : aucun appel Google Analytics avant « Accepter » ; « Refuser » aussi simple.
- [ ] Kit : inscription test → preuve de consentement enregistrée → e-mail J0 reçu avec le PDF → inscrit visible dans l'admin.
- [ ] Demande de formation / diagnostic test → visible dans le mini-CRM, statut et notes modifiables, export CSV lisible dans Excel.
- [ ] Achat test (carte 4242 4242 4242 4242) → `/telechargement` → PDF → e-mail de secours → vente visible dans le tableau des ventes.
- [ ] `/telechargement` sans session, avec faux ID, avec session d'un autre produit → refus ; aucun PDF payant par URL publique.
- [ ] `check:todo` : liste revue ; toutes les zones remplies avant mise en ligne.
- [ ] Aucun secret dans le diff de la PR.

## Ce que Salim doit fournir ou décider (hors agent)
- E-mail de contact professionnel ; hébergeur (confirmer celui détecté) ; médiateur de la consommation (adhésion nécessaire pour vendre aux particuliers).
- Confirmation du régime de TVA si le seuil de franchise est dépassé (comptable).
- `[LIEN AMAZON]` et date de vérification des prix Amazon.
- Outil d'e-mailing pour le kit et la séquence (Brevo, Kit, Mailchimp… ou `none`).
- Création des produits/prix/Payment Links Stripe en mode test, puis live après validation ; clé restreinte et secret de webhook (à saisir lui-même).
- PDF finaux (Cahier, Livre, Pack) et droits numériques du livre ; date et prix de la session inter (`[LIEN STRIPE]`).
- Conditions d'annulation, délais de support, durées de conservation ; relecture juridique des CGV.

## Pièces jointes à donner à l'agent (`/workspace/aigile-brief-final/`)
À copier dans le dépôt sous `docs/refonte/` :
- `brief-cursor.md` (ce brief) · `synthese-conseil-homepage.md` (spécification de l'accueil v2, à jour)
- `mentions-legales.md` · `cgv-produits-numeriques.md` · `cgv-formations-prestations.md`
- `page-de-vente.html` · `page-de-vente.md` (références de contenu ; **les décisions de ce brief priment** : CTA → `/diagnostic`, hero sans secteur, chiffres de la section 2, pas de comparatif Amazon sur l'accueil)
- `formations/fiche-formation-A.md` · `formations/fiche-formation-B.md` · `formations/page-inscription.html` (mention TVA et identité éditeur ajoutées)
- `kit/kit.html` · `kit/kit.pdf` · `kit/kit.md` · `kit/capture-page.md` · `kit/sequence-emails.md`
- `audit-site.md` (contexte : problèmes constatés le 27/10/2026)
