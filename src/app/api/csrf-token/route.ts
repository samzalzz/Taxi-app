import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { generateCSRFToken } from '@/lib/auth/csrf';

/**
 * GET /api/csrf-token
 * Returns a CSRF token for the authenticated user
 * Required for making state-changing API requests (POST, PUT, PATCH, DELETE)
 */
export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    // Check if user is authenticated
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Generate or get existing CSRF token
    const csrfToken = generateCSRFToken(session.userId);

    return NextResponse.json(
      {
        success: true,
        csrfToken,
        // Token should be sent in X-CSRF-Token header on state-changing requests
        usage: 'Include in request header: X-CSRF-Token: ' + csrfToken,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('CSRF token generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    );
  }
}
