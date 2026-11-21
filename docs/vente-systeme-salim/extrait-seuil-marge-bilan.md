# Extrait, seuil, marge, bilan à J+14

Date : 21 novembre 2026. Aucune publication, aucune dépense.

## Extrait

Passage déjà publié par Salim Gomri sur aigile.lu, source `lib/landing/book-landing-copy.ts`.

> Scrum Augmenté, Livré en Incrémental et Mesuré : les humains posent le cadre, l’IA produit dedans, et vous suivez la maturité de livraison sprint après sprint.
>
> On ne fait pas plus agile. On fait AIgile : augmenter le Scrum avec l’IA, sans laisser l’IA décider.

- Droits : l’auteur est Salim Gomri. Le texte est le sien et il l’a déjà publié sur son site.
- Validation de ce passage pour la fiche : **à confirmer par Salim**. Le oui du 21 novembre 2026 valide la présence d’un extrait, pas ces deux phrases en particulier.
- Lecture : `https://aigile.lu/salim/extrait`, sur mobile, sans formulaire.

## Seuil

Proposition confirmée par Salim le 21 novembre 2026 : **5 commandes payées en 14 jours**.

Commande payée = statut `paid`, `fulfilled`, `shipped` ou `complete`, montant supérieur à 0, hors coupon `TEST100`.

## Marge par vente, avant la première publication

Recette affichée et encaissée pour une vente livrée du livre : **74,00 €** (69,00 € + 5,00 € de port).

Coûts absents du dépôt, non inventés :

- coût unitaire du livre (impression, KDP ou achat) : **à vérifier**
- frais Stripe : montant réel `orders.stripe_fee_amount`, inconnu avant le premier paiement

Marge par vente = 74,00 € − coût unitaire − frais Stripe.

Tant que le coût unitaire n’est pas écrit, la marge nette n’est pas un chiffre. La première publication LinkedIn attend ce coût.

## Bilan à J+14

À remplir quatorze jours après la première publication. Lecture : `/salim/suivi` (compte admin).

| | |
|---|---|
| Date de publication | |
| Visites extrait | |
| Visites achat | |
| Commandes payées livre (`book_sale`) | |
| Commandes payées précommande (`book_preorder`) | |
| Commandes payées fiches (`fiches_salim`) | |
| Commandes payées collection (`bundle_salim`) | |
| Marge réelle (recette − coût unitaire − frais Stripe) | |
| Seuil : 5 commandes payées | atteint / non atteint |
| Décision | poursuivre / arrêter |
