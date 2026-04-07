import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getPricingConfig, updatePricingConfig, UpdatePricingInput } from '@/persistence/queries/pricingQueries';
import { z } from 'zod';

const updatePricingSchema = z.object({
  pricePerKm: z.number().positive().optional(),
  pickupCharge: z.number().positive().optional(),
  minimumPrice: z.number().positive().optional(),
  maximumHourlyRate: z.number().positive().optional(),
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
        { error: 'Validation error', details: error.errors },
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
