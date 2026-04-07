import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/persistence/client';

export async function GET(): Promise<NextResponse> {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get all drivers with their info and vehicle
    const drivers = await prisma.driver.findMany({
      select: {
        id: true,
        status: true,
        rating: true,
        totalTrips: true,
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        vehicle: {
          select: {
            id: true,
            type: true,
            brand: true,
            model: true,
            plateNumber: true,
          },
        },
      },
      orderBy: [
        { status: 'asc' }, // AVAILABLE first
        { rating: 'desc' },
      ],
    });

    return NextResponse.json(drivers);
  } catch (error) {
    console.error('Get available drivers error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
