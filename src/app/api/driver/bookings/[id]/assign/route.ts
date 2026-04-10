import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/persistence/client';

const AssignBookingSchema = z.object({
  driverId: z.string().min(1, 'Driver ID required'),
});

export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  const params = await props.params;
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only drivers can assign
    if (session.role !== 'DRIVER') {
      return NextResponse.json(
        { error: 'Only drivers can assign bookings' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validated = AssignBookingSchema.parse(body);

    const bookingId = params.id;

    // Fetch the booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    // Security: verify the current driver created this booking
    if (!booking || booking.createdByDriverId !== session.userId) {
      return NextResponse.json(
        { error: 'You are not authorized to assign this booking' },
        { status: 403 }
      );
    }

    // Verify booking is still pending and private
    if (booking.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Only pending bookings can be assigned' },
        { status: 400 }
      );
    }

    if (booking.isPublic) {
      return NextResponse.json(
        { error: 'Cannot assign a public booking' },
        { status: 400 }
      );
    }

    // Verify target driver exists and is a driver
    const targetDriver = await prisma.driver.findUnique({
      where: { id: validated.driverId },
      include: { user: true },
    });

    if (!targetDriver) {
      return NextResponse.json(
        { error: 'Driver not found' },
        { status: 404 }
      );
    }

    // Assign the booking to the target driver
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        driverId: validated.driverId,
        status: 'CONFIRMED',
        confirmedAt: new Date(),
      },
    });

    return NextResponse.json(updatedBooking, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Assign booking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
