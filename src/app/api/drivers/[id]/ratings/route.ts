import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/persistence/client';

/**
 * GET /api/drivers/[id]/ratings
 * Fetch driver's rating summary and recent reviews
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get driver's overall rating
    const driver = await prisma.driver.findUnique({
      where: { id: params.id },
      select: {
        rating: true,
        totalTrips: true,
        userId: true,
      },
    });

    if (!driver) {
      return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
    }

    // Get recent reviews (last 10)
    const reviews = await prisma.booking.findMany({
      where: {
        driverId: params.id,
        status: 'COMPLETED',
        driverRating: { not: null },
      },
      select: {
        id: true,
        driverRating: true,
        driverReview: true,
        createdAt: true,
        client: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // Calculate rating distribution
    const ratingCounts = await prisma.booking.groupBy({
      by: ['driverRating'],
      where: {
        driverId: params.id,
        status: 'COMPLETED',
        driverRating: { not: null },
      },
      _count: true,
    });

    const distribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    ratingCounts.forEach((count) => {
      if (count.driverRating) {
        distribution[count.driverRating as keyof typeof distribution] =
          count._count;
      }
    });

    const totalRatings = Object.values(distribution).reduce(
      (sum, count) => sum + count,
      0
    );

    return NextResponse.json(
      {
        driverId: params.id,
        overallRating: driver.rating,
        totalTrips: driver.totalTrips,
        totalRatings,
        ratingDistribution: distribution,
        recentReviews: reviews
          .filter((review) => review.client)
          .map((review) => ({
            bookingId: review.id,
            rating: review.driverRating,
            review: review.driverReview,
            clientName: review.client!.name,
            clientAvatar: review.client!.avatar,
            createdAt: review.createdAt,
          })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to fetch driver ratings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ratings' },
      { status: 500 }
    );
  }
}
