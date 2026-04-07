import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getDriverByUserId } from '@/persistence/queries/driverQueries';
import { getBookingsByDriverId, getPendingBookings, getUpcomingBookingsForDriver } from '@/persistence/queries/bookingQueries';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getSession();
    if (!session || session.role !== 'DRIVER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const driver = await getDriverByUserId(session.userId);
    if (!driver) {
      return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
    }

    const url = new URL(request.url);
    const type = url.searchParams.get('type'); // 'pending' or 'assigned'
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);

    let bookings;
    if (type === 'pending') {
      // Available pending bookings matching driver's vehicle type
      let vehicleType: string | undefined;
      if (driver.vehicleId) {
        const vehicle = await (await import('@/persistence/client')).prisma.vehicle.findUnique({
          where: { id: driver.vehicleId },
        });
        vehicleType = vehicle?.type;
      }

      bookings = await getPendingBookings(vehicleType, limit);
    } else if (type === 'upcoming') {
      // Upcoming scheduled bookings (7 days)
      bookings = await getUpcomingBookingsForDriver(driver.id, 7);
    } else if (type === 'assigned' || !type) {
      // Driver's assigned bookings (default)
      const status = url.searchParams.get('status');
      const options = status ? { status: status as any, limit } : { limit };
      bookings = await getBookingsByDriverId(driver.id, options);
    }

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Get driver bookings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
