import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/persistence/client';
import { z } from 'zod';

const UpdateComplaintSchema = z.object({
  status: z.enum(['OPEN', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED']),
  adminNotes: z.string().optional(),
});

/**
 * PATCH /api/complaints/[id]
 * Update complaint status (admin only).
 */
export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { status, adminNotes } = UpdateComplaintSchema.parse(body);

    const complaint = await prisma.complaint.findUnique({
      where: { id: params.id },
    });

    if (!complaint) {
      return NextResponse.json(
        { error: 'Complaint not found' },
        { status: 404 }
      );
    }

    const updated = await prisma.complaint.update({
      where: { id: params.id },
      data: {
        status,
        adminNotes,
        resolvedAt: ['RESOLVED', 'DISMISSED'].includes(status)
          ? new Date()
          : complaint.resolvedAt,
        resolvedBy: ['RESOLVED', 'DISMISSED'].includes(status)
          ? session.userId
          : complaint.resolvedBy,
      },
      include: {
        complainant: { select: { id: true, name: true, email: true } },
        replies: {
          include: { author: { select: { name: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    // Notify complainant of status update
    const { createNotification } = await import('@/lib/notifications/createNotification');
    createNotification({
      userId: complaint.complainantId,
      type: 'SYSTEM',
      title: 'Mise à jour de votre réclamation',
      message: `Votre réclamation a été mise à jour au statut: ${status}`,
      data: { complaintId: params.id },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }
    console.error('[Complaint PATCH]', error);
    return NextResponse.json(
      { error: 'Failed to update complaint' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/complaints/[id]
 * Get a specific complaint with all replies.
 */
export async function GET(_request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const complaint = await prisma.complaint.findUnique({
      where: { id: params.id },
      include: {
        complainant: { select: { id: true, name: true, email: true } },
        against: { select: { id: true, name: true, email: true } },
        booking: { select: { id: true, pickupAddress: true, dropoffAddress: true, status: true } },
        replies: {
          include: {
            author: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!complaint) {
      return NextResponse.json(
        { error: 'Complaint not found' },
        { status: 404 }
      );
    }

    // Verify access: user is complainant, affected party, or admin
    const isComplainant = complaint.complainantId === session.userId;
    const isAffected = complaint.againstId === session.userId;
    const isAdmin = session.role === 'ADMIN';

    if (!isComplainant && !isAffected && !isAdmin) {
      return NextResponse.json(
        { error: 'Not authorized to view this complaint' },
        { status: 403 }
      );
    }

    return NextResponse.json(complaint);
  } catch (error) {
    console.error('[Complaint GET]', error);
    return NextResponse.json(
      { error: 'Failed to fetch complaint' },
      { status: 500 }
    );
  }
}
