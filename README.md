# Taxi Leblanc - Plateforme de Réservation de Taxi

Service de taxi premium en Île-de-France avec une plateforme complète de réservation, tableau de bord client, et panneau d'administration pour chauffeurs.

**Design:** Stitch "Gilded Noir" - Thème sombre luxe avec accents or (`#d4af37`)
**Stack:** Next.js 14 + React 18 + TypeScript + Tailwind CSS + PostgreSQL + Prisma

## 🚀 Quick Start

### Prérequis
- Node.js 18+
- npm 9+
- PostgreSQL 14+ (ou créez une base via [Supabase](https://supabase.com))
- Git

### Installation

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer la base de données
# Créez une base PostgreSQL et récupérez la CONNECTION STRING

# 3. Configurer les variables d'environnement
# Copiez .env.local et remplissez:
# - DATABASE_URL (PostgreSQL connection string)
# - JWT_SECRET (générer avec: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
# - GOOGLE_MAPS_API_KEY (optionnel, pour les cartes)

# 4. Créer les tables avec Prisma
npx prisma migrate dev --name init

# 5. Démarrer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📁 Structure du Projet

```
src/
├── app/
│   ├── (auth)/           # Pages d'authentification
│   │   ├── connexion/    # Login
│   │   └── inscription/  # Signup
│   ├── (dashboard)/      # Routes protégées client
│   ├── (admin)/          # Routes protégées chauffeur
│   ├── api/              # API routes
│   │   └── auth/         # Auth endpoints
│   ├── layout.tsx        # Root layout avec Google Fonts
│   ├── globals.css       # Tailwind + custom styles
│   └── page.tsx          # Landing page
│
├── components/
│   ├── ui/               # Base components (Button, Input, etc)
│   └── features/         # Feature components
│       └── auth/         # Auth forms
│
├── lib/
│   ├── auth/             # JWT, session management
│   ├── hooks/            # Custom React hooks (useAuth)
│   └── utils/            # Utilities (cn, validators)
│
└── persistence/
    └── queries/          # Database queries (Prisma)

prisma/
├── schema.prisma         # Data models
└── migrations/           # DB migrations

.claude/
├── CLAUDE.md             # Project brain
├── settings.json         # Claude configuration
└── skills/               # Reusable workflows
```

## 🏗️ Architecture du Système

### Phase 1 ✅ - Bootstrap
- [x] Next.js 14 + TypeScript + Tailwind CSS
- [x] Google Fonts (Noto Serif + Manrope)
- [x] Design tokens (or `#d4af37`, surfaces sombres)

### Phase 2 ✅ - Schéma Base de Données
Models créés:
- **User** - Clients, chauffeurs, admins
- **Driver** - Profil chauffeur (license, status, rating)
- **Vehicle** - Véhicules (type, plaque, capacité)
- **Booking** - Réservations avec statut et pricing
- **Payment** - Paiements (Stripe)

### Phase 3 ✅ - Authentification
Endpoints:
- `POST /api/auth/login` - Connexion
- `POST /api/auth/signup` - Inscription
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/me` - Profil courant

Pages:
- `/connexion` - Login avec formulaire
- `/inscription` - Signup avec formulaire
- Middleware protégeant `/dashboard` et `/admin`

Hook: `useAuth()` pour accès client à l'auth state

### Phase 4 🚧 - Landing Page
À compléter:
- [ ] Hero section avec CTA
- [ ] Services cards (Berline, SUV, VAN, Premium)
- [ ] Stats section (5 ans, 2 villes, 40K+ trajets)
- [ ] Booking widget estimateur
- [ ] Footer avec liens

### Phase 5 ⏳ - Flux de Réservation
À implémenter:
- Modal de réservation (2 étapes)
- Étape 1: Pickup/dropoff + date/heure
- Étape 2: Sélection véhicule + prix
- Écran de confirmation "Voyage Confirmé"

### Phase 6 ⏳ - Tableau de Bord Client
À implémenter:
- "Mes réservations" (liste + filtres)
- Historique de trajets
- Profil utilisateur
- Notation chauffeurs

### Phase 7 ⏳ - Panneau Admin Chauffeur
À implémenter:
- Demandes de trajet (accept/decline)
- Gains du jour
- Planning calendrier
- Profil chauffeur

## 🔧 Scripts Disponibles

```bash
npm run dev              # Serveur dev (localhost:3000)
npm run build            # Build production
npm start                # Démarrer le serveur prod
npm run lint             # Linter (ESLint)

npm run prisma:generate  # Générer Prisma client
npm run prisma:migrate   # Créer migrations DB
npm run prisma:push      # Push schema vers DB
```

## 🎨 Design System

### Couleurs (Tailwind)
- **Primary:** `#d4af37` (or) → `.text-primary`, `.bg-primary`
- **Background:** `#131313` (quasi noir)
- **Surface:** `#121212` (containers)
- **Text:** `#e5e2e1` (off-white)
- **Error:** `#f44336` (rouge)
- **Success:** `#4caf50` (vert)

### Typographie
- **Headings:** Noto Serif (bold, italic pour luxe)
- **Body:** Manrope (clean, lisible)

### Composants
- `<Button>` - Variants: primary, secondary, ghost, outline, danger
- `<Input>` - Avec label, error, helpText
- `.glass` - Effet verre (backdrop-blur + border opacity)
- `.gradient-gold` - Dégradé doré

## 🔐 Sécurité

- Passwords: Hashés avec bcryptjs
- JWT: Signé avec HS256, stocké en httpOnly cookie
- Middleware: Protège `/dashboard` et `/admin`
- CORS: Configuré pour localhost dev
- Sensitive data: Jamais loggé ou exposé côté client

## 📦 Dépendances Principales

```json
{
  "next": "^14.0.0",
  "react": "^18.3.1",
  "@prisma/client": "^5.7.1",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.1.2",
  "react-hook-form": "^7.48.0",
  "zod": "^3.22.4",
  "tailwindcss": "^3.4.1"
}
```

## 🚢 Déploiement

### Vercel (Recommandé)
```bash
# 1. Push code vers GitHub
git push origin main

# 2. Connecter repo à Vercel dashboard
# https://vercel.com/new

# 3. Configurer env vars en Vercel settings

# 4. Déploiement auto à chaque push
```

### Variables d'Environnement (Production)
- `DATABASE_URL` - PostgreSQL
- `JWT_SECRET` - Secret clé JWT (generé)
- `NEXT_PUBLIC_API_URL` - URL de l'API
- `STRIPE_SECRET_KEY` - Clé Stripe (si paiements)
- `GOOGLE_MAPS_API_KEY` - Clé Google Maps

## 🧪 Tester l'Auth

```bash
# Terminal 1: Serveur dev
npm run dev

# Terminal 2: Tester signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "password": "password123"
  }'

# Puis login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' \
  -c cookies.txt

# Puis récupérer le user
curl http://localhost:3000/api/auth/me -b cookies.txt
```

## 📚 Documentation

- [CLAUDE.md](./CLAUDE.md) - Project brain (stack, conventions)
- [docs/architecture.md](./docs/architecture.md) - System design
- [src/app/CLAUDE.md](./src/app/CLAUDE.md) - App Router patterns
- [src/lib/CLAUDE.md](./src/lib/CLAUDE.md) - Utilities & hooks

## 🤝 Workflow Claude Code

Ce projet est structuré pour l'IA:

1. **Root CLAUDE.md** - Stack (Next.js, React, TypeScript, Prisma)
2. **Module CLAUDE.md** - Patterns spécifiques (auth, booking, dashboard)
3. **Skills** (`.claude/skills/`) - Workflows réutilisables
4. **Stitch Design** - Design tokens extraits (`docs/decisions/stitch/`)

## 📝 License

À définir

## 👤 Contact

À mettre à jour
