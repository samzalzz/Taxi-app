import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/persistence/client';
import { z } from 'zod';

const SubmitComplaintSchema = z.object({
  category: z.enum([
    'DRIVER_BEHAVIOR',
    'VEHICLE_CONDITION',
    'PRICING_DISPUTE',
    'LATE_PICKUP',
    'ROUTE_DEVIATION',
    'TECHNICAL_ISSUE',
    'OTHER',
  ]),
  description: z.string().min(10).max(5000),
  bookingId: z.string().optional(),
  againstId: z.string().optional(),
});

/**
 * POST /api/complaints
 * Submit a new complaint.
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

    const body = await request.json();
    const validated = SubmitComplaintSchema.parse(body);

    // Verify booking if provided
    if (validated.bookingId) {
      const booking = await prisma.booking.findUnique({
        where: { id: validated.bookingId },
      });

      if (!booking) {
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        );
      }
    }

    // Create complaint
    const complaint = await prisma.complaint.create({
      data: {
        complainantId: session.userId,
        againstId: validated.againstId,
        bookingId: validated.bookingId,
        category: validated.category,
        description: validated.description,
        status: 'OPEN',
      },
      include: {
        complainant: { select: { id: true, name: true, email: true } },
        against: { select: { id: true, name: true } },
        booking: { select: { id: true, status: true } },
      },
    });

    return NextResponse.json(complaint, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }
    console.error('[Complaints POST]', error);
    return NextResponse.json(
      { error: 'Failed to submit complaint' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/complaints
 * Get user's complaints (as complainant).
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

    const status = request.nextUrl.searchParams.get('status');

    const whereClause: any = { complainantId: session.userId };
    if (status) {
      whereClause.status = status;
    }

    const complaints = await prisma.complaint.findMany({
      where: whereClause,
      include: {
        against: { select: { id: true, name: true } },
        booking: { select: { id: true, pickupAddress: true, dropoffAddress: true } },
        replies: {
          include: {
            author: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      complaints,
      count: complaints.length,
    });
  } catch (error) {
    console.error('[Complaints GET]', error);
    return NextResponse.json(
      { error: 'Failed to fetch complaints' },
      { status: 500 }
    );
  }
}
