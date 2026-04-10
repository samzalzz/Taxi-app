import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth/session';
import { getDriverByUserId, updateDriverStatus } from '@/persistence/queries/driverQueries';
import { DriverStatus } from '@/generated/prisma/client';

const UpdateStatusSchema = z.object({
  status: z.enum(['OFFLINE', 'AVAILABLE', 'BUSY', 'ON_BREAK'] as const),
});

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getSession();
    if (!session || session.role !== 'DRIVER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { status } = UpdateStatusSchema.parse(body);

    const driver = await getDriverByUserId(session.userId);
    if (!driver) {
      return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
    }

    const updated = await updateDriverStatus(driver.id, status as DriverStatus);
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Update driver status error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
