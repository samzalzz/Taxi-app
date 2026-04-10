import { prisma } from '@/persistence/client';
import { Booking, BookingStatus, VehicleType } from '@/generated/prisma/client';
import { randomBytes } from 'crypto';

export interface CreateBookingInput {
  clientId?: string; // Optional for guest bookings
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  pickupAddress: string;
  pickupCity: string;
  pickupLat: number;
  pickupLng: number;
  dropoffAddress: string;
  dropoffCity: string;
  dropoffLat: number;
  dropoffLng: number;
  distance: number;
  estimatedDuration: number;
  passengers: number;
  luggage: boolean;
  vehicleType: VehicleType;
  basePrice: number;
  price: number;
  pricePerKm: number;
  currency: string;
  scheduledAt?: Date | null;
  clientNotes?: string;
  isPublic?: boolean;
  createdByDriverId?: string;
  isCpam?: boolean;
}

/**
 * Generate a unique 10-character reservation code for guest bookings
 * Uses alphanumeric characters without ambiguous characters (0/O, 1/I, etc)
 * Alphabet: ABCDEFGHJKLMNPQRSTUVWXYZ23456789 (32 chars)
 *
 * Security: 32^10 ≈ 1.1 * 10^15 possible combinations
 * Resistant to brute force attacks even with rate limiting bypasses
 *
 * Retries up to 10 times if collision detected
 */
export async function generateUniqueReservationCode(): Promise<string> {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const codeLength = 10; // Increased from 6 to 10 for better security
  const maxRetries = 10;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    // Generate random bytes and map to alphabet
    const randomBytesArray = randomBytes(codeLength);
    const code = Array.from(randomBytesArray)
      .map((byte) => alphabet[byte % alphabet.length])
      .join('');

    // Check if code already exists
    const existing = await prisma.booking.findUnique({
      where: { reservationCode: code },
    });

    if (!existing) {
      return code;
    }
  }

  throw new Error('Failed to generate unique reservation code after 10 attempts');
}

export async function createBooking(
  data: CreateBookingInput
): Promise<Booking> {
  // Generate reservation code if this is a guest booking
  let reservationCode: string | null = null;
  if (data.guestEmail) {
    reservationCode = await generateUniqueReservationCode();
  }

  return prisma.booking.create({
    data: {
      clientId: data.clientId ?? null,
      guestName: data.guestName || null,
      guestEmail: data.guestEmail || null,
      guestPhone: data.guestPhone || null,
      reservationCode,
      pickupAddress: data.pickupAddress,
      pickupCity: data.pickupCity,
      pickupLat: data.pickupLat,
      pickupLng: data.pickupLng,
      dropoffAddress: data.dropoffAddress,
      dropoffCity: data.dropoffCity,
      dropoffLat: data.dropoffLat,
      dropoffLng: data.dropoffLng,
      distance: data.distance,
      estimatedDuration: data.estimatedDuration,
      passengers: data.passengers,
      luggage: data.luggage,
      basePrice: data.basePrice,
      price: data.price,
      pricePerKm: data.pricePerKm,
      currency: data.currency,
      requestedVehicleType: data.vehicleType,
      scheduledAt: data.scheduledAt || null,
      clientNotes: data.clientNotes || null,
      isPublic: data.isPublic ?? false,
      createdByDriverId: data.createdByDriverId || null,
      isCpam: data.isCpam ?? false,
      status: 'PENDING',
    },
  });
}

export interface GetBookingsOptions {
  status?: BookingStatus;
  limit?: number;
  offset?: number;
}

