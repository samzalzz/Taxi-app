import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getApiUsageByMonth } from '@/persistence/queries/apiLogQueries';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const now = new Date();
    const month = parseInt(searchParams.get('month') || String(now.getMonth() + 1));
    const year = parseInt(searchParams.get('year') || String(now.getFullYear()));

    // Validate month/year
    if (month < 1 || month > 12 || year < 2020) {
      return NextResponse.json(
        { error: 'Invalid month or year' },
        { status: 400 }
      );
    }

    // Get API usage data
    const data = await getApiUsageByMonth(year, month);

    return NextResponse.json({
      success: true,
      month,
      year,
      data,
    });
  } catch (error) {
    console.error('[API Usage] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
