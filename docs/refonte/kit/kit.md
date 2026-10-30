# Livraison en retard : les 5 signaux à repérer avant votre prochain comité
## … et comment l'IA aide à les corriger (sans lui laisser la décision)

*Kit gratuit AIgile.lu · Auto-diagnostic en 10 minutes · 5 prompts IA prêts à l'emploi · Checklist DoR/DoD*
*Pour les managers, Scrum Masters et Product Owners, en particulier en banque et en assurance.*

> **Note de production (à retirer avant diffusion)** : version du 30/10/2026. Rien n'est publié. Les années d'expérience sont calculées automatiquement (année courante − 2003) dans `kit.html` ; dans le PDF généré en 2026, elles valent 23. Régénérer le PDF chaque année. Les zones `[À COMPLÉTER]` doivent être remplies avant diffusion. Aucun chiffre ni témoignage n'est inventé : les barèmes de l'auto-diagnostic sont des repères de lecture, pas une norme statistique.

---

## Pourquoi ce kit

Le sprint est « vert ». La démo s'est bien passée. Et pourtant, au comité, la date de mise en production recule encore.

Dans les équipes que j'accompagne depuis 2003, un retard de livraison est rarement une surprise : il s'annonce par des signaux faibles, visibles plusieurs sprints à l'avance. Le problème n'est pas de les voir, c'est qu'on ne les regarde pas au bon endroit. Les tableaux de bord montrent ce qui est « fait » dans l'outil, pas ce qui est réellement livré.

Ce kit vous donne :
1. **Les 5 signaux** qui annoncent un retard de livraison.
2. **Un auto-diagnostic noté** (10 minutes, seul ou en équipe) pour savoir lequel traiter en premier.
3. **5 prompts IA prêts à l'emploi**, un par signal, pour préparer le travail plus vite.
4. **Une checklist DoR / DoD** qui intègre ce que l'IA produit.
5. **Une prochaine étape** si vous voulez aller plus loin.

**La règle qui traverse tout le kit : l'IA propose, l'humain décide.** L'IA vous fait gagner du temps sur la préparation et l'analyse. La décision, l'arbitrage et l'engagement restent à votre équipe.

> ⚠️ **Avant d'utiliser un assistant IA** : respectez les règles de votre entreprise (outils autorisés, classification des données). En banque et en assurance, ne collez **jamais** de données clients, de données personnelles, de code ou de documents classés confidentiels dans un outil non validé par votre sécurité. Anonymisez, résumez, ou travaillez sur un exemple fictif.

---

## Les 5 signaux

### Signal 1 — Le « presque fini » s'accumule
**Ce que vous voyez** : beaucoup d'éléments « en cours », des stories à « 90 % » qui débordent d'un sprint sur l'autre, des démos qui montrent des morceaux plutôt qu'un résultat utilisable.
**Pourquoi c'est un signal** : quand l'équipe démarre plus qu'elle ne termine, le travail attend. Chaque élément en attente rallonge le délai de tous les autres.
**Ce que vous pouvez faire dès lundi** : comptez les éléments en cours par personne. Fixez une limite simple (par exemple : on ne démarre rien de nouveau tant qu'un élément bloqué n'est pas débloqué) et regardez la colonne « bloqué » en premier au daily.
**Où l'IA aide** : regrouper et résumer les éléments qui débordent pour trouver la cause commune (dépendance, taille, attente de validation). → *Prompt 1*

### Signal 2 — Les stories entrent en sprint sans être prêtes
**Ce que vous voyez** : des critères d'acceptation vagues ou absents, des questions découvertes au milieu du sprint, des stories redécoupées en urgence, des « on verra avec le métier ».
**Pourquoi c'est un signal** : une story floue n'est pas un engagement, c'est une hypothèse. Le temps perdu à clarifier pendant le sprint est du temps de livraison en moins.
**Ce que vous pouvez faire dès lundi** : adoptez une Definition of Ready courte (voir la checklist) et refusez poliment en planning ce qui ne la respecte pas.
**Où l'IA aide** : relire une story, signaler les ambiguïtés, proposer des critères d'acceptation testables et des questions à poser au métier. → *Prompt 2*

