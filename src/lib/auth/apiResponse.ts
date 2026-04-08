/**
 * API response helpers with CORS and security headers
 */

import { NextResponse } from 'next/server';
import { getCORSHeaders } from './cors';

interface ApiResponseOptions {
  status?: number;
  headers?: Record<string, string>;
  origin?: string | null;
}

/**
 * Create a JSON API response with CORS headers
 */
export function jsonResponse<T>(
  data: T,
  options: ApiResponseOptions = {}
): NextResponse<T> {
  const { status = 200, headers = {}, origin } = options;

  const corsHeaders = getCORSHeaders(origin);
  const allHeaders = {
    'Content-Type': 'application/json',
    ...corsHeaders,
    ...headers,
  };

  return new NextResponse(JSON.stringify(data), {
    status,
    headers: allHeaders,
  });
}

/**
 * Create an error response
 */
export function errorResponse(
  message: string,
  status: number = 500,
  options: ApiResponseOptions = {}
): NextResponse {
  return jsonResponse(
    { error: message },
    { ...options, status }
  );
}

/**
 * Handle CORS preflight requests
 */
export function handleCORSPreflight(origin?: string): NextResponse {
  const corsHeaders = getCORSHeaders(origin);
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

/**
 * Create success response
 */
export function successResponse<T>(
  data: T,
  message?: string,
  options: ApiResponseOptions = {}
): NextResponse<any> {
  const responseData = {
    success: true,
    ...(message && { message }),
    data,
  };

  return jsonResponse(responseData, { ...options, status: options.status || 200 });
}
