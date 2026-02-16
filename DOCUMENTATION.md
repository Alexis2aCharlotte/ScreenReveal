# PostX - Documentation

> Outil interne pour créer des visuels marketing pour Twitter/X

---

## 🎯 Aperçu du projet

PostX est un outil personnel conçu pour créer rapidement des visuels professionnels pour documenter ta journey d'entrepreneur sur Twitter. Il comprend deux modules principaux :

1. **Data Graphs** - Génération de graphiques style Trust MRR
2. **Photo Editor** - Embellissement de screenshots avec fonds colorés

---

## 🏠 Landing Page

**Fichier** : `src/app/page.tsx`

### Fonctionnalités
- Design **glassmorphism** et **liquid glass**
- Arrière-plan animé avec gradients
- Orbes flottants animés
- Overlay de texture (noise)
- Navigation vers les 2 modules

### Routes
| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/graphs` | Module Data Graphs |
| `/editor` | Module Photo Editor |

---

## 📊 Data Graphs

**Fichier** : `src/app/graphs/page.tsx`

### Fonctionnalités principales

#### Métriques disponibles
| Métrique | Icône | Couleur | Préfixe |
|----------|-------|---------|---------|
| Revenue (MRR) | 💰 | `#a855f7` | `$` |
| Users | 👥 | `#3b82f6` | - |
| Newsletter | 📧 | `#10b981` | - |
| Followers | 🐦 | `#f59e0b` | - |

#### Données Newsletter
- Données pré-chargées depuis Supabase (SQL dump)
- Calcul cumulatif des subscribers actifs
- Prise en compte des `subscribed` et `unsubscribed`
- **745 subscribers** au 21 janvier 2026

#### Données Users (Paying Customers)
- Données pré-chargées depuis Supabase (table customers)
- Calcul cumulatif des clients actifs
- Prise en compte des statuts `active` et `canceled`
- Monthly et Lifetime traités de la même manière
- **54 paying users** au 21 janvier 2026

#### Périodes disponibles
- Last 7 days
- Last 2 weeks
- Last 4 weeks
- Last 3 months
- Last 6 months
- Last year

> Le tableau de données et le % de croissance se mettent à jour dynamiquement selon la période sélectionnée.

#### Thèmes de carte
| Thème | Background | Card BG |
|-------|------------|---------|
| Dark | `#0c0c10` | `#131318` |
| Midnight | `#08081a` | `#0f0f24` |
| Charcoal | `#121212` | `#1a1a1a` |

#### Fonds d'export
| ID | Nom | Description |
|----|-----|-------------|
| `none` | Aucun | Transparent |
| `nh-dark` | NH Dark | Gradient noir/vert foncé |
| `nh-emerald` | NH Emerald | Gradient noir/emeraude |
| `nh-matrix` | NH Matrix | Gradient vertical noir/vert |
| `nh-glow` | NH Glow | Gradient radial avec glow vert |
| `gradient-mint` | Fresh Mint | Gradient blanc/vert clair |
| `gradient-purple` | Purple | Gradient violet |
| `gradient-blue` | Ocean | Gradient bleu océan |
| `gradient-emerald` | Emerald | Gradient emeraude |
| `solid-black` | Black | Noir uni |
| `solid-white` | White | Blanc uni |

#### Logo NICHES HUNTER
- Toggle afficher/masquer
- Choix de couleur : Blanc ou Noir
- Style :
  ```css
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
  font-weight: 900;
  letter-spacing: 0.1em;
  ```

### Contrôles du panneau
1. **Sélecteur de métrique** - Grille 2x2 avec icônes
2. **Gestion des données** - Ajout/suppression de points
3. **Thème de carte** - 3 options
4. **Fond d'export** - 10+ options
5. **Période** - Dropdown avec 6 options
6. **Badge vérifié** - Toggle + source personnalisable
7. **Logo NH** - Toggle + couleur
8. **Suppression des données** - Bouton danger

### Effet de relief/glow sur les graphiques
- Gradient amélioré avec 3 stops (0%, 50%, 100%) pour plus de profondeur
- Filtre SVG `glow` avec `feGaussianBlur` pour faire briller la ligne
- Filtre SVG `shadow` avec `feDropShadow` pour l'ombre portée
- Ligne de 3px d'épaisseur pour plus de visibilité

### Export PNG
```typescript
toPng(chartRef.current, {
  pixelRatio: 4, // Haute qualité (4x résolution)
  cacheBust: true,
  style: {
    transform: 'scale(1)',
    transformOrigin: 'top left',
  },
});
```

