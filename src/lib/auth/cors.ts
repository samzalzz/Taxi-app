/**
 * CORS configuration and headers management
 * Prevents unauthorized cross-origin requests
 */

export interface CORSConfig {
  allowedOrigins: string[];
  allowedMethods: string[];
  allowedHeaders: string[];
  exposedHeaders: string[];
  maxAge: number;
  credentials: boolean;
}

const DEFAULT_CORS_CONFIG: CORSConfig = {
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(','),
  allowedMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Total-Count', 'X-Page-Count'],
  maxAge: 86400, // 24 hours
  credentials: true,
};

/**
 * Get CORS headers for a specific origin
 */
export function getCORSHeaders(origin: string | null | undefined, config: Partial<CORSConfig> = {}): Record<string, string> {
  const finalConfig = { ...DEFAULT_CORS_CONFIG, ...config };

  // Check if origin is allowed
  const isOriginAllowed = !origin || finalConfig.allowedOrigins.includes(origin);
  const allowedOrigin = isOriginAllowed ? origin : finalConfig.allowedOrigins[0];

  return {
    'Access-Control-Allow-Origin': allowedOrigin || '*',
    'Access-Control-Allow-Methods': finalConfig.allowedMethods.join(', '),
    'Access-Control-Allow-Headers': finalConfig.allowedHeaders.join(', '),
    'Access-Control-Expose-Headers': finalConfig.exposedHeaders.join(', '),
    'Access-Control-Max-Age': finalConfig.maxAge.toString(),
    ...(finalConfig.credentials && {
      'Access-Control-Allow-Credentials': 'true',
    }),
  };
}

/**
 * Validate CORS preflight request
 */
export function isCORSPreflightRequest(method: string): boolean {
  return method === 'OPTIONS';
}

/**
 * Build CORS preflight response
 */
export function buildCORSPreflightResponse(
  origin: string | null | undefined,
  config: Partial<CORSConfig> = {}
) {
  const headers = getCORSHeaders(origin, config);
  return {
    status: 204,
    headers,
  };
}

/**
 * Validate if origin is allowed for CORS
 */
export function isOriginAllowed(origin: string | null | undefined, allowedOrigins?: string[]): boolean {
  if (!origin) return true;

  const originsToCheck = allowedOrigins || DEFAULT_CORS_CONFIG.allowedOrigins;
  return originsToCheck.includes(origin) || originsToCheck.includes('*');
}