### Signal 3 — Les validations et dépendances bloquent en fin de chaîne
**Ce que vous voyez** : la sécurité, la conformité, le métier, l'architecture ou une autre équipe interviennent tard. Un environnement n'est pas prêt. Le livrable attend une signature.
**Pourquoi c'est un signal** : dans les organisations régulées, une partie importante du délai se joue hors de l'équipe. Si les validations sont découvertes à la fin, le retard est déjà là.
**Ce que vous pouvez faire dès lundi** : listez, pour les 3 prochaines livraisons, toutes les validations et dépendances nécessaires, avec un nom et une date. Rendez-les visibles sur le board.
**Où l'IA aide** : à partir de la description (anonymisée) d'une livraison, établir une liste des dépendances et validations probables à vérifier, sous forme de questions. → *Prompt 3*

### Signal 4 — « Fini » ne veut pas dire livré
**Ce que vous voyez** : des éléments « done » qui reviennent en correction, des anomalies trouvées après la démo, une documentation ou des tests faits « plus tard ». Et, de plus en plus, du code, des tests ou des textes produits par l'IA que l'on relit après coup.
**Pourquoi c'est un signal** : chaque retour en correction est un retard différé. Si la Definition of Done ne dit pas ce qui doit être vérifié, y compris ce que l'IA a produit, le « fini » est une impression, pas un fait.
**Ce que vous pouvez faire dès lundi** : relisez votre DoD en équipe. Ajoutez une ligne explicite sur la vérification humaine de tout contenu produit par l'IA.
**Où l'IA aide** : comparer un livrable à votre DoD et lister ce qui manque, avec les preuves attendues. → *Prompt 4*

### Signal 5 — Les prévisions sont devenues décoratives
**Ce que vous voyez** : l'écart entre engagé et livré se répète, les dates annoncées au comité sont revues à chaque fois, personne ne peut dire avec confiance « quand ce sera prêt ». La rétrospective ne change plus rien.
**Pourquoi c'est un signal** : une prévision qui n'est jamais confrontée à ce qui s'est réellement passé ne sert qu'à rassurer, jusqu'au jour où elle ne rassure plus.
**Ce que vous pouvez faire dès lundi** : notez, sprint après sprint, ce qui était engagé et ce qui a été réellement livré (en production ou accepté par le métier). Trois sprints suffisent pour voir une tendance. En rétrospective, choisissez une seule action et suivez-la.
**Où l'IA aide** : préparer une rétrospective centrée sur l'écart engagé / livré, avec des hypothèses de causes à discuter en équipe. → *Prompt 5*

---

## Auto-diagnostic (10 minutes)

**Comment faire** : pour chaque affirmation, notez votre équipe sur les **3 derniers sprints** (ou le dernier mois si vous travaillez en flux).
**0** = rarement ou jamais · **1** = parfois · **2** = souvent

Astuce : faites-le seul, puis demandez à 2 ou 3 membres de l'équipe de le remplir de leur côté. Les écarts de perception sont souvent aussi instructifs que les notes.

