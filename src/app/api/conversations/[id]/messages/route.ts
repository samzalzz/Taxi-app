import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/persistence/client';
import { z } from 'zod';

const QuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  since: z.string().datetime().optional(), // For polling
});

/**
 * GET /api/conversations/[id]/messages
 * Get messages from a conversation with pagination.
 * Optional `since` parameter for polling new messages since a timestamp.
 */
export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify user is part of conversation
    const participant = await prisma.conversationParticipant.findFirst({
      where: {
        conversationId: params.id,
        userId: session.userId,
      },
    });

    if (!participant) {
      return NextResponse.json(
        { error: 'Not a participant in this conversation' },
        { status: 403 }
      );
    }

    const { limit, offset, since } = QuerySchema.parse(
      Object.fromEntries(request.nextUrl.searchParams)
    );

    const whereClause: any = { conversationId: params.id };
    if (since) {
      whereClause.createdAt = { gt: new Date(since) };
    }

    const messages = await prisma.message.findMany({
      where: whereClause,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
      skip: offset,
      take: limit,
    });

    const total = await prisma.message.count({
      where: { conversationId: params.id },
    });

    // Mark messages as read (except sender's own messages)
    await prisma.message.updateMany({
      where: {
        conversationId: params.id,
        senderId: { not: session.userId },
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });

    return NextResponse.json({
      messages,
      total,
      limit,
      offset,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      );
    }
    console.error('[Messages GET]', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

const SendMessageSchema = z.object({
  content: z.string().min(1).max(2000),
});

/**
 * POST /api/conversations/[id]/messages
 * Send a message to a conversation.
 */
export async function POST(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify user is part of conversation
    const participant = await prisma.conversationParticipant.findFirst({
      where: {
        conversationId: params.id,
        userId: session.userId,
      },
    });

    if (!participant) {
      return NextResponse.json(
        { error: 'Not a participant in this conversation' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { content } = SendMessageSchema.parse(body);

    // Create message
    const message = await prisma.message.create({
      data: {
        conversationId: params.id,
        senderId: session.userId,
        content,
        type: 'TEXT',
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    // Update conversation's lastReadAt for sender
    await prisma.conversationParticipant.update({
      where: {
        conversationId_userId: {
          conversationId: params.id,
          userId: session.userId,
        },
      },
      data: {
        lastReadAt: new Date(),
      },
    });

    // Create NEW_MESSAGE notification for other participants
    const { createNotification } = await import('@/lib/notifications/createNotification');
    const otherParticipants = await prisma.conversationParticipant.findMany({
      where: {
        conversationId: params.id,
        userId: { not: session.userId },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    for (const p of otherParticipants) {
      createNotification({
        userId: p.userId,
        type: 'NEW_MESSAGE',
        title: 'Nouveau message',
        message: `Un message a été envoyé: "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`,
        data: { conversationId: params.id },
      });
    }

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('[Messages POST]', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
