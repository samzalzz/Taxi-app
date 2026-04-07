import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/persistence/client';

/**
 * GET /api/admin/complaints
 * Get all complaints with filtering options (admin only).
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

    const status = request.nextUrl.searchParams.get('status');
    const category = request.nextUrl.searchParams.get('category');
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '50');
    const offset = parseInt(request.nextUrl.searchParams.get('offset') || '0');

    const whereClause: any = {};
    if (status) whereClause.status = status;
    if (category) whereClause.category = category;

    const [complaints, total] = await Promise.all([
      prisma.complaint.findMany({
        where: whereClause,
        include: {
          complainant: { select: { id: true, name: true, email: true } },
          against: { select: { id: true, name: true, email: true } },
          booking: { select: { id: true, pickupAddress: true, dropoffAddress: true } },
          replies: {
            select: { id: true, createdAt: true, author: { select: { name: true } } },
            orderBy: { createdAt: 'desc' },
            take: 2,
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.complaint.count({ where: whereClause }),
    ]);

    return NextResponse.json({
      complaints,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('[Admin Complaints GET]', error);
    return NextResponse.json(
      { error: 'Failed to fetch complaints' },
      { status: 500 }
    );
  }
}