| # | Affirmation | 0 | 1 | 2 |
|---|---|---|---|---|
| **Signal 1 — Le « presque fini » s'accumule** | | | | |
| 1.1 | Des éléments passent d'un sprint au suivant sans être terminés. | ☐ | ☐ | ☐ |
| 1.2 | Chaque personne a plusieurs éléments « en cours » en même temps. | ☐ | ☐ | ☐ |
| 1.3 | Des éléments restent bloqués plusieurs jours sans que personne ne les remonte. | ☐ | ☐ | ☐ |
| **Signal 2 — Stories pas prêtes** | | | | |
| 2.1 | Des stories entrent en sprint sans critères d'acceptation clairs et testables. | ☐ | ☐ | ☐ |
| 2.2 | Des questions métier sont découvertes en cours de sprint. | ☐ | ☐ | ☐ |
| 2.3 | Des stories doivent être redécoupées ou réestimées pendant le sprint. | ☐ | ☐ | ☐ |
| **Signal 3 — Validations et dépendances tardives** | | | | |
| 3.1 | Une validation (sécurité, conformité, métier, architecture) est découverte en fin de chaîne. | ☐ | ☐ | ☐ |
| 3.2 | L'équipe attend une autre équipe, un fournisseur ou un environnement. | ☐ | ☐ | ☐ |
| 3.3 | Les dépendances ne sont pas visibles sur le board avec un responsable et une date. | ☐ | ☐ | ☐ |
| **Signal 4 — « Fini » n'est pas livré** | | | | |
| 4.1 | Des éléments « done » reviennent en correction ou génèrent des anomalies après la démo. | ☐ | ☐ | ☐ |
| 4.2 | Tests, revue ou documentation sont reportés « à plus tard ». | ☐ | ☐ | ☐ |
| 4.3 | Ce que l'IA produit (code, tests, textes) est relu après coup, ou sans critère explicite. | ☐ | ☐ | ☐ |
| **Signal 5 — Prévisions décoratives** | | | | |
| 5.1 | L'écart entre ce qui est engagé et ce qui est livré se répète d'un sprint à l'autre. | ☐ | ☐ | ☐ |
| 5.2 | Les dates annoncées à la direction ou au comité sont revues à la dernière minute. | ☐ | ☐ | ☐ |
| 5.3 | Les rétrospectives ne produisent pas d'action suivie jusqu'au bout. | ☐ | ☐ | ☐ |

### Vos scores

| Signal | Score (sur 6) |
|---|---|
| 1 — Le « presque fini » s'accumule | ___ |
| 2 — Stories pas prêtes | ___ |
| 3 — Validations et dépendances tardives | ___ |
| 4 — « Fini » n'est pas livré | ___ |
| 5 — Prévisions décoratives | ___ |
| **Total** | **___ / 30** |

### Comment lire le résultat
*Repères de lecture proposés par AIgile, pas une norme statistique.*

- **Par signal** : un signal à **4 ou plus sur 6** est votre priorité. S'il y en a plusieurs, commencez par celui qui est le plus en amont : **2** (stories pas prêtes) puis **3** (dépendances), puis **1**, **4** et **5**. Corriger l'amont fait souvent baisser les autres.
- **0 à 8 sur 30 — Sous contrôle.** Gardez la discipline : refaites ce diagnostic chaque trimestre.
- **9 à 17 sur 30 — À surveiller.** Choisissez un seul signal, appliquez l'action « dès lundi » et le prompt associé pendant 2 sprints, puis remesurez.
- **18 à 30 sur 30 — Dérapage installé.** Le retard est probablement structurel (organisation, dépendances, définition du « fini »). Traitez-le avec les décideurs concernés, pas seulement dans l'équipe. Un regard extérieur peut faire gagner du temps : voir « Prochaine étape ».

---

## 5 prompts IA prêts à l'emploi

**Mode d'emploi** : copiez le prompt, remplacez les zones `[entre crochets]` par des informations **anonymisées**, puis relisez la réponse avec la grille de vérification ci-dessous. Fonctionne avec un assistant IA conversationnel autorisé par votre entreprise.

**Grille de vérification humaine (après chaque réponse)**
- ☐ La réponse s'appuie-t-elle uniquement sur ce que j'ai fourni, ou invente-t-elle des faits ?
- ☐ Les hypothèses de l'IA sont-elles signalées comme des hypothèses ?
- ☐ Est-ce applicable dans notre contexte (règles, outils, contraintes réglementaires) ?
- ☐ Qui, dans l'équipe, valide et porte la décision ?

