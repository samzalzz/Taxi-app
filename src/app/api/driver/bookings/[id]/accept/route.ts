import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getDriverByUserId, updateDriverStatus } from '@/persistence/queries/driverQueries';
import { assignDriverToBooking } from '@/persistence/queries/bookingQueries';
import { createNotification } from '@/lib/notifications/createNotification';

export async function POST(
  _: unknown,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const session = await getSession();
    if (!session || session.role !== 'DRIVER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const driver = await getDriverByUserId(session.userId);
    if (!driver) {
      return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
    }

    if (!driver.vehicleId) {
      return NextResponse.json({ error: 'Driver has no vehicle' }, { status: 400 });
    }

    // Assign driver to booking
    const booking = await assignDriverToBooking(params.id, driver.id, driver.vehicleId);

    // Update driver status to BUSY
    await updateDriverStatus(driver.id, 'BUSY');

    // Notify client that booking is confirmed
    if (booking.clientId) {
      createNotification({
        userId: booking.clientId,
        type: 'BOOKING_CONFIRMED',
        title: 'Course confirmée',
        message: `Votre course de ${booking.pickupAddress} à ${booking.dropoffAddress} a été confirmée par un chauffeur.`,
        data: { bookingId: booking.id },
      });
    }

    return NextResponse.json(booking);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    const status = msg.includes('no longer available') ? 400 : 500;
    console.error('Accept booking error:', error);
    return NextResponse.json({ error: msg }, { status });
  }
}
