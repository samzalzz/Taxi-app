import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createBooking } from '@/persistence/queries/bookingQueries';
import { calculateDistance, calculatePrice, estimateDuration } from '@/lib/utils/pricing';
import { sendGuestBookingConfirmationEmail } from '@/lib/email/mailer';
import { VehicleType } from '@/generated/prisma/client';

const CoordinateSchema = z.number().min(-180).max(180).finite();
const LatitudeSchema = z.number().min(-90).max(90).finite();

const CreateGuestBookingSchema = z.object({
  guestName: z.string().trim().min(2, 'Nom requis'),
  guestEmail: z.string().trim().toLowerCase().email('Email invalide'),
  guestPhone: z.string().trim().min(9, 'Téléphone invalide'),
  pickupAddress: z.string().trim().min(1, 'Adresse de départ requise'),
  pickupCity: z.string().trim().min(1, 'Ville de départ requise'),
  pickupLat: LatitudeSchema,
  pickupLng: CoordinateSchema,
  dropoffAddress: z.string().trim().min(1, 'Adresse de destination requise'),
  dropoffCity: z.string().trim().min(1, 'Ville de destination requise'),
  dropoffLat: LatitudeSchema,
  dropoffLng: CoordinateSchema,
  passengers: z.number().int().min(1).max(8).default(1),
  luggage: z.boolean().default(false),
  vehicleType: z.enum(['BERLINE', 'SUV', 'VAN', 'PREMIUM'] as const),
  scheduledAt: z.union([
    z.string().datetime(),
    z.string().nullable(),
    z.null()
  ]).optional(),
  clientNotes: z.string().trim().max(500).default('').optional(),
  isCpam: z.boolean().default(false),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const validated = CreateGuestBookingSchema.parse(body);

    // Calculate distance and price server-side (never trust client)
    const distance = calculateDistance(
      validated.pickupLat,
      validated.pickupLng,
      validated.dropoffLat,
      validated.dropoffLng
    );

    const estimatedDuration = estimateDuration(distance);
    const { basePrice, price, pricePerKm } = calculatePrice(
      validated.vehicleType as VehicleType,
      distance
    );

    // Create guest booking (generates unique reservation code)
    const booking = await createBooking({
      guestName: validated.guestName,
      guestEmail: validated.guestEmail,
      guestPhone: validated.guestPhone,
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
      vehicleType: validated.vehicleType as VehicleType,
      basePrice,
      price,
      pricePerKm,
      currency: 'EUR',
      scheduledAt: validated.scheduledAt ? new Date(validated.scheduledAt) : null,
      clientNotes: validated.clientNotes,
      isCpam: validated.isCpam,
    });

    // Send confirmation email (fire-and-forget)
    try {
      if (booking.guestEmail && booking.reservationCode) {
        await sendGuestBookingConfirmationEmail(
          booking.guestEmail,
          booking.guestName || 'Guest',
          booking,
          booking.reservationCode
        );
      }
    } catch (emailError) {
      console.error('Failed to send guest booking confirmation email:', emailError);
      // Not rethrown — booking already succeeded
    }

    return NextResponse.json(
      {
        id: booking.id,
        reservationCode: booking.reservationCode,
        pickupAddress: booking.pickupAddress,
        dropoffAddress: booking.dropoffAddress,
        price: booking.price,
        currency: booking.currency,
        distance: booking.distance,
        estimatedDuration: booking.estimatedDuration,
        status: booking.status,
        scheduledAt: booking.scheduledAt,
        createdAt: booking.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Guest booking API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
