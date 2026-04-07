/**
 * CSRF token generation and validation
 * Protects against Cross-Site Request Forgery attacks
 */

import crypto from 'crypto';

// Store CSRF tokens in memory (in production, use Redis)
const csrfTokens = new Map<string, { token: string; expiresAt: number }>();

const CSRF_TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour

/**
 * Generate a CSRF token for a session
 */
export function generateCSRFToken(sessionId: string): string {
  // Remove old token if exists
  csrfTokens.delete(sessionId);

  // Generate new token
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + CSRF_TOKEN_EXPIRY;

  csrfTokens.set(sessionId, { token, expiresAt });

  return token;
}

/**
 * Validate a CSRF token
 */
export function validateCSRFToken(sessionId: string, token: string): boolean {
  const storedData = csrfTokens.get(sessionId);

  if (!storedData) {
    return false;
  }

  // Check expiration
  if (Date.now() > storedData.expiresAt) {
    csrfTokens.delete(sessionId);
    return false;
  }

  // Use constant-time comparison to prevent timing attacks
  return constantTimeCompare(token, storedData.token);
}

/**
 * Constant-time string comparison to prevent timing attacks
 */
function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let equal = 0;
  for (let i = 0; i < a.length; i++) {
    equal |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return equal === 0;
}

/**
 * Revoke a CSRF token
 */
export function revokeCSRFToken(sessionId: string): void {
  csrfTokens.delete(sessionId);
}

/**
 * Get CSRF token from request headers
 */
export function getCSRFTokenFromRequest(request: Request): string | null {
  // Check in headers first (most secure)
  const headerToken = request.headers.get('x-csrf-token');
  if (headerToken) return headerToken;

  // Check in custom header
  const customHeader = request.headers.get('x-requested-with');
  if (customHeader === 'XMLHttpRequest') {
    // For XMLHttpRequest, token could be in headers already checked
    return headerToken;
  }

  return null;
}

/**
 * Cleanup expired tokens (run periodically)
 */
export function cleanupExpiredCSRFTokens(): void {
  const now = Date.now();
  for (const [sessionId, data] of csrfTokens.entries()) {
    if (now > data.expiresAt) {
      csrfTokens.delete(sessionId);
    }
  }
}

// Cleanup expired tokens every 30 minutes
setInterval(cleanupExpiredCSRFTokens, 30 * 60 * 1000);
