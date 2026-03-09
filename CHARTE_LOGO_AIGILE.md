# Charte graphique — Logo AIgile

## Logo principal

### Composition
- **Icône** : Carré aux bords arrondis (`rounded-xl`) avec dégradé
- **Lettre** : « A » majuscule, centrée, en gras
- **Nom** : « AIgile » à droite de l’icône (version desktop)

### Couleurs

| Nom | Hex | Usage |
|-----|-----|-------|
| **AIgile Gold** | `#c9973a` | Couleur principale, icône, texte, CTA |
| **AIgile Blue** | `#138eec` | Dégradé icône, accents |
| **AIgile Navy** | `#0f2240` | Fond sombre, contraste |
| **Book Orange** | `#E8961E` | Hover, accent secondaire |

### Variantes du logo

1. **Logo complet** (navbar, header)  
   - Icône : dégradé `from-aigile-gold to-aigile-blue`  
   - Lettre « A » : blanc (`text-white`) sur le dégradé  
   - Texte « AIgile » : `text-aigile-gold`

2. **Logo icône seule** (favicon, petits formats)  
   - Carré doré `bg-aigile-gold`  
   - « A » en noir (`text-black`) pour contraste

3. **Logo sur fond clair**  
   - Icône dorée ou dégradé  
   - Texte en `text-aigile-gold` ou `text-gray-800`

### Tailles recommandées
- **Navbar** : `w-10 h-10` (40px) pour l’icône
- **Login/Register** : `w-16 h-16` (64px)
- **Favicon** : 32×32 ou 48×48 px

### Classes Tailwind de référence
```css
/* Icône avec dégradé */
bg-gradient-to-br from-aigile-gold to-aigile-blue

/* Icône dorée simple */
bg-aigile-gold

/* Texte du nom */
text-aigile-gold
```

---

## Boutons et contrastes

### Bouton Google
- Fond : blanc (`bg-white`)
- Texte : gris foncé (`text-gray-800`) pour un bon contraste
- Bordure : `border-gray-200`

### Bouton principal (CTA)
- Fond : `bg-aigile-gold`
- Texte : noir (`text-black`)
- Hover : `bg-book-orange`
