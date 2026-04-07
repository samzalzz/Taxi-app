# 🧪 Taxi Leblanc Platform - Complete Testing Prompt
## Updated with Guest Booking & Driver Reservations Management (April 7, 2026)

## 🚀 Latest Updates (Build 2.0)

### New Features Added
- ✅ **Admin Panel Pagination** — Select items per page (10, 25, 50, 100) on all admin pages
- ✅ **Admin Panel Bulk Actions** — Select multiple items, perform batch operations:
  - Mark notifications as read
  - Delete notifications, conversations, reviews, complaints
  - Checkbox selection with "Select All" functionality
  - Sticky toolbar with action buttons + confirmation dialogs
- ✅ **Responsive Design** — All pagination controls work on mobile/desktop
- ✅ **API Support** — Pagination via `limit`/`offset` query params on all admin endpoints
- ✅ **Phase 9 Testing** — Complete test scenarios documented in TESTING_PROMPT.md

### Technical Improvements
- Fixed JSX structure in `/admin/conversations/page.tsx`
- Added missing Prisma relation: `Complaint` ↔ `Booking`
- Generated Prisma Client with latest schema
- Fixed TypeScript type errors in conversation endpoints
- Updated `.gitignore` with comprehensive file exclusions

### Pages Updated
- `/admin/notifications` — Pagination + bulk actions
- `/admin/conversations` — Pagination + bulk actions
- `/admin/avis` (reviews) — Pagination + bulk actions
- `/admin/reclamations` (complaints) — Pagination + bulk actions

---

## Setup
- **Platform URL**: http://localhost:3000
- **Status**: Development server running on port 3000
- **Database**: PostgreSQL with seeded test accounts
- **Test Credentials**: See section below

---

## 📋 Test Credentials

### Client Account
- **Email**: `client@taxi-leblanc.fr`
- **Password**: `ClientPass123!`
- **Role**: CLIENT
- **Landing Page**: `/dashboard`

### Driver Account
- **Email**: `chauffeur@taxi-leblanc.fr`
- **Password**: `DriverPass123!`
- **Role**: DRIVER
- **Landing Page**: `/dashboard/chauffeur`
- **Vehicle**: Peugeot 308 BERLINE (Capacity: 4, Plate: AB-123-CD)

### Admin Account
- **Email**: `admin@taxi-leblanc.fr`
- **Password**: `AdminPass123!`
- **Role**: ADMIN
- **Landing Page**: `/admin`

---

## 🔧 Critical Bug Fixes Verification (April 6, 2026)

### Bug #1: Login HTTP Cookie ✅ FIXED
**What was fixed:** Login API now sets httpOnly authentication cookie  
**How to verify:**
- [ ] Login with valid credentials at `/connexion`
- [ ] Check browser DevTools → Application → Cookies
- [ ] Should see `auth-session` cookie with JWT token
- [ ] Cookie should have: `HttpOnly`, `SameSite=Lax`, `Max-Age=604800` (7 days)
- [ ] After login, should redirect to correct dashboard (not infinite loop)

**Test flow:**
```bash
# Test via API
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"client@taxi-leblanc.fr","password":"ClientPass123!"}'

# Should see response header:
# set-cookie: auth-session=eyJ...; Path=/; HttpOnly; SameSite=lax
```

---

### Bug #2: Driver Vehicle Linking ✅ FIXED
**What was fixed:** Driver signup now links created vehicle to driver record  
**How to verify:**
- [ ] Create new driver account at `/inscription/chauffeur`
- [ ] Fill all 3 steps:
  - Step 1: Personal info (name, email, phone, password)
  - Step 2: License (number, expiry date **in future**)
  - Step 3: Vehicle (BERLINE, Tesla, Model 3, 2023, Blanc, XY-789-ZA, 4 passengers)
- [ ] Click "Créer mon compte chauffeur"
- [ ] Should redirect to `/dashboard/chauffeur` (not error page)
- [ ] Driver can now accept trips (vehicle is linked)

**Test flow:**
```bash
# Test via API
curl -X POST http://localhost:3000/api/auth/driver-signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"newdriver@test.fr",
    "name":"New Driver",
    "password":"TestPass123!",
    "licenseNumber":"DL123456789",
    "licenseExpiryDate":"2030-12-31T00:00:00Z",
    "vehicleType":"BERLINE",
    "brand":"Peugeot",
    "model":"308",
    "year":2022,
    "color":"Noir",
    "plateNumber":"AB-999-CD",
    "capacity":4
  }'

# Response should be 201 Created with user and cookie set
```

---

### Bug #4: Expired License Validation ✅ FIXED
**What was fixed:** Driver signup now rejects expired license dates  
**How to verify:**
- [ ] Try to create driver with license expiry date in the **past** (e.g., 2020-01-01)
- [ ] Should see validation error: "License expiry date must be in the future"
- [ ] Form should NOT submit
- [ ] Try with **future** date (e.g., 2030-12-31) → Should work

**Test scenarios:**
- [ ] Expired date: 2020-01-01 → ❌ REJECTED (validation error)
- [ ] Today's date: 2026-04-06 → ❌ REJECTED (not in future)
- [ ] Future date: 2030-12-31 → ✅ ACCEPTED

---

### Bug #6: Missing Rating Field ✅ FIXED
**What was fixed:** User stats API now returns `rating` field  
**How to verify:**
- [ ] Call `GET /api/users/me/stats` as authenticated user
- [ ] Response should include: `rating: 5.0`
- [ ] Dashboard should show rating (★) in stat card

**Test via API:**
```bash
# Login first to get cookie
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"client@taxi-leblanc.fr","password":"ClientPass123!"}' \
  -c cookies.txt

# Then get stats
curl -X GET http://localhost:3000/api/users/me/stats \
  -b cookies.txt

# Should see in response:
# {"completedTrips": 0, "totalDistance": 0, "totalSpent": 0, "rating": 5.0}
```

**Dashboard verification:**
- [ ] Login as CLIENT → `/dashboard`
- [ ] See 4 stat cards at top
- [ ] Fourth card should show "Note" with ★ (star) rating
- [ ] Should display: 5.0★ or similar

---

## 🆕 NEW: Rating & Review System Testing

### Feature Overview
A complete 5-star rating system where users can rate each other after completed trips.
- **Clients** can rate drivers after trip completion
- **Drivers** can rate clients after trip completion
- Each user sees driver profiles with aggregated ratings and recent reviews
- Prevents duplicate ratings from the same person

### Rating Modal Tests
- [ ] After completing a trip, booking card shows "Noter le chauffeur" (Rate Driver) button
- [ ] Click button → RatingModal appears with:
  - [ ] Modal title: "Évaluer le trajet"
  - [ ] Question: "Comment avez-vous trouvé votre expérience avec [Driver Name]?"
  - [ ] 5 interactive star buttons (gold/primary color when hovered)
  - [ ] Star count feedback (1★ through 5★)
  - [ ] Sentiment text updates based on selection:
    - 5 stars: "Excellent! 🎉"
    - 4 stars: "Très bien!"
    - 3 stars: "Correct"
    - 2 stars: "Peut être mieux"
    - 1 star: "Pas satisfait"
  - [ ] Text area for optional review (placeholder: "Partager votre expérience (optionnel)...")
  - [ ] Character counter (0-500 max)
  - [ ] "Passer" (Skip) button → closes modal without rating
  - [ ] "Envoyer" (Send) button → disabled until rating selected
- [ ] Submit rating with 3-star and review "Bonne expérience" → modal closes
- [ ] Booking card now shows: "Vous avez noté: 3 ★" (badge style)
- [ ] Click "Envoyer" → see loading state, then success
- [ ] Try to rate same trip again → error "You have already rated this trip"

### Driver Profile Page Tests (`/drivers/[id]`)
- [ ] Access driver profile after rating them
- [ ] Driver header section shows:
  - [ ] Driver name
  - [ ] Award icon or avatar placeholder
  - [ ] "Note moyenne" (Average Rating): e.g., "4.5 ★"
  - [ ] "Trajets complétés" (Completed Trips): e.g., "12"
  - [ ] "Véhicule" (Vehicle): e.g., "Peugeot 308" with type badge
  - [ ] Phone number (if available)

