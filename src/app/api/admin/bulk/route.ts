import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/persistence/client';
import { z } from 'zod';

const BulkActionSchema = z.object({
  action: z.enum([
    'mark-notifications-read',
    'delete-notifications',
    'delete-conversations',
    'delete-reviews',
    'update-complaint-status',
    'delete-complaints',
  ]),
  ids: z.array(z.string()).min(1),
  data: z.record(z.string(), z.any()).optional(),
});

/**
 * POST /api/admin/bulk
 * Execute bulk actions on multiple records (admin only).
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action, ids, data } = BulkActionSchema.parse(body);

    let result: any = {};

    switch (action) {
      case 'mark-notifications-read': {
        const updated = await prisma.notification.updateMany({
          where: { id: { in: ids } },
          data: { read: true },
        });
        result = { updated: updated.count, action };
        break;
      }

      case 'delete-notifications': {
        const deleted = await prisma.notification.deleteMany({
          where: { id: { in: ids } },
        });
        result = { deleted: deleted.count, action };
        break;
      }

      case 'delete-conversations': {
        const deleted = await prisma.conversation.deleteMany({
          where: { id: { in: ids } },
        });
        result = { deleted: deleted.count, action };
        break;
      }

      case 'delete-reviews': {
        const deleted = await prisma.review.deleteMany({
          where: { id: { in: ids } },
        });
        result = { deleted: deleted.count, action };
        break;
      }

      case 'update-complaint-status': {
        if (!data?.status) {
          throw new Error('Status required for complaint update');
        }
        const updated = await prisma.complaint.updateMany({
          where: { id: { in: ids } },
          data: {
            status: data.status,
            resolvedAt: ['RESOLVED', 'DISMISSED'].includes(data.status)
              ? new Date()
              : null,
            resolvedBy: ['RESOLVED', 'DISMISSED'].includes(data.status)
              ? session.userId
              : null,
          },
        });
        result = { updated: updated.count, action };
        break;
      }

      case 'delete-complaints': {
        const deleted = await prisma.complaint.deleteMany({
          where: { id: { in: ids } },
        });
        result = { deleted: deleted.count, action };
        break;
      }

      default:
        return NextResponse.json(
          { error: 'Unknown action' },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }
    console.error('[Bulk Action]', error);
    return NextResponse.json(
      { error: 'Failed to execute bulk action' },
      { status: 500 }
    );
  }
}
