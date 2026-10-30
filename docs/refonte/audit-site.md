# Audit critique d'aigile.lu
*27/10/2026, heure de Paris. Pages lues en direct (WebFetch, curl, rendu Chrome headless 390 px et 1366 px). Rien n'a été modifié sur le site.*

> **Résumé en une phrase** : le site a beaucoup de matière (livre, framework, manifeste, outils, une très bonne page `/diagnostic`), mais il parle à trois publics à la fois (acheteur d'un livre, utilisateur d'outils, DSI qui cherche un coach). Le visiteur B2B, celui qui peut signer une mission, n'a pas de chemin clair, et plusieurs signaux font douter (pages vides, chiffres qui ne concordent pas, aucune mention légale).

---

## 1. Ce que j'ai vérifié

| URL | Statut | Contenu constaté |
|---|---|---|
| `/` (accueil) | 200 | H1 « J'installe le Système S.A.L.I.M. dans vos équipes », CTA Calendly « Réserver un échange coaching », bouton livre 69 €, 3 témoignages (Nicolas Schell, Nouna Sehili, David Mansy), outils, manifeste |
| `/salim` | 200 | Page de vente du livre : 3 formats Livre 69 € / Fiches 49 € / Collection 110 €, comparaison « vs Amazon » (79 € / 59 € / 138 €), 2 témoignages anonymes, mini-cas « ~30/100 → >55/100 » |
| `/diagnostic` | 200 | **Meilleure page du site** : appel découverte 30 min, 5 signaux, formulaire 4 champs puis Calendly, Sprint court 4-6 sem. / Transformation 16-20 sem., FAQ |
| `/framework` | 200 | Cadre AIgile v1.4, guide FR/EN téléchargeable, 3 articles LinkedIn |
| `/manifesto` | 200 | 4 valeurs, 10 principes |
| `/tools` | 200 | Suite d'outils, bandeau « 4.9/5 \| 1000+ agilists FR/Lux » |
| `/retro` | 200 | Outil Rétro IA gratuit (questionnaire 8 questions, rétro aléatoire) |
| `/scoring-deliverable` | 200 | Questionnaire libre, rapport après connexion, débit de crédits |
| `/dashboard-manager`, `/dashboard/westrum` | 200 | Outils fonctionnels (crédits pour le Dashboard) |
| `/salim-qa` | 200 | « Accès sur invitation » |
| `/parcours` | 200 | 4 profils (Lanceur, Stabilisateur, Mesureur, Augmenteur), puis « Très bientôt… » |
| `/prompts` | 200 | « Bientôt disponible » |
| `/skill-matrix` | 200 | « **Ouverture prévue le 31 décembre 2099** » |
| `/pricing` | 200 | **Vide** (titre « Tarifs AIgile \| Abonnements Coaching… », aucun tarif) |
| `/about` | 200 | Page de liens (livre, univers, LinkedIn, RDV) |
| `/privacy` | 200 | Politique de confidentialité (mars 2026), contact Gmail |
| `/login` | 200 | « Chargement… » |
| `/cahier`, `/cahier-pratique`, `/livre`, `/contact`, `/mentions-legales`, `/cgv`, `/blog`, `/articles`, `/coaching`, `/entreprises`, `/a-propos`, `/en` | **404** | — |
| `robots.txt`, `sitemap.xml` | 200 | Sitemap = 15 URL, dont `/pricing` (vide), `/prompts` et `/parcours` (inachevées) |

