import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/persistence/client';

/**
 * GET /api/admin/reviews
 * Get all reviews (admin only) with optional filtering.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const role = request.nextUrl.searchParams.get('role');
    const hasResponse = request.nextUrl.searchParams.get('hasResponse');
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '50');
    const offset = parseInt(request.nextUrl.searchParams.get('offset') || '0');

    const whereClause: any = {};
    if (role) whereClause.role = role;
    if (hasResponse === 'true') {
      whereClause.response = { not: null };
    } else if (hasResponse === 'false') {
      whereClause.response = null;
    }

    const [reviews, total, stats] = await Promise.all([
      prisma.review.findMany({
        where: whereClause,
        include: {
          reviewer: { select: { id: true, name: true, email: true } },
          reviewee: { select: { id: true, name: true, email: true } },
          booking: { select: { id: true, pickupAddress: true, dropoffAddress: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.review.count({ where: whereClause }),
      prisma.review.groupBy({
        by: ['role'],
        _avg: { overallRating: true },
        _count: true,
      }),
    ]);

    return NextResponse.json({
      reviews,
      total,
      stats,
      limit,
      offset,
    });
  } catch (error) {
    console.error('[Admin Reviews GET]', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
