# Testing Prompt - Taxi Leblanc

## Overview
Ce document contient tous les tests et vérifications pour les modifications récentes de l'application.

---

## 1️⃣ Menu Rétractable (Sidebar Collapsible)

### Fichiers modifiés:
- `src/components/layout/DashboardSidebar.tsx` (nouveau)
- `src/components/layout/AdminSidebar.tsx` (nouveau)
- `src/app/dashboard/layout.tsx` (mis à jour)
- `src/app/admin/layout.tsx` (mis à jour)

### Tests à effectuer:

#### Dashboard Client/Chauffeur:
- [ ] Sur **mobile** (< 1024px): bouton Menu/X visible en haut à gauche
- [ ] Clic sur le bouton: menu slide in from left avec animation fluide
- [ ] Menu ouvert = overlay gris semi-transparent visible
- [ ] Clic sur overlay: menu se ferme
- [ ] Clic sur un lien du menu: navigation fonctionne
- [ ] Sur **desktop** (≥ 1024px): menu toujours visible, pas de bouton toggle
- [ ] Menu s'étend sur toute la hauteur de l'écran

#### Admin Panel:
- [ ] Même comportement que dashboard sur mobile/desktop
- [ ] Tous les liens de navigation fonctionnent (Tableau de bord, Utilisateurs, Réservations, etc.)
- [ ] Liens "Gestion des features" visibles et cliquables

---

## 2️⃣ Authentification & Cookies

### Fichiers modifiés:
- `src/lib/hooks/useBooking.ts` - ajout `credentials: 'include'`
- `src/lib/hooks/useGuestBooking.ts` - ajout `credentials: 'include'`
- `src/lib/hooks/useDriverCreateBooking.ts` - ajout `credentials: 'include'`
- `src/components/features/notifications/NotificationBell.tsx` - vérification `isAuthenticated`

### Tests à effectuer:

#### Création de réservation:
- [ ] **Non authentifié**: Impossible de créer une réservation (401)
- [ ] **Authentifié**: Peut créer une réservation avec succès
- [ ] Formulaire rempli correctement → réservation créée
- [ ] Erreur de validation → affiche message détaillé
- [ ] Booking créé → page affiche confirmation avec numéro de réservation

#### Réservation Client (Guest):
- [ ] Remplissage du formulaire complet: nom, email, téléphone
- [ ] Validation des champs requis
- [ ] Booking créé avec succès

#### Réservation Chauffeur:
- [ ] Chauffeur peut créer une course
- [ ] Cookie d'authentification envoyé automatiquement
- [ ] Erreurs d'API affichées clairement

#### Session Persistence:
- [ ] User connecté → rafraîchir la page → reste connecté
- [ ] User déconnecté → pas d'erreurs de CORS
- [ ] Logo visible → clic → retour à l'accueil

---

## 3️⃣ Notification Bell - 401 Silent Handling

### Fichiers modifiés:
- `src/components/features/notifications/NotificationBell.tsx`

### Tests à effectuer:

#### Non authentifié:
- [ ] Console du navigateur: **PAS** d'erreur 401 visible
- [ ] Cloche (Bell icon) visible mais vide
- [ ] Pas d'erreur dans les logs

#### Authentifié:
- [ ] Notifications se chargent
- [ ] Badge de count visible si notifications non-lues
- [ ] Clic sur cloche: dropdown s'ouvre

---

## 4️⃣ Prisma 5.22.0 Sync

### Fichiers modifiés:
- `package.json` - `prisma: ^5.22.0`
- `package-lock.json` - régénéré
- `prisma/schema.prisma` - restauré `url = env("DATABASE_URL")`

### Tests à effectuer:

#### Build local:
- [ ] `npm install` → succès sans erreurs
- [ ] `npx prisma generate` → succès
- [ ] Application démarre avec `npm run dev`

#### Déploiement:
- [ ] Build Docker réussit
- [ ] Pas d'erreur Prisma CLI version mismatch
- [ ] Application accessible après déploiement

---

## 5️⃣ Modal "Plus d'infos" - Admin vs Driver

### Fichiers modifiés:
- `src/components/features/booking/BookingClientDetailsModal.tsx` (nouveau)
- `src/app/api/admin/clients/[id]/route.ts` (nouveau API)
- `src/app/admin/reservations/page.tsx` - ajout bouton + modal
- `src/components/features/driver/TripCard.tsx` - ajout bouton "Plus d'infos"
- `src/components/features/driver/AvailableCoursesView.tsx` - intégration modal
- `src/components/features/driver/UpcomingCoursesSection.tsx` - ajout bouton

### Tests ADMIN Panel - Réservations:

#### Bouton "Plus d'infos":
- [ ] Visible sur chaque ligne de réservation
- [ ] Clic ouvre modal avec infos client

#### Réservation Client Enregistré:
- [ ] Modal affiche: Nom ✅
- [ ] Modal affiche: Email ✅
- [ ] Modal affiche: Téléphone ✅
- [ ] Modal affiche: Rôle (CLIENT/DRIVER/ADMIN) ✅
- [ ] Modal affiche: Membre depuis (date) ✅
- [ ] Modal affiche: Voyages complétés (nombre) ✅
- [ ] Modal affiche: Note moyenne (⭐) ✅
- [ ] Si CPAM par défaut: badge "✓ Client CPAM par défaut" visible ✅
- [ ] Notes du client (clientNotes) visibles si présentes ✅
- [ ] Notes du chauffeur (driverNotes) visibles si présentes ✅

