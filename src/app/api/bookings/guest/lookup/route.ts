import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getBookingByReservationCode } from '@/persistence/queries/bookingQueries';

const LookupQuerySchema = z.object({
  code: z.string().regex(/^[A-Z0-9]{6}$/, 'Invalid reservation code format'),
  email: z.string().email('Invalid email'),
});

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
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
