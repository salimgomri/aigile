# Page de capture — Kit « 5 signaux »
*Texte prêt à intégrer (route proposée : `/kit`, plus un bloc réduit sur la page d'accueil). Vouvoiement, charte AIgile (bleu nuit #14213d, jaune #f2c230). Rien n'est publié. Les zones [À COMPLÉTER] / [À CHOISIR] doivent être remplies avant mise en ligne.*

---

## Balises SEO
- **Title** : Kit gratuit : 5 signaux que votre livraison dérape | AIgile
- **Meta description** : Auto-diagnostic en 10 minutes, 5 prompts IA prêts à l'emploi et une checklist DoR/DoD pour repérer un retard de livraison avant votre prochain comité. Gratuit.

## Sur-titre
Kit gratuit · Managers, Scrum Masters, Product Owners · Banque et assurance

## Titre (H1)
Livraison en retard : les 5 signaux à repérer avant votre prochain comité

## Sous-titre
Et comment l'IA aide à les corriger, sans lui laisser la décision. Un kit PDF de 10 pages, à remplir seul ou avec votre équipe en 10 minutes.

## Ce que vous recevez (bénéfices)
- **Savoir où ça coince, en 10 minutes** : un auto-diagnostic noté sur 15 affirmations concrètes, pour identifier le signal à traiter en premier.
- **Arriver au comité avec des faits** : une lecture claire de l'écart entre ce qui est « fini » dans l'outil et ce qui est réellement livré.
- **Gagner du temps avec l'IA, sans perdre la main** : 5 prompts prêts à l'emploi (story prête, dépendances, DoD, rétrospective…) et une grille de vérification humaine.
- **Une checklist DoR / DoD « IA incluse »** : ce que doit vérifier une équipe quand l'IA produit du code, des tests ou de la documentation.
- **Pensé pour les environnements régulés** : validations, dépendances et règles d'usage des données traitées dès le départ.

## Phrase de réassurance
Écrit par Salim Gomri, coach agile depuis 2003 ({{ANNEES_EXPERIENCE}} ans de terrain, calcul automatique : année en cours − 2003) et auteur du *Système S.A.L.I.M.* (477 pages).
*L'IA propose, l'humain décide.*

## Formulaire
- **Champ** : Prénom (facultatif) — `prenom`
- **Champ** : E-mail professionnel* — `email`, type email, obligatoire. Placeholder : prenom.nom@entreprise.com
- **Case obligatoire, non cochée par défaut** — `consent_kit` :
  > ☐ Je souhaite recevoir le kit « 5 signaux » par e-mail, ainsi que 4 e-mails de conseils sur la livraison et l'IA envoyés sur 10 jours. Je peux me désinscrire à tout moment, en un clic, depuis chaque e-mail.
- **Case facultative, non cochée par défaut** — `consent_news` :
  > ☐ J'accepte aussi de recevoir ensuite, environ une fois par mois, des nouvelles d'AIgile (articles, outils, formations). [À CONFIRMER : fréquence]
- **Champ anti-spam caché** (honeypot) — `website`, invisible pour les humains.
- **Bouton** : Recevoir le kit gratuit
- **Sous le bouton (mention d'information RGPD)** :
  > Vos données (prénom, e-mail) sont traitées par Salim GOMRI EI (GO-COACH), éditeur d'AIgile.lu, pour vous envoyer le kit et les e-mails demandés, sur la base de votre consentement. Elles sont transmises à notre outil d'envoi d'e-mails [À CHOISIR : Brevo / Kit / autre] et conservées jusqu'à votre désinscription, puis [À COMPLÉTER : durée, ex. 3 ans après le dernier contact] au maximum. Vous pouvez retirer votre consentement à tout moment et exercer vos droits (accès, rectification, effacement, opposition) en écrivant à [À COMPLÉTER : e-mail de contact]. Vous pouvez aussi saisir la CNIL. En savoir plus : [Politique de confidentialité](/privacy).

## Messages après envoi
- **Succès (sans redirection)** : « Merci ! Vérifiez votre boîte mail : le kit arrive dans quelques minutes. Pensez à regarder dans les indésirables. » [Si double opt-in : « Cliquez sur le lien de confirmation que nous venons de vous envoyer pour recevoir le kit. »]
- **Erreur** : « L'envoi n'a pas fonctionné. Réessayez dans un instant ou écrivez-nous à [À COMPLÉTER : e-mail de contact]. »
- **E-mail invalide** : « Merci d'indiquer une adresse e-mail valide. »
- **Case non cochée** : « Cochez la case pour recevoir le kit par e-mail. »

## Bloc secondaire (sous le formulaire)
**Vous préférez en parler directement ?** Le diagnostic flash dure 30 minutes, il est gratuit, et vous repartez avec 2 à 3 priorités. → [Réserver un diagnostic](/diagnostic)

## Version courte (bloc page d'accueil)
**Titre** : Kit gratuit : 5 signaux que votre livraison dérape
**Texte** : Auto-diagnostic en 10 minutes, 5 prompts IA prêts à l'emploi, checklist DoR/DoD. Pour managers, Scrum Masters et PO.
**Formulaire** : e-mail + case `consent_kit` (même texte) + mention RGPD abrégée : « Désinscription en un clic. Détails : [Politique de confidentialité](/privacy). »
**Bouton** : Recevoir le kit

## Notes techniques et conformité (pour l'agent de code et Salim)
- Cases **jamais précochées** ; enregistrer la preuve du consentement (date/heure, texte de la case, source, IP si l'outil le fait).
- Recommandé : **double opt-in** (confirmation par e-mail) si l'outil d'e-mailing le permet. [À CHOISIR par Salim]
- Lien de désinscription dans chaque e-mail ; identité de l'expéditeur visible.
- Mettre à jour `/privacy` : finalité « envoi du kit et e-mails », destinataire (outil d'e-mailing), durée de conservation, transfert hors UE éventuel selon l'outil choisi.
- PDF du kit : `kit.pdf`, servi par lien direct dans l'e-mail (fichier gratuit, peut être public avec en-tête `X-Robots-Tag: noindex`).
- UTM des liens sortants du kit et des e-mails : `utm_source=kit` ou `utm_source=email&utm_campaign=bienvenue-kit&utm_content=j0…j10`.
- Ce texte n'est pas un avis juridique : faire relire la mention RGPD avec `/privacy`.
