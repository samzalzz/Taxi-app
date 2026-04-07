import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/persistence/client';

/**
 * GET /api/notifications
 * List unread and recent notifications for the authenticated user.
 * Returns up to 20 most recent notifications (unread first).
 */
export async function GET(_request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: session.userId },
      orderBy: [
        { read: 'asc' }, // Unread first
        { createdAt: 'desc' }, // Then by date
      ],
      take: 20,
    });

    return NextResponse.json({
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
    });
  } catch (error) {
    console.error('[Notifications GET]', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/notifications/read-all
 * Mark all notifications as read for the authenticated user.
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

    const pathSegments = request.nextUrl.pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];

    // If path is /api/notifications/read-all
    if (lastSegment === 'read-all') {
      const result = await prisma.notification.updateMany({
        where: {
          userId: session.userId,
          read: false,
        },
        data: { read: true },
      });

      return NextResponse.json({
        success: true,
        updated: result.count,
      });
    }

    // Default response for other POST requests
    return NextResponse.json(
      { error: 'Not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('[Notifications POST]', error);
    return NextResponse.json(
      { error: 'Failed to update notifications' },
      { status: 500 }
    );
  }
}
