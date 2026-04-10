import { NextRequest, NextResponse } from 'next/server';
import { createNotification } from '@/lib/notifications/createNotification';
import { prisma } from '@/persistence/client';
import { verifyToken } from '@/lib/auth/jwt';

/**
 * POST /api/bookings/[id]/rating
 * Client or Driver submits a rating for a completed booking
 */
export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const token = req.cookies.get('auth-session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await req.json();
    const { role, ratingValue, review } = body;

    if (!['client', 'driver'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be "client" or "driver"' },
        { status: 400 }
      );
    }

    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Verify the booking exists and belongs to the user
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: { client: true, driver: true },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Check user is authorized to rate this booking
    const isClient = booking.clientId === decoded.userId;
    const isDriver = booking.driver?.userId === decoded.userId;

    if (!isClient && !isDriver) {
      return NextResponse.json(
        { error: 'Not authorized to rate this booking' },
        { status: 403 }
      );
    }

    // Verify booking is completed
    if (booking.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Can only rate completed bookings' },
        { status: 400 }
      );
    }

    // Prevent double-rating by same person
    if (role === 'client' && booking.driverRating !== null) {
      return NextResponse.json(
        { error: 'You have already rated this trip' },
        { status: 400 }
      );
    }

    if (role === 'driver' && booking.clientRating !== null) {
      return NextResponse.json(
        { error: 'You have already rated this client' },
        { status: 400 }
      );
    }

    // Update booking with rating
    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data:
        role === 'client'
          ? {
              driverRating: ratingValue,
              driverReview: review || null,
            }
          : {
              clientRating: ratingValue,
              clientReview: review || null,
            },
    });

    // Update driver's overall rating if client is rating driver
    if (role === 'client' && booking.driver && booking.driverId) {
      const driverBookings = await prisma.booking.findMany({
        where: {
          driverId: booking.driverId,
          driverRating: { not: null },
          status: 'COMPLETED',
        },
        select: { driverRating: true },
      });

      const avgRating =
        driverBookings.length > 0
          ? driverBookings.reduce((sum, b) => sum + (b.driverRating || 0), 0) /
            driverBookings.length
          : 5.0;

      await prisma.driver.update({
        where: { id: booking.driverId },
        data: { rating: Math.round(avgRating * 10) / 10 },
      });

      // Notify driver of new rating
      createNotification({
        userId: booking.driver.userId,
        type: 'NEW_RATING',
        title: 'Nouvel avis',
        message: `Vous avez reçu un nouvel avis pour votre trajet de ${booking.pickupAddress} à ${booking.dropoffAddress}. Note: ${ratingValue}★`,
        data: { bookingId: booking.id },
      });
    }

    return NextResponse.json(updatedBooking, { status: 200 });
  } catch (error) {
    console.error('Rating submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit rating' },
      { status: 500 }
    );
  }
}
