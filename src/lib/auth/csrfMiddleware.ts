/**
 * CSRF middleware for protecting state-changing endpoints (POST, PUT, PATCH, DELETE)
 * Usage: Wrap API route handlers with this middleware
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from './session';
import { validateCSRFToken, getCSRFTokenFromRequest } from './csrf';

/**
 * Middleware to check CSRF token on state-changing requests
 * Only validates for authenticated requests with state-changing methods
 */
export async function validateCSRFMiddleware(request: NextRequest): Promise<{ valid: boolean; error?: string }> {
  const method = request.method;

  // Only validate POST, PUT, PATCH, DELETE requests
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    return { valid: true };
  }

  // Get session
  const session = await getSession();
  if (!session) {
    // Unauthenticated requests don't need CSRF (handled by other means)
    return { valid: true };
  }

  // Get CSRF token from request
  const token = getCSRFTokenFromRequest(request);
  if (!token) {
    return {
      valid: false,
      error: 'CSRF token required for state-changing operations',
    };
  }

  // Validate token
  const isValid = validateCSRFToken(session.userId, token);
  if (!isValid) {
    return {
      valid: false,
      error: 'Invalid or expired CSRF token',
    };
  }

  return { valid: true };
}

/**
 * Wrapper function for API routes to add CSRF protection
 */
export async function withCSRFProtection(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  // Validate CSRF
  const csrf = await validateCSRFMiddleware(request);
  if (!csrf.valid) {
    return new NextResponse(
      JSON.stringify({ error: csrf.error || 'CSRF validation failed' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Call handler
  return handler(request);
}
