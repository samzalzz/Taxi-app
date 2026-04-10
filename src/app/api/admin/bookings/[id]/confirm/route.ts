import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/persistence/client';
import { z } from 'zod';
import { BookingStatus } from '@/generated/prisma/client';

const confirmSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'DRIVER_ARRIVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const),
});

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  const params = await props.params;
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { status } = confirmSchema.parse(body);

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Update booking status
    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        status: status as BookingStatus,
        confirmedAt: status === 'CONFIRMED' ? new Date() : booking.confirmedAt,
      },
      include: {
        driver: {
          select: {
            id: true,
            userId: true,
            user: { select: { name: true } },
          },
        },
        conversation: true,
      },
    });

    // Auto-create conversation if booking is confirmed and has both client and driver
    if (
      status === 'CONFIRMED' &&
      updatedBooking.clientId &&
      updatedBooking.driver?.userId &&
      !updatedBooking.conversation
    ) {
      try {
        await prisma.conversation.create({
          data: {
            bookingId: params.id,
            type: 'RIDE',
            participants: {
              create: [
                { userId: updatedBooking.clientId },
                { userId: updatedBooking.driver.userId },
              ],
            },
          },
        });
      } catch (error) {
        // Conversation might already exist, ignore the error
        if (!(error instanceof Error && error.message.includes('Unique constraint'))) {
          console.error('[Conversation Creation]', error);
        }
      }
    }

    return NextResponse.json(updatedBooking);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Admin confirm booking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
