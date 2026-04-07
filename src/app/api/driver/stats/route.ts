import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getDriverByUserId, getDriverStats } from '@/persistence/queries/driverQueries';

export async function GET(): Promise<NextResponse> {
  try {
    const session = await getSession();
    if (!session || session.role !== 'DRIVER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const driver = await getDriverByUserId(session.userId);
    if (!driver) {
      return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
    }

    const stats = await getDriverStats(driver.id);
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Get driver stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
