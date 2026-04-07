import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/persistence/client';

/**
 * GET /api/driver/list
 * Returns a list of all drivers except the current user.
 * Used to populate the "Nouveau message" modal for driver-to-driver messaging.
 */
export async function GET(_request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const drivers = await prisma.user.findMany({
      where: {
        role: 'DRIVER',
        id: {
          not: session.userId,
        },
      },
      select: {
        id: true,
        name: true,
        avatar: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({ drivers });
  } catch (error) {
    console.error('[Driver List GET]', error);
    return NextResponse.json(
      { error: 'Failed to fetch drivers' },
      { status: 500 }
    );
  }
}