### Prompt 1 — Trouver la cause commune du « presque fini » (signal 1)
```
Tu es un coach agile expérimenté. Voici la liste anonymisée des éléments qui n'ont pas été terminés sur les [3] derniers sprints, avec leur statut et la raison connue du blocage :
[liste : titre court – statut – depuis combien de jours – raison du blocage si connue]

1. Regroupe ces éléments par cause probable (dépendance externe, taille trop grande, attente de validation, manque d'information, autre).
2. Pour chaque groupe, indique les éléments concernés et l'impact probable sur le délai.
3. Propose 3 actions concrètes et réalisables dès le prochain sprint, de la plus simple à la plus structurante.
4. Liste séparément tes hypothèses et les informations qui te manquent pour conclure.
Ne prends aucune décision à la place de l'équipe : présente des options.
```

### Prompt 2 — Rendre une story prête (signal 2)
```
Tu es un Product Owner rigoureux. Voici une user story anonymisée et ce que l'on sait du besoin :
[story : En tant que … je veux … afin de …]
[contexte : règles métier connues, contraintes, ce qui est hors périmètre]

1. Signale toutes les ambiguïtés et les termes qui peuvent être compris de deux façons.
2. Propose des critères d'acceptation testables au format Étant donné / Quand / Alors.
3. Liste les questions à poser au métier avant le prochain planning.
4. Si la story te paraît trop grosse pour un sprint, propose 2 ou 3 façons de la découper en éléments livrables séparément.
Distingue clairement ce qui vient de mon texte et ce que tu supposes.
```

### Prompt 3 — Rendre visibles les validations et dépendances (signal 3)
```
Tu aides une équipe de delivery dans une organisation régulée (banque ou assurance). Voici la description anonymisée d'une livraison prévue :
[ce qui change pour l'utilisateur, systèmes concernés en termes génériques, date visée]

1. Établis une liste des validations et dépendances qu'il faut vérifier (par exemple sécurité, conformité, métier, architecture, exploitation, autres équipes, environnements, fournisseurs), sous forme de questions à poser.
2. Pour chacune, indique à quel moment il serait raisonnable de la lancer pour ne pas bloquer la fin de chaîne.
3. Présente le résultat sous forme de tableau : dépendance / question à poser / qui contacter (rôle) / date limite proposée.
Ne présente pas ces éléments comme des obligations réglementaires : ce sont des points à vérifier avec les personnes responsables dans mon entreprise.
```

### Prompt 4 — Vérifier un livrable contre la Definition of Done (signal 4)
```
Voici notre Definition of Done :
[coller votre DoD]

Voici la description anonymisée d'un élément que l'équipe considère comme terminé, avec les preuves disponibles (tests passés, revue faite, documentation, validation métier) :
[description + preuves]

1. Pour chaque ligne de la DoD, indique : respectée / non respectée / impossible à dire, et la preuve attendue.
2. Signale en particulier ce qui a été produit par l'IA et qui n'a pas de trace de vérification humaine.
3. Termine par la liste des actions à faire avant de déclarer l'élément livré.
Tu n'as pas le droit de déclarer l'élément livré : c'est la décision de l'équipe.
```

### Prompt 5 — Préparer une rétrospective sur l'écart engagé / livré (signal 5)
```
Tu es facilitateur de rétrospective. Voici, pour les [3] derniers sprints, ce que l'équipe avait engagé et ce qui a été réellement livré (accepté par le métier ou mis en production) :
[sprint – engagé – livré – faits marquants]

1. Décris l'écart de façon factuelle, sans jugement sur les personnes.
2. Propose 3 à 5 hypothèses de causes, formulées comme des questions à discuter en équipe.
3. Propose un déroulé de rétrospective de 45 minutes pour explorer ces hypothèses.
4. Aide l'équipe à formuler UNE seule action, avec un responsable, une date et un moyen de vérifier si elle a fonctionné.
```

---

## Checklist DoR / DoD (à adapter avec votre équipe)

