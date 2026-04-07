import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/persistence/client';

/**
 * GET /api/drivers/[id]
 * Fetch public driver information
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const driver = await prisma.driver.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        rating: true,
        totalTrips: true,
        user: {
          select: {
            name: true,
            phone: true,
          },
        },
        vehicle: {
          select: {
            type: true,
            brand: true,
            model: true,
          },
        },
      },
    });

    if (!driver) {
      return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
    }

    return NextResponse.json(driver, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch driver:', error);
    return NextResponse.json(
      { error: 'Failed to fetch driver' },
      { status: 500 }
    );
  }
}
