# Ce que la page affiche / ce qui est vrai

Fiche : `https://aigile.lu/salim`  
Code : `app/salim/page.tsx`, `lib/salim/fiche.ts`, `lib/payments/catalog.ts`, `lib/book-config.ts`  
Date : 21 novembre 2026

Les cinq prix sont ceux qui étaient codés pour la fiche. La page n’en affiche plus qu’un : le total livré.

| Ce que la page affiche | Ce qui est vrai | Source |
|---|---|---|
| Prix Amazon du livre, 79,00 € | Rien sur la fiche. La constante `BOOK_COMPARE_AT_CENTIMES = 7900` existe encore et n’est plus affichée ici. Aucune page Amazon n’est citée dans le dépôt. | à vérifier · `lib/book-config.ts` |
| Prix du livre, 69,00 € | Encaissé : 6 900 centimes (`book_sale.amount`). La fiche ne l’affiche pas seul : il est inclus dans le total livré. | `lib/payments/catalog.ts`, `lib/book-config.ts` |
| Prix Amazon des fiches, 59,00 € | Rien sur la fiche. Constante `FICHES_COMPARE_AT_CENTIMES = 5900`, sans capture Amazon. | à vérifier · `lib/book-config.ts` |
| Prix des fiches, 49,00 € | Encaissé si ce produit est commandé : 4 900 centimes. La fiche ne le vend pas et ne l’affiche pas. | `lib/payments/catalog.ts` (`fiches_salim`) |
| Prix de la collection, 110,00 € | Encaissé si ce produit est commandé : 11 000 centimes. La fiche ne le vend pas et ne l’affiche pas. | `lib/payments/catalog.ts` (`bundle_salim`) |
| Prix affiché : 74,00 € | 6 900 + 500 centimes de port forfaitaire. Un seul prix, une seule édition (`book_sale`). | `lib/salim/fiche.ts` |
| Sous-titre : « Livre · port compris dans le prix. » | Le port catalogue est un forfait de 5,00 €, pas un calcul selon la zone. Aucune phrase d’exclusivité. | `lib/salim/fiche.ts`, `catalog.ts` `shippingFee` |
| Lien extrait : `/salim/extrait` | Page de lecture, sans formulaire. Visite enregistrée sous le lien `extrait`. | `app/salim/extrait/page.tsx` |
| Lien achat : `/salim/achat` | Paiement du seul livre, même checkout qu’avant. Visite enregistrée sous le lien `achat`. | `app/salim/achat/page.tsx` |

Les deux liens sont distincts. Amazon est un prix de référence encore dans le code, pas un lien d’achat.
