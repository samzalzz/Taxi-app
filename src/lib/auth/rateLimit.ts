/**
 * Simple in-memory rate limiter for authentication endpoints
 * Tracks requests by IP address and enforces limits per time window
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

export interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number; // Time window in milliseconds
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
};

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (IP address, email, etc.)
 * @param config - Rate limit configuration
 * @returns true if request is allowed, false if rate limited
 */
export function checkRateLimit(
  identifier: string,
  config: Partial<RateLimitConfig> = {}
): boolean {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  // No record exists, create new one
  if (!record || now > record.resetAt) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetAt: now + finalConfig.windowMs,
    });
    return true;
  }

  // Check if limit exceeded
  if (record.count >= finalConfig.maxAttempts) {
    return false;
  }

  // Increment count
  record.count++;
  return true;
}

/**
 * Reset rate limit for a specific identifier
 */
export function resetRateLimit(identifier: string): void {
  rateLimitMap.delete(identifier);
}

/**
 * Get remaining attempts for an identifier
 */
export function getRemainingAttempts(
  identifier: string,
  config: Partial<RateLimitConfig> = {}
): number {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const record = rateLimitMap.get(identifier);

  if (!record) {
    return finalConfig.maxAttempts;
  }

  const now = Date.now();
  if (now > record.resetAt) {
    rateLimitMap.delete(identifier);
    return finalConfig.maxAttempts;
  }

  return Math.max(0, finalConfig.maxAttempts - record.count);
}

/**
 * Get reset time for rate limit
 */
export function getResetTime(identifier: string): number | null {
  const record = rateLimitMap.get(identifier);
  if (!record) return null;

  const now = Date.now();
  if (now > record.resetAt) {
    rateLimitMap.delete(identifier);
    return null;
  }

  return record.resetAt;
}

// Cleanup old records every hour to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetAt) {
      rateLimitMap.delete(key);
    }
  }
}, 60 * 60 * 1000); // 1 hour
