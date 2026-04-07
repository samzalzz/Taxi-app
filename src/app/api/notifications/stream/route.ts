import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/persistence/client';

/**
 * GET /api/notifications/stream
 * Server-Sent Events (SSE) endpoint for real-time notifications.
 * Polls the database every 5 seconds for new unread notifications.
 *
 * Client usage:
 * ```js
 * const eventSource = new EventSource('/api/notifications/stream');
 * eventSource.onmessage = (event) => {
 *   const notifications = JSON.parse(event.data);
 *   console.log('New notifications:', notifications);
 * };
 * ```
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.userId;

    // Create a ReadableStream that polls for new notifications
    const stream = new ReadableStream({
      async start(controller) {
        // Send initial unread notifications
        try {
          const initialNotifs = await prisma.notification.findMany({
            where: {
              userId,
              read: false,
            },
            orderBy: { createdAt: 'desc' },
          });

          controller.enqueue(
            `data: ${JSON.stringify({ notifications: initialNotifs })}\n\n`
          );
        } catch (error) {
          console.error('[SSE Init] Failed to fetch initial notifications:', error);
        }

        // Set up polling interval
        const interval = setInterval(async () => {
          try {
            const notifications = await prisma.notification.findMany({
              where: {
                userId,
                read: false,
              },
              orderBy: { createdAt: 'desc' },
            });

            // Send data in SSE format
            controller.enqueue(
              `data: ${JSON.stringify({ notifications })}\n\n`
            );
          } catch (error) {
            console.error('[SSE Poll] Failed to fetch notifications:', error);
          }
        }, 5000); // Poll every 5 seconds

        // Clean up interval when client disconnects
        request.signal.addEventListener('abort', () => {
          clearInterval(interval);
          controller.close();
        });
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no', // Disable buffering (important for Vercel)
      },
    });
  } catch (error) {
    console.error('[Notifications Stream]', error);
    return NextResponse.json(
      { error: 'Failed to establish stream' },
      { status: 500 }
    );
  }
}
