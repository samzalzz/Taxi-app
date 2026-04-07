# 🔐 Test Credentials — Taxi Leblanc

Generated for comprehensive platform testing. All accounts are seeded in the database via `prisma/seed.ts`.

## Test Accounts

| Role | Email | Password | Landing Page |
|------|-------|----------|--------------|
| **CLIENT** | `client@taxi-leblanc.fr` | `ClientPass123!` | `/dashboard` |
| **DRIVER** | `chauffeur@taxi-leblanc.fr` | `DriverPass123!` | `/dashboard/chauffeur` |
| **ADMIN** | `admin@taxi-leblanc.fr` | `AdminPass123!` | `/admin` |

---

## Quick Start

### Initialize Test Accounts
```bash
cd ~/Desktop/Websites/New
DATABASE_URL="postgresql://postgres:AdminSecurePassword123!@localhost:5432/taxi_leblanc" npx prisma db seed
```

### Login
Visit: http://localhost:3000/connexion

---

## Feature Access Matrix

### CLIENT Dashboard (`/dashboard`)
- ✅ View statistics (trips, distance, spending)
- ✅ Book a trip (`/dashboard/reserver`)
- ✅ View reservations (`/dashboard/reservations`)
- ✅ Cancel pending/confirmed bookings
- ✅ Edit profile (`/dashboard/profil`)
- ❌ Driver features
- ❌ Admin panel

### DRIVER Dashboard (`/dashboard/chauffeur`)
- ✅ Toggle availability (OFFLINE/AVAILABLE/ON_BREAK)
- ✅ View available trips (`/dashboard/chauffeur/courses`)
- ✅ Accept trips
- ✅ Manage active trip:
  - Mark as "Je suis arrivé" (DRIVER_ARRIVED)
  - Start trip (IN_PROGRESS)
  - Complete trip (COMPLETED)
- ✅ View completed trips history (`/dashboard/chauffeur/historique`)
- ✅ View earnings & statistics
- ✅ Edit profile (`/dashboard/profil`)
- ❌ Make bookings (CLIENT feature)
- ❌ Admin panel

### ADMIN Panel (`/admin`)
- ✅ Dashboard overview (stats)
- ✅ View all users (`/admin/utilisateurs`)
- ✅ View all bookings (`/admin/reservations`)
- ✅ Filter bookings by status
- ✅ View completed trips with driver info
- ❌ Edit/delete users (not implemented yet)

### Shared Features (All Roles)
- ✅ Login/Logout
- ✅ Edit personal info & change password (`/dashboard/profil`)
- ✅ View account details

---

## Test Flows

### Flow 1: Client Books a Trip
1. Login as **CLIENT**
2. Go to `/dashboard/reserver`
3. Enter pickup address (e.g., "Paris, France")
4. Enter dropoff address (e.g., "Versailles, France")
5. Select vehicle (BERLINE/SUV/VAN/PREMIUM)
6. Review price estimate
7. Click "Réserver maintenant"
8. ✅ Booking created, appears in `/dashboard/reservations`

### Flow 2: Driver Accepts & Completes a Trip
1. **Precondition**: Client has created a booking (see Flow 1)
2. Login as **DRIVER**
3. Go to `/dashboard/chauffeur/courses`
4. See pending trips (filtered by driver's vehicle type)
5. Click "Accepter la course"
6. ✅ Trip appears in `/dashboard/chauffeur` as active
7. Click "Je suis arrivé"
8. ✅ Status: DRIVER_ARRIVED
9. Click "Démarrer le trajet"
10. ✅ Status: IN_PROGRESS
11. Click "Terminer le trajet"
12. ✅ Status: COMPLETED → Earnings added → Trip moves to historique

### Flow 3: Admin Monitors Platform
1. Login as **ADMIN**
2. Go to `/admin`
3. View stats: total users, bookings, completed trips, revenue
4. Go to `/admin/utilisateurs`
5. See all registered users (clients, drivers, admins)
6. Go to `/admin/reservations`
7. Filter by status (PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED)
8. ✅ See all bookings with driver assignment

---

## Database Credentials

```
Host: localhost
Port: 5432
Database: taxi_leblanc
User: postgres
Password: AdminSecurePassword123!
```

**Connection String:**
```
postgresql://postgres:AdminSecurePassword123!@localhost:5432/taxi_leblanc
```

---

## API Credentials

### JWT Secret
```
3cb3fa16e4283636362e2177383537fd0a922ffa7d369e61a31f763a7a57e4b4
```
(Stored in `.env.local` as `JWT_SECRET`)

### Google Maps API Key
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=<your-api-key>
```
(Stored in `.env.local`)

---

## Test Data Notes

- **Driver Vehicle**: Peugeot 308 (BERLINE), capacity 4 passengers
- **Test Prices**: BERLINE €5 base + €1.50/km (adjust in `src/lib/utils/pricing.ts`)
- **Test License**: Valid until 2030-12-31
- **Phone Numbers**: All set to test numbers (+33 6 00 00 00 XX)

---

## Resetting Test Data

To clear all test accounts and reseed:
```bash
DATABASE_URL="postgresql://postgres:AdminSecurePassword123!@localhost:5432/taxi_leblanc" npx prisma db seed
```

This automatically deletes old test accounts and creates fresh ones.

---

## Troubleshooting

### "User already exists" on seed
Your test database has old accounts. Run:
```bash
npx prisma db push  # Sync schema
npx prisma db seed  # Reseed
```

### Login fails with "Email already in use"
The seed script deletes old test accounts first. If signup fails, use login instead (accounts already exist).

### Driver sees no available trips
- Client must book a trip first
- Driver's vehicle type must match booking's `requestedVehicleType`
- Test client books a BERLINE trip → test driver (with BERLINE) will see it

---

## Deployment Notes

**DO NOT SEED IN PRODUCTION.** The seed script is for local development only.

For production, manually create admin account via a secure onboarding flow.
