import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth/session';
import { createBooking, getBookingsByClientId } from '@/persistence/queries/bookingQueries';
import { calculateDistance, calculatePrice, estimateDuration } from '@/lib/utils/pricing';
import { getUserById } from '@/persistence/queries/userQueries';
import { getEmailTemplate } from '@/persistence/queries/appConfigQueries';
import { sendBookingConfirmationEmail } from '@/lib/email/mailer';
import { BookingStatus } from '@prisma/client';

const CreateBookingSchema = z.object({
  pickupAddress: z.string().min(1, 'Adresse de départ requise'),
  pickupCity: z.string().min(1, 'Ville de départ requise'),
  pickupLat: z.number(),
  pickupLng: z.number(),
  dropoffAddress: z.string().min(1, 'Adresse de destination requise'),
  dropoffCity: z.string().min(1, 'Ville de destination requise'),
  dropoffLat: z.number(),
  dropoffLng: z.number(),
  passengers: z.number().int().min(1).max(8),
  luggage: z.boolean().default(false),
  vehicleType: z.enum(['BERLINE', 'SUV', 'VAN', 'PREMIUM']),
  scheduledAt: z.string().datetime().optional().nullable(),
  clientNotes: z.string().max(500).optional(),
  isCpam: z.boolean().default(false),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = CreateBookingSchema.parse(body);

    // Calculate distance and price server-side (never trust client)
    const distance = calculateDistance(
      validated.pickupLat,
      validated.pickupLng,
      validated.dropoffLat,
      validated.dropoffLng
    );

    const estimatedDuration = estimateDuration(distance);
    const { basePrice, price, pricePerKm } = calculatePrice(
      validated.vehicleType,
      distance
    );

    const booking = await createBooking({
      clientId: session.userId,
      pickupAddress: validated.pickupAddress,
      pickupCity: validated.pickupCity,
      pickupLat: validated.pickupLat,
      pickupLng: validated.pickupLng,
      dropoffAddress: validated.dropoffAddress,
      dropoffCity: validated.dropoffCity,
      dropoffLat: validated.dropoffLat,
      dropoffLng: validated.dropoffLng,
      distance,
      estimatedDuration,
      passengers: validated.passengers,
      luggage: validated.luggage,
      vehicleType: validated.vehicleType,
      basePrice,
      price,
      pricePerKm,
      currency: 'EUR',
      scheduledAt: validated.scheduledAt ? new Date(validated.scheduledAt) : null,
      clientNotes: validated.clientNotes,
      isCpam: validated.isCpam,
    });

    // Send booking confirmation email (fire-and-forget)
    try {
      const [user, template] = await Promise.all([
        getUserById(session.userId),
        getEmailTemplate(),
      ]);
      if (user?.email) {
        await sendBookingConfirmationEmail(user.email, user.name, booking, template);
      }
    } catch (emailError) {
      console.error('Failed to send booking confirmation:', emailError);
      // Not rethrown — booking already succeeded
    }

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Booking API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const status = url.searchParams.get('status') as BookingStatus | null;
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);

    const bookings = await getBookingsByClientId(session.userId, {
      status: status || undefined,
      limit,
      offset,
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
