import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getUserById } from '@/persistence/queries/userQueries';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const user = await getUserById(session.userId);

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}
