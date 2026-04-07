import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/persistence/client';
import { z } from 'zod';

const RespondSchema = z.object({
  response: z.string().min(1).max(1000),
});

/**
 * POST /api/reviews/[id]/respond
 * Respond to a review as the reviewee.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { response } = RespondSchema.parse(body);

    // Get review
    const review = await prisma.review.findUnique({
      where: { id: params.id },
      include: {
        reviewer: { select: { id: true } },
        reviewee: { select: { id: true } },
      },
    });

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Verify user is the reviewee
    if (review.revieweeId !== session.userId) {
      return NextResponse.json(
        { error: 'Only the reviewee can respond to this review' },
        { status: 403 }
      );
    }

    // Update review with response
    const updated = await prisma.review.update({
      where: { id: params.id },
      data: {
        response,
        respondedAt: new Date(),
      },
    });

    // Notify reviewer of response
    const { createNotification } = await import('@/lib/notifications/createNotification');
    createNotification({
      userId: review.reviewerId,
      type: 'SUPPORT_REPLY',
      title: 'Réponse à votre avis',
      message: `La personne que vous avez évaluée a répondu à votre avis.`,
      data: { reviewId: params.id },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('[Review Respond POST]', error);
    return NextResponse.json(
      { error: 'Failed to submit response' },
      { status: 500 }
    );
  }
}
