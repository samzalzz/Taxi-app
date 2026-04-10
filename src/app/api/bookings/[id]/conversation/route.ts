import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/persistence/client';

/**
 * POST /api/bookings/[id]/conversation
 * Get or create a conversation for a booking.
 * Used when a client or driver wants to chat about a specific trip.
 */
export async function POST(__request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get booking
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        client: { select: { id: true } },
        driver: { select: { id: true, userId: true } },
        conversation: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Verify user is part of booking (client or driver)
    const isClient = booking.clientId === session.userId;
    const isDriver = booking.driver?.userId === session.userId;

    if (!isClient && !isDriver) {
      return NextResponse.json(
        { error: 'Not authorized to chat about this booking' },
        { status: 403 }
      );
    }

    // If conversation already exists, return it
    if (booking.conversation) {
      return NextResponse.json(booking.conversation);
    }

    // Create new conversation between client and driver
    if (!booking.clientId || !booking.driver?.userId) {
      return NextResponse.json(
        { error: 'Cannot create conversation: missing client or driver' },
        { status: 400 }
      );
    }

    const conversation = await prisma.conversation.create({
      data: {
        bookingId: params.id,
        type: 'RIDE',
        participants: {
          create: [
            {
              userId: booking.clientId,
            },
            {
              userId: booking.driver.userId,
            },
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

    return NextResponse.json(conversation, { status: 201 });
  } catch (error) {
    console.error('[Booking Conversation POST]', error);
    return NextResponse.json(
      { error: 'Failed to get or create conversation' },
      { status: 500 }
    );
  }
}
