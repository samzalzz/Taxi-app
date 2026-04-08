import { incrementApiLog } from '@/persistence/queries/apiLogQueries';

/**
 * Log an API call asynchronously (fire and forget)
 * Does not block the API response
 */
export function logApiCall(endpoint: string, method: string): void {
  // Fire and forget - don't await, don't catch in caller
  incrementApiLog(endpoint, method).catch(() => {
    // Silently fail - logging errors should not affect API responses
  });
}
