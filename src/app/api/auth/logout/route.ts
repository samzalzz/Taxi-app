import { NextResponse } from 'next/server';
import { clearSession } from '@/lib/auth/session';

export async function POST() {
  try {
    await clearSession();
    return NextResponse.redirect(new URL('/connexion', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'), {
      status: 302,
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.redirect(new URL('/connexion', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'), {
      status: 302,
    });
  }
}
