import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/persistence/client';
import { z } from 'zod';

const SubmitReviewSchema = z.object({
  bookingId: z.string().min(1),
  revieweeId: z.string().min(1),
  role: z.enum(['client', 'driver']),
  overallRating: z.number().int().min(1).max(5),
  punctualityRating: z.number().int().min(1).max(5).optional(),
  cleanlinessRating: z.number().int().min(1).max(5).optional(),
  politenessRating: z.number().int().min(1).max(5).optional(),
  safetyRating: z.number().int().min(1).max(5).optional(),
  comment: z.string().max(1000).optional(),
});

/**
 * POST /api/reviews
 * Submit a detailed review for a completed booking.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validated = SubmitReviewSchema.parse(body);

    // Verify booking exists and user is part of it
    const booking = await prisma.booking.findUnique({
      where: { id: validated.bookingId },
      include: {
        client: { select: { id: true } },
        driver: { select: { id: true, userId: true } },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Verify user is part of booking
    const isClient = booking.clientId === session.userId;
    const isDriver = booking.driver?.userId === session.userId;
    if (!isClient && !isDriver) {
      return NextResponse.json(
        { error: 'Not authorized to review this booking' },
        { status: 403 }
      );
    }

    // Verify booking is completed
    if (booking.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Can only review completed bookings' },
        { status: 400 }
      );
    }

    // Check if user already reviewed this booking
    const existingReview = await prisma.review.findFirst({
      where: {
        bookingId: validated.bookingId,
        reviewerId: session.userId,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this booking' },
        { status: 400 }
      );
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        bookingId: validated.bookingId,
        reviewerId: session.userId,
        revieweeId: validated.revieweeId,
        role: validated.role,
        overallRating: validated.overallRating,
        punctualityRating: validated.punctualityRating,
        cleanlinessRating: validated.cleanlinessRating,
        politenessRating: validated.politenessRating,
        safetyRating: validated.safetyRating,
        comment: validated.comment,
      },
      include: {
        reviewer: { select: { id: true, name: true } },
        reviewee: { select: { id: true, name: true } },
      },
    });

    // Update driver rating if this is a client reviewing a driver
    if (validated.role === 'driver' && booking.driver) {
      const allDriverReviews = await prisma.review.findMany({
        where: {
          revieweeId: validated.revieweeId,
          role: 'driver',
        },
        select: { overallRating: true },
      });

      const avgRating =
        allDriverReviews.length > 0
          ? Math.round(
              (allDriverReviews.reduce((sum, r) => sum + r.overallRating, 0) /
                allDriverReviews.length) *
                10
            ) / 10
          : 5.0;

      await prisma.driver.update({
        where: { userId: validated.revieweeId },
        data: { rating: avgRating },
      });
    }

    // Notify reviewee of new review
    const { createNotification } = await import('@/lib/notifications/createNotification');
    createNotification({
      userId: validated.revieweeId,
      type: 'NEW_RATING',
      title: 'Nouvel avis',
      message: `Vous avez reçu un nouvel avis avec une note de ${validated.overallRating}★`,
      data: { bookingId: validated.bookingId },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('[Reviews POST]', error);
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/reviews?userId=...&role=...
 * Get reviews for a user (as reviewee).
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const role = request.nextUrl.searchParams.get('role') || 'driver';

    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter required' },
        { status: 400 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: {
        revieweeId: userId,
        role,
      },
      include: {
        reviewer: { select: { id: true, name: true, avatar: true } },
        booking: { select: { pickupAddress: true, dropoffAddress: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate averages
    const avgRatings = {
      overall:
        reviews.length > 0
          ? Math.round(
              (reviews.reduce((sum, r) => sum + r.overallRating, 0) /
                reviews.length) *
                10
            ) / 10
          : 0,
      punctuality:
        reviews.filter((r) => r.punctualityRating).length > 0
          ? Math.round(
              (reviews
                .filter((r) => r.punctualityRating)
                .reduce((sum, r) => sum + (r.punctualityRating || 0), 0) /
                reviews.filter((r) => r.punctualityRating).length) *
                10
            ) / 10
          : 0,
      cleanliness:
        reviews.filter((r) => r.cleanlinessRating).length > 0
          ? Math.round(
              (reviews
                .filter((r) => r.cleanlinessRating)
                .reduce((sum, r) => sum + (r.cleanlinessRating || 0), 0) /
                reviews.filter((r) => r.cleanlinessRating).length) *
                10
            ) / 10
          : 0,
      politeness:
        reviews.filter((r) => r.politenessRating).length > 0
          ? Math.round(
              (reviews
                .filter((r) => r.politenessRating)
                .reduce((sum, r) => sum + (r.politenessRating || 0), 0) /
                reviews.filter((r) => r.politenessRating).length) *
                10
            ) / 10
          : 0,
      safety:
        reviews.filter((r) => r.safetyRating).length > 0
          ? Math.round(
              (reviews
                .filter((r) => r.safetyRating)
                .reduce((sum, r) => sum + (r.safetyRating || 0), 0) /
                reviews.filter((r) => r.safetyRating).length) *
                10
            ) / 10
          : 0,
    };

    return NextResponse.json({
      reviews,
      count: reviews.length,
      avgRatings,
    });
  } catch (error) {
    console.error('[Reviews GET]', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