Écosystème : **gomri.coach** (site perso + 3 CV), **LinkedIn** (titre : « Agile Coach & IA | J'aide les DSI à débloquer les transformations agiles qui patinent, sans casser ce qui marche | 23 ans de terrain, 16 équipes en banque | Auteur du Système S.A.L.I.M. »).

---

## 2. Problèmes classés par gravité

### 🔴 CRITIQUE (bloque les contacts, les ventes ou la confiance)

**C1. Pas de chemin B2B visible depuis l'accueil, alors que c'est l'objectif n°1 (missions).**
La page `/diagnostic` est bien construite (qualification en 4 champs, promesse claire, « Sprint court ou transformation »), mais **elle n'est pas liée depuis l'accueil**. Le CTA principal envoie directement vers un Calendly générique (`calendly.com/salimdulux/30min`), sans qualification ni promesse précise. Aucune page « Entreprises » ou « Offres » (le lien de pied de page « Entreprises » pointe vers une ancre `#entreprises` qui n'existe pas).
→ **Correction** : faire du diagnostic **le CTA principal** de tout le site (« Réserver un diagnostic de 30 min »), mettre `/diagnostic` en menu, et créer une section « Pour les entreprises » avec 3 offres et un prix « à partir de ».

**C2. Aucune mention légale, aucune CGV, alors que le site encaisse des paiements.**
`/mentions-legales` et `/cgv` sont en 404, aucun SIRET ni adresse d'éditeur trouvé dans le HTML. En France, les mentions légales sont obligatoires pour un site professionnel (loi LCEN), et les CGV le sont pour une vente à des consommateurs (avec l'information sur le droit de rétractation). Un acheteur B2B (achats bancaires) le remarquera aussi.
→ **Correction** : publier `/mentions-legales` et `/cgv` (base : `/workspace/cahier-pratique-stripe/cgv.md`), lien dans chaque pied de page, adresse e-mail professionnelle. *À valider par un juriste/comptable.*

**C3. Comparaison de prix « vs Amazon » non vérifiable.**
`/salim` affiche « Amazon : 79,00 € », « Valeur Amazon : 138,00 € », « économie de 28 € vs Amazon ». Je **n'ai trouvé aucune fiche Amazon publique** du livre (et les posts LinkedIn renvoient uniquement vers aigile.lu). Une comparaison avec un prix qui n'est pas réellement pratiqué peut être vue comme une **pratique commerciale trompeuse**.
→ **Correction** : si le livre n'est pas réellement en vente à ce prix sur Amazon, **retirer immédiatement** les mentions « vs Amazon ». Sinon, ajouter le lien vers la fiche.

**C4. Chiffres qui se contredisent d'une page à l'autre (crédibilité).**

| Donnée | aigile.lu (accueil) | aigile.lu (autres pages) | gomri.coach | LinkedIn |
|---|---|---|---|---|
| Années de terrain | 23 ans | 23 ans | **21 ans** (et « 22 ans » dans la section livres) | 23 ans |
| Personnes accompagnées | **2 000** | « **1000+ agilists** » (/tools) | **700+** | — |
| Équipes | — | « 1 → 13 équipes » (/diagnostic) | 50+ projets | **16 équipes en banque** |
| Pages du livre | — | **477** pages (/salim, /diagnostic) | **415** pages | — |
| Note | — | « **4.9/5** » (/tools), source inconnue | — | — |
| Nom S.A.L.I.M. | Scrum Augmenté, Livré en Incrémental et Mesuré | idem | — | CV : « Scrum Augmented **Lead Increase** & Measure » |

Un décideur qui compare deux pages voit l'incohérence. « 4.9/5 » sans source ressemble à un avis inventé (risque juridique sur les avis clients).
→ **Correction** : une seule fiche de chiffres (« source de vérité ») et la même partout. Retirer « 4.9/5 » tant qu'aucune source vérifiable n'existe.

**C5. Le livre est vendu uniquement en physique, avec intervention manuelle.**
« Envoi postal 5 € ou retrait », « contacte-moi après commande pour convenir du lieu », « stock limité ». C'est l'inverse d'un revenu passif, et les posts LinkedIn parlent de premiers tirages presque épuisés (« Il reste 6 exemplaires de la première impression »). Pas de version numérique, pas de page Cahier (`/cahier` 404).
→ **Correction** : ajouter une version numérique (PDF) avec livraison automatique (voir `brief-cursor.md`) et garder le papier dédicacé comme option « premium ».

### 🟠 MAJEUR (fait perdre des prospects)

**M1. Trois promesses concurrentes sur l'accueil.** « J'installe le Système S.A.L.I.M. dans vos équipes » (coaching), « Commencez à mesurer ce que l'IA livre vraiment » (livre), « Outils professionnels pour équipes performantes » (SaaS). Le visiteur doit deviner ce qu'on attend de lui. Le titre LinkedIn (« J'aide les DSI à débloquer les transformations agiles qui patinent ») est **plus clair que le site** et n'y apparaît pas.
→ Une promesse unique tournée vers l'acheteur B2B, le livre en preuve d'autorité, les outils en aimant gratuit.

**M2. Cible floue.** Le site parle tour à tour à « tu » (praticien) et « vous » (entreprise), au Scrum Master et au DSI. L'acheteur de missions (DSI, directeur de transformation, responsable PMO, sponsor) n'a pas de section qui lui parle de ses enjeux (budget, délais, adoption, IA, comité).
→ « Vous » sur la page entreprises ; « tu » réservé aux contenus praticiens. Section « Pour qui » explicite.

**M3. Pages vides, « bientôt » et date 2099.** `/pricing` vide mais indexée dans le sitemap, `/prompts` « Bientôt », `/parcours` se termine sur « Très bientôt… », `/skill-matrix` « 31 décembre 2099 », Q&A Lab « sur invitation », 4 outils « en préparation ». Ensemble, cela donne une impression de chantier.
→ Retirer du menu et du sitemap tout ce qui n'est pas prêt, ou le remplacer par « Inscrivez-vous pour être prévenu » (ce qui capte un e-mail).

**M4. Aucune capture d'e-mail.** Pas de newsletter, pas de lead magnet, pas de formulaire hors `/diagnostic`. Les visiteurs venus de LinkedIn qui ne sont pas prêts à acheter repartent sans laisser de trace.
→ Lead magnet (ex. « Auto-diagnostic : 5 signaux que votre transformation dérape » ou « Chapitre 1 du livre »), formulaire e-mail, séquence de 5 e-mails.

**M5. Preuve sociale existante mais mal exploitée.** Les 3 témoignages nommés sont un vrai atout (liens LinkedIn), mais :
- les titres des auteurs sont tronqués (« 9 ans de collaboration · secteur bancaire ») alors que gomri.coach affiche « Head of Digital Transformation, BIL » ;
- `/diagnostic` cite « Cas : Financière Média (1-2 ans → 2-3 sem.) · BIL à grande échelle » sans explication ;
- `/salim` contient 2 témoignages **anonymes** et un mini-cas chiffré (« ~30/100 → au-dessus de 55/100 ») sans source ni méthode, et la promesse « le livre explique comment doubler ce score ».
→ Garder les témoignages nommés **avec accord écrit** pour l'usage commercial, ajouter fonction et entreprise si autorisé, transformer « Financière Média » et « BIL » en 2 études de cas courtes (contexte, action, résultat, accord du client). Retirer ou sourcer les chiffres « 30/100 → 55/100 » et « doubler ce score ».

**M6. Contact peu professionnel.** `salim.gomri@gmail.com`, Calendly `salimdulux`, téléphone +33 sur une marque `.lu`. Pour un acheteur bancaire luxembourgeois, une adresse `@aigile.lu` rassure davantage.
→ Adresse `contact@aigile.lu` (ou `salim@aigile.lu`), Calendly renommé.

**M7. Cookies / Google Analytics sans bandeau visible.** Le HTML charge Google Analytics (`G-WMG8QLND8X`) ; je n'ai trouvé aucun bandeau de consentement dans le rendu. La CNIL exige un consentement préalable pour ce type de traceur. *À vérifier dans un navigateur.*
→ Bandeau de consentement ou outil de mesure exempté (ex. Plausible/Matomo configuré en mode exempté).

**M8. Positionnement « product management » absent.** Le site ne parle que de Scrum, alors que le profil de Salim inclut le product management (mentor Product Manager chez OpenClassrooms selon son CV, gestion de projets, fintech). C'est un marché d'acheteurs plus large (product + IA).
→ Ajouter « Product & delivery augmentés par l'IA » dans la promesse et une offre « Diagnostic produit & livraison ».

### 🟡 MOYEN

- **m1. Cohérence gomri.coach ↔ aigile.lu** : gomri.coach propose aussi « Création de site web » et a ses propres chiffres ; il dilue le positionnement. → Faire de gomri.coach une page « auteur / CV » qui renvoie vers aigile.lu pour toute offre ; supprimer l'offre « site web » ou la séparer.
- **m2. Compteurs animés** : sur `/salim` et gomri.coach, les compteurs valent « 0 » dans le HTML servi (avant JavaScript) et affichent des valeurs intermédiaires pendant l'animation (capture : « 247+ rétrospectives », « 393 pages »). Google et les aperçus LinkedIn voient « 0+ années ». → Écrire la valeur finale dans le HTML.
- **m3. Bouton « Acheter le livre » désactivé dans le HTML serveur** (attribut `disabled`), activé après chargement JavaScript. Sans JS, ou si le script plante, on ne peut pas acheter. → Utiliser un vrai lien `<a href>` vers le paiement.
- **m4. Mélange FR/EN** : textes du Scoring bilingues dans la même page (« Une seule équipe A single team »), méta-description de `/framework` en anglais, bouton EN/FR alors que `/en` est en 404.
- **m5. SEO de base** : titres trop génériques et répétés (`/prompts` et `/scoring-deliverable` reprennent le titre de l'accueil), un seul mot-clé utile (« coaching agile Luxembourg ») ; pas de page article/blog alors que 18 articles existent sur LinkedIn ; `/pricing` vide indexé. Points positifs : `lang="fr"`, balise canonical, Open Graph et Twitter Card, données structurées `Book` et `ProfessionalService`, robots.txt et sitemap. → Titres uniques par page, une page « Articles » qui republie les meilleurs posts/articles, retirer du sitemap les pages vides, ajouter les données `Person` et `Offer` des services.
- **m6. Le Q&A Lab est « 1 crédit par réponse »** mais le prix d'un crédit n'est affiché nulle part.
- **m7. Licence Retromat** : le site cite « 146 activités Retromat ». Retromat est un projet tiers : vérifier sa licence avant de monétiser l'outil Rétro (déjà signalé dans `etude-aigile.md`).

### 🟢 MINEUR
- Logo « AI gile » qui se coupe en deux mots dans certains en-têtes (texte « A AI gile » dans le HTML).
- Bouton « Offrir un café » dans le pied de page : peu cohérent avec un positionnement B2B premium.
- Pied de page avec des ancres (`#book`, `#cards`, `#contact`) qui ne fonctionnent que sur l'accueil.

### ✅ Ce qui marche (à garder)
- Le **titre de l'accueil à la 1ʳᵉ personne** et la phrase « Le livre expose le système. Le coaching l'installe. » : excellent pont livre → mission.
- La **page `/diagnostic`** : structure de page de vente B2B très correcte (problème en 5 signaux, déroulé de l'appel, 2 chemins, FAQ, formulaire qualifiant). C'est le modèle à généraliser.
- Le **mobile** : rendu propre à 390 px (capture), CTA collant en bas d'écran « Réserver un échange coaching », boutons larges.
- Le manifeste et le framework : vraie matière d'autorité, téléchargeables.
- Des outils gratuits réellement utilisables (Rétro IA, Westrum) : parfaits comme aimants.

---

## 3. Le tunnel actuel, étape par étape

| Étape | Aujourd'hui | Problème | Cible |
|---|---|---|---|
| LinkedIn → site | « Lien en commentaire » vers l'accueil | Atterrissage générique | Lien vers une page précise (diagnostic, lead magnet, livre) avec UTM |
| Visiteur → contact | Calendly direct ou `/diagnostic` (caché) | Pas de qualification depuis l'accueil, pas de capture e-mail | CTA unique « Diagnostic 30 min » + aimant gratuit pour les « pas encore prêts » |
| Contact → proposition | Hors site | Pas de fourchette de prix, pas d'offres nommées | 3 offres nommées avec « à partir de » |
| Visiteur → achat livre | Paiement puis envoi postal ou rendez-vous | Manuel, stock limité, pas de numérique | PDF à téléchargement automatique + papier dédicacé |
| Achat → client B2B | Rien | Les acheteurs du livre ne sont jamais relancés | Séquence e-mail post-achat → atelier / diagnostic |

---

## 4. Top 10 des corrections, par ordre

1. Lier `/diagnostic` depuis l'accueil et en faire le CTA principal (1 h).
2. Retirer les comparaisons « vs Amazon » si elles ne sont pas réelles (15 min).
3. Publier mentions légales + CGV (1 jour, base `cgv.md`).
4. Unifier les chiffres sur les 3 supports, retirer « 4.9/5 » (1 h).
5. Retirer `/pricing`, `/prompts`, `/skill-matrix` du menu/sitemap ou les transformer en « liste d'attente » (1 h).
6. Nouvelle page d'accueil orientée missions (voir `page-de-vente.html`).
7. Lead magnet + formulaire e-mail (voir `offre.md`).
8. Version PDF du livre et du Cahier avec livraison automatique (voir `brief-cursor.md`).
9. Adresse e-mail `@aigile.lu`, bandeau cookies.
10. 2 études de cas validées par les clients (BIL, Financière Média) si accord.

*Limites : mobile vérifié par capture d'écran headless à 390 px (accueil, /salim, /diagnostic), pas sur un vrai téléphone. Les obligations légales citées sont des points d'attention, pas un avis juridique. Le profil LinkedIn n'a été lu que via les résultats de recherche (pas de connexion).*
