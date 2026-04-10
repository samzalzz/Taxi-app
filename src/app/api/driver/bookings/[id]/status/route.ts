import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth/session';
import { getDriverByUserId, updateDriverStatus } from '@/persistence/queries/driverQueries';
import { updateBookingStatusByDriver } from '@/persistence/queries/bookingQueries';
import { createNotification } from '@/lib/notifications/createNotification';
import { prisma } from '@/persistence/client';
import { BookingStatus } from '@prisma/client';

const UpdateStatusSchema = z.object({
  status: z.enum(['DRIVER_ARRIVED', 'IN_PROGRESS', 'COMPLETED'] as const),
});

export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  const params = await props.params;
  try {
    const session = await getSession();
    if (!session || session.role !== 'DRIVER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const driver = await getDriverByUserId(session.userId);
    if (!driver) {
      return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
    }

    const body = await request.json();
    const { status } = UpdateStatusSchema.parse(body);

    // Update booking status
    const booking = await updateBookingStatusByDriver(
      params.id,
      driver.id,
      status as BookingStatus
    );

    // Send notifications based on status
    if (booking.clientId) {
      switch (status) {
        case 'DRIVER_ARRIVED':
          createNotification({
            userId: booking.clientId,
            type: 'DRIVER_ARRIVED',
            title: 'Chauffeur arrivé',
            message: `Votre chauffeur est arrivé à ${booking.pickupAddress}`,
            data: { bookingId: booking.id },
          });
          break;
        case 'IN_PROGRESS':
          createNotification({
            userId: booking.clientId,
            type: 'TRIP_STARTED',
            title: 'Trajet commencé',
            message: `Votre trajet a commencé vers ${booking.dropoffAddress}`,
            data: { bookingId: booking.id },
          });
          break;
        case 'COMPLETED':
          createNotification({
            userId: booking.clientId,
            type: 'TRIP_COMPLETED',
            title: 'Trajet terminé',
            message: `Votre trajet vers ${booking.dropoffAddress} est terminé. Total: ${booking.price}€`,
            data: { bookingId: booking.id },
          });
          break;
      }
    }

    // If trip is completed, set driver back to AVAILABLE and update stats
    if (status === 'COMPLETED') {
      await updateDriverStatus(driver.id, 'AVAILABLE');

      // Update driver stats
      await prisma.driver.update({
        where: { id: driver.id },
        data: {
          totalTrips: { increment: 1 },
          totalEarnings: { increment: booking.price },
        },
      });
    }

    return NextResponse.json(booking);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    const status = msg.includes('Cannot transition') ? 400 : 500;
    console.error('Update booking status error:', error);
    return NextResponse.json({ error: msg }, { status });
  }
}