#### Réservation Client Invité (Guest):
- [ ] Modal affiche: Nom du guest ✅
- [ ] Modal affiche: Email du guest ✅
- [ ] Modal affiche: Téléphone du guest ✅
- [ ] Pas de données de compte (rôle, historique, etc.) ✅

#### Fermeture Modal:
- [ ] Bouton "Fermer" ferme la modal
- [ ] Clic en dehors de la modal → ferme (optional overlay click)
- [ ] Bouton X en haut à droite → ferme

---

### Tests DRIVER - Courses Disponibles:

#### Bouton "Plus d'infos" sur TripCard:
- [ ] Visible sur chaque carte de course
- [ ] Clic ouvre modal

#### Infos Affichées (mode driver = isAdmin=false):
- [ ] Nom du client ✅
- [ ] Email du client ✅
- [ ] Téléphone du client ✅
- [ ] Notes du client (clientNotes) si présentes ✅
- [ ] **PAS** de rôle du client ❌
- [ ] **PAS** de date d'inscription ❌
- [ ] **PAS** de nombre de voyages ❌
- [ ] **PAS** de rating ❌
- [ ] **PAS** de notes du chauffeur (driverNotes) ❌

#### Pour Guest Booking:
- [ ] Affiche guestName, guestEmail, guestPhone ✅

---

### Tests DRIVER - Courses Planifiées (Upcoming):

#### Nouveau Bouton "Plus d'infos":
- [ ] Visible sur chaque cours planifiée
- [ ] Clic ouvre modal avec infos client

#### Affichage des infos:
- [ ] Même comme "Courses Disponibles"
- [ ] Infos limitées (pas infos sensibles) ✅

---

## 6️⃣ API Endpoint Nouveau

### `GET /api/admin/clients/[id]`

#### Tests:
- [ ] Admin authentifié → retourne données complètes ✅
- [ ] Driver authentifié → retourne données complètes ✅
- [ ] Non authentifié → 401 Unauthorized ✅
- [ ] Client non trouvé → 404 Not Found ✅

#### Réponse:
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "phone": "string or null",
  "role": "CLIENT|DRIVER|ADMIN",
  "createdAt": "ISO datetime",
  "cpamByDefault": "boolean",
  "avatar": "string or null",
  "completedTrips": "number",
  "rating": "number or null"
}
```

---

## 7️⃣ Intégration Globale

### Parcours Complet - Client Non Authentifié:
- [ ] Page d'accueil → Logo cliquable
- [ ] Clique logo → revient à la page d'accueil
- [ ] Bouton "Réserver" → formulaire de booking
- [ ] Remplit le formulaire complet
- [ ] Clique "Confirmer" → réservation créée
- [ ] Reçoit numéro de réservation

### Parcours Complet - Client Authentifié:
- [ ] Se connecte
- [ ] Page d'accueil → reste connecté (pas de rechargement nécessaire)
- [ ] Notifications: cloche visible, pas d'erreur 401
- [ ] Dashboard: menu rétractable fonctionne
- [ ] Réserver course → succès

### Parcours Complet - Chauffeur:
- [ ] Se connecte en tant que chauffeur
- [ ] Accès "Courses disponibles"
- [ ] Clique "Plus d'infos" sur une course → modal client
- [ ] Voit nom, email, téléphone du client
- [ ] Voit notes du client
- [ ] Accepte la course
- [ ] Accès "Courses planifiées"
- [ ] Clique "Plus d'infos" → même données client
- [ ] Menu chauffeur rétractable sur mobile

### Parcours Complet - Admin:
- [ ] Se connecte en tant qu'admin
- [ ] Accès "Panel Admin"
- [ ] Clique "Réservations"
- [ ] Voir liste des réservations
- [ ] Clique "Plus d'infos" sur une réservation
- [ ] Modal affiche: toutes les infos (email, phone, rôle, stats, rating, CPAM)
- [ ] Voit notes du client ET notes du chauffeur
- [ ] Menu admin rétractable sur mobile

---

## 🔍 Vérifications Finales

### Console Browser:
- [ ] **Zéro** erreur 401 non-gérée
- [ ] **Zéro** erreur CORS
- [ ] **Zéro** warning TypeScript

### Performance:
- [ ] Modal charge rapidement (< 500ms)
- [ ] Pas de lag lors du toggle du menu
- [ ] Animations fluides (60fps)

### Responsive:
- [ ] Mobile (360px): tous les éléments visibles
- [ ] Tablet (768px): layout correct
- [ ] Desktop (1920px): sidebar toujours visible

### Cross-Browser:
- [ ] Chrome: ✅
- [ ] Firefox: ✅
- [ ] Safari: ✅
- [ ] Edge: ✅

---

## 📝 Notes de Test

**Dates:**
- Créé: 2026-04-08
- Testé sur: [à remplir]
- Validé par: [à remplir]

**Commits à Tester:**
- `94895d6` - Client details modal + admin
- `24ab08c` - Upcoming courses info button
- `f46c542` - Collapsible sidebars
- `1c4b885` - Auth & error handling fixes
- `e987cac` - Prisma version sync

---

## ✅ Checklist Finale

- [ ] Tous les tests manuels validés
- [ ] Pas d'erreur en console
- [ ] Déploiement sur Coolify réussi
- [ ] Features visibles en production
- [ ] Users peuvent tester les nouvelles fonctionnalités
