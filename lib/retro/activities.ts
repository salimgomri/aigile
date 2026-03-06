export type RetroPhase = 'set-stage' | 'gather-data' | 'generate-insights' | 'decide-what-to-do' | 'close'

export interface RetroActivity {
  id: string
  phase: RetroPhase
  name: string
  nameFr: string
  summary: string
  summaryFr: string
  duration: number
  description: string
  descriptionFr: string
  tags: string[]
  trustLevel?: 'low' | 'medium' | 'high'
  teamSizeMin?: number
  teamSizeMax?: number
  retromatUrl?: string
}

/**
 * 146 curated retrospective activities mapped to team dysfunction patterns
 * Organized by problem type and retro phase
 */
export const RETRO_ACTIVITIES: Record<string, RetroActivity[]> = {
  // silent-team (47 activities)
  'silent-team': [
    {
      id: 'retromat-1',
      phase: 'set-stage',
      name: 'ESVP',
      nameFr: 'ECVP',
      summary: 'How do participants feel at the retro: Explorer, Shopper, Vacationer, or Prisoner?',
      summaryFr: 'Comment se sentent les participants de la rétro : Explorateur, Client, Vacancier, ou Prisonnier ?',
      duration: 5,
      description: `Prepare a flipchart with areas for E, S, V, and P. Explain the concept: 
 Explorer: Eager to dive in and research what did and didn't work and how to improve.
 Shopper: Positive attitude. Happy if one good things comes out.
 Vacationer: Reluctant to actively take part but the retro beats the regular work.
 Prisoner: Only attend because they (feel they) must.
Take a poll (anonymously on slips of paper). Count out the answers and keep track on the flipchart for all to see. If trust is low, deliber`,
      descriptionFr: `Préparer un paperboard avec des zones pour E, C, V, et P. Expliquer les concepts : 
Explorateur : Désireux de se lancer, de rechercher ce qui a et n'a pas fonctionné et comment améliorer.
Client : Attitude positive. Content si de bonnes choses en ressortent.
Vacancier : Hésitant à participer activement mais la rétro vaut mieux que le travail habituel.
Prisonnier : Participe seulement car il (sent qu'il) le doit.
Faire un sondage (anonyme sur des bouts de papier). Compter les réponses et assurer `,
      tags: ["P1-primary","PA-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=1'
    },
    {
      id: 'retromat-2',
      phase: 'set-stage',
      name: 'Weather Report',
      nameFr: 'Bulletin météo',
      summary: 'Participants mark their \'weather\' (mood) on a flipchart',
      summaryFr: 'Les participants marquent leur \'météo\' (humeur) sur un paperboard.',
      duration: 5,
      description: `Prepare a flipchart with a drawing of storm, rain, clouds and sunshine. Each participant marks their mood on the sheet.`,
      descriptionFr: `Préparer un paperboard avec un dessin d'orage, pluie, nuages ​​et soleil. Chaque participant marque son humeur sur le tableau.`,
      tags: ["P1-primary","PA-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=2'
    },
    {
      id: 'retromat-3',
      phase: 'set-stage',
      name: 'Check In - Quick Question',
      nameFr: 'Lancement - Question rapide',
      summary: 'Ask one question that each participant answers in turn',
      summaryFr: 'Poser une question à laquelle chacun des participants répond à son tour.',
      duration: 5,
      description: `In round-robin each participant answers the same question (unless they say 'I pass'). Sample questions: 
 
In one word - What do you need from this retrospective?
 When someone answers something that alerts you such as "help" or "protection", you have to react to that e. g. with "Is there something we can do right now to help?" oder "What kind of protection?"
 
What's something that caused problems last iteration?
 
If you could change one thing about the last iteration what would it be?
 
Av`,
      descriptionFr: `À tour de rôle chaque participant répond à la même question (sauf s'ils disent « je passe »). Exemples de questions : 
En un mot - Qu'attendez-vous de cette rétrospective ?
En un mot - Qu'avez-vous en tête ?
Traitez les préoccupations, par exemple en les écrivant et en les mettant - physiquement et mentalement - de côté
Dans cette rétrospective - Si vous étiez une voiture, quel genre serait-elle ?
Dans quel état émotionnel êtes-vous ? (par exemple, « heureux », « en colère », « triste », « effra`,
      tags: ["P1-primary","P2-primary","PA-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=3'
    },
    {
      id: 'retromat-6',
      phase: 'gather-data',
      name: 'Like to like',
      nameFr: 'Aimer à aimer',
      summary: 'Participants match quality cards to their own Start-Stop-Continue-proposals',
      summaryFr: 'Les participants font correspondre des cartes qualité à leurs propres propositions "Commencer-Arrêter-Continuer".',
      duration: 30,
      description: `Preparation: ca. 20 quality cards, i.e. colored index cards with unique words such as fun, on time, clear, meaningful, awesome, dangerous, nasty
 Each team member has to write at least 9 index cards: 3 each with things to start doing, keep doing and stop doing. Choose one person to be the first judge. The judge turns the first quality card. From their own cards each member chooses the best match for this word and places it face down on the table.The last one to choose has to take their card back`,
      descriptionFr: `Préparation: 20 cartes qualité, càd des fiches cartonnées colorées avec un unique mot comme drôle, claire, sérieuse, géniale, dangereuse, désagréable.
 Chaque membre de l'équipe doit écrire au moins 9 cartes : 3 de chaque pour les choses à commencer à faire, à continuer et à arrêter. Choisir une personne qui sera le premier juge. Le juge retourne la première carte qualité. Chaque membre sélectionne alors parmi ses cartes celle qui correspond le mieux à ce mot et la pose face cachée sur la table.`,
      tags: ["P1-primary","P3-primary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=6'
    },
    {
      id: 'retromat-7',
      phase: 'gather-data',
      name: 'Mad Sad Glad',
      nameFr: 'Mad Sad Glad',
      summary: 'Collect events when team members felt mad, sad, or glad and find the sources',
      summaryFr: 'Collecter les évènements durant lesquels les membres de l\'équipe se sont sentis en colère (mad), tristes (sad), ou contents (glad) et trouver les raisons.',
      duration: 15,
      description: `Put up three posters labeled 'mad', 'sad', and 'glad' (or >:(, :(, :) alternatively). Team members write down one event per color coded card, when they've felt that way. When the time is up have everyone post their cards to the appropriate posters. Cluster the cards on each poster. Ask the group for cluster names. 
Debrief by asking: What's standing out? What's unexpected?
 What was difficult about this task? What was fun?
 What patterns do you see? What do they mean for you as a team?
 Suggesti`,
      descriptionFr: `Affichez trois affiches intitulées 'en colère' (mad), 'triste' (sad), et 'content' (glad) ou ">:), :(, :)'. Les membres de l'equipe écrivent un évènement par carte lorsqu'ils ont ressenti ce sentiment, avec un code couleur pour chaque type de sentiment. Lorsque le temps est écoulé demander à chacun de placer ses cartes sur les affiches appropriées. Regrouper les cartes sur chaque affiche puis demander au groupe de nommer chaque regroupement. 
Terminer en demandant :Qu'en ressort-il ? Qu'est-ce q`,
      tags: ["PA-primary","P1-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=7'
    },
    {
      id: 'retromat-15',
      phase: 'close',
      name: 'Appreciations',
      nameFr: 'Appréciations',
      summary: 'Let team members appreciate each other and end positively',
      summaryFr: 'Les membres de l\'équipe sont reconnaissants les uns envers les autres et concluent de manière positive.',
      duration: 5,
      description: `Start by giving a sincere appreciation of one of the participants. It can be anything they contributed: help to the team or you, a solved problem, ...Then invite others and wait for someone to work up the nerve. Close, when no one has talked for a minute.`,
      descriptionFr: `Commencer en remerciant de manière sincère l'un des participants. Cela peut concerner n'importe laquelle de ses contributions : aider l'équipe ou vous-même à résoudre un problème...
Inviter alors les autres à faire de même et attendre que quelqu'un se jette à l'eau. Arrêter quand personne n'a parlé pendant plus d'une minute.`,
      tags: ["PA-primary","P1-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=15'
    },
    {
      id: 'retromat-18',
      phase: 'set-stage',
      name: 'Check In - Amazon Review',
      nameFr: 'Lancement - Commentaires Amazon',
      summary: 'Review the iteration on Amazon. Don\'t forget the star rating!',
      summaryFr: 'Commenter l\'itération sur Amazon. Ne pas oublier l\'évaluation !',
      duration: 30,
      description: `Each team member writes a short review with: Title
 Content
 Star rating (5 stars is the best) 
Everyone reads out their review. Record the star ratings on a flip chart.
Can span whole retrospective by also asking what is recommended about the iteration and what not.`,
      descriptionFr: `Chaque membre écrit un rapide commentaire qui comporte : Un titre
Un commentaire
Une évaluation (5 étoiles pour le meilleur score) 
Chacun lit son commentaire. Noter les évaluations sur un tableau.
Peut s'étendre à la rétrospective entière en demandant également ce qui est recommandé de faire et de ne pas faire pour l'itération.`,
      tags: ["P1-primary","PA-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=18'
    },
    {
      id: 'retromat-22',
      phase: 'set-stage',
      name: 'Temperature Reading',
      nameFr: 'Prise de température',
      summary: 'Participants mark their \'temperature\' (mood) on a flipchart',
      summaryFr: 'Les participants marquent leur \'température\' (humeur) sur un tableau',
      duration: 5,
      description: `Prepare a flipchart with a drawing of a thermometer from freezing to body temperature to hot. Each participant marks their mood on the sheet.`,
      descriptionFr: `Préparer un tableau avec un dessin de thermomètre allant de glacé à chaud en passant par la température du corps. Chaque participant marque son humeur au tableau.`,
      tags: ["P1-primary","PA-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=22'
    },
    {
      id: 'retromat-27',
      phase: 'gather-data',
      name: 'Retrospective Cookies',
      nameFr: 'Biscuits Chinois de Rétrospective',
      summary: 'Take the team out to eat and spark discussion with retrospective fortune cookies',
      summaryFr: 'Amener l\'équipe à manger à l\'extérieur et susciter des discussions avec des biscuits chinois de rétrospective (\'retrospective cookies\')',
      duration: 30,
      description: `Invite the team out to eat, preferably Chinese if you want to stay in theme ;) Distribute fortune cookies and go around the table opening the cookies and discussing their content. Example 'fortunes': What was the most effective thing you did this iteration, and why was it so successful?
 Did the burndown reflect reality? Why or why not?
 What do you contribute to the development community in your company? What could you contribute?
 What was our Team's biggest impediment this iteration?
You can `,
      descriptionFr: `Inviter l'équipe à manger à l'extérieur, de préférence Chinois si vous souhaitez rester dans le thème ;)
Distribuer des 'fortune cookies' (biscuits chinois renfermant un mot dans leur emballage) et faire un tour de table en ouvrant les biscuits et en discutant leur contenu. Quelques exemples de 'fortunes' :Quelle a été la chose la plus efficace que vous ayez fait durant le Sprint, et pourquoi est-ce que cela a été si réussi ?
Est-ce que le burndown reflète la réalité ? Pourquoi ?
Que contribuez `,
      tags: ["P1-primary","PA-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=27'
    },
    {
      id: 'retromat-28',
      phase: 'gather-data',
      name: 'Take a Walk',
      nameFr: 'Allez prendre l\'air !',
      summary: 'Go to the nearest park and wander about and just talk',
      summaryFr: 'Allez dans le parc le plus proche, posez-vous des questions et parlez.',
      duration: 30,
      description: `Is there nice weather outside? Then why stay cooped up inside, when walking fills your brain with oxygen and new ideas 'off the trodden track'. Get outside and take a walk in the nearest park. Talk will naturally revolve around work. This is a nice break from routine when things run relatively smoothly and you don't need visual documentation to support discussion. Mature teams can easily spread ideas and reach consensus even in such an informal setting.`,
      descriptionFr: `Fait-il beau dehors ? Oui ? Alors pourquoi rester enfermés quand on peut s'aérer les poumons et voir les choses sous un autre angle.
 Aller dehors et faire un tour dans le parc le plus proche. Vous parlerez naturellement du travail. C'est une bonne façon de changer vos habitudes lorsque tout fonctionne et que vous n'avez pas besoin de projeter des documents pour échanger.
 Les équipes matures peuvent très bien partager des idées et trouver des consensus malgré le contexte bien plus informel.`,
      tags: ["P1-primary","PA-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=28'
    },
    {
      id: 'retromat-31',
      phase: 'set-stage',
      name: 'Check In - Draw the Iteration',
      nameFr: 'Lancement - Dessiner l\'itération',
      summary: 'Participants draw some aspect of the iteration',
      summaryFr: 'Les participants dessinent certains aspects de l\'itération.',
      duration: 15,
      description: `Distribute index cards and markers. Set a topic, e.g. one of the following: How did you feel during the iteration?
 What was the most remarkable moment?
 What was the biggest problem?
 What did you long for?
 If the last iteration had been a circus performance, what part did you play? Juggler, funambulist, clown, knife-thrower, ...
 Ask the team members to draw their answer. Post all drawings on a whiteboard. For each drawing let people guess what it means, before the artist explains it.
 Metaph`,
      descriptionFr: `Distribuer des cartes et des marqueurs et choisir le sujet. Exemples de sujet : Comment avez-vous vécu l'itération ?
 Quel a été le moment le plus marquant ?
 Quel a été le plus gros problème ?
 Qu'auriez-vous désiré ?
Demander à chaque membre de l'équipe de dessiner sa réponse. Coller tous les dessins sur un tableau. 
Pour chaque dessin, laisser les gens deviner ce qu'il représente avant que son auteur ne l'explique.
Les métaphores apportent un nouvel éclairage et créent une compréhension parta`,
      tags: ["P1-primary","P2-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=31'
    },
    {
      id: 'retromat-32',
      phase: 'set-stage',
      name: 'Emoticon Project Gauge',
      nameFr: 'Gauge du projet par émoticônes',
      summary: 'Help team members express their feelings about a project and address root causes early',
      summaryFr: 'Aider les membres de l\'équipe à exprimer leur sentiment vis-à-vis du projet et en traiter les causes au plus tôt.',
      duration: 5,
      description: `Prepare a flipchart with faces expressing various emotions such as: shocked / surprised
 nervous / stressed
 unempowered / constrained
 confused
 happy
 mad
 overwhelmed
Let each team member choose how they feel about the project. This is a fun and effective way to surface problems early. You can address them in the subsequent phases.`,
      descriptionFr: `Preparer un tableau avec des visages exprimant diverses émotions telles que : choc / surprise
 nervosité / stress
 impuissance / contrainte
 confusion
 joie
 colère
 dépassement
Laisser chaque membre de l'équipe choisir comment il se sent à propos du projet, c'est un moyen fun et efficace de faire remonter plus tôt les problèmes. 
Vous pourrez en trouver les solutions dans les étapes qui suivent.`,
      tags: ["PA-primary","P1-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=32'
    },
    {
      id: 'retromat-33',
      phase: 'gather-data',
      name: 'Proud & Sorry',
      nameFr: 'Fier(ère) & Désolé(e)',
      summary: 'What are team members proud or sorry about?',
      summaryFr: 'De quoi les membres de l\'équipe sont-ils fiers ou désolés ?',
      duration: 15,
      description: `Put up two posters labeled 'proud' and 'sorry'. Team members write down one instance per sticky note. When the time is up have everyone read out their note and post it to the appropriate poster.
Start a short conversation e.g. by asking: Did anything surprise you?
 What patterns do you see? What do they mean for you as a team?`,
      descriptionFr: `Afficher deux feuilles "fier(e)" et "désolé(e)".
Les membres de l'équipe listent un commentaire pour chaque feuille.
Lorsque le temps est écoulé, faire un tour de table pour que chacun lise ses notes et les colle sous le thème approprié. 
Démarrer une courte conversation en demandant : Est-ce que quelque chose vous a surpris ?
 Quels motifs peut-on constater ? Que cela signifie-t-il en tant qu'équipe ?`,
      tags: ["PA-primary","PD-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=33'
    },
    {
      id: 'retromat-34',
      phase: 'close',
      name: 'Shower of Appreciation',
      nameFr: 'La douche de l\'appréciation',
      summary: 'Listen to others talk behind your back - and only the good stuff!',
      summaryFr: 'Écouter les gens parler dans votre dos (et uniquement des bonnes choses) !',
      duration: 5,
      description: `Form groups of 3. Each group arranges their chairs so that 2 chairs face each other and the third one has its back turned, like this: >^<. The two people in the chairs that face each other talk about the third person for 2 minutes. They may only say positive things and nothing that was said may be reduced in meaning by anything said afterwards. 
Hold 3 rounds so that everyone sits in the shower seat once.`,
      descriptionFr: `Par groupes de 3, chaque groupe déplace ses chaises pour que 2 chaises soient face à face et que la troisième leur tourne le dos. Quelque chose comme ça : >^<.
Les deux personnes dans les chaises qui se font face parlent de la troisième personne pendant qu'elle se douche durant 2 minutes.
Elles ne peuvent dire que des choses positives et rien de ce qu'il se dit ne peut être minimisé en en reparlant par la suite.
Faire trois tours pour que chacun puisse se doucher une fois !`,
      tags: ["PA-primary","P1-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=34'
    },
    {
      id: 'retromat-36',
      phase: 'set-stage',
      name: 'Appreciative Goal',
      nameFr: 'Objectif reconnaissance',
      summary: 'State an affirmative goal for the session',
      summaryFr: 'Formuler un objectif positif pour la session.',
      duration: 5,
      description: `Concentrate on positive aspects instead of problems by setting an affirmative goal, e.g. Let's find ways to amplify our strengths in process and teamwork
 Let's find out how to extend our best uses of engineering practices and methods
 We'll look at our best working relationships and find ways to build more relationships like that
 We'll discover where we added the most value during our last iteration to increase the value we'll add during the next`,
      descriptionFr: `Concentrez-vous sur les aspects positifs au lieu des problèmes en définissant un objectif positif. Exemples : Trouvons plusieurs façons de renforcer notre travail d'équipe et nos process
 Trouvons comment étendre nos bonnes pratiques et méthodes d'ingénierie
 Identifions et tentons de trouver plus de rapports dans le travail qui fonctionne
 Identifions là où nous avons produit le plus de valeur ajoutée au cours de la dernière itération afin d'augmenter celle que nous fournirons lors du prochain`,
      tags: ["P1-primary","PA-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=36'
    },
    {
      id: 'retromat-42',
      phase: 'set-stage',
      name: 'Postcards',
      nameFr: 'Cartes postales',
      summary: 'Participants pick a postcard that represents their thoughts / feelings',
      summaryFr: 'Les participants choissisent une carte postale qui représente leurs pensées / sentiments',
      duration: 15,
      description: `Bring a stack of diverse postcards - at least 4 four times as many as participants. Scatter them around the room and instruct team members to pick the postcard that best represents their view of the last iteration. After choosing they write down three keywords describing the postcard, i.e. iteration, on index cards. In turn everyone hangs up their post- and index cards and describes their choice.`,
      descriptionFr: `Amener un lot de cartes postales variées - au moins quatre fois plus que de participants. Les éparpiller dans la pièce et demander aux membre de l'équipe de choisir la carte postale qui représente le mieux leur vision de la dernière itération. Après avoir choisi, ils écrivent 3 mots-clefs qui décrivent la carte postale, par exemple sprint, sur une petite fiche. Tour à tour tout le monde accroche sa carte postale ainsi que sa fiche et explique son choix.`,
      tags: ["P1-primary","P2-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=42'
    },
    {
      id: 'retromat-43',
      phase: 'set-stage',
      name: 'Take a Stand - Opening',
      nameFr: 'Prise de position - Ouverture',
      summary: 'Participants take a stand, indicating their satisfaction with the iteration',
      summaryFr: 'Les participants se positionnent pour indiquer leur niveau de satisfaction par rapport à l\'itération',
      duration: 5,
      description: `Create a big scale (i.e. a long line) on the floor with masking tape. Mark one end as 'Great' and the other as 'Bad'. Let participants stand on the scale according to their satisfaction with the last iteration. Ask people what they notice.


Psychologically, taking a stand physically is different from just saying something. It's more 'real'.

 
You can reuse the scale if you close with activity #44.`,
      descriptionFr: `Créer une grande échelle (par exemple une longue ligne) sur le sol avec du rouleau adhésif. Définir une extrémité comme 'Génial' et l'autre comme 'Nul'. Inviter les participants à se positionner sur l'échelle en fonction de leur satisfaction à propos de la dernière itération. Psychologiquement, prendre position physiquement est différent de juste dire quelque chose. C'est plus 'réel'.
 Vous pouvez réutiliser cette échelle de valeurs si vous terminez avec l'activité #44.`,
      tags: ["P1-primary","P2-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=43'
    },
    {
      id: 'retromat-46',
      phase: 'set-stage',
      name: 'Why Retrospectives?',
      nameFr: 'Pourquoi des rétrospectives ?',
      summary: 'Ask \'Why do we do retrospectives?\'',
      summaryFr: 'Demander "Pourquoi faisons-nous des rétrospectives ?"',
      duration: 5,
      description: `Go back to the roots and start into the retrospective by asking 'Why do we do this?' Write down all answers for everyone to see. You might be surprised.`,
      descriptionFr: `Revenir aux sources et commencer la rétrospective en demandant "Pourquoi faisons-nous ça ?" Écrire toutes les réponses pour qu'elles soient visibles par tout le monde. Vous pourriez être surpris.`,
      tags: ["P1-primary","PD-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=46'
    },
    {
      id: 'retromat-57',
      phase: 'close',
      name: 'Say it with Flowers',
      nameFr: 'Dites-le avec des fleurs',
      summary: 'Each team member appreciates someone else with a flower',
      summaryFr: 'Chaque membre de l\'équipe remercie quelqu\'un avec une fleur',
      duration: 5,
      description: `Buy one flower for each team member and reveal them at the end of the retrospective. Everyone gets to give someone else a flower as a token of their appreciation.`,
      descriptionFr: `Acheter une fleur pour chaque membre de l'équipe et les leur montrer à la fin de la rétrospective. Tout le monde doit offrir une fleur à quelqu'un pour lui montrer sa reconnaissance.`,
      tags: ["PA-primary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=57'
    },
    {
      id: 'retromat-59',
      phase: 'set-stage',
      name: 'Happiness Histogram',
      nameFr: 'Histogramme de bonheur',
      summary: 'Create a happiness histogram to get people talking',
      summaryFr: 'Créer un histogramme de bonheur pour faire discuter les gens',
      duration: 5,
      description: `Prepare a flip chart with a horizontal scale from 1 (Unhappy) to 5 (Happy). One team member after the other places their sticky note according to their happiness and comment on their placement
 If anything noteworthy comes from the reason, let the team choose to either discuss it there and then or postpone it for later in the retrospective
 If someone else has the same score, they place their sticky above the placed one, effectively forming a histogram`,
      descriptionFr: `Préparer un paperboard avec une échelle horizontale de 1 (malheureux) à 5 (heureux).

Chaque membre de l'équipe, l'un après l'autre place son post-it en fonction de son état d'esprit et explique son choix.

Si l'explication fait ressortir quelque chose de marquant, l'équipe décide d'en parler en suivant ou de le noter pour plus tard dans la rétrospective.

Si quelqu'un d'autre a le même score, il place son post-it au dessus du précédent, ce qui permet de former un véritable histogramme.`,
      tags: ["PA-primary","P1-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=59'
    },
    {
      id: 'retromat-65',
      phase: 'gather-data',
      name: 'Appreciative Inquiry',
      nameFr: 'Enquête appréciative',
      summary: 'Lift everyone\'s spirit with positive questions',
      summaryFr: 'Améliorez le moral de tous avec des questions positives',
      duration: 15,
      description: `This is a round-based activity. In each round you ask the team a question, they write down their answers (gives everyone time to think) and then read them out to the others.
Questions proposed for Software Development teams: When was the last time you were really engaged / animated / productive? What did you do? What had happened? How did it feel?
 From an application-/code-perspective: What is the awesomest stuff you've built together? What makes it great?
 Of the things you built for this comp`,
      descriptionFr: `Il s'agit d'une activité composée de tours. À chaque tour, vous posez une question à l'équipe, qui écrit ses réponses (ce qui donne à chacun·e le temps de réfléchir) et les lit ensuite aux autres.
Questions proposées pour les équipes de développement de logiciels : A quand remonte la dernière fois où vous étiez vraiment engagé·e·s / animé·e·s / productives/fs ? Qu'aviez-vous fait ? Que s'est-il passé ? Qu'avez-vous ressenti ?
 Du point de vue de l'application/du code : Quelle est la chose la plu`,
      tags: ["PA-primary","P1-secondary"],
      trustLevel: 'medium',
      retromatUrl: 'https://retromat.org/en/?id=65'
    },
    {
      id: 'retromat-70',
      phase: 'set-stage',
      name: '3 for 1 - Opening',
      nameFr: '3 en 1 - Ouverture',
      summary: 'Check satisfaction with iteration results, communication & mood all at once',
      summaryFr: 'Vérifiez en une fois la satisfaction des résultats de l\'itération, de la communication et de l\'humeur.',
      duration: 5,
      description: `Prepare a flip chart with a co-ordinate plane on it. The Y-axis is 'Satisfaction with iteration result'. The X-axis is 'Number of times we coordinated'. Ask each participant to mark where their satisfaction and perceived touch points intersect - with an emoticon showing their mood (not just a dot).Discuss surprising variances and extreme moods.
(Vary the X-axis to reflect current team topics, e.g. 'Number of times we pair programmed'.)`,
      descriptionFr: `Préparez un paper board avec un système de coordonnées. Indiquez sur l'axe des y "Satisfaction des résultats de l'itération" et sur l'axe des x "Fréquence de la coordination". Demandez à tou·te·s les participant·e·s de marquer le point de satisfaction (axe des y) et la fréquence perçue (axe des x) - en utilisant un émoticône pour montrer leur humeur (c'est-à-dire pas seulement un point).
Discutez des valeurs surprenantes et des humeurs extrêmes.
(Variez l'axe des abscisses (x) pour refléter d'a`,
      tags: ["P1-primary","P2-primary","PA-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=70'
    },
    {
      id: 'retromat-75',
      phase: 'gather-data',
      name: 'Writing the Unspeakable',
      nameFr: 'Écrire l\'indicible',
      summary: 'Write down what you can never ever say out loud',
      summaryFr: 'Écrivez ce que vous ne pouvez jamais dire à voix haute.',
      duration: 5,
      description: `Do you suspect that unspoken taboos are holding back the team? Consider this silent activity: Stress confidentiality ('What happens in Vegas stays in Vegas') and announce that all notes of this activity will be destroyed in the end. Only afterwards hand out a piece of paper to each participant to write down the biggest unspoken taboo in the company. 
When everyone's done, they pass their paper to their left-hand neighbors. The neighbors read and may add comments. Papers are passed on and on unti`,
      descriptionFr: `Pensez-vous que des tabous tacites freinent l'équipe ? Considérez cette activité silencieuse : insistez sur la confidentialité "Ce qui se passe à Vegas reste à Vegas" et annoncez que toutes les notes de cette activité seront détruites à la fin. Ce n'est qu'ensuite que vous distribuez une feuille de papier à chaque participant pour qu'il y écrive le plus grand tabou tacite de l'entreprise. 
Quand tout le monde a fini, ils passent leur papier à leurs voisins de gauche. Les voisins lisent et peuven`,
      tags: ["PA-primary","P2-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=75'
    },
    {
      id: 'retromat-76',
      phase: 'set-stage',
      name: 'Round of Admiration',
      nameFr: 'Ronde d\'admiration',
      summary: 'Participants express what they admire about one another',
      summaryFr: 'Les participants expriment ce qu\'ils admirent les uns chez les autres',
      duration: 5,
      description: `Start a round of admiration by facing your neighbour and stating 'What I admire most about you is ...' Then your neighbour says what she admires about her neighbour and so on until the last participants admires you. Feels great, doesn't it?`,
      descriptionFr: `Commencez un tour d'admiration en faisant face à votre voisin et en déclarant : "Ce que j'admire le plus chez vous, c'est ...". Puis votre voisin(e) dit ce qu'il/elle admire chez son voisin(e) et ainsi de suite jusqu'à ce que les derniers participants vous admirent. Cela fait du bien, n'est-ce pas ?`,
      tags: ["PA-primary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=76'
    },
    {
      id: 'retromat-81',
      phase: 'set-stage',
      name: 'Outcome Expectations',
      nameFr: 'Attentes en matière de résultats',
      summary: 'Everyone states what they want out of the retrospective',
      summaryFr: 'Chacun déclare ce qu\'il attend de la rétrospective.',
      duration: 15,
      description: `Everyone in the team states their goal for the retrospective, i.e. what they want out of the meeting. Examples of what participants might say: I'm happy if we get 1 good action item
 I want to talk about our argument about unit tests and agree on how we'll do it in the future
 I'll consider this retro a success, if we come up with a plan to tidy up $obscureModule
 [You can check if these goals were met if you close with activity #14.] 

 [The Meet - Core Protocol, which inspired this activity, a`,
      descriptionFr: `Chacun dans l'équipe énonce son objectif pour la rétrospective, c'est-à-dire ce qu'il attend de la réunion. Exemples de ce que les participants pourraient dire : Je suis content si nous obtenons 1 bon élément d'action
 Je veux parler de notre argument sur les tests unitaires et convenir de la façon dont nous allons le faire à l'avenir
 Je considérerai cette rétro comme un succès, si nous proposons un plan pour ranger $obscureModule
 [Vous pouvez vérifier si ces objectifs ont été atteints si vous`,
      tags: ["P1-primary","PD-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=81'
    },
    {
      id: 'retromat-82',
      phase: 'set-stage',
      name: 'Three Words',
      nameFr: 'En trois mots',
      summary: 'Everybody sums up the last iteration in 3 words',
      summaryFr: 'Tout le monde résume la dernière itération en 3 mots',
      duration: 5,
      description: `Ask everyone to describe the last iteration with just 3 words. Give them a minute to come up with something, then go around the team. This helps people recall the last iteration so that they have some ground to start from.`,
      descriptionFr: `Demandez à chacun de décrire la dernière itération avec seulement 3 mots. Donnez-leur une minute pour produire quelque chose, puis faites le tour de l'équipe. Cela aide les gens à se souvenir de la dernière itération et à avoir une base de départ.`,
      tags: ["P1-primary","P2-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=82'
    },
    {
      id: 'retromat-85',
      phase: 'set-stage',
      name: 'Greetings from the Iteration',
      nameFr: 'Salutations de la part de l\'Itération',
      summary: 'Each team member writes a postcard about the last iteration',
      summaryFr: 'Chaque membre de l\'équipe écrit une carte postale sur la dernière itération.',
      duration: 15,
      description: `Remind the team what a postcard looks like: An image on the front,
 a message on one half of the back,
 the address and stamp on the other half.
 Distribute blank index cards and tell the team they have 10 minutes to write a postcard to a person the whole team knows (i.e. an ex-colleague). When the time is up, collect and shuffle the cards before re-distributing them. Team members take turns to read out loud the postcards they got.`,
      descriptionFr: `Rappelez à l'équipe à quoi ressemble une carte postale: Une image devant,
 un message sur une moitié du dos,
 l'adresse et le timbre sur l'autre moitié.
 Distribuez des fiches vierges et dites à l'équipe qu'elle a 10 minutes pour écrire une carte postale à une personne que toute l'équipe connaît (par exemple, un ancien collègue). Une fois le temps écoulé, rassemblez et mélangez les cartes avant de les redistribuer. À tour de rôle, les membres de l'équipe lisent à haute voix les cartes postales q`,
      tags: ["P1-primary","P2-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=85'
    },
    {
      id: 'retromat-90',
      phase: 'set-stage',
      name: 'Agile Values Cheer Up',
      nameFr: 'Encouragement aux valeurs Agiles',
      summary: 'Remind each other of agile values you displayed',
      summaryFr: 'Rappelez-vous mutuellement les valeurs agiles que vous avez incarnées',
      duration: 15,
      description: `Draw 4 large bubbles and write one of the agile core values into each: Individuals and their interactions
 Delivering working software
 Customer collaboration
 Responding to change
 Ask participants to write down instances when their colleagues have displayed one of the values - 1 cheerful sticky note per example. In turn, let everyone post their note in the corresponding bubble and read them out loud. Rejoice in how you embody agile core values :)`,
      descriptionFr: `Dessinez 4 grandes bulles et écrivez une des valeurs fondamentales agiles dans chacune :

Les individus et leurs interactions
Livrer un logiciel qui fonctionne
La collaboration avec les clients
Réagir au changement

Demandez aux participants de noter des exemples où leurs collègues ont incarné l'une des valeurs - 1 note positive par exemple. À tour de rôle, chacun affiche sa note dans la bulle correspondante et la lit à voix haute. Réjouissez-vous de la façon dont vous incarnez les valeurs fonda`,
      tags: ["PA-primary","P1-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=90'
    },
    {
      id: 'retromat-97',
      phase: 'gather-data',
      name: '#tweetmysprint',
      nameFr: '#tweetmysprint',
      summary: 'Produce the team\'s twitter timeline for the iteration',
      summaryFr: 'Produisez la chronologie Twitter de l\'équipe pour l\'itération',
      duration: 15,
      description: `Ask participants to write 3 or more tweets on sticky notes about the iteration they've just completed. Tweets could be on the iteration as a whole, on individual stories, a rant, or shameless self-promotion - as long as they are brief. Hash tags, emoticons, attached pictures, @usernames are all welcome. Allow ten minutes to write the tweets, then arrange them in a timeline and discuss themes, trends etc. Now invite participants to favorite, retweet and write replies to the tweets, again followin`,
      descriptionFr: `Demandez aux participants d'écrire 3 tweets ou plus sur des notes autocollantes concernant l'itération qu'ils viennent de terminer. Les tweets peuvent porter sur l'itération dans son ensemble, sur des stories individuelles, un coup de gueule ou de l'auto-promotion éhontée - tant qu'ils sont brefs. Les hashtags, émoticônes, images jointes, @noms d'utilisateur sont tous les bienvenus.

Accordez dix minutes pour écrire les tweets, puis organisez-les dans une chronologie et discutez des thèmes, tend`,
      tags: ["P1-primary","P2-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=97'
    },
    {
      id: 'retromat-101',
      phase: 'close',
      name: 'Endless Blessings',
      nameFr: 'Bénédictions sans fin',
      summary: 'Bless the upcoming iteration with all your good wishes',
      summaryFr: 'Bénissez la prochaine itération avec tous vos bons vœux',
      duration: 5,
      description: `Stand in a circle. Explain that you will collect good wishes for the next iteration, building on each other's blessings. If you do it for the first time, start the activity by giving the first blessing. Then go around the circle to add to your blessing. Skip over people who can't think of anything. When you are losing steam, ask for another blessing and start another round. Continue until no one can think of blessings anymore. 

Example:
You start with 'May we finish all stories next iteration'.`,
      descriptionFr: `Tenez-vous en cercle. Expliquez que vous allez recueillir de bons vœux pour la prochaine itération, en vous appuyant sur les bénédictions de chacun.

Si vous le faites pour la première fois, commencez l'activité en donnant la première bénédiction. Ensuite, faites le tour du cercle pour ajouter à votre bénédiction. Sautez les personnes qui ne peuvent penser à rien. Quand vous perdez de l'élan, demandez une autre bénédiction et commencez un autre tour. Continuez jusqu'à ce que personne ne puisse p`,
      tags: ["PA-primary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=101'
    },
    {
      id: 'retromat-102',
      phase: 'close',
      name: 'You and Me',
      nameFr: 'Toi et moi',
      summary: 'Recognize the efforts of teammates and self-improve a little',
      summaryFr: 'Reconnaissez les efforts des coéquipiers et auto-améliorez-vous un peu',
      duration: 5,
      description: `Put up 2 columns on a white board: 'Thank you!' and 'My action'. Ask everybody to write one sticky per column: Something they want to thank another teammate for doing; and something they want to change about their own behavior in the next iteration. It can be something really small. Once everyone is finished, do a round for each person to present their stickies and post them to the board.`,
      descriptionFr: `Mettez en place 2 colonnes sur un tableau blanc : 'Merci !' et 'Mon action'.

Demandez à tout le monde d'écrire une note par colonne :
- Quelque chose pour lequel ils veulent remercier un autre coéquipier
- Quelque chose qu'ils veulent changer dans leur propre comportement lors de la prochaine itération. Cela peut être quelque chose de vraiment petit.

Une fois que tout le monde a terminé, faites un tour pour que chaque personne présente ses notes et les affiche sur le tableau.`,
      tags: ["PA-primary","PC-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=102'
    },
    {
      id: 'retromat-106',
      phase: 'set-stage',
      name: 'Who said it?',
      nameFr: 'Qui a dit ça ?',
      summary: 'Attribute quotes to team members and situations',
      summaryFr: 'Attribuez des citations aux membres de l\'équipe et aux situations',
      duration: 5,
      description: `Before the retro, spend some time looking through email threads, chat logs, ticket discussions, and the like. Collect quotes from the last iteration: Funny quotes, or quotes which without context sound a little odd. Write them down with the name of the person who said them. 

 Read out the quotes at the beginning of the retro, and ask the team to guess who said it - the source may not self-identify! Often the team will not only know who said it, but also talk about what was going on at the time.`,
      descriptionFr: `Avant la rétro, passez du temps à parcourir les fils de courriels, journaux de discussion, discussions de tickets, et similaires. Collectez des citations de la dernière itération : Citations drôles, ou citations qui sans contexte semblent un peu bizarres. Notez-les avec le nom de la personne qui les a dites.

Lisez les citations au début de la rétro, et demandez à l'équipe de deviner qui l'a dit - la source ne doit pas s'identifier ! Souvent, l'équipe saura non seulement qui l'a dit, mais aussi `,
      tags: ["P1-primary","P2-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=106'
    },
    {
      id: 'retromat-107',
      phase: 'set-stage',
      name: 'Unlikely Superheros',
      nameFr: 'Super-héros improbables',
      summary: 'Imagine yourself as a superhero! What is your superpower?',
      summaryFr: 'Imaginez-vous en super-héros ! Quel est votre super-pouvoir ?',
      duration: 5,
      description: `Each participant creates a superhero version of themselves based on how they see themselves in the team / project - Complete with appropriate superpowers, weaknesses and possibly an arch-nemesis.`,
      descriptionFr: `Chaque participant crée une version super-héros d'eux-mêmes basée sur la façon dont ils se voient dans l'équipe / le projet - Avec des super-pouvoirs appropriés, des faiblesses et possiblement un ennemi juré.`,
      tags: ["P1-primary","P2-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=107'
    },
    {
      id: 'retromat-110',
      phase: 'gather-data',
      name: 'Movie Critic',
      nameFr: 'Critique de film',
      summary: 'Imagine your last iteration was a movie and write a review about it',
      summaryFr: 'Imaginez que votre dernière itération était un film et écrivez une critique à son sujet',
      duration: 15,
      description: `Introduce the activity by asking: Imagine your last iteration was a movie and you had to write a review: What was the genre of the movie (e.g. horror, drama, ...)?
 What was the (central) theme? Describe in 2-3 words.
 Was there a big twist (e.g. a bad guy)?
 What was the ending like (e.g. happy-end, cliffhanger) and did you expect it?
 What was your personal highlight?
 Would you recommend it to a colleague?
 Give each team member a piece of paper and 5 minutes to silently ponder the questions.`,
      descriptionFr: `Introduisez l'activité en demandant : Imaginez que votre dernière itération était un film et que vous deviez écrire une critique :
- Quel était le genre du film (par exemple horreur, drame, ...) ?
- Quel était le thème (central) ? Décrivez en 2-3 mots.
- Y avait-il un grand rebondissement (par exemple un méchant) ?
- Comment était la fin (par exemple happy-end, cliffhanger) et vous y attendiez-vous ?
- Quel a été votre moment fort personnel ?
- Le recommanderiez-vous à un collègue ?

Donnez à ch`,
      tags: ["P1-primary","P2-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=110'
    },
    {
      id: 'retromat-111',
      phase: 'gather-data',
      name: 'Feedback Sandwich',
      nameFr: 'Sandwich de feedback',
      summary: 'Learn how to raise constructive criticism with your team mates in a trusting and positive way',
      summaryFr: 'Apprenez à formuler des critiques constructives avec vos coéquipiers de manière confiante et positive',
      duration: 30,
      description: `Try this activity to help teams that are only ever saying nice things to each other and seem reluctant to raise concerns about each other. If they are always keeping the peace, they miss growth opportunities and issues may fester. Feedback Sandwich is a way to learn how to give and receive potentially critical feedback. It goes like this: 

 Team members sit in a circle and take turns receiving the feedback. The team member who's turn it is is not allowed to say anything until each person finish`,
      descriptionFr: `Essayez cette activité pour aider les équipes qui ne disent que de belles choses les unes sur les autres et semblent réticentes à soulever des préoccupations les unes sur les autres. S'ils maintiennent toujours la paix, ils manquent des opportunités de croissance et les problèmes peuvent s'envenimer.

Le Sandwich de Feedback est une façon d'apprendre à donner et recevoir des retours potentiellement critiques. Ça se passe comme ça :

Les membres de l'équipe s'assoient en cercle et chacun leur tou`,
      tags: ["PA-primary","P2-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=111'
    },
    {
      id: 'retromat-112',
      phase: 'close',
      name: 'Appreciation Postcards',
      nameFr: 'Cartes postales d\'appréciation',
      summary: 'Team members write appreciative postcards for later delivery',
      summaryFr: 'Les membres de l\'équipe écrivent des cartes postales d\'appréciation pour livraison ultérieure',
      duration: 5,
      description: `Hand out blank postcards. Each team member silently writes a postcard to another team member, thanking them for something they did. They can write as many postcards as they like, and they can address them either to individuals or to multiple people. Collect all postcards. Consider using envelopes with the name on for privacy. Deliver the cards throughout the next iteration to make someone's day. 

 Variation: Use normal paper and let participants fold the paper into little cranes for some origam`,
      descriptionFr: `Distribuez des cartes postales vierges. Chaque membre de l'équipe écrit silencieusement une carte postale à un autre membre de l'équipe, en le remerciant pour quelque chose qu'il a fait. Ils peuvent écrire autant de cartes postales qu'ils le souhaitent, et ils peuvent les adresser soit à des individus soit à plusieurs personnes. Collectez toutes les cartes postales.

Envisagez d'utiliser des enveloppes avec le nom dessus pour la confidentialité. Livrez les cartes tout au long de la prochaine ité`,
      tags: ["PA-primary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=112'
    },
    {
      id: 'retromat-114',
      phase: 'set-stage',
      name: 'Give me a face',
      nameFr: 'Donne-moi un visage',
      summary: 'Participants show how they feel by drawing a face on a tangerine',
      summaryFr: 'Les participants montrent comment ils se sentent en dessinant un visage sur une clémentine',
      duration: 5,
      description: `Each team member gets a sharpie and a tangerine with a sticky note asking: 'How do you feel? Please give me a face'. After all are done drawing you go around and compare the works of art and emotions. It's a light-hearted way to set the stage.`,
      descriptionFr: `Chaque membre de l'équipe reçoit un feutre et une clémentine avec une note autocollante demandant : 'Comment te sens-tu ? Donne-moi un visage, s'il te plaît'.

Après que tous aient fini de dessiner, vous faites le tour et comparez les œuvres d'art et les émotions. C'est une façon légère de créer le contexte.`,
      tags: ["P1-primary","PA-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=114'
    },
    {
      id: 'retromat-120',
      phase: 'close',
      name: 'My Team is Awesome',
      nameFr: 'Mon équipe est géniale',
      summary: 'Acknowledge what\'s awesome about your team',
      summaryFr: 'Reconnaissez ce qui est génial dans votre équipe',
      duration: 5,
      description: `Give each team member a piece of paper and ask them to write down the following text: 
 'My team is awesome because _______________ 
 and that makes me feel __________________' 

 Everyone fills out the blanks for themselves and signs below. When everyone is finished, put up the sheets on a wall. A volunteer reads out the sheets and the team celebrates by cheering or applausing. Take some time to review and share observations. Take a picture to remind the team how awesome it feels to be part of `,
      descriptionFr: `Donnez à chaque membre de l'équipe une feuille de papier et demandez-leur d'écrire le texte suivant :

'Mon équipe est géniale parce que _______________
et cela me fait sentir __________________'

Chacun remplit les blancs pour lui-même et signe en dessous. Quand tout le monde a terminé, affichez les feuilles sur un mur. Un volontaire lit les feuilles et l'équipe célèbre en acclamant ou applaudissant. Prenez un moment pour examiner et partager les observations.

Prenez une photo pour rappeler à `,
      tags: ["PA-primary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=120'
    },
    {
      id: 'retromat-122',
      phase: 'set-stage',
      name: 'Positive and True',
      nameFr: 'Positif et vrai',
      summary: 'Boost everyone\'s energy with a tailored question',
      summaryFr: 'Boostez l\'énergie de chacun avec une question sur mesure',
      duration: 5,
      description: `Think of a question that is tailored to get a response that is positive, true and about their own experiences, e.g. 
 What have you done really well in the last iteration?
 
What is something that makes you really happy?
 
What were you most happy about yesterday?
 
 

Ask your neighbor the question. Then your neighbor asks their neighbor on the other side the same question and so on until everyone has answered and asked. 

 
This will give everyone a boost and lead to a better retro.`,
      descriptionFr: `Pensez à une question qui est conçue pour obtenir une réponse qui est positive, vraie et sur leurs propres expériences, par exemple :

- Qu'avez-vous vraiment bien fait lors de la dernière itération ?
- Qu'est-ce qui vous rend vraiment heureux ?
- De quoi étiez-vous le plus heureux hier ?

Posez la question à votre voisin. Ensuite, votre voisin pose la même question à son voisin de l'autre côté et ainsi de suite jusqu'à ce que tout le monde ait répondu et posé la question.

Cela donnera à chacun`,
      tags: ["P1-primary","PA-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=122'
    },
    {
      id: 'retromat-126',
      phase: 'gather-data',
      name: 'I like, I wish',
      nameFr: 'J\'aime, Je souhaite',
      summary: 'Give positive, as well as non-threatening, constructive feedback',
      summaryFr: 'Donnez des retours positifs, ainsi que des retours constructifs non menaçants',
      duration: 15,
      description: `Hang up two flip charts, one headed 'I like' and the other 'I wish'. Give the participants 5-10 minutes to silently write down what they liked about the past iteration and the team and what they wish was different (and how it should be different) – one point per sticky note. When everyone is finished, go around the circle and everybody reads out their 'I like' items and hangs them up. Repeat the same for the 'I wish' stickies. Either debrief or use the stickies as input for the next phase.


V`,
      descriptionFr: `Accrochez deux paperboards, l'un intitulé 'J'aime' et l'autre 'Je souhaite'.

Donnez aux participants 5-10 minutes pour écrire silencieusement ce qu'ils ont aimé de la dernière itération et de l'équipe et ce qu'ils souhaitent qui soit différent (et comment cela devrait être différent) - un point par note autocollante.

Quand tout le monde a terminé, faites le tour du cercle et chacun lit ses éléments 'J'aime' et les accroche. Répétez la même chose pour les notes 'Je souhaite'. Soit débriefez, so`,
      tags: ["PA-primary","PD-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=126'
    },
    {
      id: 'retromat-129',
      phase: 'set-stage',
      name: 'String Theory',
      nameFr: 'Théorie des cordes',
      summary: 'Surface shared traits and mutual interests among team members',
      summaryFr: 'Faites ressortir les traits partagés et les intérêts mutuels entre les membres de l\'équipe',
      duration: 15,
      description: `This is an excellent activity for newly formed teams of 6 to 15 members. It speeds up team building by sharing traits and interests so that team members can build closer bonds than possible with just work-related stuff. 

 Have the team form a circle with everyone looking inwards. Leave about a foot of space between people. Depending on what you want to stress with this activity, you can ask colleagues that usually work remotely to stand about 5 feet away from the circle. 

 Hand a ball of yarn `,
      descriptionFr: `C'est une excellente activité pour les équipes nouvellement formées de 6 à 15 membres. Elle accélère la construction d'équipe en partageant des traits et des intérêts afin que les membres de l'équipe puissent construire des liens plus étroits que possible avec seulement du travail.

Demandez à l'équipe de former un cercle en regardant vers l'intérieur. Laissez environ 30 cm d'espace entre les personnes. Selon ce que vous voulez souligner avec cette activité, vous pouvez demander aux collègues qu`,
      tags: ["PA-primary","P1-secondary"],
      trustLevel: 'low',
      retromatUrl: 'https://retromat.org/en/?id=129'
    },
    {
      id: 'retromat-130',
      phase: 'set-stage',
      name: 'Spot the Elephant',
      nameFr: 'Repérer l\'éléphant',
      summary: 'Are there problems nobody talks about?',
      summaryFr: 'Y a-t-il des problèmes dont personne ne parle ?',
      duration: 5,
      description: `Prepare 1 set of cards per team member. A set of cards contains 1 elephant card, 1 boot card, 1 happy sun card, and 1 moon card. Explain how they each choose one card from their set: If a team member thinks there is at least one 'Elephant in the room' (unspoken but important problem) for this team, then choose the Elephant card. Choosing this card doesn't mean that they have to talk about the Elephant or even say what they think the problem is.
 If there are no Elephants, but they got their feel`,
      descriptionFr: `Préparez 1 ensemble de cartes par membre de l'équipe. Un ensemble de cartes contient 1 carte éléphant, 1 carte botte, 1 carte soleil joyeux et 1 carte lune.

Expliquez comment chacun choisit une carte de son ensemble :

- Si un membre de l'équipe pense qu'il y a au moins un 'Éléphant dans la pièce' (problème important mais non exprimé) pour cette équipe, choisissez la carte Éléphant. Choisir cette carte ne signifie pas qu'ils doivent parler de l'Éléphant ou même dire ce qu'ils pensent être le pr`,
      tags: ["PA-primary","P2-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=130'
    },
    {
      id: 'retromat-136',
      phase: 'set-stage',
      name: 'Surprise!',
      nameFr: 'Surprise !',
      summary: 'How do the toys in Kinder Surprise Eggs represent participants?',
      summaryFr: 'Comment les jouets des Kinder Surprise représentent-ils les participants ?',
      duration: 5,
      description: `Prepare by buying a Kinder Surprise Egg (or something similar with a surprise toy inside) for each participant. 


Hand out the eggs at the beginning of the retrospective. Eating the chocolate is optional, but everybody needs to open their egg and assemble the toy. Ask “How does your toy represent your role in this iteration?”


Give everyone a minute to think. Then go around the group for everyone to present their toy and how they relate to it.`,
      descriptionFr: `Préparez en achetant un Kinder Surprise (ou quelque chose de similaire avec un jouet surprise à l'intérieur) pour chaque participant.

Distribuez les œufs au début de la rétrospective. Manger le chocolat est optionnel, mais tout le monde doit ouvrir son œuf et assembler le jouet. Demandez "Comment votre jouet représente-t-il votre rôle dans cette itération ?"

Donnez à chacun une minute pour réfléchir. Ensuite, faites le tour du groupe pour que chacun présente son jouet et comment il s'y rapport`,
      tags: ["P1-primary","P2-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=136'
    },
    {
      id: 'retromat-140',
      phase: 'set-stage',
      name: 'What kind of X?',
      nameFr: 'Quel genre de X ?',
      summary: 'Participants give a metaphor for the iteration',
      summaryFr: 'Les participants donnent une métaphore pour l\'itération',
      duration: 5,
      description: `Start by asking "If this iteration was an X, what kind of X would it be?" This question has endless variations from "If the iteration was a animal, what animal would it be?" over cocktails and furniture to plants and "If the iteration was a car, what car would it be?"


Ask everybody to write down their answer on a sticky note. Go around the team, everybody reads out their note and posts it on a board. Briefly discuss the answers. After all it's a difference if the iteration were "a BMW, but t`,
      descriptionFr: `Commencez par demander "Si cette itération était un X, quel genre de X serait-ce ?" Cette question a des variations infinies de "Si l'itération était un animal, quel animal serait-ce ?" en passant par les cocktails et les meubles jusqu'aux plantes et "Si l'itération était une voiture, quelle voiture serait-ce ?"

Demandez à chacun d'écrire sa réponse sur une note autocollante. Faites le tour de l'équipe, chacun lit sa note et la poste sur un tableau. Discutez brièvement des réponses. Après tout,`,
      tags: ["P1-primary","P2-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=140'
    },
    {
      id: 'retromat-143',
      phase: 'set-stage',
      name: 'How’s your battery?',
      nameFr: 'Comment va votre batterie ?',
      summary: 'Check in on everybody’s well-being',
      summaryFr: 'Faites un point sur le bien-être de chacun',
      duration: 5,
      description: `If your phone battery runs low you look for a charger. With human beings it is harder to tell when they need to recharge. That’s why we use this activity to ask explicitly: Prepare a flipchart by outlining one battery per participant. 


Ask each participant to color in their battery to show how much energy they currently have. Reflect together on the results, e. g. by asking “What do you notice?” – especially if someone is low on energy (“What would help you save or even gain energy?”)


De`,
      descriptionFr: `Si la batterie de votre téléphone est faible, vous cherchez un chargeur. Avec les êtres humains, il est plus difficile de dire quand ils ont besoin de se recharger. C'est pourquoi nous utilisons cette activité pour demander explicitement :

Préparez un paperboard en dessinant une batterie par participant.

Demandez à chaque participant de colorier sa batterie pour montrer combien d'énergie il a actuellement. Réfléchissez ensemble aux résultats, par exemple en demandant "Que remarquez-vous ?" - s`,
      tags: ["PA-primary","P1-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=143'
    },
    {
      id: 'retromat-144',
      phase: 'close',
      name: 'Elevenie',
      nameFr: 'Onzième',
      summary: 'Write a short poem',
      summaryFr: 'Écrivez un court poème',
      duration: 15,
      description: `An Elevenie (German 'Elfchen') is a poem with 11 words on five lines – 1, 2, 3, 4 and 1 word per line respectively. Only do this with a team in which people enjoy working with each other. It's a wonderful activity to do with a team that is disbanding at the end of a project as a way to commerate the good times. 


Hand out pens and paper and read out the instructions:


'We are going to each write a poem with 5 lines. Each line has a specific number of words. Don't worry, I'll guide you thro`,
      descriptionFr: `Un Onzième (Elfchen en allemand) est un poème avec 11 mots sur cinq lignes - 1, 2, 3, 4 et 1 mot par ligne respectivement. Ne faites cela qu'avec une équipe dans laquelle les gens aiment travailler les uns avec les autres. C'est une merveilleuse activité à faire avec une équipe qui se dissout à la fin d'un projet comme moyen de commémorer les bons moments.

Distribuez des stylos et du papier et lisez les instructions :

'Nous allons chacun écrire un poème de 5 lignes. Chaque ligne a un nombre sp`,
      tags: ["PA-primary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=144'
    },
    {
      id: 'retromat-145',
      phase: 'generate-insights',
      name: 'Braver',
      nameFr: 'Plus courageux',
      summary: 'What does courage look like? What would the team do if they were bolder?',
      summaryFr: 'À quoi ressemble le courage ? Que ferait l\'équipe si elle était plus audacieuse ?',
      duration: 30,
      description: `Put up four posters with the following questions: 



Which person in the team do you find courageous and how does courage show itself?

When have you felt insecure and wished you were braver?

What helps you to be brave?

What bold idea would you try as a team if you were 10 times bolder?


For each question do a round of:



4 minutes of quiet time to answer the question on sticky notes

Ask people to read out and post their answers. (In a large group you can use 1-2-4-All to discu`,
      descriptionFr: `Mettez en place quatre affiches avec les questions suivantes :

1. Quelle personne dans l'équipe trouvez-vous courageuse et comment le courage se manifeste-t-il ?
2. Quand vous êtes-vous senti(e) en insécurité et avez souhaité être plus courageux(se) ?
3. Qu'est-ce qui vous aide à être courageux(se) ?
4. Quelle idée audacieuse essaieriez-vous en équipe si vous étiez 10 fois plus audacieux(ses) ?

Pour chaque question, faites un tour de :
- 4 minutes de temps calme pour répondre à la question sur`,
      tags: ["PA-primary","PB-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=145'
    },
  ],

  // lack-purpose (20 activities)
  'lack-purpose': [
    {
      id: 'retromat-4',
      phase: 'gather-data',
      name: 'Timeline',
      nameFr: 'Frise chronologique',
      summary: 'Participants write down significant events and order them chronologically',
      summaryFr: 'Les participants écrivent les événements marquants et les ordonnent chronologiquement.',
      duration: 15,
      description: `Divide into groups with 5 or less people each. Distribute cards and markers. Give participants 10min to note down memorable and / or personally significant events. It's about gathering many perspectives. Consensus would be detrimental. All participants post their cards and order them. It's okay to add cards on the fly. Analyze.
Color Coding can help to see patterns, e.g.:
 Emotions
 Events (technical, organization, people, ...)
 Function (tester, developer, manager, ...)`,
      descriptionFr: `Diviser en groupes de 5 personnes ou moins. Distribuer des cartes et des marqueurs. Donner aux participants 10 minutes pour noter des événements mémorables et / ou personnellement significatifs. Il s'agit de recueillir plusieurs points de vue. Un consensus serait préjudiciable. Tous les participants affichent leurs cartes et les ordonnent. Il est normal d'ajouter des cartes à la volée. Analyser.
Des codes couleurs peuvent aider à faire ressortir des modèles, par exemple :
Émotions
Événements (te`,
      tags: ["P2-primary","PB-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=4'
    },
    {
      id: 'retromat-11',
      phase: 'decide-what-to-do',
      name: 'Circle of Questions',
      nameFr: 'Le Cercle des Questions',
      summary: 'Asking and answering go around the team circle - an excellent way to reach consensus',
      summaryFr: 'Questions et réponses font le tour du cercle de l\'équipe - une excellente façon de parvenir à un consensus.',
      duration: 15,
      description: `Everyone sits in a circle. Begin by stating that you'll go round asking questions to find out what you want to do as a group. You start by asking your neighbor the first question, e.g. 'What is the most important thing we should start in the next iteration?' Your neighbor answers and asks her neighbor a related question. Stop when consensus emerges or the time is up. Go around at least once, so that everybody is heard!`,
      descriptionFr: `Tout le monde s'asseoit en cercle. Commencez en annonçant que vous allez faire un tour de questions pour découvrir ce que vous voulez faire en tant que groupe. Vous commencez par poser la première question à votre voisin, par exemple 'Quelle est la chose la plus importante que nous devrions démarrer lors de la prochaine itération ?' Votre voisin répond et pose une question liée à son voisin. Arrêtez-vous quand un consensus émerge ou que le temps est écoulé. Faites au moins un tour, qu'on puisse `,
      tags: ["P2-primary","PC-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=11'
    },
    {
      id: 'retromat-26',
      phase: 'generate-insights',
      name: 'Speed Dating',
      nameFr: 'Speed Dating',
      summary: 'Each team member explores one topic in depth in a series of 1:1 talks',
      summaryFr: 'Chaque membre de l\'équipe explore un sujet en détail dans une série de discussions en tête-à-tête',
      duration: 30,
      description: `Each participant writes down one topic they want to explore, i.e. something they'd like to change. Then form pairs and spread across the room. Each pair discusses both topics and ponders possible actions - 5 minutes per participant (topic) - one after the other. After 10 minutes the pairs break up to form new pairs. Continue until everyone has talked to everyone else. 
If the group has an odd number of members, the facilitator is part of a pair but the partner gets all 10 minutes for their topic`,
      descriptionFr: `Chaque participant écrit un sujet qu'il souhaite approfondir, càd quelque chose qu'il aimerait voir changer. Former ensuite des paires et répartissez-vous à travers la salle. Chaque paire discute des deux sujets et réfléchit aux actions possibles - 5 minutes par participant (sujet) - l'un après l'autre. Après 10 minutes les paires se séparent et forment de nouvelles paires. Continuer jusqu'à ce que tout le monde ait discuté avec tout le monde. 
Si le groupe a un nombre impair de membres, le faci`,
      tags: ["P2-primary","PB-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=26'
    },
    {
      id: 'retromat-30',
      phase: 'gather-data',
      name: 'Dialogue Sheets',
      nameFr: 'Plateau de discussion',
      summary: 'A structured approach to a discussion',
      summaryFr: 'Une approche structurée pour une discussion.',
      duration: 30,
      description: `A dialogue sheet looks a little like a board game board. There are several different sheets available. Choose one, print it as large as possible (preferably A1) and follow its instructions.`,
      descriptionFr: `Un plateau de discussions ressemble un peu à un jeu de plateau. Il y a plusieurs grilles disponibles (EN).
En choisir une, l'imprimer dans le plus grand format possible (idéalement en A1) et suivre ses instructions.`,
      tags: ["P2-primary","PB-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=30'
    },
    {
      id: 'retromat-41',
      phase: 'generate-insights',
      name: 'Park Bench',
      nameFr: 'Le banc du parc',
      summary: 'Group discussion with varying subsets of participants',
      summaryFr: 'Discussion de groupe avec un nombre variable de sous-groupes de participants.',
      duration: 15,
      description: `Place at least 4 and at most 6 chairs in a row so that they face the group. Explain the rules: Take a bench seat when you want to contribute to the discussion
 One seat must always be empty
 When the last seat is taken, someone else must leave and return to the audience
Get everything going by sitting on the 'bench' and wondering aloud about something you learned in the previous phase until someone joins. End the activity when discussion dies down. 
This is a variant of 'Fish Bowl'. It's suited `,
      descriptionFr: `Placer au moins 4 et au maximum 6 chaises en ligne afin qu'elles fassent face au groupe. 
Expliquer les règles : Vous asseoir sur le banc lorsque vous voulez contribuer à la discussion
 Le banc doit toujours avoir une place de libre
 Lorsque la dernière place du banc est prise, quelqu'un doit obligatoirement partir et retourner dans le public
Démarrer en vous asseyant sur le "banc" et en vous demandant à voix haute ce que vous avez appris au cours de la phase précédente jusqu'à ce que quelqu'un `,
      tags: ["P2-primary","PB-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=41'
    },
    {
      id: 'retromat-47',
      phase: 'gather-data',
      name: 'Empty the Mailbox',
      nameFr: 'Vider la boîte aux lettres',
      summary: 'Look at notes collected during the iteration',
      summaryFr: 'Jetons un coup d\'œil aux notes collectées pendant le sprint',
      duration: 15,
      description: `Set up a 'retrospective mailbox' at the beginning of the iteration. Whenever something significant happens or someone has an idea for improvement, they write it down and 'post' it. (Alternatively the 'mailbox' can be a visible place. This can spark discussion during the iteration.) 
Go through the notes and discuss them.
A mailbox is great for long iterations and forgetful teams.`,
      descriptionFr: `Mettre en place une 'boîte à lettres de rétrospective' au début de l'itération. Lorsque quelque chose d'important se produit ou que quelqu'un a une idée d'amélioration, il l'écrit et le 'poste'. (La 'boîte aux lettres' peut également être un endroit visible. Cela peut initier une discussion pendant l'itération.) 
Parcourir toutes les notes et en discuter.
Une boîte aux lettres est bien pour les longues itérations et les équipes distraites.`,
      tags: ["P2-primary","PB-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=47'
    },
    {
      id: 'retromat-51',
      phase: 'generate-insights',
      name: 'Lean Coffee',
      nameFr: 'Café Lean',
      summary: 'Use the Lean Coffee format for a focused discussion of the top topics',
      summaryFr: 'Utiliser le format du café Lean pour une discussion centrée sur les sujets les plus importants',
      duration: 15,
      description: `Say how much time you set aside for this phase, then explain the rules of Lean Coffee for retrospectives: Everyone writes down topics they’d like to discuss - 1 topic per sticky
 Put the stickies up on a whiteboard or flipchart. The person who wrote it describes the topic in 1 or 2 sentences. Group stickies that are about the same topic
 Everyone dot-votes for the 2 topics they want to discuss
 Order the stickies according to votes
 Start with the topic of highest interest
 Set a timer for 5 min`,
      descriptionFr: `Indiquer combien de temps consacrer à cette phase et expliquer ensuite les règles du café Lean pour les rétrospectives : Chacun écrit les sujets qu'il voudrait évoquer - 1 sujet par note
 Placer les notes sur un tableau. Chacun décrit son sujet en une ou deux phrases. Les notes sur le même sujet sont regroupées
 Tout le monde vote par point pour les deux sujets qu'ils veulent évoquer
 Trier les notes selon les votes
 Débuter par le sujet avec le plus grand intérêt
 Démarrer un chrono pour 5 minu`,
      tags: ["P2-primary","PC-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=51'
    },
    {
      id: 'retromat-52',
      phase: 'set-stage',
      name: 'Constellation - Opening',
      nameFr: 'Constellation - Ouvrir',
      summary: 'Let the participants affirm or reject statements by moving around',
      summaryFr: 'Permettre aux participants d\'approuver ou rejeter des énoncés en se déplaçant',
      duration: 5,
      description: `Place a circle or sphere in the middle of a free space. Let the team gather around it. Explain that the circle is the center of approval: If they agree to a statement they should move towards it, if they don't, they should move as far outwards as their degree of disagreement. Now read out statements, e.g. I feel I can talk openly in this retrospective
 I am satisfied with the last iteration
 I am happy with the quality of our code
 I think our continuous integration process is mature
Watch the c`,
      descriptionFr: `Placer un cercle ou une sphère au milieu d'une zone dégagée. Inviter l'équipe à se rassembler autour. Expliquer que le cercle est le centre d'approbation. Si je suis d'accord avec un énoncé, je me rapproche du centre, si je ne le suis pas, je m'en éloigne d'autant que représente mon niveau de rejet. Ensuite, lire les déclarations, exemple : Je trouve que je peux m'exprimer ouvertement dans cette rétrospective
 Je suis satisfait de notre dernière itération
 Je suis heureux de la qualité de notre `,
      tags: ["P2-primary","PA-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=52'
    },
    {
      id: 'retromat-58',
      phase: 'generate-insights',
      name: 'Undercover Boss',
      nameFr: 'Le chef clandestin',
      summary: 'If your boss had witnessed the last iteration, what would she want you to change?',
      summaryFr: 'Si votre chef avait assisté à votre dernière itération, que voudrait-il/elle vous voir changer ?',
      duration: 15,
      description: `Imagine your boss had spent the last iteration - unrecognized - among you. What would she think about your interactions and results? What would she want you to change? 
This setting encourages the team to see themselves from a different angle.`,
      descriptionFr: `Imaginer que votre chef a passé la dernière itération - incognito - parmi vous. Que penserait-il/elle de vos échanges et résultats ? Que voudrait-il/elle vous voir changer ? 

Ce cadre aide l'équipe à se voir d'un point de vue différent.`,
      tags: ["P2-primary","PB-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=58'
    },
    {
      id: 'retromat-62',
      phase: 'gather-data',
      name: 'Expectations',
      nameFr: 'Attentes',
      summary: 'What can others expect of you? What can you expect of them?',
      summaryFr: 'Qu\'est-ce que les autres peuvent attendre de vous ? Que pouvez-vous attendre d\'eux ?',
      duration: 15,
      description: `Give each team member a piece of paper. The lower half is blank. The top half is divided into two sections: What my team mates can expect from me
 What I expect from my team mates
Each person fills out the top half for themselves. When everyone is finished, they pass their paper to the left and start reviewing the sheet that was passed to them. In the lower half they write what they personally expect from that person, sign it and pass it on.
When the papers made it around the room, take some tim`,
      descriptionFr: `Distribuer une feuille de papier à chaque membre de l'équipe. La moitié basse est blanche, le haut est divisé en deux sections : Qu'est-ce que mon équipe attend de moi ?
 Qu'est-ce que j'attend de mes co-équipiers ?
Chaque personne remplit la partie haute. Quand tout le monde a terminé, on fait passer le papier à la personne sur notre gauche puis chacun lit la feuille qui lui a été transmise. Dans la partie basse, on écrit ce qu'on attend personnellement du propriétaire de la feuille en signant `,
      tags: ["P2-primary","PA-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=62'
    },
    {
      id: 'retromat-86',
      phase: 'gather-data',
      name: 'Lines of Communication',
      nameFr: 'Lignes de communication',
      summary: 'Visualize how information flows in, out and around the team',
      summaryFr: 'Visualiser la manière dont l\'information circule au sein de l\'équipe et autour d\'elle.',
      duration: 15,
      description: `Is information not flowing as well as it needs to? Do you suspect bottlenecks? Visualize the ways information flows to find starting points for improvements. If you want to look at one specific flow (e.g. product requirements, impediments, ...) check out Value Stream Mapping (#79). For messier situations try something akin to Cause-Effect-Diagrams (#25). 
Look at the finished drawing. Where are delays or dead ends?`,
      descriptionFr: `Les informations ne circulent elles pas aussi bien qu'elles le devraient ? Suspectez vous des "goulots d'étranglement" / des bouchons ? Visualisez les flux d'informations afin de trouver des points de départ pour des améliorations. Si vous souhaitez examiner un flux spécifique (par exemple, les exigences du produit, les obstacles, ...), consultez la cartographie de la chaîne de valeur (Value Stream Mapping) (#79). Pour les situations plus compliquées, essayez quelque chose qui ressemble aux Diag`,
      tags: ["P2-primary","P3-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=86'
    },
    {
      id: 'retromat-93',
      phase: 'gather-data',
      name: 'Tell a Story with Shaping Words',
      nameFr: 'Raconter une histoire avec des mots-clés',
      summary: 'Each participant tells a story about the last iteration that contains certain words',
      summaryFr: 'Chaque participant raconte une histoire sur la dernière itération qui contient certains mots',
      duration: 15,
      description: `Provide everyone with something to write down their story. Then introduce the shaping words, which influence the story to be written: If the last iteration could have been better:
 You set a couple of shaping words, e.g. such as 'mad, sad, glad' or 'keep, drop, add'. Additionally they have to write their story in first person. This avoids blaming others. 
 If the last iteration was successful:
 The team can either choose their own set of words or you can provide random words to unleash the team'`,
      descriptionFr: `Fournissez à chacun de quoi écrire son histoire. Ensuite, introduisez les mots-clés, qui influencent l'histoire à écrire :

Si la dernière itération aurait pu être meilleure :
Vous définissez quelques mots-clés, par exemple 'en colère, triste, content' ou 'garder, abandonner, ajouter'. De plus, ils doivent écrire leur histoire à la première personne. Cela évite de blâmer les autres.

Si la dernière itération a été un succès :
L'équipe peut soit choisir son propre ensemble de mots, soit vous pouv`,
      tags: ["P2-primary","PA-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=93'
    },
    {
      id: 'retromat-94',
      phase: 'generate-insights',
      name: 'BYOSM - Build your own Scrum Master',
      nameFr: 'BYOSM - Construisez votre propre Scrum Master',
      summary: 'The team assembles the perfect SM & takes different points of view',
      summaryFr: 'L\'équipe assemble le SM parfait et prend différents points de vue',
      duration: 30,
      description: `Draw a Scrum Master on a flipchart with three sections on him/her: brain, heart, stomach. Round 1: 'What properties does your perfect SM display?' 
Ask them to silently write down one trait per note. Let participants explain their notes and put them on the drawing. 
 Round 2: 'What does the perfect SM have to know about you as a team so that he/she can work with you well?' 
Round 3: 'How can you support your SM to do a brilliant job?' 
 
You can adapt this activity for other roles, e.g. BYOProdu`,
      descriptionFr: `Dessinez un Scrum Master sur un paperboard avec trois sections : cerveau, cœur, estomac.

Tour 1 : 'Quelles propriétés votre SM parfait affiche-t-il ?'
Demandez-leur d'écrire silencieusement un trait par note. Laissez les participants expliquer leurs notes et les placer sur le dessin.

Tour 2 : 'Que doit savoir le SM parfait sur vous en tant qu'équipe pour qu'il/elle puisse bien travailler avec vous ?'

Tour 3 : 'Comment pouvez-vous aider votre SM à faire un travail brillant ?'

Vous pouvez adap`,
      tags: ["P2-primary","PA-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=94'
    },
    {
      id: 'retromat-95',
      phase: 'generate-insights',
      name: 'If I were you',
      nameFr: 'Si j\'étais toi',
      summary: 'What could sub-groups improve when interacting with others?',
      summaryFr: 'Que pourraient améliorer les sous-groupes lors des interactions avec les autres ?',
      duration: 30,
      description: `Identify sub-groups within the participants that interacted during the iteration, e.g. developers/testers, clients/providers, PO/developers, etc. Give participants 3 minutes to silently write down what they think their group did that negatively impacted another group. One person should be part of one group only and write stickies for all groups they don't belong to - 1 sticky per issue. 

 Then in turn all participants read their stickies and give them to the corresponding group. The affected gr`,
      descriptionFr: `Identifiez les sous-groupes parmi les participants qui ont interagi pendant l'itération, par exemple développeurs/testeurs, clients/fournisseurs, PO/développeurs, etc.

Donnez aux participants 3 minutes pour écrire silencieusement ce qu'ils pensent que leur groupe a fait qui a eu un impact négatif sur un autre groupe. Une personne ne doit faire partie que d'un seul groupe et écrire des notes pour tous les groupes auxquels elle n'appartient pas - 1 note par problème.

Ensuite, à tour de rôle, tou`,
      tags: ["P2-primary","PB-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=95'
    },
    {
      id: 'retromat-108',
      phase: 'set-stage',
      name: 'Know your neighbour - Opening',
      nameFr: 'Connaissez votre voisin - Ouverture',
      summary: 'How did your right neighbour feel during the iteration',
      summaryFr: 'Comment votre voisin de droite s\'est-il senti pendant l\'itération',
      duration: 5,
      description: `Ask each team member to briefly describe how their right neighbour felt during the iteration. Their neighbour confirms or corrects the guess. 
 Once all participants shared their best guess about how their teammates felt, you get an idea of how connected they are, how communication is flowing in your team and if people are aware of the feelings expressed, in some way, by others. 

 Consider closing with activity #109.`,
      descriptionFr: `Demandez à chaque membre de l'équipe de décrire brièvement comment leur voisin de droite s'est senti pendant l'itération. Leur voisin confirme ou corrige la supposition.

Une fois que tous les participants ont partagé leur meilleure supposition sur ce que leurs coéquipiers ont ressenti, vous avez une idée de leur connexion, de la façon dont la communication circule dans votre équipe et si les gens sont conscients des sentiments exprimés, d'une certaine manière, par les autres.

Envisagez de clor`,
      tags: ["P2-primary","PA-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=108'
    },
    {
      id: 'retromat-119',
      phase: 'gather-data',
      name: 'Hit the Headlines',
      nameFr: 'Faire les gros titres',
      summary: 'Which sprint events were newsworthy?',
      summaryFr: 'Quels événements du sprint méritaient d\'être des nouvelles ?',
      duration: 15,
      description: `Collect some news headlines in advance and take them to the retrospective to serve as examples. Try to gather a mixture of headlines: factual, opinion, review. Place the headlines where everyone can see them. Hand out sticky notes. Give team members 10 minutes to come up with their own headlines describing newsworthy aspects of the sprint. Encourage short, punchy headlines. 
 Stick the completed headlines to a whiteboard. If any cover the same news item, combine them. If any are unclear, ask the`,
      descriptionFr: `Collectez quelques gros titres de journaux à l'avance et apportez-les à la rétrospective pour servir d'exemples. Essayez de rassembler un mélange de titres : factuels, opinion, critique. Placez les titres là où tout le monde peut les voir.

Distribuez des notes autocollantes. Donnez aux membres de l'équipe 10 minutes pour créer leurs propres titres décrivant des aspects notables du sprint. Encouragez des titres courts et percutants.

Collez les titres terminés sur un tableau blanc. Si certains c`,
      tags: ["P2-primary","P1-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=119'
    },
    {
      id: 'retromat-133',
      phase: 'gather-data',
      name: 'Tell me something I don’t know',
      nameFr: 'Dis-moi quelque chose que je ne sais pas',
      summary: 'Reveal everyone\'s hidden knowledge with a game show',
      summaryFr: 'Révélez les connaissances cachées de chacun avec un jeu télévisé',
      duration: 15,
      description: `Instruct participants as follows:
‘There’s a game show called ‘Tell me something I don’t know’. In it a guest states a fact, poses a related question and then the hosts ask questions in order to guess the right answers. 


Here’s an example: ‘In the US you always sing along to the national anthem. In Spain no one does. Can you guess why?’ The hosts ask questions such as ‘Does it have to do with the Franco era?’, ‘Are the lyrics in a foreign language e.g. Latin?’ etc. They either guess the ans`,
      descriptionFr: `Donnez les instructions suivantes aux participants :

'Il y a un jeu télévisé appelé "Dis-moi quelque chose que je ne sais pas". Dans celui-ci, un invité énonce un fait, pose une question connexe, puis les animateurs posent des questions pour essayer de deviner les bonnes réponses.

Voici un exemple : "Aux États-Unis, vous chantez toujours l'hymne national. En Espagne, personne ne le fait. Pouvez-vous deviner pourquoi ?" Les animateurs posent des questions telles que "Est-ce lié à l'ère Franco ?`,
      tags: ["P2-primary","PD-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=133'
    },
    {
      id: 'retromat-137',
      phase: 'gather-data',
      name: 'Dare, Care, Share',
      nameFr: 'Oser, Prendre soin, Partager',
      summary: 'Collect topics in three categories: \'Dare\', \'Care\' and \'Share\'',
      summaryFr: 'Collectez des sujets dans trois catégories : \'Oser\', \'Prendre soin\' et \'Partager\'',
      duration: 5,
      description: `Display three categories: 


Dare

… is for bold wishes, ideas and suggestions; to address pain points; anything that is important to mention but might need courage to raise



Care

… is for troubles and worries; things that aren’t happening but should; areas for improvement



Share

… is for any kind of information that team members want to share with each other; feedback, news, …



Ask each participant to write down at least 1 sticky note per category and set the timer to 5 m`,
      descriptionFr: `Affichez trois catégories :

Oser - ... est pour les souhaits audacieux, les idées et suggestions ; pour aborder les points douloureux ; tout ce qui est important à mentionner mais qui pourrait nécessiter du courage pour le soulever

Prendre soin - ... est pour les troubles et soucis ; les choses qui ne se passent pas mais devraient ; les domaines d'amélioration

Partager - ... est pour tout type d'information que les membres de l'équipe veulent partager entre eux ; feedback, nouvelles, ...

Dem`,
      tags: ["P2-primary","PA-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=137'
    },
    {
      id: 'retromat-142',
      phase: 'gather-data',
      name: 'Watermelon',
      nameFr: 'Pastèque',
      summary: 'How is your project really doing?',
      summaryFr: 'Comment va vraiment votre projet ?',
      duration: 15,
      description: `A disconnect between the actual state of a project and a too positive external view on it, can be dangerous. The longer the disconnect lasts and the wider the gap, the harder it becomes to address: Let’s look for gaps. 


In this activity you compare internal and external view on progress and project state. Prepare a flipchart with a large watermelon cut through, red with seeds on the inside, yellow and green rings on the outside. Write “How does our project look internally?” inside the melon `,
      descriptionFr: `Un décalage entre l'état réel d'un projet et une vision externe trop positive de celui-ci peut être dangereux. Plus le décalage dure longtemps et plus l'écart est large, plus il devient difficile à aborder : Recherchons les écarts.

Dans cette activité, vous comparez la vision interne et externe des progrès et de l'état du projet. Préparez un paperboard avec une grande pastèque coupée, rouge avec des pépins à l'intérieur, anneaux jaunes et verts à l'extérieur. Écrivez "Comment notre projet paraî`,
      tags: ["P2-primary","PB-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=142'
    },
    {
      id: 'retromat-146',
      phase: 'gather-data',
      name: 'Roles and Responsibilities',
      nameFr: 'Rôles et responsabilités',
      summary: 'Clarify expectations and responsibilities for each role on the team',
      summaryFr: 'Clarifiez les attentes et responsabilités pour chaque rôle dans l\'équipe',
      duration: 30,
      description: `Many conflicts arise from unclear expectations. Talking about individual people can feel like an attack. That’s why this activity focusses on expectations towards roles.


Create a table with one column per role in the team. (Limit it to 7 columns. If there are more than 7 roles, leave out roles that have little conflict.) The rows of the table are:  
Role name

This role is responsible for … 

This role is NOT responsible for … 


Leave enough space between the bottom rows so that people`,
      descriptionFr: `De nombreux conflits naissent d'attentes peu claires. Parler de personnes individuelles peut ressembler à une attaque. C'est pourquoi cette activité se concentre sur les attentes envers les rôles.

Créez un tableau avec une colonne par rôle dans l'équipe. (Limitez à 7 colonnes. S'il y a plus de 7 rôles, laissez de côté les rôles qui ont peu de conflit.) Les lignes du tableau sont :
- Nom du rôle
- Ce rôle est responsable de...
- Ce rôle n'est PAS responsable de...

Laissez suffisamment d'espace `,
      tags: ["P2-primary","PA-secondary"],
      trustLevel: 'medium',
      retromatUrl: 'https://retromat.org/en/?id=146'
    },
  ],

  // repetitive-complaints (29 activities)
  'repetitive-complaints': [
    {
      id: 'retromat-5',
      phase: 'gather-data',
      name: 'Analyze Stories',
      nameFr: 'Analyse des fonctionnalités utilisateur',
      summary: 'Walk through each story handled by the team and look for possible improvements',
      summaryFr: 'Passer sur chaque fonctionnalité utilisateur traitée par l\'équipe et chercher des améliorations possibles',
      duration: 30,
      description: `Preparation: Collect all stories handled during the iteration and bring them along to the retrospective.
 In a group (10 people max.) read out each story. For each one discuss whether it went well or not. If it went well, capture why. If not discuss what you could do differently in the future.


Variants: You can use this for support tickets, bugs or any combination of work done by the team.`,
      descriptionFr: `Préparation : Rassembler toutes les fonctionnalités utilisateur traitées lors de l'itération et les amener à la rétrospective. 
 En groupe (10 personnes max.) lire chaque fonctionnalité utilisateur. Pour chacune d'elles se demander si elle s'est bien passée ou non. Si tout s'est bien passé, saisir pourquoi. Sinon discuter de ce qu'il est possible de faire différemment à l'avenir. 
 Variantes : Vous pouvez effectuer cela pour les tickets de support, les bugs ou toute autre tâche effectuée par l'é`,
      tags: ["P3-primary","PB-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=5'
    },
    {
      id: 'retromat-8',
      phase: 'generate-insights',
      name: '5 Whys',
      nameFr: '5 Pourquoi',
      summary: 'Drill down to the root cause of problems by repeatedly asking \'Why?\'',
      summaryFr: 'Examiner de près la cause racine de problèmes en se demandant à plusieurs reprises \'Pourquoi ?\'',
      duration: 5,
      description: `Divide the participants into small groups ( One person asks the others 'Why did that happen?' repeatedly to find the root cause or a chain of events
 Record the root causes (often the answer to the 5th 'Why?')
Let the groups share their findings.`,
      descriptionFr: `Diviser les participants en petits groupes (Une personne demande aux autres 'Pourquoi est-ce arrivé ?' à plusieurs reprises pour trouver la cause racine ou une suite d'évènements
Noter la cause racine trouvée (souvent la réponse au 5e 'Pourquoi ?')
Laisser le groupe partager ses conclusions.`,
      tags: ["PB-primary","P3-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=8'
    },
    {
      id: 'retromat-10',
      phase: 'generate-insights',
      name: 'Brainstorming / Filtering',
      nameFr: 'Brainstorming / Filtrage',
      summary: 'Generate lots of ideas and filter them against your criteria',
      summaryFr: 'Générer de nombreuses idées et les filtrer suivant certains critères.',
      duration: 30,
      description: `Lay out the rules of brainstorming, and the goal: To generate lots of new ideas which will be filtered after the brainstorming. Let people write down their ideas for 5-10 minutes
 Go around the table repeatedly always asking one idea each, until all ideas are on the flip chart
 Now ask for filters (e.g. cost, time investment, uniqueness of concept, brand appropriateness, ...). Let the group choose 4.
 Apply each filter and mark ideas that pass all 4.
 Which ideas will the group carry forward? Do`,
      descriptionFr: `Exposer les règles du brainstorming, et le but : générer un maximum de nouvelles idées qui seront filtrées après le brainstorming.Laisser les participants écrire leurs idées pendant 5 à 10 minutes
Faire des tours de table en demandant de façon répétée une idée à chacun, jusqu'à ce que toutes les idées soient au tableau
Demander ensuite des filtres (exemple : coût, temps demandé, unicité des concepts, pertinence par rapport à l'activité...). Laisser le groupe en choisir 4.
Appliquer chaque filtre`,
      tags: ["PB-primary","PC-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=10'
    },
    {
      id: 'retromat-19',
      phase: 'gather-data',
      name: 'Sailboat / Speedboat',
      nameFr: 'Hors-Bord / Voilier',
      summary: 'Analyze what forces push you forward and what pulls you back',
      summaryFr: 'Analyser les forces qui vous font avancer et qui vous ralentissent.',
      duration: 15,
      description: `Draw a sailboat (or speedboat) onto a flip chart paper. Give it big sails (motor) as well as a heavy anchor. Team members silently write on sticky notes what propelled the team forward and what kept it in place. One idea per note. Post the stickies to sails (motor) and anchor respectively. Read out each one and discuss how you can increase wind (motor power) and cut anchors. 

 Variation: Some people add an iceberg in the back of the image. The iceberg represents obstacles they already see comin`,
      descriptionFr: `Dessiner un bateau sur un tableau à feuilles. Le doter d'un bon moteur ainsi que d'une ancre très lourde. Les membres de l'équipe écrivent en silence sur des post-its ce qui a propulsé l'équipe vers l'avant et ce qui lui a fait faire du surplace. Une idée par post-it. Coller les post-its respectivement sur le moteur et l'ancre. Tous les lire et discuter de comment booster le 'moteur' et comment se passer de l’'ancre'.`,
      tags: ["PB-primary","P3-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=19'
    },
    {
      id: 'retromat-25',
      phase: 'generate-insights',
      name: 'Cause-Effect-Diagram',
      nameFr: 'Diagramme-Causes-Effets',
      summary: 'Find the source of problems whose origins are hard to pinpoint and lead to endless discussion',
      summaryFr: 'Trouver la source des problèmes dont les origines sont difficiles à localiser \
et amènent à des discussions sans fin',
      duration: 30,
      description: `Write the problem you want to explore on a sticky note and put it in the middle of a whiteboard. Find out why that is a problem by repeatedly asking 'So what?'. Find out the root causes by repeatedly asking 'Why (does this happen)?' Document your findings by writing more stickies and showing causal relations with arrows. Each sticky can have more than one reason and more than one consequence
 Vicious circles are usually good starting points for actions. If you can break their bad influence, you `,
      descriptionFr: `Écrire le problème que vous souhaitez explorer sur un post-it et le coller au milieu d'un tableau blanc. Découvrir en quoi c'est un problème en demandant continuellement 'Et alors ?'. Découvrir les causes racines de ce problème en demandant continuellement 'Pourquoi (est-ce que cela se produit) ?'. Documenter vos conclusions en ajoutant des post-its et en explicitant la relation cause à effet avec des flèches. Chaque post-it peut avoir plus d'une raison et plus d'une conséquence.
Les cercles vic`,
      tags: ["PB-primary","P3-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=25'
    },
    {
      id: 'retromat-35',
      phase: 'gather-data',
      name: 'Agile Self-Assessment',
      nameFr: 'L\'auto-évaluation Agile',
      summary: 'Assess where you are standing with a checklist',
      summaryFr: 'Evaluer où vous en êtes via une checklist.',
      duration: 15,
      description: `Print out a checklist that appeals to you, e.g.: Henrik Kniberg's excellent Scrum Checklist
 Self-assessment of agile engineering practices
 Nokia Test
Go through them in the team and discuss where you stand and if you're on the right track. 
This is a good activity after an iteration without major events.`,
      descriptionFr: `Imprimer une checklist qui vous convient, exemples : L'excellente checklist Scrum de Henrik Kniberg
 L'auto-évaluation des pratiques agiles d'ingénierie (EN)
 Test Nokia (EN)
Les parcourir avec l'équipe et échanger pour savoir là où vous en êtes et si vous êtes sur la bonne voie. 
C'est une bonne activité à pratiquer lorsque qu'une itération s'est déroulée sans événement majeur.`,
      tags: ["PB-primary","PD-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=35'
    },
    {
      id: 'retromat-50',
      phase: 'generate-insights',
      name: 'Wish granted',
      nameFr: 'Vœu accordé',
      summary: 'A fairy grants you a wish - how do you know it came true?',
      summaryFr: 'Une fée vous accorde un vœu, comment réalisez-vous qu\'il a été exaucé ?',
      duration: 15,
      description: `Give participants 2 minutes to silently ponder the following question: 'A fairy grants you a wish that will fix your biggest problem at work overnight. What do you wish for?' Follow up with: 'You come to work the next morning. You can tell, that the fairy has granted your wish. How do you know? What is different now?' If trust within the group is high, let everyone describe their 'Wish granted'-workplace. If not, just tell the participants to keep their scenario in mind during the next phase and`,
      descriptionFr: `Donner 2 minutes à chaque participant pour trancher la réponse qu'ils donneraient à la question suivante :
 "Une fée vous accorde un vœu qui résoudra votre plus gros problème au travail au cours de la nuit. Que lui demandez-vous ?"
 Poursuivre par : "Vous arrivez au travail le lendemain matin. Vous constatez que la fée a exaucé votre vœu. Comment pouvez-vous le dire ? Qu'est-ce qui a changé ? "
 Si la confiance au sein du groupe est importante, laisser chacun décrire son environnement de travail`,
      tags: ["PB-primary","P1-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=50'
    },
    {
      id: 'retromat-54',
      phase: 'gather-data',
      name: 'Story Oscars',
      nameFr: 'Les Oscars des stories',
      summary: 'The team nominates stories for awards and reflects on the winners',
      summaryFr: 'L\'équipe choisit les stories nominées pour des récompenses et réfléchit sur les gagnants',
      duration: 5,
      description: `Display all stories completed in the last iterations on a board. Create 3 award categories (i.e. boxes on the board): Best story
 Most annoying story
 ... 3rd category invented by the team ...
Ask the team to 'nominate' stories by putting them in one of the award boxes. 
For each category: Dot-vote and announce the winner. Ask the team why they think the user story won in this category and let the team reflect on the process of completing the tasks - what went good or wrong.`,
      descriptionFr: `Afficher sur un tableau toutes les stories terminées lors de la dernière itération.
Créer 3 catégories de récompenses (i.e. des cases sur le tableau) :

meilleure story

story la plus ennuyeuse

... 3eme catégorie décidée par l'équipe


Demander à l'équipe de "nominer" les stories en les mettant dans l'une des cases de catégorie.
Pour chaque catégorie : Dot-voter et annoncer le gagnant. Demander à l'équipe pourquoi elle pense que la story a gagné dans cette catégorie, et la faire réfléch`,
      tags: ["P3-primary","PD-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=54'
    },
    {
      id: 'retromat-56',
      phase: 'gather-data',
      name: 'Invite a Customer',
      nameFr: 'Inviter un client',
      summary: 'Bring the team into direct contact with a customer or stakeholder',
      summaryFr: 'Mettre l\'équipe en contact direct avec un client ou un intervenant',
      duration: 30,
      description: `Invite a customer or internal stakeholder to your retrospective.Let the team ask ALL the questions: How does the client use your product?
 What makes them curse the most?
 Which function makes their life easier?
 Let the client demonstrate their typical workflow
 ...`,
      descriptionFr: `Inviter un client ou un intervenant interne à votre rétrospective. Laisser l'équipe poser TOUTES les questions possibles et imaginables :

Comment le client utilise-t-il votre produit

Qu'est-ce qui est le plus insupportable dans votre produit

Quelle fonction leur facilite la vie

Demander au client de faire une démo de leur process le plus classique

...`,
      tags: ["PB-primary","P2-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=56'
    },
    {
      id: 'retromat-64',
      phase: 'gather-data',
      name: 'Quartering - Identify boring stories',
      nameFr: 'Quartiers - Identifier les story ennuyantes',
      summary: 'Categorize stories in 2 dimensions to identify boring ones',
      summaryFr: 'Catégoriser les users story en 2 groupes pour visualiser les plus ennuyantes',
      duration: 5,
      description: `Draw a big square and divide it into 2 columns. Label them 'Interesting' and 'Dull'. Let the team write down everything they did last iteration on stickies and put it into the appropriate column. Have them add a rough estimate of how long it took on each of their own stickies.
 Now add a horizontal line so that your square has 4 quadrants. Label the top row 'Short' (took hours) and the bottom row 'Long' (took days). Rearrange the stickies in each column.
 The long and dull stories are now nicely`,
      descriptionFr: `Dessinez un grand carré et divisez-le en 2 colonnes : "Intéressant" et "Nul". Laissez l'équipe écrire toute ce qu'ils ont fait lors de la dernière itération sur des notes repositionnables et les placer dans la colonne appropriée. 

Demandez-leur maintenant d'ajouter le temps approximatif passé sur chaque post-it. Puis dessinez une ligne horizontale pour diviser votre carré en 4 cases. Nommez le rang du bas "Court" et le rang du haut "Long". Réarrangez les notes dans chaque case. Les user story`,
      tags: ["P3-primary","PB-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=64'
    },
    {
      id: 'retromat-66',
      phase: 'generate-insights',
      name: 'Brainwriting',
      nameFr: 'Brainwriting',
      summary: 'Written brainstorming levels the playing field for introverts',
      summaryFr: 'Le brainstorming écrit permet d\'uniformiser les règles du jeu pour les introverti·e·s.',
      duration: 15,
      description: `Pose a central question, such as 'What actions should we take in the next iteration to improve?'. Hand out paper and pens. Everybody writes down their ideas. After 3 minutes everyone passes their paper to their neighbour and continues to write on the one they've gotten. As soon as they run out of ideas, they can read the ideas that are already on the paper and extend them. Rules: No negative comments and everyone writes their ideas down only once. (If several people write down the same idea, tha`,
      descriptionFr: `Posez une question centrale, par exemple : "Quelles actions devrions-nous entreprendre lors de la prochaine itération pour nous améliorer ?". Distribuez du papier et des stylos. Tout le monde écrit ses idées. Après 3 minutes, chacun·e passe son papier à son/sa voisin·e et continue à écrire sur celui qu'il a reçu. Dès que les personnes sont à court d'idées, elles peuvent lire les idées qui sont déjà sur le papier et les prolonger. Règles : Pas de commentaires négatifs et chacun·e n'écrit ses idée`,
      tags: ["PB-primary","P2-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=66'
    },
    {
      id: 'retromat-68',
      phase: 'generate-insights',
      name: 'Company Map',
      nameFr: 'Carte de l\'entreprise',
      summary: 'Draw a map of the company as if it was a country',
      summaryFr: 'Dessinez une carte de l\'entreprise comme s\'il s\'agissait d\'un pays.',
      duration: 15,
      description: `Hand out pens and paper. Pose the question 'What if the company / department / team was territory? What would a map for it look like? What hints would you add for save travelling?' Let participants draw for 5-10 minutes. Hang up the drawings. Walk through each one to clarify and discuss interesting metaphors.`,
      descriptionFr: `Distribuez du papier et des stylos. Posez la question suivante : "Et si votre entreprise / département / division était un pays ? A quoi ressemblerait la carte ? Quels conseils seraient importants pour y voyager en toute sécurité ? Demandez aux participant·e·s de dessiner pendant 5 à 10 minutes. Accrochez les dessins. Discutez de chaque carte pour expliquer et discuter des métaphores intéressantes.`,
      tags: ["PB-primary","P2-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=68'
    },
    {
      id: 'retromat-69',
      phase: 'generate-insights',
      name: 'The Worst We Could Do',
      nameFr: 'Le pire que l\'on puisse faire',
      summary: 'Explore how to ruin the next iteration for sure',
      summaryFr: 'Explorez comment ruiner à coup sûr la prochaine itération',
      duration: 15,
      description: `Hand out pens and sticky notes. Ask everyone for ideas on how to turn the next iteration / release into a certain desaster - one idea per note. When everyone's finished writing, hang up all stickies and walk through them. Identify and discuss themes. 
In the next phase turn these negative actions into their opposite.`,
      descriptionFr: `Distribuez des stylos et des notes repositionnables. Demandez à chacun·e de donner des idées sur la façon de transformer la prochaine itération/version en un désastre certain - une idée par note. Lorsque tout le monde a fini d'écrire, accrochez toutes les notes autocollantes et parcourez-les. Identifiez et discutez des thèmes. 
Dans la phase suivante, transformez ces actions négatives en leur contraire.`,
      tags: ["PB-primary","P3-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=69'
    },
    {
      id: 'retromat-74',
      phase: 'generate-insights',
      name: 'Pessimize',
      nameFr: 'Pessimiste',
      summary: 'If we had ruined the last iteration what would we have done?',
      summaryFr: 'Si nous avions gâché la dernière itération, qu\'aurions-nous fait ?',
      duration: 30,
      description: `You start the activity by asking: 'If we had completely ruined last iteration what would we have done?' Record the answers on a flip chart. Next question: 'What would be the opposite of that?' Record it on another flip chart. Now ask participants to comment the items on the 'Opposite'-chart by posting sticky notes answering 'What keeps us from doing this?'. Hand out different colored sticky notes to comment on the comments, asking 'Why is it like this?'.`,
      descriptionFr: `Vous commencez l'activité en demandant : "Si nous avions complètement gâché la dernière itération, qu'aurions-nous fait ?". Notez les réponses sur un tableau de papier. 
Question suivante : "Quel serait le contraire de cela ? Inscrivez les réponses sur un autre tableau de papier. Demandez maintenant aux participants de commenter les éléments du tableau "Opposé" en inscrivant sur des notes repositionnables la réponse. 
"Qu'est-ce qui nous empêche de le faire ? Distribuez des notes repositionnab`,
      tags: ["PB-primary","P3-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=74'
    },
    {
      id: 'retromat-79',
      phase: 'gather-data',
      name: 'Value Stream Mapping',
      nameFr: 'Cartographie de la chaîne de valeur',
      summary: 'Draw a value stream map of your iteration process',
      summaryFr: 'Dessinez une carte de la chaîne de valeur de votre processus d\'itération.',
      duration: 15,
      description: `Explain an example of Value Stream Mapping. (If you're unfamiliar with it, check out this video or this printable 1-pager.) Ask the team to draw a value stream map of their process from the point of view of a single user story. If necessary, ask them to break into small groups, and facilitate the process if they need it. Look at the finished map. Where are long delays, choke points and bottlenecks?`,
      descriptionFr: `Expliquez un exemple de cartographie de la chaîne de valeur. (Si vous ne la connaissez pas, regardez cette vidéo ou cette page imprimable.) Demandez à l'équipe de dessiner une carte de flux de valeur de leur processus du point de vue d'une seule user story. Si nécessaire, demandez-leur de se diviser en petits groupes et facilitez le processus s'ils en ont besoin. Regardez la carte terminée. Où sont les longs retards, les points d'étranglement et les goulots d'étranglement ?`,
      tags: ["P3-primary","PB-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=79'
    },
    {
      id: 'retromat-87',
      phase: 'gather-data',
      name: 'Meeting Satisfaction Histogram',
      nameFr: 'Histogramme de satisfaction de la réunion',
      summary: 'Create a histogram on how well ritual meetings went during the iteration',
      summaryFr: 'Créez un histogramme sur la façon dont les réunions rituelles se sont déroulées pendant l\'itération.',
      duration: 15,
      description: `Prepare a flip chart for each meeting that recurs every iteration, (e.g. the Scrum ceremonies) with a horizontal scale from 1 ('Did not meet expectations') to 5 ('Exceeds Expectations'). Each team member adds a sticky note based on their rating for each of these meetings. Let the team discuss why some meetings do not have a rating of 5. 
 You can discuss improvements as part of this activity or in a later activity such as Perfection Game (#20) or Plus & Delta (#40).`,
      descriptionFr: `Préparez un tableau pour chaque réunions qui reviennent à chaque itération (par exemple les cérémonies Scrum (Scrum ceremonies)) avec une échelle horizontale allant de 1 ("N'a pas répondu aux attentes") à 5 ("Dépasse les attentes"). Chaque membre de l'équipe ajoute un post-it en fonction de son évaluation de chacune de ces réunions. Laissez l'équipe discuter des raisons pour lesquelles certaines réunions n'ont pas obtenu la note de 5.
 Vous pouvez discuter des améliorations dans le cadre de cett`,
      tags: ["PB-primary","P3-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=87'
    },
    {
      id: 'retromat-91',
      phase: 'generate-insights',
      name: 'Poster Session',
      nameFr: 'Session d\'affiches',
      summary: 'Split a large group into smaller ones that create posters',
      summaryFr: 'Divisez un grand groupe en plusieurs petits qui créent des affiches',
      duration: 30,
      description: `After you've identified an important topic in the previous phase you can now go into detail. Have the larger group split up into groups of 2-4 people that will each prepare a poster (flip chart) to present to the other groups. If you have identified more than one main topic, let the team members select on which they want to work further.
 Give the teams guidelines about what the posters should cover / answer, such as: What exactly happens? Why is that a problem?
 Why / when / how does this situa`,
      descriptionFr: `Après avoir identifié un sujet important dans la phase précédente, vous pouvez maintenant entrer dans les détails. Divisez le grand groupe en groupes de 2 à 4 personnes qui prépareront chacun une affiche (flip chart) à présenter aux autres groupes. Si vous avez identifié plus d'un sujet principal, laissez les membres de l'équipe choisir celui sur lequel ils veulent travailler davantage.

Donnez aux équipes des directives sur ce que les affiches doivent couvrir / répondre, telles que :
- Que se p`,
      tags: ["PB-primary","P2-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=91'
    },
    {
      id: 'retromat-96',
      phase: 'decide-what-to-do',
      name: 'Problem Solving Tree',
      nameFr: 'Arbre de résolution de problèmes',
      summary: 'Got a big goal? Find the steps that lead to it',
      summaryFr: 'Vous avez un grand objectif ? Trouvez les étapes qui y mènent',
      duration: 30,
      description: `Hand out sticky notes and markers. Write the big problem you want to solve onto a note and stick it to the top of a wall or big board. Ask the participants to write down ideas of what they can do to solve the problem. Post them one level below the original problem. Repeat this for each note on the new level. For every idea ask whether it can be done in a single iteration and if everyone understands what they need to do. If the answer is no, break it down and create another level in the problem s`,
      descriptionFr: `Distribuez des notes autocollantes et des marqueurs. Écrivez le grand problème que vous voulez résoudre sur une note et collez-la en haut d'un mur ou d'un grand tableau.

Demandez aux participants de noter des idées sur ce qu'ils peuvent faire pour résoudre le problème. Postez-les un niveau en dessous du problème original.

Répétez ce processus pour chaque note du nouveau niveau. Pour chaque idée, demandez si elle peut être réalisée en une seule itération et si tout le monde comprend ce qu'il fa`,
      tags: ["PB-primary","PC-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=96'
    },
    {
      id: 'retromat-98',
      phase: 'gather-data',
      name: 'Laundry Day',
      nameFr: 'Jour de lessive',
      summary: 'Which things are clear and feel good and which feel vague and implicit?',
      summaryFr: 'Quelles choses sont claires et agréables et lesquelles sont vagues et implicites ?',
      duration: 5,
      description: `Use this activity if you suspect the team to make lots of unconscious decisions hardly ever questioning anything. You can figure out what things need to be talked about to get an explicit grasp of them. 

 You need: about 3 metres of string as the clothesline
 about 20 clothes pins
 a white shirt (cut from paper)
 a pair of dirty pants (cut from paper)
 

Hang up the clothesline and mark the middle, e.g. with a ribbon. Hang up the clean shirt on one side and the dirty pants on the other. Ask t`,
      descriptionFr: `Cette activité fonctionne mieux si vous tenez la rétrospective là où (la plupart de) l'équipe travaille.

Utilisez cette activité si vous soupçonnez l'équipe de prendre beaucoup de décisions inconscientes sans jamais rien remettre en question. Vous pouvez découvrir quelles choses doivent être discutées pour en avoir une compréhension explicite.

Vous avez besoin de :
- environ 3 mètres de ficelle comme corde à linge
- environ 20 pinces à linge
- une chemise blanche (découpée dans du papier)
- un`,
      tags: ["PB-primary","P2-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=98'
    },
    {
      id: 'retromat-105',
      phase: 'generate-insights',
      name: 'Election Manifesto',
      nameFr: 'Manifeste électoral',
      summary: 'Different parties present manifestos for change. Who will get your vote?',
      summaryFr: 'Différents partis présentent des manifestes pour le changement. Qui aura votre vote ?',
      duration: 30,
      description: `Is there an election coming up in your country? Use it as a back drop for your team to convince each other of their change initiatives. 

 Ask the participants to split into political parties with 2 or 3 members. For 20 minutes, each party will work on a manifesto for change. What isn't working? How would they improve things? 
Afterwards the parties meet again and their leaders present their manifestos. Be prepared for tough questions and heckling!
 Now plan for a better world! Summarise the man`,
      descriptionFr: `Y a-t-il une élection à venir dans votre pays ? Utilisez-la comme toile de fond pour que votre équipe se convainque mutuellement de leurs initiatives de changement.

Demandez aux participants de se diviser en partis politiques de 2 ou 3 membres. Pendant 20 minutes, chaque parti travaillera sur un manifeste pour le changement. Qu'est-ce qui ne fonctionne pas ? Comment amélioreraient-ils les choses ?

Ensuite, les partis se réunissent et leurs leaders présentent leurs manifestes. Préparez-vous à d`,
      tags: ["PB-primary","P2-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=105'
    },
    {
      id: 'retromat-113',
      phase: 'generate-insights',
      name: 'Set Course',
      nameFr: 'Définir le cap',
      summary: 'Imagine you\'re on a voyage - Cliffs and treasures await',
      summaryFr: 'Imaginez que vous naviguez sur un bateau - Falaises et trésors vous attendent',
      duration: 30,
      description: `Imagine you're navigating a boat instead of a product or service. Ask the crew the following questions: Where is a treasure to be found? (New things worth trying) 
 Where is a cliff to be safe from? (What makes the team worry)
 Keep course for ... (What existing processes go well?)
 Change course for... (What existing processes go badly)`,
      descriptionFr: `Imaginez que vous naviguez sur un bateau au lieu d'un produit ou service. Posez les questions suivantes à l'équipage :

- Où se trouve un trésor à découvrir ? (Nouvelles choses qui valent la peine d'être essayées)
- Où se trouve une falaise dont il faut se méfier ? (Ce qui inquiète l'équipe)
- Maintenir le cap pour... (Quels processus existants fonctionnent bien ?)
- Changer de cap pour... (Quels processus existants fonctionnent mal ?)`,
      tags: ["PB-primary","P3-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=113'
    },
    {
      id: 'retromat-115',
      phase: 'generate-insights',
      name: 'Force Field Analysis',
      nameFr: 'Analyse du champ de forces',
      summary: 'Analyse the factors that support and hinder a particular initiative',
      summaryFr: 'Analysez les facteurs qui soutiennent et entravent une initiative particulière',
      duration: 30,
      description: `State the topic that the team will explore in depth (deployment processes, peer-programming, Definition of Done, ...). Break the room into groups of 3-4 people each. Give them 5-7 minutes to list all contributing factors, drivers and actions that make up the topic. Go around the room. Each group reads 1 of their sticky notes and puts it up inside the force field until no group has any items left. Cluster or discard duplicates. Repeat the last 2 steps for factors that inhibit or restrain the topi`,
      descriptionFr: `Énoncez le sujet que l'équipe explorera en profondeur (processus de déploiement, programmation en binôme, Définition du Fini, ...).

Divisez la salle en groupes de 3-4 personnes chacun. Donnez-leur 5-7 minutes pour lister tous les facteurs contribuants, moteurs et actions qui composent le sujet.

Faites le tour de la salle. Chaque groupe lit 1 de leurs notes autocollantes et la place à l'intérieur du champ de forces jusqu'à ce qu'aucun groupe n'ait plus d'éléments. Regroupez ou éliminez les doub`,
      tags: ["PB-primary","P3-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=115'
    },
    {
      id: 'retromat-116',
      phase: 'gather-data',
      name: 'Genie in a Bottle',
      nameFr: 'Génie dans une bouteille',
      summary: 'Playfully explore unmet needs',
      summaryFr: 'Explorez de manière ludique les besoins non satisfaits',
      duration: 15,
      description: `Present the following scenario to the participants: You have freed a genie from its bottle and you're granted the customary 3 wishes. What do you wish for? Please make one wish for yourself
 one wish for your team
 one wish for all the people in the world
 Cheating (i.e. wishing for more wishes or more genies) is not allowed! 

 Let everybody present their wishes. Optionally you can then dot-vote on the best or most appreciated wishes.`,
      descriptionFr: `Présentez le scénario suivant aux participants : Vous avez libéré un génie de sa bouteille et vous avez droit aux 3 vœux traditionnels. Que souhaitez-vous ?

Veuillez faire :
- Un vœu pour vous-même
- Un vœu pour votre équipe
- Un vœu pour toutes les personnes dans le monde

La triche (c'est-à-dire souhaiter plus de vœux ou plus de génies) n'est pas autorisée !

Laissez tout le monde présenter leurs vœux. En option, vous pouvez ensuite voter par points sur les meilleurs vœux ou les plus apprécié`,
      tags: ["PB-primary","P1-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=116'
    },
    {
      id: 'retromat-118',
      phase: 'generate-insights',
      name: 'Snow Mountain',
      nameFr: 'Montagne enneigée',
      summary: 'Address problematic burndowns and scope creep',
      summaryFr: 'Abordez les burndowns problématiques et l\'augmentation du périmètre',
      duration: 30,
      description: `This activity is helpful when a team is constantly dealing with additional requests and scope creep. Use the burndown chart of problematic sprints to draw snowy mountains with the same outline. Add a few trees here and there. Print drawings of kids in various sledging situations such as kid sledging down fast, kid sledging and being scared, kid with a sledge looking bored, etc. (You can use Google image search with 'kid sledging drawing'). 

 In teams of 2 or 3, ask the team members to identify `,
      descriptionFr: `Cette activité est utile lorsqu'une équipe fait constamment face à des demandes supplémentaires et à une augmentation du périmètre.

Utilisez le graphique burndown des sprints problématiques pour dessiner des montagnes enneigées avec le même contour. Ajoutez quelques arbres ici et là. Imprimez des dessins d'enfants dans diverses situations de luge comme : enfant dévalant rapidement, enfant en luge ayant peur, enfant avec une luge ayant l'air ennuyé, etc. (Vous pouvez utiliser la recherche d'imag`,
      tags: ["P3-primary","PB-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=118'
    },
    {
      id: 'retromat-123',
      phase: 'gather-data',
      name: 'Find your Focus Principle',
      nameFr: 'Trouvez votre principe directeur',
      summary: 'Discuss the 12 agile principles and pick one to work on',
      summaryFr: 'Discutez des 12 principes agiles et choisissez-en un sur lequel travailler',
      duration: 30,
      description: `Print the principles of the Agile Manifesto onto cards, one principle per card. If the group is large, split it and provide each smaller group with their own set of the principles. 

 Explain that you want to order the principles according to the following question: 'How much do we need to improve regarding this principle?'. In the end the principle that is the team's weakest spot should be on top of the list. 

 Start with a random principle, discuss what it means and how much need for improvem`,
      descriptionFr: `Imprimez les principes du Manifeste Agile sur des cartes, un principe par carte. Si le groupe est grand, divisez-le et fournissez à chaque petit groupe son propre ensemble de principes.

Expliquez que vous voulez classer les principes selon la question suivante : 'Dans quelle mesure devons-nous nous améliorer concernant ce principe ?'. À la fin, le principe qui est le point faible de l'équipe devrait être en haut de la liste.

Commencez par un principe aléatoire, discutez de ce qu'il signifie et`,
      tags: ["PB-primary","PD-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=123'
    },
    {
      id: 'retromat-127',
      phase: 'gather-data',
      name: 'Delay Display',
      nameFr: 'Affichage des retards',
      summary: 'What\'s the current delay? And where are we going again?',
      summaryFr: 'Quel est le retard actuel ? Et où allons-nous encore ?',
      duration: 15,
      description: `Draw a table with 3 columns. Head the first one 'Destination', the second one 'Delay' and the last one 'Announcement'. 

 Introduce the scenario: 'You are at a train station. Where is your train going? (It can be anything, a fictional or a real place.) How much of a delay does the train currently have? And what is the announcement? Why is there a delay? (This can be a real reason or modeled after the typical announcements.)' 


Each team member fills out 3 sticky notes, 1 for each column. Goin`,
      descriptionFr: `Dessinez un tableau avec 3 colonnes. Intitulez la première 'Destination', la deuxième 'Retard' et la dernière 'Annonce'.

Introduisez le scénario : 'Vous êtes à une gare. Où va votre train ? (Ce peut être n'importe quoi, un lieu fictif ou réel.) Combien de retard le train a-t-il actuellement ? Et quelle est l'annonce ? Pourquoi y a-t-il un retard ? (Cela peut être une vraie raison ou modelée sur les annonces typiques.)'

Chaque membre de l'équipe remplit 3 notes autocollantes, 1 pour chaque colo`,
      tags: ["P3-primary","PB-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=127'
    },
    {
      id: 'retromat-131',
      phase: 'gather-data',
      name: 'Sacred Cow',
      nameFr: 'Vache sacrée',
      summary: 'What is the organization clinging to that doesn\'t make sense anymore?',
      summaryFr: 'À quoi l\'organisation s\'accroche-t-elle qui n\'a plus de sens ?',
      duration: 30,
      description: `This activity is great for shaking up routine in places that do things the way they've always done them. Introduce it by telling the story of the sacred cows as epically as possible. Here's the gist: 

 'In some cultures cows were sacred, never to be killed for food or any other reason. The cows roamed free, leading a happy life and usually died of old age. With rare exceptions such as one fateful spring in a city far, far away ...

 This particular city came under siege by a superior enemy forc`,
      descriptionFr: `Cette activité est excellente pour secouer la routine dans des endroits qui font les choses comme ils les ont toujours faites. Introduisez-la en racontant l'histoire des vaches sacrées de la manière la plus épique possible. Voici l'essentiel :

'Dans certaines cultures, les vaches étaient sacrées, ne devant jamais être tuées pour la nourriture ou toute autre raison. Les vaches erraient librement, menant une vie heureuse et mouraient généralement de vieillesse. Avec de rares exceptions comme un p`,
      tags: ["PB-primary","P3-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=131'
    },
    {
      id: 'retromat-135',
      phase: 'gather-data',
      name: 'Avoid Waste',
      nameFr: 'Éviter le gaspillage',
      summary: 'Tackle the 7 Wastes of Software Development',
      summaryFr: 'Abordez les 7 gaspillages du développement logiciel',
      duration: 30,
      description: `This activity facilitates a broad discussion around waste, using the 7 Wastes of Software Development from Lean Software Development by Mary and Tom Poppendieck.


Prepare the room with 7 flip-chart sheets, each representing a category of waste. Be sure to give enough room for small groups to stand around them, so spread the sheets out across the room!


The 7 categories of waste are:

Partially Done Work

Is work going from beginning to end in a single rapid flow? For example; are you bu`,
      descriptionFr: `Cette activité facilite une large discussion sur le gaspillage, en utilisant les 7 gaspillages du développement logiciel de Lean Software Development par Mary et Tom Poppendieck.

Préparez la salle avec 7 feuilles de paperboard, chacune représentant une catégorie de gaspillage. Assurez-vous de donner suffisamment d'espace pour que de petits groupes puissent se tenir autour d'elles, alors répartissez les feuilles dans la salle !

Les 7 catégories de gaspillage sont :

1. Travail partiellement ter`,
      tags: ["P3-primary","PB-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=135'
    },
    {
      id: 'retromat-139',
      phase: 'gather-data',
      name: 'Room Service',
      nameFr: 'Service en chambre',
      summary: 'Take a look at the team room: Does it help or hinder?',
      summaryFr: 'Jetez un œil à la salle d\'équipe : Aide-t-elle ou entrave-t-elle ?',
      duration: 15,
      description: `This activity works best if you hold the retrospective where (most of) the team work.


On a whiteboard, post 2 headlines: 'Our work space helps me/us ...' and 'Our work space makes it hard to ...'.


Give participants 5 minutes to write their individual answers on sticky notes – 1 idea per note. Afterwards go around the group and let everyone post their answers in the respective categories. Allow for a short discussion, e.g. using Lean Coffee (#51). 


If the team have not suggested any a`,
      descriptionFr: `Cette activité fonctionne mieux si vous tenez la rétrospective là où (la plupart de) l'équipe travaille.

Sur un tableau blanc, affichez 2 titres : 'Notre espace de travail m'aide/nous aide ...' et 'Notre espace de travail rend difficile de ...'.

Donnez aux participants 5 minutes pour écrire leurs réponses individuelles sur des notes autocollantes - 1 idée par note. Ensuite, faites le tour du groupe et laissez chacun afficher ses réponses dans les catégories respectives. Permettez une courte di`,
      tags: ["P3-primary","PB-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=139'
    },
  ],

  // no-team (0 activities)
  'no-team': [
  ],

  // burnout (24 activities)
  'burnout': [
    {
      id: 'retromat-9',
      phase: 'gather-data',
      name: 'Learning Matrix',
      nameFr: 'Matrice d\'apprentissage',
      summary: 'Team members brainstorm in 4 categories to quickly list issues',
      summaryFr: 'Les membres de l\'équipe \'brainstorment\' sur 4 catégories afin de rapidement lister des problèmes.',
      duration: 15,
      description: `After discussing the data from Phase 2 show a flip chart with 4 quadrants labeled ':)', ':(', 'Idea!', and 'Appreciation'. Hand out sticky notes. The team members can add their input to any quadrant. One thought per sticky note. 
 Cluster the notes.
 Hand out 6-10 dots for people to vote on the most important issues.
This list is your input for Phase 4.`,
      descriptionFr: `Après avoir discuté des données de la Phase 2, afficher un tableau à 4 quadrants intitulés ':)', ':(', 'Idée !', et 'Appréciation'. Distribuer des post-its. Les membres de l'équipe peuvent contribuer à chaque quadrant. Une idée par post-it.
Regrouper les notes.
Distribuer 6 à 10 points aux participants pour voter et élire les idées les plus importantes.
Cette liste sera celle utilisée pour la Phase 4.`,
      tags: ["PD-primary","P1-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=9'
    },
    {
      id: 'retromat-14',
      phase: 'close',
      name: 'Feedback Door - Numbers (ROTI)',
      nameFr: 'La porte des retours - les chiffres',
      summary: 'Gauge participants\' satisfaction with the retro on a scale from 1 to 5 in minimum time',
      summaryFr: 'Évaluer la satisfaction des participants à propos de la rétro sur une échelle de 1 à 5 en un minimum de temps.',
      duration: 5,
      description: `Put sticky notes on the door with the numbers 1 through 5 on them. 1 is the topmost and best, 5 the lowest and worst.When ending the retrospective, ask your participants to put a sticky to the number they feel reflects the session. The sticky can be empty or have a comment or suggestion on it.`,
      descriptionFr: `Placer des posts-its sur la porte numérotés de 1 à 5. 1 étant le plus haut et le meilleur score, 5 le plus bas et le pire. À la fin de la rétrospective, demander aux participants de placer un post-it sur le chiffre qui d'après eux correspond le mieux à la session. Le post-it peut être vide ou contenir un commentaire ou une suggestion.`,
      tags: ["PD-primary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=14'
    },
    {
      id: 'retromat-16',
      phase: 'close',
      name: 'Helped, Hindered, Hypothesis',
      nameFr: 'Aide, Gêne, Hypothèse',
      summary: 'Get concrete feedback on how you facilitated',
      summaryFr: 'Obtenir des retours concrets sur votre manière de faciliter.',
      duration: 15,
      description: `Prepare 3 flip chart papers titled 'Helped', 'Hindered', and 'Hypothesis' (suggestions for things to try out). Ask participants to help you grow and improve as a facilitator by writing you sticky notes and signing their initials so that you may ask questions later.`,
      descriptionFr: `Préparer 3 feuilles de papier intitulées 'Aide', 'Gêne', et 'Hypothèse' (des suggestions de choses à essayer). Demander aux participants de vous aider à progresser et devenir un meilleur facilitateur en vous écrivant des post-its et en signant de leurs initiales pour que vous puissiez poser des questions par la suite.`,
      tags: ["PD-primary","PC-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=16'
    },
    {
      id: 'retromat-17',
      phase: 'close',
      name: 'SaMoLo (More of, Same of, Less of)',
      nameFr: 'SaMoLo (Plus de, Autant de, Moins de)',
      summary: 'Get course corrections on what you do as a facilitator',
      summaryFr: 'Pour vous aider à redresser la barre dans votre rôle de facilitateur.',
      duration: 15,
      description: `Divide a flip chart in 3 sections titled 'More of', 'Same of', and 'Less of'. Ask participants to nudge your behaviour into the right direction: Write stickies with what you should do more, less and what is exactly right. Read out and briefly discuss the stickies section-wise.`,
      descriptionFr: `Dessiner au tableau trois parties intitulées 'Plus de', 'Autant de', et 'Moins de'. Demander aux participants un coup de main pour vous aider à améliorer votre comportement : écrire sur des post-its ce que vous devriez faire plus souvent, moins souvent et ce qui est très bien comme ça. Lire et discuter un court moment des post-its collés dans chaque partie.`,
      tags: ["PD-primary","PC-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=17'
    },
    {
      id: 'retromat-23',
      phase: 'close',
      name: 'Feedback Door - Smilies',
      nameFr: 'La porte des retours - Smileys',
      summary: 'Gauge participants\' satisfaction with the retro in minimum time using smilies',
      summaryFr: 'Mesurer la satisfaction des participants concernant la rétro en un minimum de temps en utilisant des smileys',
      duration: 5,
      description: `Draw a ':)', ':|', and ':(' on a sheet of paper and tape it against the door. When ending the retrospective, ask your participants to mark their satisfaction with the session with an 'x' below the applicable smily.`,
      descriptionFr: `Dessinez un ':)', ':|', et ':(' sur une feuille de papier et accrochez-la sur la porte. À la fin de la rétrospective, demander aux participants de marquer leur niveau de satisfaction par rapport à la session par un 'x' sous le smiley correspondant.`,
      tags: ["PD-primary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=23'
    },
    {
      id: 'retromat-40',
      phase: 'close',
      name: 'Plus & Delta',
      nameFr: 'Plus & Delta',
      summary: 'Each participant notes 1 thing they like and 1 thing they\'d change about the retro',
      summaryFr: 'Chaque participant note une chose qu\'il aime et une qu\'il voudrait changer à propos de la rétro.',
      duration: 15,
      description: `Prepare a flip chart with 2 columns: Head them with 'Plus' and 'Delta'. Ask each participant to write down 1 aspect of the retrospective they liked and 1 thing they would change (on different index cards). Post the index cards and walk through them briefly to clarify the exact meaning and detect the majority's preference when notes from different people point into opposite directions.`,
      descriptionFr: `Préparer un tableau avec deux colonnes "Plus" et "Delta". Demander à chaque participant d'écrire un aspect de la rétrospective qu'il a aimé et un qu'il souhaiterait modifier sur des cartes différentes. 
Afficher et passer rapidement en revue les cartes en clarifiant leur sens exact et en identifiant la tendance majoritaire lorsque des notes vont dans deux directions opposées pour un même point.`,
      tags: ["PD-primary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=40'
    },
    {
      id: 'retromat-44',
      phase: 'close',
      name: 'Take a Stand - Closing',
      nameFr: 'Prise de position - Conclusion',
      summary: 'Participants take a stand, indicating their satisfaction with the retrospective',
      summaryFr: 'Les participants se positionnent pour indiquer leur niveau de satisfaction par rapport à la rétrospective',
      duration: 5,
      description: `Create a big scale (i.e. a long line) on the floor with masking tape. Mark one end as 'Great' and the other as 'Bad'. Let participants stand on the scale according to their satisfaction with the retrospective. Ask people what they notice.


Psychologically, taking a stand physically is different from just saying something. It's more 'real'.

 
See activity #43 on how to begin the retrospective with the same scale.`,
      descriptionFr: `Créer une grande échelle (par exemple une longue ligne) sur le sol avec du rouleau adhésif. Définir une extrémité comme 'Génial' et l'autre comme 'Nul'. Invitez les participants à se positionner sur l'échelle en fonction de leur satisfaction à propos de la rétrospective. Psychologiquement, prendre position physiquement est différent de juste dire quelque chose. C'est plus 'réel'.
 Voir l'activité #43 pour voir comment démarrer la retrospective avec la même échelle de valeurs.`,
      tags: ["PD-primary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=44'
    },
    {
      id: 'retromat-45',
      phase: 'close',
      name: 'Pleased & Surprised',
      nameFr: 'Ravi & Surpris',
      summary: 'What pleased and / or surprised participants in the retrospective',
      summaryFr: 'Qu\'est-ce qui a plu et/ou surpris les participants pendant la rétrospective ?',
      duration: 5,
      description: `Just make a quick round around the group and let each participant point out one finding of the retrospective that either surprised or pleased them (or both).`,
      descriptionFr: `Faire simplement un rapide tour du groupe et inviter chaque participant à pointer du doigt une constatation de la retrospective qui les a soit surpris soit ravis (ou les deux).`,
      tags: ["PD-primary","PA-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=45'
    },
    {
      id: 'retromat-53',
      phase: 'close',
      name: 'Constellation - Closing',
      nameFr: 'Constellation - Clore',
      summary: 'Let the participants rate the retrospective by moving around',
      summaryFr: 'Permettre aux participants de noter la rétrospective en se déplaçant',
      duration: 5,
      description: `Place a circle or sphere in the middle of a free space. Let the team gather around it. Explain that the circle is the center of approval: If they agree to a statement they should move towards it, if they don't, they should move as far outwards as their degree of disagreement. Now read out statements, e.g. We talked about what was most important to me
 I spoke openly today
 I think the time of the retrospective was well invested
 I am confident we will carry out our action items
Watch the constel`,
      descriptionFr: `Placer un cercle ou une sphère au milieu d'une zone dégagée. Inviter l'équipe à se rassembler autour. Expliquer que le cercle est le centre d'approbation. Si je suis d'accord avec un énoncé, je me rapproche du centre, si je ne le suis pas, je m'en éloigne d'autant que représente mon niveau de rejet. Ensuite, lire les déclarations, exemple : Nous avons parlé de ce qui me tenait le plus à cœur
 J'ai parlé ouvertement aujourd'hui
 Je pense que la durée de la rétrospective a été utilisée à bon escie`,
      tags: ["PD-primary","P2-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=53'
    },
    {
      id: 'retromat-55',
      phase: 'generate-insights',
      name: 'Original 4',
      nameFr: 'Les 4 originelles',
      summary: 'Ask Norman Kerth\'s 4 key questions',
      summaryFr: 'Poser les 4 questions clé de Norman Kerth',
      duration: 15,
      description: `Norman Kerth, inventor of retrospectives, identified the following 4 questions as key: What did we do well, that if we didn’t discuss we might forget?
 What did we learn?
 What should we do differently next time?
 What still puzzles us?
What are the team's answers?`,
      descriptionFr: `Norman Kerth, le créateur des retrospectives, a identifié les 4 questions clé suivantes :



Qu'avons-nous bien fait et que nous pourrions oublier si nous n'en discutons pas ?
Qu'avons nous appris ?
Que devrions-nous faire différemment la prochaine fois ?
À quoi devons-nous encore réfléchir ?


Quelles sont les réponses de l'équipe à ces questions ?`,
      tags: ["PD-primary","PB-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=55'
    },
    {
      id: 'retromat-60',
      phase: 'close',
      name: 'AHA!',
      nameFr: 'AHA!',
      summary: 'Throw a ball around and uncover learning',
      summaryFr: 'Découvrez de nouveaux apprentissages en faisant passer une balle',
      duration: 5,
      description: `Throw a ball (e.g. koosh ball) around the team and uncover positive thoughts and learning experiences. Give out a question at the beginning that people answer when they catch the ball, such as: One thing I learned in this retrospective
 One awesome thing someone else did for me
Depending on the question it might uncover events that are bugging people. If any alarm bells go off, dig a little deeper. With the '1 nice thing'-question you usually close on a positive note.`,
      descriptionFr: `L'équipe se lance une balle (p.ex. koosh ball) et révèle des pensées positives et des apprentissages. Au début, posez une question à laquelle les personnes répondront quand ils attraperont la balle comme, par exemple: Une chose que j'ai appris lors de la dernière itération
 Une chose géniale qu'une autre personne à fait pour moi
En fonction de la question, vous pourriez découvrir des événements perturbant les personnes. Si quelque chose vous alerte, creusez plus profondément. Avec la question '1`,
      tags: ["PD-primary","PA-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=60'
    },
    {
      id: 'retromat-67',
      phase: 'close',
      name: 'Take Aways',
      nameFr: 'Ce que j\'emporte',
      summary: 'Capture what participants learned during the retro',
      summaryFr: 'Capturer ce que les participant·e·s ont appris pendant la rétro',
      duration: 5,
      description: `Everyone writes a sticky note with the most remarkable thing they learned during the retro. Put the notes against the door. In turn each participant reads out their own note.`,
      descriptionFr: `Chaque personne écrit une note repositionnable avec la chose la plus marquante qu'elle a apprise pendant la rétro. Placez les notes contre la porte. À tour de rôle, chaque participant·e lit sa propre note.`,
      tags: ["PD-primary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=67'
    },
    {
      id: 'retromat-71',
      phase: 'close',
      name: '3 for 1 - Closing: Was everyone heard?',
      nameFr: '3 en 1 - Clôture: Tout le monde a t\'il été entendu ?',
      summary: 'Check satisfaction with retro results, fair distribution of talk time & mood',
      summaryFr: 'Précisez le degré de satisfaction de l\'équipe à l\'égard des résultats de la rétrospective, de la répartition équitable du temps de parole et de l\'ambiance durant ce moment.',
      duration: 5,
      description: `Prepare a flip chart with a co-ordinate plane on it. The Y-axis is 'Satisfaction with retro result'. The X-axis is 'Equal distribution of talking time' (the more equal, the farther to the right). Ask each participant to mark where their satisfaction and perceived talking time balance intersect - with an emoticon showing their mood (not just a dot). Discuss talking time inequalities (and extreme moods).`,
      descriptionFr: `Préparez un paper board avec un système de coordonnées. Indiquez sur l'axe des y "Satisfaction à l'égard du résultat de la rétrospective" et sur l'axe des x "Distribution équitable du temps de parole" (plus la distribution est uniforme, plus le point sera à droite). Demandez à tou·te·s les participant·e·s de marquer le point de leur satisfaction (axe des y) et la répartition du temps de parole (axe des x) - en utilisant une émoticône pour montrer leur humeur (c'est-à-dire pas seulement un point)`,
      tags: ["PD-primary","P2-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=71'
    },
    {
      id: 'retromat-78',
      phase: 'gather-data',
      name: '4 Ls - Loved, Learned, Lacked, Longed for',
      nameFr: '4 L - Loved (Aimé), Learned (Appris), Lacked (Manqué), Longed for (Attendu)',
      summary: 'Explore what people loved, learned, lacked and longed for individually',
      summaryFr: 'Explore what people loved, learned, lacked and longed for individually',
      duration: 15,
      description: `Each person brainstorms individually for each of these 4 questions: What I Loved
 What I Learned
 What I Lacked
 What I Longed For
 Collect the answers, either stickies on flip charts or in a digital tool if you're distributed. Form 4 subgroups, on for each L, read all notes, identify patterns and report their findings to the group. Use this as input for the next phase.`,
      descriptionFr: `Recueillez les réponses, soit sur post-it et tableaux blanc, soit dans un outil numérique. Formez 4 sous-groupes, un pour chaque L, lisez toutes les notes, identifiez les tendances et rapportez les conclusions au groupe. Utilisez ces informations pour la phase suivante.`,
      tags: ["PD-primary","PA-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=78'
    },
    {
      id: 'retromat-80',
      phase: 'gather-data',
      name: 'Repeat & Avoid',
      nameFr: 'Répéter & Éviter',
      summary: 'Brainstorm what to repeat and what behaviours to avoid',
      summaryFr: 'Faites un brainstorming sur : Que faut-il répéter ? Que faut-il éviter ?',
      duration: 15,
      description: `Head 2 flip charts with 'Repeat' and 'Avoid' respectively. The participants write issues for the columns on sticky notes - 1 per issue. You can also color code the stickies. Example categories are 'People', 'Process', 'Technology', ... Let everyone read out their notes and post them to the appropriate column. Are all issues unanimous?`,
      descriptionFr: `Créer deux colonnes "Répéter" et "Éviter". 
Demandez aux participants d'ajouter leurs notes en conséquence :
* Que devrions-nous répéter ?
* Qu'est-ce qu'il faut éviter ?
Regroupez les notes (Exemples de catégories : "Personnes", "Processus", "Technologie", ...). Laissez les participants lire leurs notes et les placer dans la colonne appropriée et discutez-en.`,
      tags: ["PD-primary","P3-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=80'
    },
    {
      id: 'retromat-83',
      phase: 'close',
      name: 'Retro Dart',
      nameFr: 'Fléchette rétro',
      summary: 'Check if you hit bull\'s eye on important issues',
      summaryFr: 'Vérifiez si vous touchez dans le mille sur des questions importantes',
      duration: 5,
      description: `Draw one or several dartboards on a flip chart. Write a question next to each dartboard, e.g. We talked about what's important to me
 I spoke openly
 I'm confident we'll improve next iteration
 Participants mark their opinion with a sticky. Smack in the middle is 100% agreement. Outside the disc is 0% agreement.`,
      descriptionFr: `Dessinez une ou plusieurs cibles sur un tableau à feuilles mobiles. Écrivez une question à côté de chaque jeu de fléchettes, par ex. Nous avons parlé de ce qui est important pour moi
 J'ai parlé ouvertement
 Je suis sûr que nous allons nous améliorer lors de la prochaine itération. 
 Les participants marquent leur opinion à l'aide d'un autocollant. En plein milieu, ils sont d'accord à 100 %. En dehors du disque, c'est 0% d'accord.`,
      tags: ["PD-primary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=83'
    },
    {
      id: 'retromat-89',
      phase: 'gather-data',
      name: 'Retro Wedding',
      nameFr: 'Retro Wedding (Mariage Rétro)',
      summary: 'Collect examples for something old, new, borrowed and blue',
      summaryFr: 'Collecter des exemples de quelque chose d\'ancien, nouveau, emprunté et bleu',
      duration: 5,
      description: `Analogue to an anglo-american wedding custom ask the team to give examples for the following categories: Something Old
 Positive feedback or constructive criticism on established practice
 Something New
 Positive feedback or constructive criticism on experiments in progress
 Something Borrowed
 Tool/idea from another team, the Web or yourself for a potential experiment
 Something Blue
 Any blocker or source of sadness
 One example per sticky note. There's only one rule: If someone contributes to`,
      descriptionFr: `Analogue à une coutume de mariage anglo-américaine, demandez à l'équipe de donner des exemples pour les catégories suivantes :

Quelque chose d'ancien - Retour positif ou critique constructive sur une pratique établie
Quelque chose de nouveau - Retour positif ou critique constructive sur des expériences en cours
Quelque chose d'emprunté - Outil/idée d'une autre équipe, du Web ou de vous-même pour une expérience potentielle
Quelque chose de bleu - Tout obstacle ou source de tristesse

Un exemple `,
      tags: ["PD-primary","P3-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=89'
    },
    {
      id: 'retromat-109',
      phase: 'close',
      name: 'Know your neighbour - Closing',
      nameFr: 'Connaissez votre voisin - Clôture',
      summary: 'How does your left neighbour feel about the retrospective',
      summaryFr: 'Comment votre voisin de gauche se sent-il à propos de la rétrospective',
      duration: 5,
      description: `Ask each team member to guess if their left neighbour thinks this retrospective was a good use of their time and why. Their neighbour confirms or corrects their guess. 

 If you have set the stage with activity #108, make sure to go around the other direction this time.`,
      descriptionFr: `Demandez à chaque membre de l'équipe de deviner si leur voisin de gauche pense que cette rétrospective a été une bonne utilisation de son temps et pourquoi. Leur voisin confirme ou corrige leur supposition.

Si vous avez préparé le terrain avec l'activité #108, assurez-vous d'aller dans l'autre direction cette fois.`,
      tags: ["PD-primary","P2-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=109'
    },
    {
      id: 'retromat-121',
      phase: 'gather-data',
      name: 'The Good, the Bad and the Ugly',
      nameFr: 'Le Bon, le Mauvais et le Vilain',
      summary: 'Collect what team members perceived as good, bad and non-optimal',
      summaryFr: 'Collectez ce que les membres de l\'équipe ont perçu comme bon, mauvais et non optimal',
      duration: 5,
      description: `Put up three sections labeled ‘The Good’, ‘The Bad’ and ‘The Ugly’. Give everyone 5 minutes to note down one or more things per category from the last sprint. One aspect per post-it. When the time is up, have everyone stick their post-its to the appropriate labels. Cluster as you collect, if possible.`,
      descriptionFr: `Mettez en place trois sections étiquetées 'Le Bon', 'Le Mauvais' et 'Le Vilain'. Donnez à chacun 5 minutes pour noter une ou plusieurs choses par catégorie du dernier sprint. Un aspect par post-it.

Quand le temps est écoulé, demandez à chacun de coller ses post-its sur les étiquettes appropriées. Regroupez au fur et à mesure si possible.`,
      tags: ["PD-primary","P3-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=121'
    },
    {
      id: 'retromat-128',
      phase: 'gather-data',
      name: 'Learning Wish List',
      nameFr: 'Liste de souhaits d\'apprentissage',
      summary: 'Create a list of learning objectives for the team',
      summaryFr: 'Créez une liste d\'objectifs d\'apprentissage pour l\'équipe',
      duration: 15,
      description: `Hand out pens and paper. Each participant writes down what they wish their coworkers would learn (as a team - no need to name individual people). When everyone is done, collect all items on a board and count how often each one appears. Pick the top three things as learning objectives, unless the team's discussion leads somewhere else.`,
      descriptionFr: `Distribuez des stylos et du papier. Chaque participant écrit ce qu'il souhaite que ses collègues apprennent (en tant qu'équipe - pas besoin de nommer des personnes individuelles).

Quand tout le monde a terminé, collectez tous les éléments sur un tableau et comptez combien de fois chacun apparaît. Choisissez les trois premiers comme objectifs d'apprentissage, à moins que la discussion de l'équipe ne mène ailleurs.`,
      tags: ["PD-primary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=128'
    },
    {
      id: 'retromat-132',
      phase: 'gather-data',
      name: 'Time Capsule',
      nameFr: 'Capsule temporelle',
      summary: 'Make long-term progress visible by storing impediments in a time capsule',
      summaryFr: 'Rendez les progrès à long terme visibles en stockant les obstacles dans une capsule temporelle',
      duration: 15,
      description: `It’s hard to see progress when you chip away at your challenges but in hindsight the improvements are impressive. Set your team up to realize how much it has improved in half a year. This activity will also broaden the team’s perspective to bigger topics beyond everyday improvements.


Caution: Do not use this activity if you suspect there are big unspoken issues.


Hand out pens and fancy paper. Tell participants to complete the following two sentences: 

’I think our biggest impediment r`,
      descriptionFr: `Il est difficile de voir les progrès quand vous grignotez vos défis, mais rétrospectivement, les améliorations sont impressionnantes. Préparez votre équipe à réaliser combien elle s'est améliorée dans six mois. Cette activité élargira également la perspective de l'équipe vers des sujets plus importants au-delà des améliorations quotidiennes.

Attention : N'utilisez pas cette activité si vous soupçonnez qu'il y a de gros problèmes non exprimés.

Distribuez des stylos et du papier fantaisie. Dites`,
      tags: ["PD-primary","PC-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=132'
    },
    {
      id: 'retromat-134',
      phase: 'close',
      name: 'Know Your Meme',
      nameFr: 'Connaissez votre mème',
      summary: 'If the retrospective was a meme or gif, which would it be?',
      summaryFr: 'Si la rétrospective était un mème ou un gif, lequel serait-ce ?',
      duration: 5,
      description: `Usually devices are frowned upon during a retrospective. In this activity the participants get to whip out their laptop or smart phone in order to find the meme or gif that best represents the retrospective.

Give participants 3 minutes to find the meme and then go around the circle. Each participant shows their meme and briefly says why they chose it.`,
      descriptionFr: `Habituellement, les appareils sont mal vus pendant une rétrospective. Dans cette activité, les participants peuvent sortir leur ordinateur portable ou smartphone pour trouver le mème ou gif qui représente le mieux la rétrospective.

Donnez aux participants 3 minutes pour trouver le mème, puis faites le tour du cercle. Chaque participant montre son mème et dit brièvement pourquoi il l'a choisi.`,
      tags: ["PD-primary","P1-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=134'
    },
    {
      id: 'retromat-138',
      phase: 'close',
      name: 'Debriefing Cube',
      nameFr: 'Cube de débriefing',
      summary: 'Close with a reflective question from the Debriefing Cube and cards',
      summaryFr: 'Clôturez avec une question réflexive du Cube de débriefing et des cartes',
      duration: 5,
      description: `A good debriefing deepens understanding, learning and sharing. Preparation: Download and assemble the Debriefing Cube and cards.

During the retrospective, roll the cube. Then draw a card from the category it shows and use it to prompt a discussion. Repeat as time permits.

This will broaden your debriefing options and is especially great for groups without a facilitator to enable them to effectively debrief on their own.`,
      descriptionFr: `Un bon débriefing approfondit la compréhension, l'apprentissage et le partage. Préparation : Téléchargez et assemblez le Cube de débriefing et les cartes.

Pendant la rétrospective, lancez le cube. Ensuite, tirez une carte de la catégorie qu'il montre et utilisez-la pour lancer une discussion. Répétez selon le temps disponible.

Cela élargira vos options de débriefing et est particulièrement excellent pour les groupes sans facilitateur pour leur permettre de débriefer efficacement par eux-mêmes.`,
      tags: ["PD-primary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=138'
    },
    {
      id: 'retromat-141',
      phase: 'gather-data',
      name: 'Back to the Future',
      nameFr: 'Retour vers le futur',
      summary: 'You take the DeLorean back to the beginning of the project',
      summaryFr: 'Vous prenez la DeLorean pour retourner au début du projet',
      duration: 15,
      description: `This activity is great for looking at a longer period of time. Put on your storyteller hat and ask your team to imagine the following scenario:


"You are sitting relaxed at your computer working, when suddenly there is a loud bang and a huge cloud of dust is in your room. You cough and as the dust settles, you realize that a car has driven through the wall of your house. You approach cautiously to see what has happened. The car looks futuristic and has gullwing doors. You wipe the dust off th`,
      descriptionFr: `Cette activité est excellente pour regarder une période de temps plus longue. Mettez votre chapeau de conteur et demandez à votre équipe d'imaginer le scénario suivant :

"Vous êtes assis détendu à votre ordinateur en train de travailler, quand soudain il y a un grand bang et un énorme nuage de poussière dans votre pièce. Vous toussez et alors que la poussière se dissipe, vous réalisez qu'une voiture a traversé le mur de votre maison. Vous vous approchez prudemment pour voir ce qui s'est passé. `,
      tags: ["PD-primary","PB-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=141'
    },
  ],

  // tensions (26 activities)
  'tensions': [
    {
      id: 'retromat-12',
      phase: 'decide-what-to-do',
      name: 'Dot Voting - Start, Stop, Continue',
      nameFr: 'Démarrer, Arrêter, Continuer',
      summary: 'Brainstorm what to start, stop & continue and pick the top initiatives',
      summaryFr: 'Réfléchir ensemble à ce que vous voulez démarrer, arrêter ou continuer et garder les propositions les mieux notées.',
      duration: 15,
      description: `Divide a flip chart into boxes headed with 'Start', 'Continue' and 'Stop'. Ask your participants to write concrete proposals for each category - 1 idea per index card. Let them write in silence for a few minutes. Let everyone read out their notes and post them to the appropriate category. Lead a short discussion on what the top 20% beneficial ideas are. Vote on it by distributing dots or X's with a marker, e.g. 1, 2, and 3 dots for each person to distribute. The top 2 or 3 become your action ite`,
      descriptionFr: `Diviser le tableau en 3 colonnes nommées 'Démarrer', 'Continuer' and 'Arrêter'. Demander aux participants d'écrire des propositions concrètes pour chaque catégorie - 1 idée par carte. Les laisser écrire en silence pendant quelques minutes. Puis chacun lit ses propositions à voix haute et les place dans la catégorie appropriée. Mener une courte discussion sur les 20% d'idées qui vous semblent les plus bénéfiques. Voter en distribuant des points ou des croix à l'aide d'un marqueur, par exemple 1, `,
      tags: ["PC-primary","P3-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=12'
    },
    {
      id: 'retromat-13',
      phase: 'decide-what-to-do',
      name: 'SMART Goals',
      nameFr: 'Objectifs SMART',
      summary: 'Formulate a specific and measurable plan of action',
      summaryFr: 'Formuler un plan d\'action spécifique et mesurable.',
      duration: 15,
      description: `Introduce SMART goals (specific, measurable, attainable, relevant, timely) and examples for SMART vs not so smart goals, e.g.'We'll study stories before pulling them by talking about them with the product owner each Wednesday at 9am' vs. 'We'll get to know the stories before they are in our sprint backlog'.
Form groups around the issues the team wants to work on. Each group identifies 1-5 concrete steps to reach the goal. Let each group present their results. All participants should agree on the`,
      descriptionFr: `Présenter les objectifs SMART (Spécifique, Mesurable, Atteignable, Réaliste, défini dans le Temps) ainsi que des exemples d'objectifs plus ou moins SMART, par exemple 'Nous étudierons les stories avant des les accepter en en parlant avec le product owner tous les mercredis à 9h.' plutôt que 'Nous prendrons connaissance des stories avant qu'elles ne soit ajoutées au backlog du sprint'. 
Créer des groupes par thématiques sur lesquelles l'équipe souhaite continuer à travailler. Chaque groupe identi`,
      tags: ["PC-primary","P3-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=13'
    },
    {
      id: 'retromat-20',
      phase: 'generate-insights',
      name: 'Perfection Game',
      nameFr: 'Le jeu de la perfection',
      summary: 'What would make the next iteration a perfect 10 out of 10?',
      summaryFr: 'Qu\'est-ce qui pourrait faire que la prochaine itération obtienne une note de 10 sur 10 ?',
      duration: 15,
      description: `Prepare a flip chart with 2 columns, a slim one for 'Rating' and a wide one for 'Actions'. Everyone rates the last iteration on a scale from 1 to 10. Then they have to suggest what action(s) would make the next iteration a perfect 10.`,
      descriptionFr: `Dessiner deux colonnes sur une feuille du tableau, une petite pour 'Évaluation' et une grande pour 'Actions'. Tout le monde évalue la dernière itération sur une échelle de 1 à 10. Ensuite chacun suggère quelles action(s) feraient que la prochaine itération obtienne un score de 10 sur 10.`,
      tags: ["PC-primary","P3-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=20'
    },
    {
      id: 'retromat-21',
      phase: 'decide-what-to-do',
      name: 'Merge',
      nameFr: 'Fusion',
      summary: 'Condense many possible actions down to just two the team will try',
      summaryFr: 'Réduire le nombre d\'actions possibles à seulement deux qui seront expérimentées par l\'équipe.',
      duration: 15,
      description: `Hand out index cards and markers. Tell everyone to write down the two actions they want to try next iteration - as concretely as possible (SMART). Then everyone pairs up with their neighbor and both together must merge their actions into a single list with two actions. The pairs form groups of 4. Then 8. Now collect every group's two action items and have a vote on the final two.`,
      descriptionFr: `Distribuer des cartes et des marqueurs. Dire à tout le monde d'écrire les deux actions qu'ils veulent essayer à la prochaine itération - aussi précises que possible (SMART). Ensuite tout le monde paire avec son voisin et ensemble ils doivent fusionner leurs actions en une seule liste avec deux actions. Les paires forment des groupes de 4. Puis 8. Maitenant ramasser les deux actions de tous les groupes et voter pour les deux finales.`,
      tags: ["PC-primary","P2-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=21'
    },
    {
      id: 'retromat-24',
      phase: 'decide-what-to-do',
      name: 'Open Items List',
      nameFr: 'Liste des choses à faire',
      summary: 'Participants propose and sign up for actions',
      summaryFr: 'Les participants proposent et s\'engagent sur des actions',
      duration: 15,
      description: `Prepare a flip chart with 3 columns titled 'What', 'Who', and 'Due'. Ask one participant after the other, what they want to do to advance the team. Write down the task, agree on a 'done by'-date and let them sign their name. 
If someone suggests an action for the whole team, the proposer needs to get buy-in (and signatures) from the others.`,
      descriptionFr: `Préparer un tableau avec 3 colonnes 'Quoi', 'Qui' et 'Échéance'. Demander à chaque participant à tour de rôle ce qu'ils souhaitent faire pour faire avancer l'équipe. Écrire la tâche, se mettre d'accord sur une date d'échéance et les laisser signer de leur nom. 
Si quelqu'un suggère une action pour l'équipe entière, cette personne doit obtenir l'adhésion (et les signatures) des autres.`,
      tags: ["PC-primary","P3-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=24'
    },
    {
      id: 'retromat-29',
      phase: 'decide-what-to-do',
      name: 'Circles & Soup / Circle of Influence',
      nameFr: 'Cercles d\'Influence',
      summary: 'Create actions based on how much control the team has to carry them out',
      summaryFr: 'Identifier des actions selon le niveau de contrôle que l\'équipe souhaite avoir.',
      duration: 15,
      description: `Prepare a flip chart with 3 concentric circles, each big enough to put stickies in. Label them 'Team controls - Direct action', 'Team influences - Persuasive/recommending action' and 'The soup - Response action', from innermost to outermost circle respectively. ('The soup' denotes the wider system the team is embedded into.) Take your insights from the last phase and put them in the appropriate circle.
 The participants write down possible actions in pairs of two. Encourage them to concentrate o`,
      descriptionFr: `Preparer un tableau avec 3 cercles concentriques, chacun étant assez grand pour y coller des post-its.
 Nommer les cercles de l'intérieur vers l'extérieur :
 L'équipe contrôle - Actions directes
 L'équipe influence - Actions de recommandation
 Le reste - Actions de réponse/réaction
 ("Le reste" représente l'environnement dans lequel l'équipe est embarquée.)
 Reprendre la liste des idées identifiée à l'étape précédente et les placer dans le cercle approprié. 
 Les participants rédigent en binôme `,
      tags: ["PC-primary","P3-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=29'
    },
    {
      id: 'retromat-37',
      phase: 'generate-insights',
      name: 'Remember the Future',
      nameFr: 'Souvenons-nous de l\'avenir',
      summary: 'Imagine the next iteration is perfect. What is it like? What did you do?',
      summaryFr: 'Imaginez que la prochaine itération soit parfaite. À quoi ressemble-t-elle ? Qu\'avez-vous fait ?',
      duration: 15,
      description: `'Imagine you could time travel to the end of the next iteration (or release). You learn that it was the best, most productive iteration yet! How do your future selves describe it? What do you see and hear?' Give the team a little time to imagine this state and jot down some keywords to aid their memory. Then let everyone describe their vision of a perfect iteration.
Follow up with 'What changes did we implement that resulted in such a productive and satisfying future?'Write down the answers on i`,
      descriptionFr: `Imaginez que vous puissiez voyager à travers le temps jusqu'à la fin de la prochaine itération (ou release).
Vous y apprenez que ça a été la meilleure itération et la plus productive que vous ayez faite !
Comment vos futurs vous vous la décrivent ? Qu'y voyez-vous et entendez-vous ?

Donnez un peu de temps à l'équipe pour imaginer cette situation et prendre quelques notes / mots clés pour aider leur mémoire.
 Ensuite, laissez chacun décrire sa vision de l'itération parfaite.
 Pousuivez ensuite a`,
      tags: ["PC-primary","P1-secondary"],
      trustLevel: 'medium',
      retromatUrl: 'https://retromat.org/en/?id=37'
    },
    {
      id: 'retromat-38',
      phase: 'decide-what-to-do',
      name: 'Dot Voting - Keep, Drop, Add',
      nameFr: 'Vote par gommette - Garder, Abandonner, Démarrer',
      summary: 'Brainstorm what behaviors to keep, drop & add and pick the top initiatives',
      summaryFr: 'Phosphorer sur les comportements à garder, abandonner et démarrer et en garder les principaux.',
      duration: 15,
      description: `Divide a flip chart into boxes headed with 'Keep', 'Drop' and 'Add'. Ask your participants to write concrete proposals for each category - 1 idea per index card. Let them write in silence for a few minutes. Let everyone read out their notes and post them to the appropriate category. Lead a short discussion on what the top 20% beneficial ideas are. Vote on it by distributing dots or X's with a marker, e.g. 1, 2, and 3 dots for each person to distribute. The top 2 or 3 become your action items.`,
      descriptionFr: `Séparer un tableau en trois ensembles intitulés :Garder
 Abandonner
 Démarrer
Demander à vos participants d'écrire des propositions concrètes pour chaque catégorie avec une idée par thème. Les laisser écrire en silence pendant quelques minutes. 
Chacun lit ensuite ses notes à voix haute et colle ses cartes dans la catégorie appropriée.
Mener la conversation pour identifiez 20% des idées qui seraient les plus bénéfiques. 
Laisser chacun voter avec des gommettes ou avec un marqueur en pouvant dist`,
      tags: ["PC-primary","P3-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=38'
    },
    {
      id: 'retromat-39',
      phase: 'decide-what-to-do',
      name: 'Dot Voting - Worked well, Do differently',
      nameFr: 'Vote par gommette - Fonctionne bien, Faire différemment',
      summary: 'Brainstorm what worked well & what to do differently and pick the top initiatives',
      summaryFr: 'Phosphorer sur ce qui a bien fonctionné et ce qu\'il faudrait faire différemment et gardez les meilleurs idées.',
      duration: 15,
      description: `Head 2 flip charts with 'Worked well' and 'Do differently next time' respectively. Ask your participants to write concrete proposals for each category - 1 idea per index card. Let them write in silence for a few minutes. Let everyone read out their notes and post them to the appropriate category. Lead a short discussion on what the top 20% beneficial ideas are. Vote on it by distributing dots or X's with a marker, e.g. 1, 2, and 3 dots for each person to distribute. The top 2 or 3 become your ac`,
      descriptionFr: `Intituler respectivement deux tableaux "Fonctionne bien" et "Faire différemment".
 Demander à vos participants d'écrire des propositions concrètes pour chaque catégorie avec une idée par thème. Les laisser écrire en silence pendant quelques minutes.
Chacun lit ensuite ses notes à voix haute et colle ses cartes dans la catégorie appropriée.
Laisser chacun voter avec des gommettes ou avec un marqueur en pouvant distribuer 1, 2 ou 3 points aux idées (répartis comme bon lui semble).
Les 2 ou 3 princ`,
      tags: ["PC-primary","PD-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=39'
    },
    {
      id: 'retromat-48',
      phase: 'decide-what-to-do',
      name: 'Take a Stand - Line Dance',
      nameFr: 'Prenez position - Dancez sur le fil',
      summary: 'Get a sense of everyone\'s position and reach consensus',
      summaryFr: 'Faites-vous une idée de l\'opinion de tout le monde et atteignez le consensus',
      duration: 5,
      description: `When the team can't decide between two options, create a big scale (i.e. a long line) on the floor with masking tape. Mark one end as option A) and the other as option B). Team members position themselves on the scale according to their preference for either option. Now tweak the options until one option has a clear majority.`,
      descriptionFr: `Lorsque l'équipe ne parvient pas à trancher entre deux options, créez une grande échelle (ex : une longue ligne) au sol avec du scotch de peintre. Marquez une extrémité comme étant l'option A) et l'autre comme étant l'option B). Les membres de l'équipe se répartissent le long de l'échelle selon leur position entre les deux options. Ensuite, reformulez les options jusqu'à ce que l'une d'entre elles ait une majorité clairement visible.`,
      tags: ["PC-primary","P2-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=48'
    },
    {
      id: 'retromat-49',
      phase: 'decide-what-to-do',
      name: 'Dot Voting - Starfish',
      nameFr: 'Vote par gommette - Étoile de mer',
      summary: 'Collect what to start, stop, continue, do more and less of',
      summaryFr: 'Collect what to start, stop, continue, do more and less of',
      duration: 15,
      description: `Draw 5 spokes on a flip chart paper, dividing it into 5 segments. Label them 'Start', 'Stop', 'Continue', 'Do More' and 'Do less'. Participants write their proposals on sticky notes and put them in the appropriate segment. After clustering stickies that capture the same idea, dot vote on which suggestions to try.`,
      descriptionFr: `Dessinez 5 rayons sur un tableau, afin de former 5 sections. Nommez-les 'Commencer à', 'Arrêter de', 'Continuer de', 'Faire plus de' and 'Faire moins de'. Les participants notent leurs propositions sur des post-its et les collent dans les sections appropriées. Après avoir regroupé les notes selon les idées faites un vote par gommettes pour les propositions à tenter.`,
      tags: ["PC-primary","P3-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=49'
    },
    {
      id: 'retromat-61',
      phase: 'decide-what-to-do',
      name: 'Chaos Cocktail Party',
      nameFr: 'Chaos Cocktail Party',
      summary: 'Actively identify, discuss, clarify and prioritize a number of actions',
      summaryFr: 'Identifier, discuter, clarifier et prioriser une liste d\'actions.',
      duration: 15,
      description: `Everyone writes one card with an action that they think is important to do - the more specific (SMART), the better. Then team members go around and chat about the cards like in a cocktail party. Every chat pair discusses the actions on their two cards. Stop the chatting after 1 minute. Each chat pair splits 5 points between the two cards. More points go to the more important action. Organize 3 to 5 rounds of chats (depending on group size). At the end everyone adds up the points on their card. I`,
      descriptionFr: `Chacun écrit une action qui lui semble importante sur une carte - en étant le plus spécifique possible (SMART). Ensuite, les membres de l'équipe se promènent dans la pièce et discutent à propos de leur carte, comme dans un cocktail. Chaque binôme échange sur les actions écrites sur les deux cartes pendant 1 minute. A l'issue de cette minute, chaque binôme doit partager 5 points entre les deux cartes selon l'importance de l'action. Répétez pour 3 à 5 tours de discussions selon la taille du groupe`,
      tags: ["PC-primary","P2-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=61'
    },
    {
      id: 'retromat-63',
      phase: 'decide-what-to-do',
      name: 'Low Hanging Fruit',
      nameFr: 'Les fruits mûrs',
      summary: 'Visualize promise and ease of possible courses of actions to help pick',
      summaryFr: 'Visualiser les promesses et faciliter la prise d\'action',
      duration: 15,
      description: `Reveal a previously drawn tree. Hand out round index cards and instruct participants to write down the actions they would like to take - one per card. When everyone's finished, collect the cards, shuffle and read them out one by one. Place each 'fruit' according to the participants' assessment: Is it easy to do? Place it lower. Hard? More to the top.
 Does it seem very beneficial? Place it more to the left. Value is dubious at best? To the right.
The straightforward choice is to pick the bottom `,
      descriptionFr: `Dévoilez un arbre dessiné au préalable. Distribuez des notes repositionnables et demandez aux participants d'écrire les actions qu'ils aimeraient prendre (une par carte). 

Quand tout le monde a terminé, ramassez les cartes, mélangez-les et lisez-les à voix haute. 

Placez chaque "fruit" sur l'arbre, selon les avis des participants : 
 Est-ce que c'est facile à mettre en place ? Placez le en bas. Difficile ? En haut 
 Est-ce que ça semble très bénéfique? Placez-le fruit vers la gauche. Le b`,
      tags: ["PC-primary","P3-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=63'
    },
    {
      id: 'retromat-72',
      phase: 'decide-what-to-do',
      name: 'Divide the Dollar',
      nameFr: 'Partager les euros',
      summary: 'How much is an action item worth to the team?',
      summaryFr: 'Quelle est la valeur d\'une action pour l\'équipe ?',
      duration: 5,
      description: `Hang up the list of possible actions. Draw a column next to it, titled 'Importance (in $)'. The team gets to spend 100 (virtual) dollars on the action items. The more important it is to them, the more they should spend. Make it more fun by bringing paper money from a board game such as Monopoly.

Let them agree on prices. Consider the 2 or 3 highest amount action items as chosen.`,
      descriptionFr: `Accrochez la liste des actions possibles. Dessinez une colonne à côté, intitulée "Importance (en €)". L'équipe peut dépenser 100 € (virtuels) pour les différentes actions. Plus l'action est importante pour eux, plus ils doivent dépenser. Rendez la chose plus amusante en apportant de l'argent en papier d'un jeu de société tel que le Monopoly.

Laissez-les se mettre d'accord sur les prix. Considérez les 2 ou 3 éléments au montant le plus élevé comme actions choisies.`,
      tags: ["PC-primary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=72'
    },
    {
      id: 'retromat-73',
      phase: 'decide-what-to-do',
      name: 'Pitch',
      nameFr: 'Présentation',
      summary: 'Ideas for actions compete for 2 available \'Will do\'-slots',
      summaryFr: 'Les idées d\'actions sont en lice pour deux emplacements disponibles dans les actions à faire.',
      duration: 15,
      description: `[Caution: This game creates 'winners' and 'losers'. Don't use it if the team has power imbalances.]

 Ask everyone to think of 2 changes they'd like to implement and write them down on separate index cards. Draw 2 slots on the board. The first team member puts their favorite change idea into the first slot. His neighbor puts their favorite into the second slot. The third member has to pitch her favorite idea against the one already hanging that she favors less. If the team prefers her idea, it's`,
      descriptionFr: `[Attention : Ce jeu crée des "gagnants" et des "perdants". Ne l'utilisez pas si l'équipe présente des déséquilibres de pouvoir.]

Demandez à chacun de penser à 2 changements qu'ils aimeraient mettre en œuvre et de les écrire sur des fiches séparées. Dessinez 2 cases sur le tableau. Le premier membre de l'équipe met son idée de changement préférée dans la première case. Son voisin met sa préférée dans la seconde. Le troisième membre doit présenter son idée préférée afin de la mettre en concurrenc`,
      tags: ["PC-primary","P2-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=73'
    },
    {
      id: 'retromat-77',
      phase: 'close',
      name: 'Follow Through',
      nameFr: 'Aller au bout des choses',
      summary: 'What\'s the probability of action items getting implemented?',
      summaryFr: 'Quelle est la probabilité que les actions soient mises en œuvre ?',
      duration: 5,
      description: `Let everyone draw an emoticon of their current mood on a sticky note. Then draw a scale on a flip chart, labeled 'Probability we'll implement our action items'. Mark '0%' on the left and '100%' on the right. Ask everyone to place their sticky according to their confidence in their follow through as a team. 
Discuss interesting results such as low probability or bad mood.`,
      descriptionFr: `Laissez chacun dessiner un émoticône de son humeur actuelle sur une note repositionnable. Ensuite, dessinez une échelle sur un tableau à feuilles mobiles, intitulée « Probabilité que nous mettions en œuvre nos éléments d'action » . Marquez '0%' à gauche et '100%' à droite. Demandez à chacun de placer son émoticône en fonction de sa confiance dans le suivi de l'action en équipe. 
Discutez des résultats intéressants tels que la faible probabilité ou la mauvaise humeur.`,
      tags: ["PC-primary","P1-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=77'
    },
    {
      id: 'retromat-84',
      phase: 'set-stage',
      name: 'Last Retro\'s Actions Table',
      nameFr: 'Tableau des actions de la dernière rétro',
      summary: 'Assess how to continue with last retro\'s actions',
      summaryFr: 'Évaluer comment continuer avec les actions de la dernière rétro',
      duration: 5,
      description: `Create a table with 5 columns. The first column lists last retro's action items. The other columns are headed 'More of', 'Keep doing', 'Less of' and 'Stop doing'. Participants place 1 sticky note per row into the column that states how they want to proceed with that action. Afterwards facilitate a short discussion for each action, e.g. asking: Why should we stop doing this?
 Why is it worth to go further?
 Are our expectations satisfied?
 Why do opinions vary that much?`,
      descriptionFr: `Créer un tableau avec 5 colonnes. La première colonne répertorie les éléments d'action de la dernière rétro. Les autres colonnes sont intitulées « Plus de », « Continuer à faire », « Moins de » et « Arrêter de faire ». Les participants placent une note autocollante par ligne dans la colonne qui indique comment ils veulent procéder pour cette action. Ensuite, animez une brève discussion pour chaque action, en posant par exemple les questions suivantes : Pourquoi devrions-nous arrêter de faire cel`,
      tags: ["PC-primary","P3-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=84'
    },
    {
      id: 'retromat-88',
      phase: 'decide-what-to-do',
      name: 'Impediments Cup',
      nameFr: 'Coupe des obstacles',
      summary: 'Impediments compete against each other in a World Cup style',
      summaryFr: 'Les obstacles s\'affrontent les uns les autres dans un style Coupe du monde',
      duration: 15,
      description: `Prepare a flip chart with a playing schedule for quarter-final, semi-final and final. All participants write down actions on a post-it until you have eight actions. Shuffle them and randomly place them on the playing schedule.
The team now has to vote for one of the two actions in each pair. Move the winning action to the next round until you have a winner of the impediments cup. 

If you want to take on more than one or two actions you can play the match for third place.`,
      descriptionFr: `Préparez un tableau avec un programme de matchs pour le quart de finale, la demi-finale et la finale. Tous les participants inscrivent des actions sur un post-it jusqu'à ce que vous ayez huit actions. Mélangez-les et placez-les au hasard sur le tableau de jeu.
 L'équipe doit maintenant voter pour l'une des deux actions de chaque paire. Faites passer l'action gagnante au tour suivant jusqu'à ce que vous ayez un gagnant de la Coupe des obstacles.

Si vous souhaitez prendre en charge plus d'une ou `,
      tags: ["PC-primary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=88'
    },
    {
      id: 'retromat-92',
      phase: 'close',
      name: 'Motivational Poster',
      nameFr: 'Affiche Motivationnelle',
      summary: 'Turn action items into posters to improve visibility & follow-through',
      summaryFr: 'Transformez les actions en affiches pour améliorer la visibilité et le suivi',
      duration: 30,
      description: `Take each of your action items and create a funny poster for it (see the photos for examples). Pick an image
 Agree on a title
 Write a self-mocking description
Print your master piece as big as possible (A4 at the very least) and display it prominently.`,
      descriptionFr: `Prenez chacune de vos actions et créez une affiche amusante pour elle (voir les photos pour des exemples).
- Choisissez une image
- Convenez d'un titre
- Rédigez une description auto-dérisoire

Imprimez votre chef-d'œuvre aussi grand que possible (A4 au strict minimum) et affichez-le de manière visible.`,
      tags: ["PC-primary","P1-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=92'
    },
    {
      id: 'retromat-99',
      phase: 'decide-what-to-do',
      name: 'Planning Poker Voting',
      nameFr: 'Vote au Planning Poker',
      summary: 'Use your Planning Poker cards for un-influenced voting',
      summaryFr: 'Utilisez vos cartes de Planning Poker pour un vote non influencé',
      duration: 15,
      description: `If you've got very influential and / or shy team members you can re-use Planning Poker cards to vote simultaneously: 

 Write all suggested actions on sticky notes and put them onto a wall. Hand out an ordered deck of Planning Poker cards to each participant. Count the proposals and remove that many cards from the back of the card decks. If you've got 5 suggestions you might have cards '1', '2', '3', '5', and '8'. This depends on your deck (some have a '1/2' card). It doesn't matter, as long as `,
      descriptionFr: `Si vous avez des membres d'équipe très influents et/ou timides, vous pouvez réutiliser les cartes de Planning Poker pour voter simultanément :

Écrivez toutes les actions suggérées sur des notes autocollantes et placez-les sur un mur. Distribuez un jeu ordonné de cartes de Planning Poker à chaque participant. Comptez les propositions et retirez autant de cartes de l'arrière des jeux. Si vous avez 5 suggestions, vous pourriez avoir les cartes '1', '2', '3', '5' et '8'. Cela dépend de votre jeu (c`,
      tags: ["PC-primary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=99'
    },
    {
      id: 'retromat-100',
      phase: 'decide-what-to-do',
      name: 'Landscape Diagram',
      nameFr: 'Diagramme Paysage',
      summary: 'Assess action items based on how clear they are and take your pick',
      summaryFr: 'Évaluez les actions selon leur clarté et faites votre choix',
      duration: 15,
      description: `This activity is helpful when a team is facing an ambiguous, volatile, uncertain or complex set of problems and has many suggested action items to choose from. 

 Draw a Landscape Diagram, i.e. an x-axis labeled 'Certainty about approach' and a y-axis labeled 'Agreement on issue'. Both go from low certainty / agreement in their mutual origin to high towards the top / right. For each action item ask 'How much agreement do we have that solving this problem would have a great beneficial impact? How`,
      descriptionFr: `Cette activité est utile lorsqu'une équipe fait face à un ensemble de problèmes ambigus, volatils, incertains ou complexes et a de nombreuses actions suggérées parmi lesquelles choisir.

Dessinez un Diagramme Paysage, c'est-à-dire un axe des x étiqueté 'Certitude sur l'approche' et un axe des y étiqueté 'Accord sur le problème'. Les deux vont d'une faible certitude/accord à leur origine mutuelle à élevé vers le haut/la droite.

Pour chaque action, demandez 'Quel degré d'accord avons-nous que rés`,
      tags: ["PC-primary","PB-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=100'
    },
    {
      id: 'retromat-103',
      phase: 'decide-what-to-do',
      name: 'Systemic Consensus',
      nameFr: 'Consensus systémique',
      summary: 'Check for resistance instead of approval',
      summaryFr: 'Vérifiez la résistance plutôt que l\'approbation',
      duration: 5,
      description: `Do you have a hotly debated matter with several possible ways to go and the team can't agree on any of them? Instead of trying to find a majority for a way that will create winners and losers, try what happens if you turn the decision inside out: 
Draw a table with the voters in the left-most column and proposals on top. Now everybody has to fill in their resistance towards each proposal. 0 means 'no resistance - this is what I want', up to 10, meaning 'shoot me now'. Give the least hated soluti`,
      descriptionFr: `Avez-vous une question vivement débattue avec plusieurs façons possibles d'avancer et l'équipe ne peut se mettre d'accord sur aucune d'elles ? Au lieu d'essayer de trouver une majorité pour une voie qui créera des gagnants et des perdants, essayez ce qui se passe si vous retournez la décision :

Dessinez un tableau avec les votants dans la colonne la plus à gauche et les propositions en haut. Maintenant, tout le monde doit remplir leur résistance envers chaque proposition. 0 signifie 'pas de rés`,
      tags: ["PC-primary","P2-secondary"],
      trustLevel: 'medium',
      retromatUrl: 'https://retromat.org/en/?id=103'
    },
    {
      id: 'retromat-104',
      phase: 'close',
      name: 'Note to Self',
      nameFr: 'Note à soi-même',
      summary: 'Remind yourself of your good intentions',
      summaryFr: 'Rappelez-vous de vos bonnes intentions',
      duration: 5,
      description: `Thinking back about the discussions, everybody writes a reminder for her- or himself about a change in their own behaviour they want to try during the next iteration. It's for quiet self reflection and is not shared with the group. They take their respective sticky notes with them to their desktop and put it in a place they will look at often.`,
      descriptionFr: `En repensant aux discussions, chacun écrit un rappel pour lui-même sur un changement dans son propre comportement qu'il veut essayer lors de la prochaine itération.

C'est pour une réflexion personnelle silencieuse et n'est pas partagé avec le groupe. Ils emportent leurs notes autocollantes respectives à leur bureau et les placent à un endroit qu'ils regarderont souvent.`,
      tags: ["PC-primary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=104'
    },
    {
      id: 'retromat-117',
      phase: 'decide-what-to-do',
      name: 'Maximize Follow Through',
      nameFr: 'Maximiser le suivi',
      summary: 'Think about how the team will follow up and set yourselves up for success',
      summaryFr: 'Réfléchissez à la façon dont l\'équipe assurera le suivi et préparez-vous au succès',
      duration: 15,
      description: `Prepare a flip chart with 4 columns titled 'Action', 'Motivation', 'Ease' and 'Reminder'. Write down the list of actions the team wants to take in the first column. Read out each action and fill in the other columns by asking: Motivation - How can we motivate ourselves to do this? 
Examples: 'Jane will own this and report back at the next retrospective', or 'We'll reward ourselves with cake on Friday if we do this every day'

 Ease - How can we make it easy to do? 
Example: For an action 'Start `,
      descriptionFr: `Préparez un paperboard avec 4 colonnes intitulées 'Action', 'Motivation', 'Facilité' et 'Rappel'. Notez la liste des actions que l'équipe veut entreprendre dans la première colonne.

Lisez chaque action et remplissez les autres colonnes en demandant :

Motivation - Comment pouvons-nous nous motiver à faire cela ?
Exemples : 'Jane en sera propriétaire et fera un rapport à la prochaine rétrospective', ou 'Nous nous récompenserons avec un gâteau vendredi si nous faisons cela tous les jours'

Facili`,
      tags: ["PC-primary","P3-secondary"],
      trustLevel: 'medium',
      retromatUrl: 'https://retromat.org/en/?id=117'
    },
    {
      id: 'retromat-124',
      phase: 'decide-what-to-do',
      name: 'Outside In',
      nameFr: 'De l\'extérieur vers l\'intérieur',
      summary: 'Turn blaming others into actions owned by the team',
      summaryFr: 'Transformez les reproches envers les autres en actions détenues par l\'équipe',
      duration: 15,
      description: `If your team has a tendency to see obstacles outside of their team and influence and primarily wants others to change, you can try this activity: 

 Draw a big rectangle on the board and another rectangle inside of it, like a picture frame. Hang all complaints and grievances that surfaced in previous phases into the frame. 

 Now comes the interesting twist: Explain that if they want anything in the outside frame to change, they will have to do something themselves to affect that change. Ask the`,
      descriptionFr: `Si votre équipe a tendance à voir des obstacles en dehors de leur équipe et de leur influence et veut principalement que les autres changent, vous pouvez essayer cette activité :

Dessinez un grand rectangle sur le tableau et un autre rectangle à l'intérieur, comme un cadre photo. Accrochez toutes les plaintes et griefs qui ont émergé dans les phases précédentes dans le cadre.

Maintenant vient la tournure intéressante : Expliquez que s'ils veulent que quoi que ce soit dans le cadre extérieur ch`,
      tags: ["PC-primary","P2-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=124'
    },
    {
      id: 'retromat-125',
      phase: 'decide-what-to-do',
      name: 'Three by Three',
      nameFr: 'Trois par trois',
      summary: 'Build on each other\'s ideas to create a great action item',
      summaryFr: 'Construisez sur les idées de chacun pour créer une excellente action',
      duration: 15,
      description: `This silent brainstorming technique helps the team come up with truly creative solutions and gives quiet people equal footing: 

 Everyone writes 3 sticky notes with 1 action idea each
 Go around the room and pitch each idea in 15 seconds
 Gather all stickies so that everyone can see them
 Each team member adds their name to the sticky note that inspires them the most
 Take off all ideas without a name on them
 Repeat this process 2 more times. Afterwards, everyone can dot vote to determine whic`,
      descriptionFr: `Cette technique de brainstorming silencieux aide l'équipe à proposer des solutions vraiment créatives et donne aux personnes silencieuses une position égale :

- Chacun écrit 3 notes autocollantes avec 1 idée d'action chacune
- Faites le tour de la salle et présentez chaque idée en 15 secondes
- Rassemblez toutes les notes pour que tout le monde puisse les voir
- Chaque membre de l'équipe ajoute son nom à la note qui l'inspire le plus
- Retirez toutes les idées sans nom dessus
- Répétez ce proce`,
      tags: ["PC-primary","P2-secondary"],
      trustLevel: 'high',
      retromatUrl: 'https://retromat.org/en/?id=125'
    },
  ],

}

/**
 * Get activities for a specific problem and filters
 */
export function getActivitiesForProblem(
  problemKey: string,
  duration: number = 60,
  trustLevel: 'low' | 'medium' | 'high' = 'medium',
  teamSize: number = 7
): RetroActivity[] {
  const activities = RETRO_ACTIVITIES[problemKey] || RETRO_ACTIVITIES['repetitive-complaints']
  
  // Filter by trust level
  let filtered = activities.filter(a => {
    if (!a.trustLevel) return true
    if (trustLevel === 'low') return a.trustLevel === 'low'
    if (trustLevel === 'medium') return a.trustLevel === 'low' || a.trustLevel === 'medium'
    return true
  })

  // Ensure we have at least one activity per phase
  const phases: RetroPhase[] = ['set-stage', 'gather-data', 'generate-insights', 'decide-what-to-do', 'close']
  const selected: RetroActivity[] = []
  
  phases.forEach(phase => {
    const phaseActivities = filtered.filter(a => a.phase === phase)
    if (phaseActivities.length > 0) {
      // Pick first activity for this phase (could be randomized later)
      selected.push(phaseActivities[0])
    }
  })

  return selected
}

/**
 * Get all available activities (for browsing)
 */
export function getAllActivities(): RetroActivity[] {
  return Object.values(RETRO_ACTIVITIES).flat()
}

/**
 * Get activities count by problem
 */
export function getActivitiesStats(): Record<string, number> {
  return Object.entries(RETRO_ACTIVITIES).reduce((acc, [key, activities]) => {
    acc[key] = activities.length
    return acc
  }, {} as Record<string, number>)
}
