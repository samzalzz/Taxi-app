import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { createNotification } from '@/lib/notifications/createNotification';
import { prisma } from '@/persistence/client';
import { z } from 'zod';

const assignDriverSchema = z.object({
  driverId: z.string().min(1, 'Driver ID required'),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { driverId } = assignDriverSchema.parse(body);

    // Get driver and their vehicle
    const driver = await prisma.driver.findUnique({
      where: { id: driverId },
      select: { id: true, vehicleId: true },
    });

    if (!driver) {
      return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
    }

    if (!driver.vehicleId) {
      return NextResponse.json(
        { error: 'Driver has no vehicle assigned' },
        { status: 400 }
      );
    }

    // Get booking and verify it's PENDING
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (booking.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Can only assign driver to PENDING bookings' },
        { status: 400 }
      );
    }

    // Assign driver to booking
    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        driverId,
        vehicleId: driver.vehicleId,
        status: 'CONFIRMED',
        confirmedAt: new Date(),
      },
      include: {
        driver: {
          select: {
            id: true,
            userId: true,
            user: { select: { name: true } },
          },
        },
      },
    });

    // Notify client that driver is assigned
    if (updatedBooking.clientId) {
      createNotification({
        userId: updatedBooking.clientId,
        type: 'DRIVER_ASSIGNED',
        title: 'Chauffeur assigné',
        message: `Un chauffeur (${updatedBooking.driver?.user.name}) a été assigné à votre course de ${updatedBooking.pickupAddress} à ${updatedBooking.dropoffAddress}.`,
        data: { bookingId: updatedBooking.id, driverId: updatedBooking.driverId },
      });
    }

    // Auto-create conversation between client and driver
    if (updatedBooking.clientId && updatedBooking.driver?.userId) {
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
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Assign driver error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
