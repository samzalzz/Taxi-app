import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getUserById, getAllUsers, getUsersByRole } from '@/persistence/queries/userQueries';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const currentUser = await getUserById(session.userId);
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only admins can view users' },
        { status: 403 }
      );
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);
    const role = url.searchParams.get('role') as 'CLIENT' | 'DRIVER' | 'ADMIN' | null;

    // Filter by role if specified
    if (role && ['CLIENT', 'DRIVER', 'ADMIN'].includes(role)) {
      const users = await getUsersByRole(role);
      return NextResponse.json({
        success: true,
        users,
        total: users.length,
        filtered: true,
        filterRole: role,
      });
    }

    // Get paginated users
    const { users, total } = await getAllUsers(page, limit);

    return NextResponse.json({
      success: true,
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Admin users error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
