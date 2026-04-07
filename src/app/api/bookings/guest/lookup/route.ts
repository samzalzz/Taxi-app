import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getBookingByReservationCode } from '@/persistence/queries/bookingQueries';
import { checkRateLimit } from '@/lib/auth/rateLimit';

const LookupQuerySchema = z.object({
  code: z.string().regex(/^[A-Z0-9]{10}$/, 'Invalid reservation code format'),
  email: z.string().email('Invalid email'),
});

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Rate limit by IP to prevent brute force attacks
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown';

    // Max 10 lookup attempts per 15 minutes per IP
    if (!checkRateLimit(ip, { maxAttempts: 10, windowMs: 15 * 60 * 1000 })) {
      return NextResponse.json(
        { error: 'Trop de tentatives. Veuillez réessayer dans 15 minutes.' },
        { status: 429 }
      );
    }

    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const email = url.searchParams.get('email');

    // Validate query parameters
    const validated = LookupQuerySchema.parse({ code, email });

    // Look up booking by code and verify email
    const booking = await getBookingByReservationCode(validated.code, validated.email);

    if (!booking) {
      return NextResponse.json(
        { error: 'Réservation introuvable' },
        { status: 404 }
      );
    }

    // Return booking details with optional driver name
    return NextResponse.json({
      id: booking.id,
      reservationCode: booking.reservationCode,
      pickupAddress: booking.pickupAddress,
      pickupCity: booking.pickupCity,
      dropoffAddress: booking.dropoffAddress,
      dropoffCity: booking.dropoffCity,
      status: booking.status,
      price: booking.price,
      currency: booking.currency,
      distance: booking.distance,
      estimatedDuration: booking.estimatedDuration,
      passengers: booking.passengers,
      luggage: booking.luggage,
      scheduledAt: booking.scheduledAt,
      driverName: booking.driver?.user.name || null,
      createdAt: booking.createdAt,
      pickupAt: booking.pickupAt,
      dropoffAt: booking.dropoffAt,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Booking lookup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