### Definition of Ready — une story peut entrer en sprint si…
- ☐ Le besoin est formulé du point de vue de l'utilisateur, avec le « pourquoi ».
- ☐ Les critères d'acceptation sont écrits, testables et compris par toute l'équipe.
- ☐ La story est assez petite pour être terminée dans le sprint.
- ☐ Les dépendances (autres équipes, environnements, fournisseurs) sont identifiées, avec un responsable et une date.
- ☐ Les validations nécessaires (sécurité, conformité, métier) sont identifiées et planifiées.
- ☐ Les données de test nécessaires sont disponibles ou anonymisées.
- ☐ Si l'IA est utilisée : l'outil est autorisé, les données qu'on peut lui fournir sont connues, et on sait qui vérifiera ce qu'elle produit.
- ☐ Le Product Owner est disponible pour répondre aux questions pendant le sprint.

### Definition of Done — un élément est livré si…
- ☐ Tous les critères d'acceptation sont vérifiés.
- ☐ Le code a été relu par au moins une autre personne.
- ☐ Les tests prévus passent (unitaires, intégration, non-régression selon votre contexte).
- ☐ **Tout contenu produit par l'IA (code, tests, documentation, textes) a été vérifié par un humain identifié**, avec une trace de cette vérification.
- ☐ Aucune donnée confidentielle n'a été transmise à un outil non autorisé.
- ☐ Les validations requises (sécurité, conformité, métier) sont obtenues et tracées.
- ☐ La documentation utile à l'exploitation et aux utilisateurs est à jour.
- ☐ L'élément est déployable (ou déployé) sur l'environnement cible prévu.
- ☐ Le Product Owner ou le métier l'a accepté.

*Règle AIgile : l'IA déclare, l'humain décide. Toute transition faite par l'IA laisse une trace et reste révocable.*

---

## Prochaine étape

**Vous avez un ou plusieurs signaux à 4 ou plus ? Parlons-en 30 minutes.**

### Diagnostic flash — 30 minutes, gratuit, en visio
Vous m'expliquez votre contexte, nous passons en revue vos résultats, et vous repartez avec une photo nette de la situation et 2 à 3 priorités. Vous recevez un compte rendu d'une page sous 24 h ouvrées. Si vous pouvez avancer seuls, je vous le dis.
→ **Réserver un diagnostic : https://aigile.lu/diagnostic**

### Former votre équipe (intra-entreprise)
- **« Agile + IA : démarrer »** — 1 jour pour une équipe qui débute ou qui intègre l'IA. **À partir de 2 000 € HT pour 8 personnes**, sur devis.
- **« Livraison fiable avec l'IA : DoR/DoD, rétro, scoring »** — 2 jours avec votre équipe, sur votre backlog réel. Sur devis.
→ **Découvrir les formations : [LIEN PAGE FORMATIONS — À COMPLÉTER]**

### Aller plus loin seul
- ***Le Système S.A.L.I.M.*** — le livre : 477 pages, 19 chapitres, 93 prompts documentés. → https://aigile.lu/salim
- **Outils gratuits** : Rétro IA (https://aigile.lu/retro) et Westrum Culture Survey (https://aigile.lu/dashboard/westrum).

---

## Qui suis-je

**Salim Gomri** — coach agile « augmenté par l'IA », fondateur d'AIgile.lu et auteur du *Système S.A.L.I.M.* (477 pages).
Sur le terrain agile depuis 2003, soit **23 ans** d'expérience *(calcul automatique : année en cours − 2003)*, j'accompagne des équipes, des managers et des directions : 16 équipes en banque, plus de 1 000 personnes accompagnées. Mentor Product Manager chez OpenClassrooms.

*Le livre expose le système. Le coaching l'installe.*

---

*© [année en cours] Salim GOMRI EI (GO-COACH) · AIgile.lu · SIREN 891 268 245 · 50 Grand'Rue, 57280 Maizières-lès-Metz, France · Contact : [À COMPLÉTER : e-mail de contact]. Prix des formations : TVA non applicable, art. 293 B du CGI [À CONFIRMER si le seuil de franchise est dépassé].*
*Ce kit est fourni gratuitement à titre informatif. Il ne remplace pas un avis adapté à votre situation. Vous pouvez le partager tel quel, sans modification et en citant la source.*
