import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/persistence/client';
import { z } from 'zod';

const ReplySchema = z.object({
  content: z.string().min(1).max(5000),
});

/**
 * POST /api/complaints/[id]/reply
 * Add a reply to a complaint.
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

    const body = await request.json();
    const { content } = ReplySchema.parse(body);

    // Get complaint
    const complaint = await prisma.complaint.findUnique({
      where: { id: params.id },
      include: {
        complainant: { select: { id: true } },
      },
    });

    if (!complaint) {
      return NextResponse.json(
        { error: 'Complaint not found' },
        { status: 404 }
      );
    }

    // Verify access: complainant, affected party, or admin
    const isComplainant = complaint.complainantId === session.userId;
    const isAffected = complaint.againstId === session.userId;
    const isAdmin = session.role === 'ADMIN';

    if (!isComplainant && !isAffected && !isAdmin) {
      return NextResponse.json(
        { error: 'Not authorized to reply to this complaint' },
        { status: 403 }
      );
    }

    // Create reply
    const reply = await prisma.complaintReply.create({
      data: {
        complaintId: params.id,
        authorId: session.userId,
        content,
      },
      include: {
        author: { select: { id: true, name: true } },
      },
    });

    // Notify the other parties
    const { createNotification } = await import('@/lib/notifications/createNotification');
    const recipientIds = new Set<string>();

    if (session.userId !== complaint.complainantId) {
      recipientIds.add(complaint.complainantId);
    }
    if (complaint.againstId && session.userId !== complaint.againstId) {
      recipientIds.add(complaint.againstId);
    }

    for (const recipientId of recipientIds) {
      createNotification({
        userId: recipientId,
        type: 'SUPPORT_REPLY',
        title: 'Nouvelle réponse à votre réclamation',
        message: `Une nouvelle réponse a été ajoutée à votre réclamation.`,
        data: { complaintId: params.id },
      });
    }

    return NextResponse.json(reply, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }
    console.error('[Complaint Reply POST]', error);
    return NextResponse.json(
      { error: 'Failed to add reply' },
      { status: 500 }
    );
  }
}
