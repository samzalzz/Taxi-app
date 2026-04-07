import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getCalendarBookingsForDriver } from '@/persistence/queries/bookingQueries';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getSession();
    if (!session || session.role !== 'DRIVER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const url = new URL(request.url);
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');

    const bookings = await getCalendarBookingsForDriver(
      session.userId,
      from ? new Date(from) : undefined,
      to ? new Date(to) : undefined
    );

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Driver calendar error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
