import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/persistence/client';

/**
 * GET /api/admin/notifications
 * Get all notifications (admin only) with optional filtering.
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

    const type = request.nextUrl.searchParams.get('type');
    const readFilter = request.nextUrl.searchParams.get('read');
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '50');
    const offset = parseInt(request.nextUrl.searchParams.get('offset') || '0');

    const whereClause: any = {};
    if (type) whereClause.type = type;
    if (readFilter === 'true') {
      whereClause.read = true;
    } else if (readFilter === 'false') {
      whereClause.read = false;
    }

    const [notifications, total, stats] = await Promise.all([
      prisma.notification.findMany({
        where: whereClause,
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.notification.count({ where: whereClause }),
      prisma.notification.groupBy({
        by: ['type'],
        _count: true,
        orderBy: { _count: { type: 'desc' } },
      }),
    ]);

    const unreadCount = await prisma.notification.count({
      where: { read: false },
    });

    return NextResponse.json({
      notifications,
      total,
      unreadCount,
      stats,
      limit,
      offset,
    });
  } catch (error) {
    console.error('[Admin Notifications GET]', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}
