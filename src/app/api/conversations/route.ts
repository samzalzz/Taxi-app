import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/persistence/client';

/**
 * GET /api/conversations
 * List all conversations for the authenticated user, sorted by last message.
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

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: session.userId,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            id: true,
            content: true,
            sender: {
              select: {
                name: true,
              },
            },
            createdAt: true,
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
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Calculate unread count for each conversation
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await prisma.message.count({
          where: {
            conversationId: conv.id,
            senderId: { not: session.userId },
            readAt: null,
          },
        });
        return { ...conv, unreadCount };
      })
    );

    return NextResponse.json({
      conversations: conversationsWithUnread,
    });
  } catch (error) {
    console.error('[Conversations GET]', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/conversations
 * Create a new driver-to-driver conversation or return existing one.
 * Body: { participantId: string }
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

    const { participantId } = await request.json();

    if (!participantId) {
      return NextResponse.json(
        { error: 'participantId is required' },
        { status: 400 }
      );
    }

    if (participantId === session.userId) {
      return NextResponse.json(
        { error: 'Cannot create conversation with yourself' },
        { status: 400 }
      );
    }

    // Check if conversation already exists between these two users (no bookingId = driver-to-driver)
    const existing = await prisma.conversation.findFirst({
      where: {
        bookingId: null,
        participants: {
          every: {
            userId: {
              in: [session.userId, participantId],
            },
          },
        },
      },
    });

    if (existing) {
      return NextResponse.json({ conversation: existing });
    }

    // Create new conversation of type SUPPORT
    const conversation = await prisma.conversation.create({
      data: {
        type: 'SUPPORT',
        participants: {
          create: [
            { userId: session.userId },
            { userId: participantId },
          ],
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ conversation }, { status: 201 });
  } catch (error) {
    console.error('[Conversations POST]', error);
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}