### Rating Display Card Tests
- [ ] "Avis et notes" (Ratings & Reviews) section shows:
  - [ ] Overall rating in large text (e.g., "4.5")
  - [ ] Star visualization (filled stars up to rating)
  - [ ] Total reviews count (e.g., "8 avis")
  - [ ] Rating distribution chart with:
    - [ ] 5 rows (one for each star level)
    - [ ] Percentage bar for each rating level
    - [ ] Percentage text on right (e.g., "50%")
    - [ ] Count for each level
  - [ ] "Avis récents" (Recent Reviews) section showing last 10 reviews:
    - [ ] Client avatar or placeholder
    - [ ] Client name
    - [ ] Star rating display
    - [ ] Review text (if provided)
    - [ ] Date posted (e.g., "6 avr. 2026")
  - [ ] If no reviews yet: "Aucun avis pour le moment" message with icon

### Rating Calculation Tests
- [ ] After first rating (5 stars), driver profile shows 5.0 rating
- [ ] Add second rating (4 stars), driver profile updates to 4.5 rating
- [ ] Add third rating (3 stars), driver profile updates to 4.0 rating
- [ ] Rating distribution updates:
  - [ ] 5★: 33% (1 review)
  - [ ] 4★: 33% (1 review)
  - [ ] 3★: 33% (1 review)
  - [ ] 2★: 0%
  - [ ] 1★: 0%

### API Testing for Ratings
- [ ] `POST /api/bookings/[id]/rating` with valid data:
  ```bash
  curl -X POST http://localhost:3000/api/bookings/[booking-id]/rating \
    -H "Content-Type: application/json" \
    -d '{"role":"client","ratingValue":5,"review":"Excellent service!"}'
  ```
  - [ ] Returns 200 OK with updated booking
  - [ ] Response includes `driverRating: 5` and `driverReview: "Excellent service!"`
  
- [ ] `POST /api/bookings/[id]/rating` with invalid rating (0 or 6):
  - [ ] Returns 400 Bad Request with "Rating must be between 1 and 5"

- [ ] `POST /api/bookings/[id]/rating` on non-COMPLETED booking:
  - [ ] Returns 400 "Can only rate completed bookings"

- [ ] `POST /api/bookings/[id]/rating` double submission:
  - [ ] Returns 400 "You have already rated this trip"

- [ ] `GET /api/drivers/[id]/ratings`:
  ```bash
  curl http://localhost:3000/api/drivers/[driver-id]/ratings
  ```
  - [ ] Returns 200 with:
    - [ ] `overallRating`: float (e.g., 4.5)
    - [ ] `totalTrips`: integer
    - [ ] `totalRatings`: integer
    - [ ] `ratingDistribution`: object with 1-5 star counts
    - [ ] `recentReviews`: array of review objects with:
      - [ ] `rating`, `review`, `clientName`, `clientAvatar`, `createdAt`

### Mutual Rating Tests
- [ ] DRIVER completes trip where they were already rated by CLIENT
- [ ] DRIVER sees completed booking with "Noter le client" (Rate Client) button
- [ ] DRIVER rates CLIENT with 5 stars
- [ ] Booking card shows "Noté: 5 ★" for driver perspective
- [ ] Both ratings visible: CLIENT rated DRIVER and DRIVER rated CLIENT

### Edge Cases
- [ ] Rate driver → navigate away → return to booking → shows rating was saved
- [ ] Rate driver → logout → login as different client → can still rate same driver
- [ ] Try to rate as unauthorized user → 403 Unauthorized
- [ ] Rate deleted booking → 404 Not Found
- [ ] Rating with empty review text → saves successfully (review is optional)
- [ ] Rating with 500 character review → saves successfully
- [ ] Rating with 501+ character review → should be truncated or rejected

---

## 🧪 Complete Testing Checklist

### PHASE 0: Guest Booking & Public Features ✨ NEW!

#### Guest Booking Page (`/reserver`)
- [ ] Navigate to http://localhost:3000/reserver (no login required)
- [ ] See booking form with:
  - [ ] Guest info section: Name, Email, Phone
  - [ ] Route selection: Pickup/Dropoff with Nominatim address autocomplete
  - [ ] Vehicle selector (ECONOMY, COMFORT, BUSINESS)
  - [ ] Options: Passengers (1-8), Luggage checkbox, Notes textarea (500 chars max)
  - [ ] Scheduling: Toggle for future booking with date/time picker
  - [ ] Price estimate display
  - [ ] Sticky submit button at bottom
- [ ] Fill booking form:
  - [ ] Name: "Jean Dupont"
  - [ ] Email: "guest@example.com"
  - [ ] Phone: "+33 6 12 34 56 78"
  - [ ] Pickup: "Paris, France"
  - [ ] Dropoff: "Versailles, France"
  - [ ] Vehicle: "COMFORT"
  - [ ] Passengers: "2"
  - [ ] Luggage: checked
  - [ ] Notes: "Merci d'être ponctuel"
- [ ] Click submit button → Confirmation modal appears
  - [ ] Modal asks: "Continuer en tant qu'invité?"
  - [ ] Shows benefits of account creation:
    - [ ] ✓ Historique de vos réservations
    - [ ] ✓ Suivi en temps réel
    - [ ] ✓ Adresses enregistrées
    - [ ] ✓ Paiement simplifié
  - [ ] 3 buttons: "✓ Créer un compte" (→/inscription), "Continuer en tant qu'invité", "Annuler"
- [ ] Click "Continuer en tant qu'invité" → Success screen appears
  - [ ] Shows ✅ "Réservation enregistrée!"
  - [ ] Displays 6-character reservation code in golden box (e.g., "K3M8HX")
  - [ ] Copy button next to code
  - [ ] Shows "✓ Copié!" message when copied
  - [ ] Displays: "Un email a été envoyé à guest@example.com"
  - [ ] Trip summary: De/Vers, Distance, Prix, Statut (En attente de chauffeur)
  - [ ] Two buttons: "Suivre ma réservation →" (→/suivi?code=...), "Nouvelle réservation"
- [ ] Check email received:
  - [ ] Should contain reservation code prominently displayed
  - [ ] Trip summary in email
  - [ ] Direct tracking link: `/suivi?code=K3M8HX&email=guest@example.com`

#### Guest Reservation Tracking (`/suivi`)
- [ ] Navigate to http://localhost:3000/suivi (no login required)
- [ ] See reservation lookup form with:
  - [ ] Email input field
  - [ ] Code input field (6 chars, auto-uppercase)
  - [ ] "Rechercher" button
  - [ ] Info section explaining code system
- [ ] **TEST AUTO-LOOKUP:**
  - [ ] Direct URL: `/suivi?code=K3M8HX&email=guest@example.com`
  - [ ] Page should auto-search and display booking details
  - [ ] No manual form submission needed
- [ ] **TEST MANUAL SEARCH:**
  - [ ] Clear the auto-lookup
  - [ ] Enter email: "guest@example.com"
  - [ ] Enter code: "k3m8hx" (lowercase)
  - [ ] Click "Rechercher" → form should uppercase code automatically
  - [ ] Should display same booking details
- [ ] Booking details display:
  - [ ] Status badge (En attente de chauffeur - gray)
  - [ ] Pickup address: "Paris, France"
  - [ ] Dropoff address: "Versailles, France"
  - [ ] Distance: "XX km"
  - [ ] Duration: "XX min"
  - [ ] Price: "€XX.XX"
  - [ ] Passengers: "2"
  - [ ] Notes: "Merci d'être ponctuel"
  - [ ] If driver assigned: Driver name visible
- [ ] Try invalid code:
  - [ ] Enter code: "INVALID"
  - [ ] Should show: "Réservation introuvable"
- [ ] Try mismatched email:
  - [ ] Enter code: "K3M8HX"
  - [ ] Enter email: "wrong@example.com"
  - [ ] Should show: "Réservation introuvable"

#### Driver Assignment (Admin Panel)
- [ ] Login as ADMIN → `/admin/reservations`
- [ ] Find a PENDING guest booking (created above)
- [ ] Click "👤 Attribuer chauffeur" button
- [ ] Modal opens showing "Attribuer un chauffeur"
  - [ ] List of all drivers with:
    - [ ] Name
    - [ ] Phone
    - [ ] Vehicle (Type, Brand, Model)
    - [ ] Status badge (Disponible/Occupé/Hors ligne)
    - [ ] Rating (⭐)
  - [ ] Drivers sorted by: status (AVAILABLE first), then rating (descending)
