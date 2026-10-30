# Séquence de bienvenue — Kit « 5 signaux » (5 e-mails, J0 à J10)
*À programmer dans l'outil d'e-mailing [À CHOISIR par Salim : Brevo / Kit / autre]. Rien n'est envoyé. Vouvoiement. Un seul appel à l'action principal par e-mail. Aucun chiffre ni témoignage inventé : les zones [À COMPLÉTER] / [À CONFIRMER] sont à remplir par Salim.*

**Paramètres communs**
- Expéditeur : Salim Gomri — AIgile · [À COMPLÉTER : adresse d'envoi, ex. salim@aigile.lu]
- Répondre à : [À COMPLÉTER : même adresse]
- Variables : `{{prenom}}` (si absent : « Bonjour, »), `{{annees}}` = année en cours − 2003 (calcul automatique ; sinon écrire « depuis 2003 »).
- Pied de page de chaque e-mail :
  > Vous recevez cet e-mail parce que vous avez demandé le kit « 5 signaux » sur aigile.lu. [Se désinscrire en un clic] · [Politique de confidentialité](https://aigile.lu/privacy)
  > Salim GOMRI EI (GO-COACH) · AIgile.lu · 50 Grand'Rue, 57280 Maizières-lès-Metz, France
- UTM : `?utm_source=email&utm_medium=sequence&utm_campaign=bienvenue-kit&utm_content=j0` (j2, j4, j7, j10).
- Règle de sortie : toute personne qui réserve un diagnostic sort de la séquence (si l'outil le permet), pour ne pas recevoir l'invitation J7 après coup.

---

## E-mail 1 — J0 (immédiat) : le kit
**Objet** : Votre kit « 5 signaux » est là
**Pré-en-tête** : 10 minutes pour savoir où votre livraison coince.

Bonjour {{prenom}},

Merci pour votre demande. Voici votre kit :
**→ [Télécharger le kit « 5 signaux » (PDF)]({{KIT_PDF_URL}})**

Mon conseil pour en tirer le maximum :
1. Remplissez l'auto-diagnostic (page 5) en pensant à vos **3 derniers sprints**, pas au sprint idéal.
2. Demandez à 2 ou 3 personnes de votre équipe de le remplir de leur côté.
3. Comparez. Les écarts de perception sont souvent aussi instructifs que les notes.

Gardez en tête la règle qui traverse tout le kit : **l'IA propose, l'humain décide.** Les 5 prompts vous font gagner du temps ; la décision reste à votre équipe.

Dans deux jours, je vous parle du signal par lequel je commence presque toujours.

Salim
*Coach agile depuis 2003, auteur du* Système S.A.L.I.M.

P.-S. Une question sur votre résultat ? Répondez simplement à cet e-mail, je lis les réponses.

---

## E-mail 2 — J2 : commencer par l'amont
**Objet** : Le signal par lequel je commence presque toujours
**Pré-en-tête** : Avant d'accélérer, regardez ce qui entre dans le sprint.

Bonjour {{prenom}},

Quand une équipe livre en retard, le réflexe est de regarder la fin de la chaîne : les tests, la mise en production, les validations.

Je commence presque toujours par l'autre bout : **ce qui entre dans le sprint** (signal 2 du kit). Une story sans critères d'acceptation testables n'est pas un engagement, c'est une hypothèse. Chaque question découverte au milieu du sprint est du temps de livraison en moins, et elle se paie souvent en fin de chaîne.

**À essayer cette semaine (15 minutes)** :
1. Prenez les 3 prochaines stories du backlog.
2. Passez-les dans le **prompt 2** du kit (« Rendre une story prête »), avec des informations anonymisées.
3. Ne gardez de la réponse que ce que l'équipe valide : les ambiguïtés réelles, les questions à poser au métier, les critères que vous auriez pu oublier.

Puis vérifiez-les avec la Definition of Ready de la page 9. Si une story ne passe pas, elle n'entre pas. C'est souvent la décision la plus rentable du sprint.

Salim

P.-S. Ce sujet est développé dans *Le Système S.A.L.I.M.* [À COMPLÉTER : numéro et titre du chapitre concerné]. → [Découvrir le livre](https://aigile.lu/salim)

---

## E-mail 3 — J4 : « fini » n'est pas livré
**Objet** : Une release « réussie »… et des semaines de reprise
**Pré-en-tête** : Ce que les tableaux de bord ne montrent pas.

Bonjour {{prenom}},

[À CONFIRMER par Salim : anecdote déjà publiée sur aigile.lu/salim — vérifier les détails avant envoi, ou la remplacer par un autre cas réel anonymisé] En 2009, j'ai vu une release considérée comme « réussie » coûter ensuite six semaines de reprise. Sur le tableau de bord, tout était terminé. Dans la réalité, une partie du travail n'était pas livrée : elle était reportée.

C'est le **signal 4** du kit : « fini » ne veut pas dire livré. Et il devient plus fréquent avec l'IA. Elle produit vite du code, des tests, de la documentation. Si personne n'a défini qui vérifie, quoi et quand, on relit après coup, ou pas du tout.

**Une seule ligne à ajouter à votre Definition of Done** :
> Tout contenu produit par l'IA (code, tests, documentation, textes) a été vérifié par un humain identifié, avec une trace de cette vérification.

Le **prompt 4** du kit vous aide à comparer un livrable à votre DoD. Il a une consigne importante : l'IA n'a pas le droit de déclarer l'élément livré. C'est votre équipe qui décide.

Salim

---

## E-mail 4 — J7 : invitation au diagnostic flash
**Objet** : 30 minutes pour regarder vos résultats ensemble ?
**Pré-en-tête** : Gratuit, sans engagement, compte rendu d'une page sous 24 h.

Bonjour {{prenom}},

Vous avez peut-être rempli l'auto-diagnostic. Si un ou plusieurs signaux sont à 4 ou plus sur 6, ou si votre total dépasse 18, le retard est probablement structurel : il se joue en partie hors de l'équipe (dépendances, validations, arbitrages).

Dans ce cas, je vous propose un **diagnostic flash de 30 minutes**, en visio et gratuit :
- vous m'expliquez votre contexte et vos résultats ;
- nous identifions ensemble 2 à 3 priorités ;
- vous recevez un **compte rendu d'une page sous 24 h ouvrées**.

Si vous pouvez avancer seuls avec ces priorités, je vous le dis. Je préfère perdre une mission que vendre de l'inutile.

**→ [Réserver mon diagnostic de 30 minutes](https://aigile.lu/diagnostic?utm_source=email&utm_medium=sequence&utm_campaign=bienvenue-kit&utm_content=j7)**

Salim
*Coach agile depuis 2003 ({{annees}} ans de terrain), 16 équipes en banque, 1 000+ personnes accompagnées.*

---

## E-mail 5 — J10 : former l'équipe (et aller plus loin)
**Objet** : Installer ces réflexes dans toute l'équipe
**Pré-en-tête** : Deux formats de formation intra, sur votre cas réel.

Bonjour {{prenom}},

Le kit vous aide à voir les signaux. Pour que toute l'équipe change ses réflexes, le plus efficace reste de travailler ensemble, sur votre propre backlog.

Je propose deux formations **intra-entreprise** :

**« Agile + IA : démarrer » — 1 jour**
Pour une équipe qui débute en agile ou qui commence à utiliser l'IA : stories et critères d'acceptation, DoR/DoD avec l'IA, rétrospective et scoring de livrables. **À partir de 2 000 € HT pour 8 personnes**, sur devis.

**« Livraison fiable avec l'IA : DoR/DoD, rétro, scoring » — 2 jours**
Pour une équipe qui livre déjà et veut fiabiliser sa livraison : DoR/DoD adoptées par l'équipe, grille de contrôle de ce que produit l'IA, indicateurs de livraison, plan d'action à 30 jours. **Sur devis.**

*TVA non applicable, art. 293 B du CGI [À CONFIRMER si le seuil de franchise est dépassé].*

**→ [Découvrir les formations]([À COMPLÉTER : LIEN PAGE FORMATIONS])**
Ou, si vous préférez en parler d'abord : [réserver un diagnostic de 30 minutes](https://aigile.lu/diagnostic?utm_source=email&utm_medium=sequence&utm_campaign=bienvenue-kit&utm_content=j10).

Et si vous préférez avancer seul : *Le Système S.A.L.I.M.* (477 pages, 19 chapitres, 93 prompts documentés) détaille tout le système. → [Découvrir le livre](https://aigile.lu/salim)

C'était le dernier e-mail de cette série. [Si la case newsletter a été cochée : « Vous continuerez à recevoir environ une fois par mois des nouvelles d'AIgile. » Sinon : « Je ne vous écrirai plus sans raison. Vous pouvez toujours me répondre directement. »]

Merci de m'avoir lu,
Salim

---

## Indicateurs à suivre (sans objectif inventé)
Taux d'ouverture et de clic par e-mail, désinscriptions, réponses directes, diagnostics réservés depuis J7/J10 (UTM), demandes de devis formation.
