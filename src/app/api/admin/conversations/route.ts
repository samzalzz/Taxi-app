import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/persistence/client';

/**
 * GET /api/admin/conversations
 * Get all conversations (admin only) with optional filtering.
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
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '50');
    const offset = parseInt(request.nextUrl.searchParams.get('offset') || '0');

    const whereClause: any = {};
    if (type) whereClause.type = type;

    const [conversations, total] = await Promise.all([
      prisma.conversation.findMany({
        where: whereClause,
        include: {
          participants: {
            include: {
              user: { select: { id: true, name: true, email: true } },
            },
          },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: {
              content: true,
              createdAt: true,
              sender: { select: { name: true } },
            },
          },
          booking: {
            select: {
              id: true,
              pickupAddress: true,
              dropoffAddress: true,
              status: true,
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.conversation.count({ where: whereClause }),
    ]);

    // Calculate unread messages per conversation
    const conversationsWithStats = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await prisma.message.count({
          where: {
            conversationId: conv.id,
            readAt: null,
          },
        });
        const totalMessages = await prisma.message.count({
          where: { conversationId: conv.id },
        });
        return { ...conv, unreadCount, totalMessages };
      })
    );

    return NextResponse.json({
      conversations: conversationsWithStats,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('[Admin Conversations GET]', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}
