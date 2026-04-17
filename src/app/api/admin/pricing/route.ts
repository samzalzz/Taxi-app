import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getPricingConfig, updatePricingConfig, UpdatePricingInput } from '@/persistence/queries/pricingQueries';
import { z } from 'zod';

const updatePricingSchema = z.object({
  // Base pricing
  pricePerKm: z.number().positive().optional(),
  pickupCharge: z.number().positive().optional(),
  minimumPrice: z.number().positive().optional(),
  maximumHourlyRate: z.number().positive().optional(),

  // Tiered per-km rates
  tier1PricePerKm: z.number().positive().optional(),
  tier2PricePerKm: z.number().positive().optional(),
  tier3PricePerKm: z.number().positive().optional(),
  tier4PricePerKm: z.number().positive().optional(),

  // Vehicle multipliers
  vehicleMultiplierBerline: z.number().positive().optional(),
  vehicleMultiplierSuv: z.number().positive().optional(),
  vehicleMultiplierVan: z.number().positive().optional(),
  vehicleMultiplierPremium: z.number().positive().optional(),

  // CPAM pricing
  cpamPricePerKm: z.number().positive().optional(),
  cpamPickupCharge: z.number().positive().optional(),
  cpamMinimumPrice: z.number().positive().optional(),

  // Airport rates
  airportCdgPrice: z.number().positive().optional(),
  airportOrlyPrice: z.number().positive().optional(),
  airportBeauvaisPrice: z.number().positive().optional(),

  // CPAM airport rates
  cpamAirportCdgPrice: z.number().positive().optional(),
  cpamAirportOrlyPrice: z.number().positive().optional(),
  cpamAirportBeauvaisPrice: z.number().positive().optional(),

  // Reservation fees
  reservationImmediateFee: z.number().nonnegative().optional(),
  reservationAdvanceFee: z.number().nonnegative().optional(),
});

export async function GET(_: NextRequest): Promise<NextResponse> {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const config = await getPricingConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error('Pricing GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = updatePricingSchema.parse(body);

    const config = await updatePricingConfig(validatedData as UpdatePricingInput);
    return NextResponse.json(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Pricing PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
