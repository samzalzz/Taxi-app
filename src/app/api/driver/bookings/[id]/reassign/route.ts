import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getDriverByUserId } from '@/persistence/queries/driverQueries';
import { prisma } from '@/persistence/client';

interface ReassignRequest {
  newDriverId: string;
}

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  const params = await props.params;
  try {
    const session = await getSession();
    if (!session || session.role !== 'DRIVER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const currentDriver = await getDriverByUserId(session.userId);
    if (!currentDriver) {
      return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
    }

    const body = (await request.json()) as ReassignRequest;
    const { newDriverId } = body;

    if (!newDriverId) {
      return NextResponse.json(
        { error: 'New driver ID required' },
        { status: 400 }
      );
    }

    // Get booking and verify it belongs to current driver
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (booking.driverId !== currentDriver.id) {
      return NextResponse.json(
        { error: 'You are not assigned to this booking' },
        { status: 403 }
      );
    }

    // Check if booking can be reassigned (must be CONFIRMED or DRIVER_ARRIVED)
    if (!['CONFIRMED', 'DRIVER_ARRIVED'].includes(booking.status)) {
      return NextResponse.json(
        { error: 'Can only reassign CONFIRMED or DRIVER_ARRIVED bookings' },
        { status: 400 }
      );
    }

    // Get new driver and verify they have a vehicle
    const newDriver = await prisma.driver.findUnique({
      where: { id: newDriverId },
    });

    if (!newDriver) {
      return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
    }

    if (!newDriver.vehicleId) {
      return NextResponse.json(
        { error: 'New driver has no vehicle assigned' },
        { status: 400 }
      );
    }

    // Reassign booking to new driver
    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        driverId: newDriverId,
        vehicleId: newDriver.vehicleId,
        // Keep status as is (CONFIRMED or DRIVER_ARRIVED)
      },
      include: {
        driver: {
          select: {
            id: true,
            user: { select: { name: true } },
          },
        },
      },
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error('Reassign booking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