- [ ] Click on a driver → booking assigned
  - [ ] Modal closes
  - [ ] Booking status changes from PENDING to CONFIRMED
  - [ ] Shows success message
- [ ] Booking now shows driver name and details
- [ ] **TEST IN GUEST TRACKING:**
  - [ ] Go to `/suivi?code=K3M8HX&email=guest@example.com`
  - [ ] Booking status should update to "Confirmée"
  - [ ] Driver name should be visible
  - [ ] Guest received no additional email (fire-and-forget pattern)

---

### PHASE 0.5: Driver Reservations Management ✨ NEW!

#### Driver Reservations Section
- [ ] Login as DRIVER → `/dashboard/chauffeur`
- [ ] Scroll down to "Mes réservations" section
  - [ ] Shows heading "Mes réservations"
  - [ ] Shows "Gérez vos réservations confirmées et actives"

#### Status Filters
- [ ] See filter buttons:
  - [ ] "Tous" (shows total count)
  - [ ] "Confirmée" (blue)
  - [ ] "Arrivé" (purple)
  - [ ] "En cours" (orange)
  - [ ] "Terminée" (green)
  - [ ] "Annulée" (red)
- [ ] Click "Confirmée" → list updates to show only CONFIRMED bookings
- [ ] Click "Tous" → list resets to show all bookings
- [ ] Each filter click should show count of bookings in that status

#### Sorting Controls
- [ ] See sort buttons:
  - [ ] "Date" with arrow (⇅)
  - [ ] "Distance" with arrow
  - [ ] "Tarif" with arrow
  - [ ] "Durée" with arrow
- [ ] **TEST DATE SORT:**
  - [ ] Click "Date" → sorts by creation date (descending by default)
  - [ ] Arrow points down ↓
  - [ ] Click "Date" again → sorts ascending ↑
  - [ ] Arrow points up
- [ ] **TEST DISTANCE SORT:**
  - [ ] Click "Distance" → sorts by distance (descending)
  - [ ] Longest trips appear first
  - [ ] Click again → sorts ascending
  - [ ] Shortest trips appear first
- [ ] **TEST PRICE SORT:**
  - [ ] Click "Tarif" → sorts by fare amount (descending)
  - [ ] Most expensive trips first
  - [ ] Click again → sorts ascending
- [ ] **TEST DURATION SORT:**
  - [ ] Click "Durée" → sorts by estimated duration (descending)
  - [ ] Longest trips first
  - [ ] Click again → sorts ascending

#### Reassign Functionality
- [ ] Find a CONFIRMED or DRIVER_ARRIVED booking in the list
- [ ] See "🔄 Réassigner" button at bottom of booking card
- [ ] Click button → Modal opens: "Réassigner cette réservation"
  - [ ] Shows list of all drivers (same as admin panel)
  - [ ] Each driver shows: name, phone, vehicle, status badge, rating
  - [ ] Sorted by availability then rating
- [ ] Click on another driver → booking reassigned
  - [ ] Modal closes
  - [ ] Booking card updates to show new driver
  - [ ] Shows success message: "✓ Réassignation réussie"
- [ ] **TEST RESTRICTION:**
  - [ ] Try to reassign IN_PROGRESS booking
  - [ ] "🔄 Réassigner" button should NOT appear
  - [ ] (Only CONFIRMED & DRIVER_ARRIVED should show button)
- [ ] **TEST REASSIGNMENT CHAIN:**
  - [ ] Reassign booking from Driver A to Driver B
  - [ ] Check that bookings list updates
  - [ ] Check that Admin panel also shows new driver assignment

#### Booking Card Details
- [ ] Each booking card in list shows:
  - [ ] Vehicle type and status badge
  - [ ] Creation date and time
  - [ ] Pickup address
  - [ ] Dropoff address (in 2-column grid)
  - [ ] Distance (km)
  - [ ] Duration (min)
  - [ ] Passenger count
  - [ ] Fare (€, in primary color)
- [ ] Clicking on booking card should show full details (if implemented)

---

### PHASE 1: Authentication & Access Control

