import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { createNotification } from '@/lib/notifications/createNotification';
import { prisma } from '@/persistence/client';

export async function POST(_: unknown, props: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  const params = await props.params;
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
    });

    // Security: verify ownership
    if (!booking || booking.clientId !== session.userId) {
      return NextResponse.json({ error: 'Booking not found or not authorized' }, { status: 404 });
    }

    // Can only cancel pending or confirmed bookings
    if (!['PENDING', 'CONFIRMED'].includes(booking.status)) {
      return NextResponse.json(
        { error: `Cannot cancel booking with status ${booking.status}` },
        { status: 400 }
      );
    }

    const updated = await prisma.booking.update({
      where: { id: params.id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancelReason: 'Cancelled by client',
      },
    });

    // Notify driver if one was assigned
    if (updated.driverId) {
      const driver = await prisma.driver.findUnique({
        where: { id: updated.driverId },
      });
      if (driver) {
        createNotification({
          userId: driver.userId,
          type: 'BOOKING_CANCELLED',
          title: 'Course annulée',
          message: `La course de ${updated.pickupAddress} à ${updated.dropoffAddress} a été annulée par le client.`,
          data: { bookingId: updated.id },
        });
      }
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Cancel booking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