---

## 🖼️ Photo Editor

**Fichier** : `src/app/editor/page.tsx`

### Fonctionnalités
- Upload d'images (drag & drop ou clic)
- Fonds colorés avec gradients prédéfinis
- Barre macOS optionnelle (boutons rouge, jaune, vert)
- Contrôles de style :
  - Padding
  - Border-radius
  - Shadow
- Export PNG haute qualité

### Gradients disponibles
- Purple Dream
- Ocean Blue
- Sunset Orange
- Forest Green
- Pink Rose
- Et plus...

---

## 🎨 Design System

**Fichier** : `src/app/globals.css`

### Police
```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&display=swap');
```

### Variables CSS
```css
:root {
  --background: #050507;
  --foreground: #fafafa;
  --glass: rgba(255, 255, 255, 0.03);
  --glass-border: rgba(255, 255, 255, 0.08);
  --glass-hover: rgba(255, 255, 255, 0.06);
  --accent: #a855f7;
  --accent-glow: rgba(168, 85, 247, 0.4);
}
```

### Classes utilitaires

| Classe | Description |
|--------|-------------|
| `.glass-card` | Carte avec effet verre |
| `.glass-btn` | Bouton glassmorphism |
| `.glass-panel` | Panneau latéral |
| `.glass-input` | Input stylisé |
| `.glass-toggle` | Toggle switch |
| `.gradient-bg` | Arrière-plan animé |
| `.noise-overlay` | Texture de bruit |
| `.orb` | Orbe flottante |
| `.shine-effect` | Effet de brillance au hover |
| `.text-gradient` | Texte en dégradé |

### Animations
- `gradientMove` - Mouvement du gradient de fond
- `float` - Flottement des orbes
- `fadeInUp` - Apparition avec translation

---

## 📦 Dépendances

### Production
```json
{
  "next": "14.2.35",
  "react": "^18",
  "react-dom": "^18",
  "html-to-image": "^1.11.11",
  "recharts": "^2.12.7"
}
```

### Développement
```json
{
  "typescript": "^5",
  "tailwindcss": "^3.4.1",
  "postcss": "^8",
  "eslint": "^8",
  "eslint-config-next": "14.2.35",
  "@types/node": "^20",
  "@types/react": "^18",
  "@types/react-dom": "^18"
}
```

---

## 📁 Structure du projet

```
PostX/
├── src/
│   └── app/
│       ├── page.tsx              # Landing page
│       ├── layout.tsx            # Root layout
│       ├── globals.css           # Styles globaux
│       ├── editor/
│       │   └── page.tsx          # Photo Editor
│       └── graphs/
│           └── page.tsx          # Data Graphs
├── public/                       # Assets statiques
├── package.json                  # Dépendances
├── package-lock.json
├── tailwind.config.ts            # Config Tailwind
├── tsconfig.json                 # Config TypeScript
├── postcss.config.mjs            # Config PostCSS
├── next.config.mjs               # Config Next.js
├── next-env.d.ts
└── DOCUMENTATION.md              # Ce fichier
```

---

## 🐛 Problèmes résolus

### 1. Hydration Mismatch
**Problème** : `toLocaleString()` retourne des résultats différents côté serveur et client.

**Solution** :
```typescript
const [isMounted, setIsMounted] = useState(false);

useEffect(() => {
  setIsMounted(true);
}, []);

// Utilisation
{isMounted ? value.toLocaleString() : String(value)}
```

### 2. Qualité d'export PNG
**Problème** : Export de mauvaise qualité.

**Solution** : Augmenter le `pixelRatio` à 4.

### 3. Polices non rendues à l'export
**Problème** : Les Google Fonts ne s'affichent pas correctement dans le PNG exporté.

**Solution** : Utiliser des polices système garanties d'être disponibles :
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
```

### 4. Données dynamiques selon période
**Problème** : Les données affichées ne changeaient pas avec la période.

**Solution** : Filtrer les données avec `useMemo` basé sur `timeRange` et recalculer le % de croissance.

---

## 🚀 Commandes

```bash
# Installation
npm install

# Développement
npm run dev

# Build production
npm run build

# Démarrage production
npm start

# Linting
npm run lint
```

---

## 📝 Notes

- Les données sont sauvegardées dans `localStorage` sous la clé `postx-metrics`
- Le projet utilise Next.js 14 avec App Router
- Le design est optimisé pour un usage personnel (pas de gestion d'erreurs avancée)

---

*Dernière mise à jour : 21 janvier 2026*
