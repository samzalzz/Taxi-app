import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth/session';
import { createBooking } from '@/persistence/queries/bookingQueries';
import { createUser } from '@/persistence/queries/userQueries';
import { getPricingConfig } from '@/persistence/queries/pricingQueries';
import { calculateDistance, calculateTieredPrice, estimateDuration } from '@/lib/utils/pricing';
import { prisma } from '@/persistence/client';

const CreateDriverBookingSchema = z.object({
  clientName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  clientPhone: z.string().min(1, 'Téléphone requis'),
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
  isPublic: z.boolean().default(false),
  isCpam: z.boolean().default(false),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only drivers can create bookings for clients
    if (session.role !== 'DRIVER') {
      return NextResponse.json(
        { error: 'Seuls les conducteurs peuvent créer des courses' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validated = CreateDriverBookingSchema.parse(body);

    // Find existing client by phone, or create one
    let client: any = await prisma.user.findFirst({
      where: {
        phone: validated.clientPhone,
        role: 'CLIENT',
      },
    });

    if (!client) {
      // Create a new temporary CLIENT account
      // Generate a temporary email based on phone number
      const tempEmail = `client-${validated.clientPhone.replace(/\s/g, '')}-${Date.now()}@taxi-leblanc.fr`;
      // Generate a random temporary password
      const tempPassword = Math.random().toString(36).substring(2, 15);

      client = await createUser(
        tempEmail,
        validated.clientName,
        tempPassword,
        validated.clientPhone,
        'CLIENT'
      );
    }

    // Calculate distance and price server-side
    const distance = calculateDistance(
      validated.pickupLat,
      validated.pickupLng,
      validated.dropoffLat,
      validated.dropoffLng
    );

    const estimatedDuration = estimateDuration(distance);

    const pricingConfig = await getPricingConfig();
    const { basePrice, price, pricePerKm } = calculateTieredPrice(
      validated.vehicleType,
      distance,
      pricingConfig
    );

    // Create the booking
    const booking = await createBooking({
      clientId: client.id,
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
      isPublic: validated.isPublic,
      createdByDriverId: session.userId,
      isCpam: validated.isCpam,
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Driver booking API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