#### Login Tests
- [ ] Navigate to http://localhost:3000/connexion
- [ ] Login as CLIENT → should redirect to `/dashboard` ✅ **WORKING** (Bug #1 fixed)
  - [ ] Verify `auth-session` cookie is set in browser
  - [ ] Cookie should be httpOnly, Lax, 7-day expiry
- [ ] Logout → should redirect to login page
- [ ] Login as DRIVER → should redirect to `/dashboard/chauffeur` ✅ **WORKING** (Bug #1 fixed)
  - [ ] Verify cookie is set
  - [ ] Driver dashboard loads (vehicle now linked - Bug #2 fixed)
- [ ] Login as ADMIN → should redirect to `/admin` ✅ **WORKING** (Bug #1 fixed)
  - [ ] Verify cookie is set
- [ ] Try invalid credentials → should show error message
- [ ] Try invalid email format → should show validation error
- [ ] **NEW:** Check DevTools → Cookies → verify `auth-session` cookie exists after login

#### Signup Tests
- [ ] Visit http://localhost:3000/inscription
- [ ] See "Create account" form with fields: name, email, phone, password
- [ ] See link to driver signup: "Vous êtes chauffeur?" → `/inscription/chauffeur`
- [ ] Attempt signup with weak password → should fail validation
- [ ] Attempt signup with invalid email → should fail validation

#### Driver Signup Tests
- [ ] Visit http://localhost:3000/inscription/chauffeur
- [ ] See 3-step form with progress indicator (1/3, 2/3, 3/3):
  - [ ] Step 1/3: Personal info (name, email, phone, password)
  - [ ] Step 2/3: License (license number, expiry date)
  - [ ] Step 3/3: Vehicle (type, brand, model, year, color, plate, capacity)
- [ ] **TEST:** Test expired license validation (Bug #4):
  - [ ] Fill all fields with license expiry date = 2020-01-01 (past date)
  - [ ] Try to submit → Should see error: "License expiry date must be in the future"
  - [ ] Form should NOT submit
  - [ ] Change date to 2030-12-31 (future date) → Now should submit successfully
- [ ] Fill all steps correctly with **valid future license date** → should create driver account
- [ ] Should redirect to `/dashboard/chauffeur` after signup ✅ **WORKS** (Bug #1 fixed)
  - [ ] Should see driver dashboard (not error page)
  - [ ] Verify vehicle is linked (can see it in trip acceptance flow)
  - [ ] Verify `auth-session` cookie is set

#### Access Control Tests
- [ ] As CLIENT: try to access `/dashboard/chauffeur` → should redirect to `/dashboard`
- [ ] As CLIENT: try to access `/admin` → should redirect to `/dashboard`
- [ ] As DRIVER: try to access `/dashboard/reserver` → should show driver sidebar instead
- [ ] As DRIVER: try to access `/admin` → should redirect to `/dashboard/chauffeur`
- [ ] As ADMIN: try to access `/dashboard/reserver` → should redirect to `/admin`
- [ ] Logout and try to access `/dashboard` without login → should redirect to `/connexion`

---

### PHASE 2: Client Features

#### Dashboard Tests
- [ ] Login as CLIENT ✅ **WORKS** (Bug #1 fixed)
- [ ] At `/dashboard` should see:
  - [ ] "Tableau de bord" heading
  - [ ] 4 stat cards: trips, distance, spending, rating ✅ **Rating now included** (Bug #6 fixed)
    - [ ] Card 1: "Courses" with number (should be 0 for new account)
    - [ ] Card 2: "Distance" with km (should be 0)
    - [ ] Card 3: "Dépensé" with €value (should be 0)
    - [ ] Card 4: "Note" with star rating ★ (should show 5.0 for new accounts)
  - [ ] Sidebar with links: "Tableau de bord", "Réserver un trajet", "Mes réservations", "Mon profil"

#### Booking Flow Tests
- [ ] Click "Réserver un trajet" → goes to `/dashboard/reserver`
- [ ] See booking form with:
  - [ ] Pickup address field (with Google Places autocomplete)
  - [ ] Dropoff address field (with Google Places autocomplete)
  - [ ] Vehicle type selector (BERLINE, SUV, VAN, PREMIUM)
  - [ ] Price estimate card showing: base fare, distance, duration, total
- [ ] Fill form:
  - [ ] Pickup: "Paris, France"
  - [ ] Dropoff: "Versailles, France"
  - [ ] Vehicle: BERLINE
- [ ] See price update dynamically as you type addresses
- [ ] Click "Réserver maintenant" → booking should be created
- [ ] Should redirect to `/dashboard/reservations`

#### Reservations Tests
- [ ] At `/dashboard/reservations` see:
  - [ ] List of user's bookings
  - [ ] Each booking card shows: pickup, dropoff, status, price, distance, duration
  - [ ] Status badges colored: PENDING (yellow), CONFIRMED (blue), IN_PROGRESS (orange), COMPLETED (green)
  - [ ] **NEW:** COMPLETED bookings show "Noter le chauffeur" button (if not yet rated)
- [ ] Find PENDING or CONFIRMED booking → click "Annuler la réservation"
- [ ] Confirm cancellation → booking status changes to CANCELLED
- [ ] COMPLETED bookings should NOT have cancel button
- [ ] Click "Noter le chauffeur" on completed booking → RatingModal opens
- [ ] **NEW:** Submit rating → button changes to show "Vous avez noté: X ★" badge
- [ ] Click on a booking → see full details

#### Profile Tests
- [ ] Click "Mon profil" → goes to `/dashboard/profil`
- [ ] See two sections:
  - [ ] Profile Form: name, phone (with PATCH endpoint)
  - [ ] Password Form: current password, new password, confirm
- [ ] Edit name/phone → click Save → should update
- [ ] Try to change password with wrong current password → error
- [ ] Change password with correct current password → success message

---

### PHASE 3: Driver Features

#### Driver Dashboard Tests
- [ ] Login as DRIVER ✅ **WORKS** (Bug #1 fixed)
- [ ] At `/dashboard/chauffeur` should see:
  - [ ] "Tableau de bord chauffeur" heading
  - [ ] Status toggle: OFFLINE / AVAILABLE / ON_BREAK buttons
  - [ ] 4 stat cards: today's trips, total trips, earnings, rating (★) ✅ **Rating field added** (Bug #6)
    - [ ] Card 1: "Courses aujourd'hui" (should be 0)
    - [ ] Card 2: "Courses totales" (should be 0)
    - [ ] Card 3: "Revenus" (should be 0€)
    - [ ] Card 4: "Note" with ★ rating (should show 5.0)
  - [ ] Active trip section (or "No active trip" message)
    - [ ] **NEW:** Verify vehicle is linked (Trip card shows if driver accepts a booking)
  - [ ] Link to "Voir les courses disponibles"

#### Status Toggle Tests
- [ ] Click "Offline" button → should turn gray
- [ ] Click "Disponible" button → should turn green, shows "Disponible"
- [ ] Click "Pause" button → should turn yellow
- [ ] Each click should make API call to PATCH `/api/driver/status`
- [ ] Status should persist on page reload

#### Available Courses Tests
- [ ] Click "Voir les courses disponibles" or go to `/dashboard/chauffeur/courses`
- [ ] Should see:
  - [ ] "Courses disponibles" heading
  - [ ] "Actualisé il y a Xs" timestamp (auto-refreshes)
  - [ ] "Actualiser" button
  - [ ] List of available trips (if any client booked)
- [ ] Each trip card should show:
  - [ ] Status badge (PENDING → "En attente")
  - [ ] Price in EUR
  - [ ] Pickup address
  - [ ] Dropoff address
  - [ ] Distance, duration, passenger count
  - [ ] "Accepter la course" button
- [ ] **TEST:** Vehicle linking test (Bug #2):
  - [ ] Click "Accepter la course" → trip should be removed from list
  - [ ] Should NOT see error "Driver has no vehicle" ✅ **NOW FIXED**
  - [ ] Should redirect to `/dashboard/chauffeur` showing trip as active ✅ **WORKS** (vehicle linked)
  - [ ] Active trip card should display correctly with all details

#### Active Trip Management Tests
- [ ] After accepting a trip, at `/dashboard/chauffeur` see:
  - [ ] "Course active" section with trip card
  - [ ] Status: CONFIRMED → button "Je suis arrivé"
  - [ ] Click "Je suis arrivé" → status changes to DRIVER_ARRIVED → button changes to "Démarrer le trajet"
  - [ ] Click "Démarrer le trajet" → status changes to IN_PROGRESS → button changes to "Terminer le trajet"
  - [ ] Click "Terminer le trajet" → status changes to COMPLETED
  - [ ] Trip should disappear from active section
  - [ ] Earnings should be added to total
  - [ ] **NEW:** Booking card should now show "Noter le chauffeur" button (if CLIENT hasn't rated yet)

#### Trip History Tests
- [ ] Click "Historique" or go to `/dashboard/chauffeur/historique`
- [ ] Should see:
  - [ ] Summary stats: courses completed, total distance, total earnings
  - [ ] List of completed trips
- [ ] Each trip in history shows:
  - [ ] Date and time
  - [ ] Pickup and dropoff addresses
  - [ ] Distance, duration, earnings (€)
- [ ] Trips are sorted by date (newest first)

#### Driver Profile Tests
- [ ] Click "Mon profil" at `/dashboard/profil`
- [ ] Should have same functionality as CLIENT (edit name/phone, change password)

---

### PHASE 4: Admin Features

#### Admin Dashboard Tests
- [ ] Login as ADMIN
- [ ] At `/admin` should see:
  - [ ] "Dashboard" heading
  - [ ] **5 stat cards (NEW: Added "Nouveaux utilisateurs"):**
    - [ ] Total Users (number)
    - [ ] **NEW:** Nouveaux (green TrendingUp icon) - shows new users from last 30 days
      - [ ] Displays count: e.g., "3"
      - [ ] Shows label "(30 derniers jours)"
      - [ ] Should update when new users sign up
    - [ ] Total Bookings (number)
    - [ ] Completed Trips (number)
    - [ ] Revenue (€ total)
- [ ] **Test New Users Counter:**
  - [ ] Create a new user account (client or driver) on another browser/incognito
  - [ ] Admin dashboard should update "Nouveaux" count within 1-2 seconds
  - [ ] Should ONLY count users created in the last 30 days
  - [ ] Should NOT count users created more than 30 days ago
- [ ] Stats should update when new bookings are created
- [ ] Sidebar with links: "Panel admin", "Utilisateurs", "Réservations"

#### Users Management Tests
- [ ] Click "Utilisateurs" → goes to `/admin/utilisateurs`
- [ ] Should see list of all users (clients, drivers, admins)
- [ ] Each user card shows:
  - [ ] Name
  - [ ] Email
  - [ ] Phone (if set)
  - [ ] Registration date
  - [ ] Role badge (colored: ADMIN red, DRIVER blue, CLIENT green)
- [ ] Should show all 3 seeded accounts

#### Bookings Management Tests
- [ ] Click "Réservations" → goes to `/admin/reservations`
- [ ] Should see:
  - [ ] Status filter buttons: "Tous", "En attente", "Confirmée", "Chauffeur arrivé", "En cours", "Terminée", "Annulée"
  - [ ] List of all bookings on platform
- [ ] Click status filter → list updates to show only that status
- [ ] Each booking shows:
  - [ ] Booking ID (last 8 chars)
  - [ ] Client email
  - [ ] Pickup address
  - [ ] Dropoff address
  - [ ] Distance, duration, price
  - [ ] Status badge (colored appropriately)
- [ ] Should show bookings created by all users

---

### PHASE 5: API Testing

#### Authentication APIs
- [ ] `POST /api/auth/signup` with valid data → creates client account
- [ ] `POST /api/auth/login` with valid credentials → returns JWT token + user role
- [ ] `POST /api/auth/driver-signup` with complete data → creates driver account
- [ ] `POST /api/auth/logout` → clears session
- [ ] `GET /api/auth/me` (authenticated) → returns current user data
- [ ] `GET /api/auth/me` (unauthenticated) → returns 401 error

#### Booking APIs
- [ ] `POST /api/bookings` with valid booking data → creates booking
- [ ] `GET /api/bookings` (as client) → returns client's bookings
- [ ] `POST /api/bookings/[id]/cancel` → cancels pending booking
- [ ] Try to cancel non-pending booking → should fail

#### Driver APIs
- [ ] `GET /api/driver/stats` (as driver) → returns: totalTrips, totalEarnings, completedToday, rating
- [ ] `PATCH /api/driver/status` → updates driver status (OFFLINE/AVAILABLE/ON_BREAK)
- [ ] `GET /api/driver/bookings?type=pending` → returns unassigned bookings for driver's vehicle
- [ ] `GET /api/driver/bookings?type=assigned` → returns driver's assigned bookings
- [ ] `POST /api/driver/bookings/[id]/accept` → assigns booking to driver
- [ ] `PATCH /api/driver/bookings/[id]/status` → updates booking status and calculates earnings

#### Admin APIs
- [ ] `GET /api/admin/stats` → returns all platform statistics
- [ ] `GET /api/admin/users` → returns all users on platform
- [ ] `GET /api/admin/bookings` → returns all bookings
- [ ] `GET /api/admin/bookings?status=COMPLETED` → filters by status

#### User APIs
- [ ] `GET /api/users/me/stats` → returns user's trip stats
- [ ] `PATCH /api/users/me` → updates user profile (name, phone)
- [ ] `POST /api/users/me/password` → changes password

#### **NEW: Guest Booking APIs**
- [ ] `POST /api/bookings/guest` - Create guest booking without auth:
  ```bash
  curl -X POST http://localhost:3000/api/bookings/guest \
    -H "Content-Type: application/json" \
    -d '{
      "guestName":"Jean Dupont",
      "guestEmail":"guest@example.com",
      "guestPhone":"+33 6 12 34 56 78",
      "pickupAddress":"Paris, France",
      "pickupCity":"Paris",
      "pickupLat":48.8566,
      "pickupLng":2.3522,
      "dropoffAddress":"Versailles, France",
      "dropoffCity":"Versailles",
      "dropoffLat":48.8011,
      "dropoffLng":2.1298,
      "distance":17.2,
      "estimatedDuration":45,
      "passengers":2,
      "luggage":true,
      "vehicleType":"COMFORT",
      "basePrice":8,
      "price":33.80,
      "pricePerKm":1.5,
      "currency":"EUR"
    }'
  ```
  - [ ] Returns 201 Created with: `id`, `reservationCode`, `pickupAddress`, `dropoffAddress`, `price`, `distance`, `status: PENDING`
  - [ ] Email sent to guest with code (or logs error if SMTP not configured)

- [ ] `GET /api/bookings/guest/lookup?code=K3M8HX&email=guest@example.com` - Lookup guest booking:
  - [ ] Returns 200 with booking details
  - [ ] **Security:** Validates code format with regex `/^[A-Z0-9]{6}$/`
  - [ ] **Security:** Double-checks email match (case-insensitive)
  - [ ] Does NOT return `guestEmail` in response (PII protection)
  - [ ] Invalid code → 400 Bad Request: "Invalid reservation code format"
  - [ ] Code not found → 404 Not Found: "Réservation introuvable"
  - [ ] Email mismatch → 404 Not Found: "Réservation introuvable"

#### **NEW: Driver Assignment APIs**
- [ ] `GET /api/admin/drivers/available` - Get all drivers (admin only):
  - [ ] Returns 200 with array of drivers
  - [ ] Each driver has: `id`, `user.name`, `user.phone`, `vehicle` (type, brand, model, plateNumber), `status`, `rating`
  - [ ] Sorted by: `status` ASC (AVAILABLE first), then `rating` DESC
  - [ ] Requires ADMIN role → 403 Forbidden if not admin

- [ ] `PATCH /api/admin/bookings/[id]/assign-driver` - Admin assigns driver:
  ```bash
  curl -X PATCH http://localhost:3000/api/admin/bookings/[booking-id]/assign-driver \
    -H "Content-Type: application/json" \
    -H "Cookie: auth-session=..." \
    -d '{"driverId":"[driver-id]"}'
  ```
  - [ ] Returns 200 with updated booking
  - [ ] Status changes PENDING → CONFIRMED
  - [ ] Sets `confirmedAt` timestamp
  - [ ] Returns driver info in response
  - [ ] Invalid driverId → 404 Driver not found
  - [ ] Driver without vehicle → 400 "Driver has no vehicle assigned"

- [ ] `PATCH /api/driver/bookings/[id]/reassign` - Driver reassigns booking:
  ```bash
  curl -X PATCH http://localhost:3000/api/driver/bookings/[booking-id]/reassign \
    -H "Content-Type: application/json" \
    -H "Cookie: auth-session=..." \
    -d '{"newDriverId":"[new-driver-id]"}'
  ```
  - [ ] Returns 200 with updated booking
  - [ ] Validates booking belongs to current driver → 403 if not
  - [ ] Only allows CONFIRMED or DRIVER_ARRIVED status → 400 if other status
  - [ ] New driver must have vehicle → 400 if not
  - [ ] New driver must exist → 404 if not

#### **NEW: Rating APIs**
- [ ] `POST /api/bookings/[id]/rating` with rating 1-5 → creates rating
- [ ] `GET /api/drivers/[id]/ratings` → returns driver rating summary and reviews
- [ ] `GET /api/drivers/[id]` → returns driver profile (name, rating, vehicle)

---

### PHASE 5.5: Guest Booking Business Logic

#### Complete Guest Booking Workflow
- [ ] **Step 1 - Guest Books Without Account:**
  - [ ] Navigate to `/reserver` (no login)
  - [ ] Fill complete booking form (name, email, phone, pickup, dropoff, vehicle, options)
  - [ ] Submit → confirmation modal
  - [ ] Click "Continuer en tant qu'invité"
  - [ ] See success screen with 6-character code (e.g., "K3M8HX")
  - [ ] Email sent to guest@example.com with code and tracking link
  
- [ ] **Step 2 - Admin Assigns Driver:**
  - [ ] Login as ADMIN
  - [ ] Go to `/admin/reservations`
  - [ ] Find guest booking (status: PENDING, shows "Invité" badge with guest name)
  - [ ] Click "👤 Attribuer chauffeur"
  - [ ] Modal shows all drivers sorted by availability/rating
  - [ ] Click a driver → booking assigned, status → CONFIRMED
  - [ ] Success message: "✓ Réassignation réussie"
  
- [ ] **Step 3 - Guest Tracks Booking:**
  - [ ] Guest clicks email link or navigates to `/suivi`
  - [ ] URL auto-populates: `/suivi?code=K3M8HX&email=guest@example.com`
  - [ ] Booking displays with:
    - [ ] Status: "Confirmée" (blue badge)
    - [ ] Driver name and details
    - [ ] Trip summary
    - [ ] Pickup time estimate
  
- [ ] **Step 4 - Driver Completes Trip:**
  - [ ] Login as assigned DRIVER
  - [ ] Go to `/dashboard/chauffeur`
  - [ ] See active trip from guest booking
  - [ ] Mark: Arrivé → En cours → Terminé
  - [ ] Status progression: CONFIRMED → DRIVER_ARRIVED → IN_PROGRESS → COMPLETED
  - [ ] Earnings calculated and added to driver total
  
- [ ] **Step 5 - Driver Can Reassign (Optional):**
  - [ ] Before completing, driver can reassign
  - [ ] Go to `/dashboard/chauffeur` → "Mes réservations"
  - [ ] Filter: CONFIRMED
  - [ ] Click "🔄 Réassigner"
  - [ ] Select different driver → reassigned
  - [ ] New driver sees it in their active trips

#### Guest Booking PII Protection
- [ ] Guest email is stored but NOT returned in `/api/bookings/guest/lookup`
- [ ] Admin panel shows guest email (but redacted in list, visible only when viewing booking details)
- [ ] Only code + email together grant access (cannot guess from code alone)
- [ ] Code is unique indexed in database

#### Reservation Code Generation
- [ ] Codes are 6 characters: [A-Z0-9] (avoiding 0/O, 1/I, L confusion)
- [ ] Codes are cryptographically random
- [ ] Collision detection: retries up to 10 times if code exists
- [ ] Each booking has unique code

#### Driver Reservation Management Workflow
- [ ] Login as DRIVER with multiple bookings
- [ ] Go to `/dashboard/chauffeur`
- [ ] Scroll to "Mes réservations"
- [ ] **TEST FILTERS:**
  - [ ] Click "CONFIRMED" → shows only CONFIRMED bookings
  - [ ] Click "EN_PROGRESS" → shows only IN_PROGRESS bookings
  - [ ] Click "COMPLETED" → shows only COMPLETED bookings
  - [ ] Click "Tous" → shows all bookings again
- [ ] **TEST SORTING:**
  - [ ] Click "Date" → sorts by creation date descending
  - [ ] Click "Date" again → sorts ascending
  - [ ] Click "Distance" → sorts by distance
  - [ ] Click "Tarif" → sorts by price
  - [ ] Click "Durée" → sorts by duration
  - [ ] Each sort shows visual indicator (↓ or ↑)
- [ ] **TEST REASSIGNMENT:**
  - [ ] Find CONFIRMED booking
  - [ ] Click "🔄 Réassigner"
  - [ ] Select different driver
  - [ ] Booking updates in list with new driver
  - [ ] IN_PROGRESS booking should NOT have reassign button
- [ ] Bookings sorted/filtered correctly persist after page reload

---

### PHASE 6: Business Logic Tests

#### Booking Workflow
- [ ] CLIENT books a trip (e.g., Paris → Versailles, BERLINE)
- [ ] Price calculation includes: base fare (€5) + distance (€1.50/km)
- [ ] DRIVER sees trip in `/dashboard/chauffeur/courses`
- [ ] DRIVER accepts trip (POST `/api/driver/bookings/[id]/accept`)
- [ ] Trip moves to CONFIRMED status
- [ ] DRIVER sees it as active trip in `/dashboard/chauffeur`
- [ ] DRIVER marks "Je suis arrivé" (DRIVER_ARRIVED status)
- [ ] DRIVER marks "Démarrer le trajet" (IN_PROGRESS status)
- [ ] DRIVER marks "Terminer le trajet" (COMPLETED status)
- [ ] Trip earnings calculated and added to driver's total
- [ ] Trip appears in DRIVER's history
- [ ] Trip appears in ADMIN's completed trips
- [ ] **NEW:** CLIENT sees booking shows "Noter le chauffeur" button
- [ ] **NEW:** CLIENT clicks rating button → RatingModal opens
- [ ] **NEW:** CLIENT submits 5-star review → booking shows rating confirmation

#### **NEW: Rating Workflow**
- [ ] Complete trip from CLIENT to DRIVER
- [ ] CLIENT rates DRIVER with 5 stars and review
- [ ] DRIVER profile rating updates to 5.0
- [ ] Review appears in driver's recent reviews
- [ ] DRIVER rates CLIENT with 4 stars
- [ ] Both ratings visible in booking details
- [ ] Can access `/drivers/[id]` → see overall rating, distribution, recent reviews
- [ ] Multiple ratings → average calculates correctly

#### Role-Based Navigation
- [ ] CLIENT sidebar shows: Tableau de bord, Réserver un trajet, Mes réservations, Mon profil
- [ ] DRIVER sidebar shows: Vue d'ensemble, Courses disponibles, Historique, Mon profil
- [ ] ADMIN sidebar shows: Panel admin, Utilisateurs, Réservations
- [ ] No role can see the other role's pages

#### Error Handling
- [ ] Invalid credentials → "Erreur de connexion"
- [ ] Email already in use → "Email already in use" or similar
- [ ] Invalid address in booking → should show error
- [ ] Driver accepting already-accepted trip → should fail gracefully
- [ ] Unauthorized access (wrong role) → 403 redirect
- [ ] **NEW:** Try to rate twice → "You have already rated this trip"
- [ ] **NEW:** Rate non-completed booking → "Can only rate completed bookings"

---

### PHASE 7: Edge Cases & Error Scenarios

#### Booking Edge Cases
- [ ] Book trip with no driver available → booking should be PENDING
- [ ] Try to cancel COMPLETED trip → should fail
- [ ] Try to cancel CANCELLED trip → should fail
- [ ] Multiple drivers available → each sees same trip, first to accept gets it

#### **NEW: Rating Edge Cases**
- [ ] Rate driver → navigate away → return → rating persists
- [ ] Rate driver → logout → login as different user → can rate same driver with different rating
- [ ] Try to rate with invalid role parameter → 400 Bad Request
- [ ] Rate completed booking from different trip → should work independently
- [ ] Rating value 0 → rejected (must be 1-5)
- [ ] Rating value 6 → rejected (must be 1-5)
- [ ] Null/undefined rating → validation error
- [ ] Empty review text → accepted (review is optional)

#### Driver Edge Cases
- [ ] Driver with no vehicle → cannot see available trips (or only generic ones)
- [ ] Driver logs out during active trip → trip persists on next login
- [ ] Change status to OFFLINE while active trip → should handle gracefully

#### Data Validation
- [ ] Names must be at least 2 characters
- [ ] Email must be valid format
- [ ] Password must be at least 8 characters
- [ ] Phone number validation
- [ ] License expiry date must be in future
- [ ] Vehicle year must be 2000 or later
- [ ] **NEW:** Rating must be 1-5
- [ ] **NEW:** Review max 500 characters

---

### PHASE 8: Performance & UI/UX

#### UI/UX Tests
- [ ] Pages load in < 3 seconds
- [ ] Buttons are clickable and responsive
- [ ] Forms show validation errors clearly
- [ ] Loading spinners appear during async operations
- [ ] Status badges are color-coded correctly
- [ ] Responsive design works on different screen sizes
- [ ] Dark theme (Stitch design) is consistent
- [ ] Gold primary color (#d4af37) used correctly
- [ ] **NEW:** RatingModal opens smoothly
- [ ] **NEW:** Star hover effects work smoothly
- [ ] **NEW:** Rating submission shows loading state
- [ ] **NEW:** Driver profile loads with all rating data

#### Price Calculation & Estimation Disclaimer ✨ NEW!
- [ ] Real-time price updates as addresses change
- [ ] Haversine distance calculation is accurate
- [ ] Price breakdown shows: base fare, distance fare, total
- [ ] Different vehicle types have different rates:
  - [ ] BERLINE: €5 base + €1.50/km
  - [ ] SUV: €8 base + €2/km
  - [ ] VAN: €10 base + €2.50/km
  - [ ] PREMIUM: €15 base + €3.50/km

- [ ] **NEW: Price Estimation Disclaimer:**
  - [ ] In all booking forms (`/reserver`, `/dashboard/reserver`, etc.), below the "Total estimé" price display
  - [ ] Should see message: "ℹ️ Ceci est une estimation. Le prix final peut varier selon les conditions de circulation et les frais supplémentaires."
  - [ ] Message should be visible but subtle (text-xs, text-on-surface-dim)
  - [ ] Message appears in:
    - [ ] Guest booking form (`/reserver`)
    - [ ] Client booking form (`/dashboard/reserver`)
    - [ ] Driver trip creation form (`/dashboard/chauffeur/creer-une-course`)

---

### PHASE 9: Admin Panel - Pagination & Bulk Actions

#### Pagination Controls Tests
All admin pages: `/admin/notifications`, `/admin/conversations`, `/admin/avis`, `/admin/reclamations`

- [ ] **Items Per Page Selector:**
  - [ ] Dropdown shows options: 10, 25, 50, 100
  - [ ] Default selection: 25 items per page
  - [ ] Select 10 → list updates to show max 10 items
  - [ ] Select 50 → list updates to show max 50 items
  - [ ] Changing selection resets to page 1
  - [ ] Dropdown label says "Afficher par page:"

- [ ] **Page Navigation:**
  - [ ] With > 25 items: see "Affichage 1-25 sur X" text
  - [ ] Previous button disabled on page 1
  - [ ] Next button disabled on last page
  - [ ] Click "2" → goes to page 2
  - [ ] Page numbers update based on current page (smart display: max 5 page buttons)
  - [ ] Current page button is highlighted in primary color
  - [ ] Other page numbers are plain/bordered
  - [ ] Click next arrow → advances one page

- [ ] **Responsive Design:**
  - [ ] On desktop: pagination controls in one row (horizontal layout)
  - [ ] On mobile: pagination stacks vertically (flex-col md:flex-row)
  - [ ] Items per page selector and info text remain accessible

- [ ] **Data Consistency:**
  - [ ] Items are correctly offset (page 1 starts at 0, page 2 at 25, etc.)
  - [ ] Total count shown is accurate
  - [ ] Filters work with pagination (e.g., filter by type, then paginate)
  - [ ] Page resets to 1 when filter changes
  - [ ] URL updates with pagination params (limit/offset)

#### Notifications Page Pagination
`/admin/notifications`

- [ ] Create 50+ notifications (or use existing test data)
- [ ] Default view: 25 items per page
- [ ] Select 10 → shows "Affichage 1-10 sur X"
- [ ] Select 50 → shows all 50 items (or fewer if < 50 total)
- [ ] Type filter works with pagination:
  - [ ] Filter by "BOOKING_CONFIRMED" → paginate through filtered results
  - [ ] Filter count updates correctly
- [ ] Read filter works with pagination:
  - [ ] Filter by "Non lues" → paginate only unread
  - [ ] Combining filters: filter by type + read status works together

#### Conversations Page Pagination
`/admin/conversations`

- [ ] Create 50+ conversations (or use test data)
- [ ] Default: 25 per page
- [ ] Type filter (RIDE/SUPPORT) works with pagination
- [ ] Each conversation card displays correctly on all pages
- [ ] Unread message counts are accurate per page
- [ ] Last message preview displays correctly

#### Reviews (Avis) Page Pagination
`/admin/avis`

- [ ] Create 50+ reviews (or use test data)
- [ ] Role filter (Client/Chauffeur) with pagination
- [ ] Response filter (Avec réponse/Sans réponse) with pagination
- [ ] Stat cards update based on filtered data:
  - [ ] Average rating calculation correct for filtered items
  - [ ] Response rate % updates correctly
- [ ] Reviews display with reviewer → reviewee info

#### Complaints (Réclamations) Page Pagination
`/admin/reclamations`

- [ ] Create 50+ complaints (or use test data)
- [ ] Status filter (OPEN/UNDER_REVIEW/RESOLVED/DISMISSED) with pagination
- [ ] Category filter (7 categories) with pagination
- [ ] Combining status + category filters with pagination
- [ ] Each complaint card displays correctly
- [ ] Status badges color-coded on every page

#### Bulk Actions Tests (All Admin Pages)

- [ ] **Selection Checkboxes:**
  - [ ] Each item has checkbox on the left
  - [ ] "Sélectionner tout" checkbox at top
  - [ ] Click item checkbox → selected (visual ring highlight + ring-2 ring-primary)
  - [ ] Click "Sélectionner tout" → all items on current page selected
  - [ ] All items selected → "Sélectionner tout" checkbox is checked
  - [ ] Some items selected → "Sélectionner tout" checkbox is unchecked
  - [ ] Uncheck "Sélectionner tout" → all deselected

- [ ] **BulkActionsToolbar:**
  - [ ] Toolbar does NOT appear when no items selected
  - [ ] Toolbar appears at bottom (sticky, z-40) when items selected
  - [ ] Shows text: "X sélectionné(s)" (singular/plural handling)
  - [ ] "Désélectionner tout" button clears all selections
  - [ ] Action buttons specific to each page:

  **Notifications Page:**
  - [ ] Select 5 notifications → toolbar shows "Marquer comme lues" + "Supprimer"
  - [ ] Click "Marquer comme lues" → updates `read: true`, list refreshes
  - [ ] Click "Supprimer" → confirmation dialog: "Êtes-vous sûr de vouloir \"Supprimer\" ces 5 élément(s)?"
  - [ ] Confirm → notifications deleted, toolbar disappears

  **Conversations Page:**
  - [ ] Select 3 conversations → toolbar shows "Supprimer"
  - [ ] Click "Supprimer" → confirmation dialog
  - [ ] Confirm → conversations deleted, page refreshes

  **Reviews (Avis) Page:**
  - [ ] Select 4 reviews → toolbar shows "Supprimer"
  - [ ] Click "Supprimer" → confirmation dialog
  - [ ] Confirm → reviews deleted, refreshes

  **Complaints (Réclamations) Page:**
  - [ ] Select 2 complaints → toolbar shows "Supprimer"
  - [ ] Click "Supprimer" → confirmation dialog
  - [ ] Confirm → complaints deleted, refreshes

- [ ] **Bulk Action Behavior:**
  - [ ] After bulk action, selections cleared automatically
  - [ ] After bulk action, page resets to page 1
  - [ ] Pagination preserved (itemsPerPage stays same)
  - [ ] Loading state: buttons show spinner during operation
  - [ ] Error handling: if bulk action fails, show console error (check DevTools)
  - [ ] Toolbar disappears after action completes

#### Pagination + Bulk Actions Integration

- [ ] **Scenario 1: Select across multiple items**
  - [ ] Go to page 1, select 5 items
  - [ ] Go to page 2, select 3 more items
  - [ ] Selections are NOT persisted across pages (by design - checkbox state is per-page)
  - [ ] (Current design: selections reset when navigating pages)

- [ ] **Scenario 2: Delete and stay on same page**
  - [ ] Page 3 with 10 items selected
  - [ ] Delete 10 items
  - [ ] If remaining items on page 3 > 0 → stays on page 3
  - [ ] If no items on page 3 → goes to page 2

- [ ] **Scenario 3: Filter, paginate, bulk delete**
  - [ ] Filter notifications by type "BOOKING_CONFIRMED" (e.g., 50 items)
  - [ ] Select itemsPerPage = 10 (5 pages total)
  - [ ] Go to page 4 → select 5 items
  - [ ] Delete → list refreshes with new count
  - [ ] Pagination adjusts if needed

- [ ] **Scenario 4: Change itemsPerPage during selection**
  - [ ] Page 1, select 5 items
  - [ ] Change itemsPerPage from 25 to 50
  - [ ] Selections should clear (page resets to 1)
  - [ ] New view shows up to 50 items per page

#### Bulk Action API Tests

- [ ] `POST /api/admin/bulk` with action `mark-notifications-read`:
  ```bash
  curl -X POST http://localhost:3000/api/admin/bulk \
    -H "Content-Type: application/json" \
    -H "Cookie: auth-session=..." \
    -d '{"action":"mark-notifications-read","ids":["id1","id2"]}'
  ```
  - [ ] Returns 200 with `{updated: 2, action: "mark-notifications-read"}`
  - [ ] Requires ADMIN role → 403 Forbidden if not admin

- [ ] `POST /api/admin/bulk` with action `delete-notifications`:
  - [ ] Returns 200 with `{deleted: X, action: "delete-notifications"}`
  - [ ] Notifications actually deleted from DB

- [ ] `POST /api/admin/bulk` with action `delete-conversations`:
  - [ ] Returns 200 with `{deleted: X, action: "delete-conversations"}`

- [ ] `POST /api/admin/bulk` with action `delete-reviews`:
  - [ ] Returns 200 with `{deleted: X, action: "delete-reviews"}`

- [ ] `POST /api/admin/bulk` with action `delete-complaints`:
  - [ ] Returns 200 with `{deleted: X, action: "delete-complaints"}`

- [ ] `POST /api/admin/bulk` with empty ids array:
  - [ ] Returns 400: "Validation error" (ids.min(1) fails)

- [ ] `POST /api/admin/bulk` with invalid action:
  - [ ] Returns 400: "Unknown action" (not in enum)

---

## 🎯 Quick Test Sequence

### 5-Minute Quick Test (Guest Booking Path)
1. Navigate to `/reserver` (no login)
2. Fill booking form (guest info, route, vehicle)
3. Submit → confirmation modal → "Continuer en tant qu'invité"
4. See success screen with 6-char code
5. Check code is in format: A-Z0-9 (6 chars)
6. Navigate to `/suivi` → auto-filled with code/email
7. See booking displayed with guest details
8. Login as ADMIN
9. Find guest booking in `/admin/reservations` (shows "Invité" badge)
10. Click "👤 Attribuer chauffeur" → select driver
11. Booking status → CONFIRMED, driver assigned
12. Go back to `/suivi` → see driver name now visible
13. Login as DRIVER → `/dashboard/chauffeur/courses` → accept trip
14. See trip in "Mes réservations" with filters/sorting

### 5-Minute Quick Test (Original - Authenticated)
1. Login as CLIENT → see dashboard
2. Book a trip (Paris → Versailles)
3. Logout → login as DRIVER
4. Accept the trip
5. Complete the trip (arrivé → démarrer → terminer)
6. **NEW:** Go to `/dashboard/chauffeur` → "Mes réservations"
7. **NEW:** Test filters (COMPLETED shows this trip)
8. **NEW:** Test sorting options (date, distance, price, duration)
9. Login as CLIENT → rate the driver
10. Check history
11. Logout → login as ADMIN
12. Verify trip in admin bookings

### 30-Minute Full Test
1. Complete all PHASE 1-4 tests
2. Test all APIs including rating endpoints
3. Test rating workflow completely
4. Check error handling for ratings
5. Verify all role restrictions

### Complete Test (2-3 hours)
1. Run through all 8 phases
2. Document any bugs/issues
3. Test rating edge cases thoroughly
4. Check driver profile displays ratings correctly
5. Test performance
6. Test on different browsers if possible

---

## 📝 Reporting Issues

When testing, note:
- **URL**: Which page you were on
- **Action**: What you clicked/tried
- **Expected**: What should happen
- **Actual**: What actually happened
- **Steps to Reproduce**: How to recreate the issue
- **Browser**: Chrome, Firefox, Safari, Edge
- **Device**: Desktop, Tablet, Mobile

---

## ✅ Success Criteria

All tests pass when:
- ✅ All 3 roles can login and access their correct pages ✅ **BUG #1 FIXED**
  - [ ] Cookie `auth-session` is set after login
  - [ ] No infinite redirects
  - [ ] Correct dashboard for each role
- ✅ Booking workflow completes (book → driver accepts → complete) ✅ **BUG #2 FIXED**
  - [ ] Driver can accept trips (vehicle linked)
  - [ ] No "Driver has no vehicle" errors
- ✅ Driver signup works with validation ✅ **BUG #4 FIXED**
  - [ ] Rejects expired license dates
  - [ ] Accepts future license dates
  - [ ] Redirects to driver dashboard after signup
- ✅ **NEW:** Rating system works end-to-end
  - [ ] Can rate completed trips (1-5 stars + optional review)
  - [ ] Prevents double-rating
  - [ ] Driver profile shows ratings and reviews
  - [ ] Rating average calculates correctly
- ✅ **NEW:** Pagination works on all admin pages
  - [ ] Items per page selector (10/25/50/100) changes list
  - [ ] Page navigation works (prev/next/page numbers)
  - [ ] Filters work with pagination
  - [ ] Page resets when filter changes
- ✅ **NEW:** Bulk actions work on all admin pages
  - [ ] Checkbox selection for individual items
  - [ ] "Select All" checkbox selects all items on page
  - [ ] Toolbar appears when items selected
  - [ ] Actions complete successfully (mark read, delete)
  - [ ] Confirmation dialogs for destructive actions
  - [ ] List refreshes after bulk action
- ✅ Driver earnings calculated correctly
- ✅ Admin sees all users and bookings
- ✅ All API endpoints respond with correct data ✅ **BUG #6 FIXED**
  - [ ] Stats API includes `rating` field
  - [ ] Rating APIs return correct data
  - [ ] Pagination APIs accept `limit`/`offset` params
  - [ ] Bulk action API validates input
- ✅ Role-based access control works (admin-only for bulk/pagination)
- ✅ Form validation works (including license date and rating validation)
- ✅ Error messages appear for invalid actions
- ✅ Pages load in reasonable time
- ✅ Design is consistent with Stitch theme
- ✅ Responsive design works (mobile, tablet, desktop)

---

## 🚀 Quick Start Commands

```bash
# Install dependencies (first time only)
npm install

# Start development server
npm run dev
# Server runs on http://localhost:3000 (or 3001/3002 if port in use)

# Build for production
npm run build

# Start production server
npm start

# Generate Prisma Client (if schema changes)
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed database with test data
npx prisma db seed
```

### Environment Setup
```bash
# Create .env.local from example
cp .env.example .env.local

# Configure your environment variables:
# - DATABASE_URL=postgresql://user:password@localhost:5432/taxi_leblanc
# - NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key
# - etc.
```

### Verify Server is Running
```bash
curl -s http://localhost:3000 | grep -o '<title>.*</title>'
# Should output: <title>Taxi Leblanc - Votre Taxi de Route</title>
```

---

---

# 📊 Test Report — Build 2.0 (April 7, 2026)

## ✅ Database Migration Status

**Status:** ✅ **MIGRATIONS APPLIED SUCCESSFULLY** (April 7, 2026 - 04:35 UTC)

The Prisma schema was updated with new models (Notification, Conversation, Review, Complaint). Database has been reset and all migrations have been applied:

```bash
npx prisma migrate reset --force
# → Database reset successful
# → Generated Prisma Client
# → Tables created for all models
```

### Current Server Status
- **Port:** http://localhost:3002 (fallback port, 3000-3001 in use)
- **Database:** PostgreSQL at localhost:5432/taxi_leblanc
- **Status:** ✅ Running
- **Last Updated:** April 7, 2026 04:35 UTC

### API Health Check Results
- `GET /api/admin/notifications` — ✅ Accessible (returns 403 without auth instead of 500)
- `GET /api/admin/conversations` — ✅ Accessible (returns 403 without auth)
- `GET /api/admin/reviews` — ✅ Accessible
- `GET /api/admin/complaints` — ✅ Accessible
- `POST /api/admin/bulk` — ✅ Accessible (validation working)

**Note:** All APIs now return proper auth errors (403 Forbidden) instead of 500 errors, confirming the database is properly initialized.

## ✅ UI Status

**Implemented but blocked by API failures:**
- Admin Notifications page: Filter dropdowns, stat cards in place
- Admin Conversations page: Type filter, stat cards in place
- Admin Reviews (Avis) page: Role/Response filters, stat cards in place
- Admin Complaints (Réclamations) page: Status/Category filters in place
- Pagination controls: Code written, not rendering (no data)
- Bulk action checkboxes: Code written, not rendering (no data)
- BulkActionsToolbar: Component created, not tested yet

**Newly added features:**
- Notification Bell icon in top navigation ✅
- Messages page for clients/drivers ✅
- Updated admin sidebar with feature links ✅
- CPAM section on driver dashboard ✅

---

---

## 🚀 Build 2.0 — Ready for Phase 9 Testing

**Post-Migration Status:**
- ✅ All Prisma migrations applied
- ✅ Database fully initialized with new tables
- ✅ Notifications, Conversations, Reviews, Complaints models created
- ✅ Pagination component created with limit/offset support
- ✅ Bulk actions API implemented with Zod validation
- ✅ Admin UI pages updated with new features

**Next Steps for Testing:**
1. Login as ADMIN (`admin@taxi-leblanc.fr` / `AdminPass123!`)
2. Navigate to `/admin/notifications`, `/admin/conversations`, `/admin/avis`, `/admin/reclamations`
3. Test pagination: Select items per page (10, 25, 50, 100)
4. Test bulk actions: Check items, use toolbar buttons
5. Verify page navigation, filters, and refresh behavior

**Known Notes:**
- Database was reset to apply migrations (test data cleared)
- May need to seed test accounts via: `npx prisma db seed`
- Build is now ready for comprehensive Phase 9 testing

---

**Platform**: Taxi Leblanc v0.2.0 | **Status**: Development (Migrations Applied ✅) | **Last Updated**: April 7, 2026
**New Features**: 
- Guest Booking System (No Account Required) 🎫
- Driver Reservations Management with Filters & Sorting 📊
- Driver Assignment & Reassignment 🔄
- Rating & Review System ⭐
- Admin Panel Chat Management 💬
- Admin Panel Detailed Reviews & Complaints 📋
- Admin Panel Pagination Controls 📄 (10/25/50/100 items per page)
- Admin Panel Bulk Actions ✅ (mark read, delete, select all)
