# Guest Booking System — Complete Implementation

## Overview
A complete guest booking workflow for Taxi Leblanc, enabling users to reserve rides without creating an account. Guests receive 6-character reservation codes and can track their bookings via email + code.

**Status:** ✓ **FULLY IMPLEMENTED & TESTED**

---

## Key Features Implemented

### 1. Guest Booking Without Account
- **Public page:** `/reserver` — accessible to anyone
- **Form sections:**
  - Guest info (name, email, phone)
  - Route selection (pickup/dropoff with Nominatim autocomplete)
  - Vehicle selection (ECONOMY, COMFORT, BUSINESS)
  - Options (passengers, luggage, notes)
  - Scheduling (optional future booking)
  - Price estimate display
- **Confirmation modal** — asks to create account or continue as guest
- **Success screen** — displays 6-character reservation code with copy button

### 2. Reservation Code System
- **Code format:** 6 alphanumeric characters (no ambiguous chars: 0/O, 1/I)
- **Alphabet:** `ABCDEFGHJKLMNPQRSTUVWXYZ23456789` (32 chars)
- **Generation:** Cryptographically random with collision detection (10 retries)
- **Storage:** Unique indexed field in Booking table with `@@index([reservationCode])`

### 3. Guest Reservation Tracking
- **Public page:** `/suivi` — lookup by code + email
- **Auto-fill:** If accessed with URL params `?code=AB3K9X&email=guest@ex.com`, auto-searches
- **Display:** Booking status, trip details, price, assigned driver (if any)
- **Manual search:** Form for code + email entry with auto-uppercase

### 4. Email Confirmation
- **Recipient:** Guest email address
- **Content:**
  - Code displayed prominently (36px monospace, golden color)
  - Trip summary (pickup, dropoff, distance, price)
  - Direct tracking link: `/suivi?code=AB3K9X&email=...`
  - Security note: "Keep this code safe"
- **Pattern:** Fire-and-forget (booking succeeds even if email fails)

### 5. Driver Assignment (Two Paths)

#### Admin Panel (`/admin/reservations`)
- **Button:** "👤 Attribuer chauffeur" on PENDING bookings
- **Modal:** Shows all drivers with:
  - Name, phone
  - Vehicle info (type, brand, model, plate)
  - Status badge (green=Available, yellow=Busy, gray=Offline)
  - Rating (stars)
- **Action:** Click driver to assign and auto-transition to CONFIRMED

#### Driver Dashboard (`/dashboard/chauffeur/courses`)
- **Button:** "Accepter la course" on PENDING bookings
- **Action:** Self-assign booking and transition to CONFIRMED
- **Status:** Driver marked as BUSY after acceptance

### 6. Booking Status Workflow
```
PENDING → CONFIRMED → DRIVER_ARRIVED → IN_PROGRESS → COMPLETED
       ↓
    CANCELLED (anytime)
```
- **Transition triggers:**
  - PENDING→CONFIRMED: Admin/Driver assigns
  - CONFIRMED→DRIVER_ARRIVED: Driver clicks "Je suis arrivé"
  - DRIVER_ARRIVED→IN_PROGRESS: Driver clicks "Démarrer"
  - IN_PROGRESS→COMPLETED: Driver clicks "Terminer"

---

## Database Schema

### Booking Model Updates
```prisma
model Booking {
  // ... existing fields ...
  
  // Made optional for guest bookings
  clientId         String?   @db.Uuid
  
  // New guest fields
  guestName        String?
  guestEmail       String?
  guestPhone       String?
  reservationCode  String?   @unique
  
  // Indexes for performance
  @@index([reservationCode])
  @@index([guestEmail])
}
```

---

## API Endpoints

### Guest Booking
- **POST `/api/bookings/guest`**
  - Creates booking without auth
  - Validates: name, email, phone, addresses, vehicle type
  - Generates reservation code
  - Fires confirmation email
  - Returns: booking data + reservationCode

### Guest Lookup
- **GET `/api/bookings/guest/lookup?code=AB3K9X&email=guest@ex.com`**
  - Double-verification (code + case-insensitive email)
  - Returns booking WITHOUT guestEmail (PII protection)
  - Includes driver name if assigned

### Admin Driver Assignment
- **PATCH `/api/admin/bookings/{id}/assign-driver`**
  - Requires ADMIN role
  - Assigns driver, auto-transitions to CONFIRMED
  - Returns: updated booking with driver info

### Available Drivers
- **GET `/api/admin/drivers/available`**
  - Requires ADMIN role
  - Returns all drivers with rating, status, vehicle info
  - Sorted by: status (AVAILABLE first), then rating (descending)

### Driver Self-Assignment
- **POST `/api/driver/bookings/{id}/accept`**
  - Requires DRIVER role
  - Assigns current driver, transitions to CONFIRMED
  - Updates driver status to BUSY

---

## Component Hierarchy

### Guest Booking Form
- **File:** `src/components/features/booking/GuestBookingForm.tsx`
- **Dependencies:**
  - `AddressPicker` — Nominatim-powered address autocomplete
  - `VehicleSelector` — Vehicle type & price estimate
  - `PriceEstimate` — Final price display
  - `useGuestBooking` hook — State management

