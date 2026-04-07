import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/persistence/client';
import { z } from 'zod';

const updateVisibilitySchema = z.object({
  bookingId: z.string().min(1),
  isPublic: z.boolean(),
});

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { bookingId, isPublic } = updateVisibilitySchema.parse(body);

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { isPublic },
    });

    return NextResponse.json({
      id: booking.id,
      isPublic: booking.isPublic,
      message: 'Visibilité mise à jour',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Visibility update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