export async function getBookingsByClientId(
  clientId: string,
  options?: GetBookingsOptions
): Promise<any[]> {
  const where = options?.status ? { clientId, status: options.status } : { clientId };

  return prisma.booking.findMany({
    where,
    include: {
      driver: {
        select: {
          id: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: options?.limit || 50,
    skip: options?.offset || 0,
  });
}

export async function getBookingById(
  id: string,
  clientId: string
): Promise<Booking | null> {
  return prisma.booking.findUnique({
    where: { id },
  }).then(booking => {
    // Security: only return if booking belongs to this client
    if (booking && booking.clientId === clientId) {
      return booking;
    }
    return null;
  });
}

/**
 * Get all pending bookings that haven't been assigned to a driver yet
 * Only returns PUBLIC bookings (visibility control)
 * Optionally filter by vehicle type
 */
export async function getPendingBookings(
  vehicleType?: string,
  limit: number = 50
): Promise<Booking[]> {
  const where: any = {
    status: 'PENDING',
    driverId: null,
    isPublic: true,
  };

  if (vehicleType) {
    where.requestedVehicleType = vehicleType;
  }

  return prisma.booking.findMany({
    where,
    orderBy: { createdAt: 'asc' },
    take: limit,
  });
}

/**
 * Get bookings assigned to a driver
 */
export async function getBookingsByDriverId(
  driverId: string,
  options?: GetBookingsOptions
): Promise<Booking[]> {
  const where = options?.status ? { driverId, status: options.status } : { driverId };

  return prisma.booking.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: options?.limit || 50,
    skip: options?.offset || 0,
  });
}

/**
 * Assign a driver to a booking (accept a trip)
 * Returns the updated booking
 */
export async function assignDriverToBooking(
  bookingId: string,
  driverId: string,
  vehicleId: string
): Promise<Booking> {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  // Security: verify booking is still pending
  if (!booking || booking.status !== 'PENDING' || booking.driverId !== null) {
    throw new Error('Booking is no longer available');
  }

  return prisma.booking.update({
    where: { id: bookingId },
    data: {
      driverId,
      vehicleId,
      status: 'CONFIRMED',
      confirmedAt: new Date(),
    },
  });
}

/**
 * Update booking status as a driver
 * Validates ownership and valid transitions
 */
export async function updateBookingStatusByDriver(
  bookingId: string,
  driverId: string,
  newStatus: BookingStatus
): Promise<Booking> {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  // Security: verify driver owns this booking
  if (!booking || booking.driverId !== driverId) {
    throw new Error('Booking not found or not authorized');
  }

  // Validate status transitions
  const validTransitions: Record<BookingStatus, BookingStatus[]> = {
    PENDING: [],
    CONFIRMED: ['DRIVER_ARRIVED'],
    DRIVER_ARRIVED: ['IN_PROGRESS'],
    IN_PROGRESS: ['COMPLETED'],
    COMPLETED: [],
    CANCELLED: [],
  };

  if (!validTransitions[booking.status]?.includes(newStatus)) {
    throw new Error(`Cannot transition from ${booking.status} to ${newStatus}`);
  }

  const updateData: any = { status: newStatus };

  // Set timestamps based on status
  if (newStatus === 'DRIVER_ARRIVED') {
    updateData.pickupAt = new Date();
  } else if (newStatus === 'IN_PROGRESS') {
    // Already picked up, just in progress
  } else if (newStatus === 'COMPLETED') {
    updateData.dropoffAt = new Date();
  }

  return prisma.booking.update({
    where: { id: bookingId },
    data: updateData,
  });
}

/**
 * Get upcoming bookings for a driver
 * Shows driver's own bookings + public bookings from other drivers
 * Only returns PENDING and CONFIRMED bookings within the specified days
 */
export async function getUpcomingBookingsForDriver(
  driverId: string,
  days: number = 7
): Promise<Booking[]> {
  const now = new Date();
  const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  return prisma.booking.findMany({
    where: {
      AND: [
        {
          scheduledAt: {
            gte: now,
            lte: futureDate,
          },
        },
        {
          status: {
            in: ['PENDING', 'CONFIRMED'],
          },
        },
        {
          OR: [
            { createdByDriverId: driverId },
            { isPublic: true },
          ],
        },
      ],
    },
    orderBy: { scheduledAt: 'asc' },
  });
}

/**
 * Get calendar bookings for a driver
 * Shows driver's own assigned bookings + public pending bookings
 * For calendar view: includes both scheduled and unscheduled bookings
 */
export async function getCalendarBookingsForDriver(
  driverId: string,
  from?: Date,
  to?: Date
): Promise<Booking[]> {
  const where: any = {
    OR: [
      // Driver's own assigned bookings
      { driverId },
      // Public pending bookings available for any driver
      {
        isPublic: true,
        status: 'PENDING',
        driverId: null,
      },
    ],
  };

  // Add date range filter if provided (check both scheduledAt and createdAt)
  if (from || to) {
    where.AND = [
      {
        OR: [
          {
            scheduledAt: {
              gte: from,
              lte: to,
            },
          },
          {
            createdAt: {
              gte: from,
              lte: to,
            },
          },
        ],
      },
    ];
  }

  return prisma.booking.findMany({
    where,
    orderBy: { scheduledAt: 'desc' },
  });
}

/**
 * Get a guest booking by reservation code + email verification
 * Double-checks both the code (unique) and email (case-insensitive) for security
 * Returns booking with driver info if assigned, excluding guestEmail (PII)
 */
export async function getBookingByReservationCode(
  code: string,
  email: string
): Promise<
  | (Booking & {
      driver?: {
        user: {
          name: string;
        };
      } | null;
    })
  | null
> {
  const booking = await prisma.booking.findUnique({
    where: { reservationCode: code },
    include: {
      driver: {
        select: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  // Verify email matches (case-insensitive) for security
  if (
    booking &&
    booking.guestEmail &&
    booking.guestEmail.toLowerCase() === email.toLowerCase()
  ) {
    // Remove guestEmail from returned data (don't re-expose PII)
    const { guestEmail, ...bookingWithoutEmail } = booking;
    return bookingWithoutEmail as any;
  }

  return null;
}