### Reservation Lookup Form
- **File:** `src/components/features/booking/ReservationLookupForm.tsx`
- **Features:**
  - Manual code + email search
  - Auto-search via props (`defaultCode`, `defaultEmail`)
  - Status badge color-coding
  - Driver info display (if assigned)

### Admin Bookings Panel
- **File:** `src/app/admin/reservations/page.tsx`
- **Features:**
  - Status filter buttons
  - Visibility toggle (private/public)
  - "👤 Attribuer chauffeur" button → modal
  - Status transition buttons
  - "Invité" badge for guest bookings

---

## Pages

### `/reserver` (Public)
- No login required
- Header with Connexion/S'inscrire links
- Full guest booking form
- Info section (code system, security, tracking)

### `/suivi` (Public)
- No login required
- Auto-lookup via URL params
- Manual search form
- Booking details display
- Info section (code explanation, support)

### `/admin/reservations` (Admin Only)
- Driver assignment modal
- Status management
- Visibility control
- Guest badge display

### `/dashboard/chauffeur/courses` (Driver Only)
- Available courses list
- "Accepter la course" button (self-assignment)
- Auto-refresh (30s interval)

---

## Key Utilities

### `generateUniqueReservationCode()`
- Generates 6-char code with collision detection
- Max 10 retries
- Uses cryptographic random bytes

### `assignDriverToBooking()`
- Validates PENDING status
- Prevents race conditions (checks booking still unassigned)
- Auto-transitions to CONFIRMED
- Sets confirmedAt timestamp

### `getBookingByReservationCode()`
- Security: double-checks code + email
- Case-insensitive email comparison
- Excludes guestEmail from response (PII)
- Includes driver info if assigned

---

## Security Features

1. **PII Protection**
   - Email address stored but not returned in lookup responses
   - Code + email required together for access

2. **Race Condition Prevention**
   - Booking status verified before assignment
   - Prevents double-assignment edge case

3. **Role-Based Access**
   - Guest pages: public, no auth
   - Admin endpoints: ADMIN role only
   - Driver endpoints: DRIVER role only

4. **Email Verification**
   - Code is unique indexed
   - Email lookup is case-insensitive
   - Both required for access (cannot guess from code alone)

---

## Testing Checklist

- [x] `/reserver` page loads without login
- [x] Guest booking form validation works
- [x] Reservation code generated on booking submit
- [x] Email sent with code (or logs error if no SMTP)
- [x] Success screen displays code + copy button
- [x] `/suivi` page loads without login
- [x] Manual code + email lookup returns booking
- [x] Auto-lookup via URL params works
- [x] Admin can assign drivers to bookings
- [x] Driver assignment modal displays available drivers
- [x] Driver can self-assign courses
- [x] Status transitions work (all buttons)
- [x] "Invité" badge shows for guest bookings
- [x] Server running on port 3000 ✓

---

## Deployment Notes

### Environment Variables Required
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-here
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=no-reply@taxileblanc.com
```

### Nominatim API
- Used for address autocomplete (replaces Google Maps)
- Free, no API key required
- No domain restrictions
- 1 request per second recommended

### Email Service
- Currently using Nodemailer (Gmail SMTP)
- Fire-and-forget pattern: booking succeeds even if email fails
- Logs errors to console

---

## Future Enhancements

1. **SMS Notifications** — Text code to guest's phone number
2. **QR Code** — Embed in email for easy tracking
3. **Driver Ratings** — Display after completion
4. **Cancellation Policy** — Allow guests to cancel PENDING bookings
5. **Multi-Language** — Localize form (currently French)
6. **Payment Integration** — Stripe/PayPal for guest bookings

---

## File Summary

| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | Database schema with guest fields |
| `src/persistence/queries/bookingQueries.ts` | Core booking logic (code gen, assignment, lookup) |
| `src/app/api/bookings/guest/route.ts` | Guest booking creation endpoint |
| `src/app/api/bookings/guest/lookup/route.ts` | Code + email lookup endpoint |
| `src/app/api/admin/bookings/[id]/assign-driver/route.ts` | Admin driver assignment endpoint |
| `src/app/api/admin/drivers/available/route.ts` | Available drivers list endpoint |
| `src/app/api/driver/bookings/[id]/accept/route.ts` | Driver self-assignment endpoint |
| `src/lib/email/mailer.ts` | Guest booking confirmation email |
| `src/lib/hooks/useGuestBooking.ts` | Guest booking form state management |
| `src/components/features/booking/GuestBookingForm.tsx` | Guest booking form component |
| `src/components/features/booking/ReservationLookupForm.tsx` | Reservation tracking form component |
| `src/app/reserver/page.tsx` | Public guest booking page |
| `src/app/suivi/page.tsx` | Public reservation tracking page |
| `src/app/admin/reservations/page.tsx` | Admin panel with driver assignment |

---

**Status:** Production-ready ✓
