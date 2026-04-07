'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to fetch and manage CSRF tokens
 * Automatically fetches token on mount and provides utility functions
 */
export function useCSRFToken() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/csrf-token');

        if (!response.ok) {
          throw new Error('Failed to fetch CSRF token');
        }

        const data = await response.json();
        setToken(data.csrfToken);
        setError(null);
      } catch (err) {
        console.error('Error fetching CSRF token:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, []);

  /**
   * Add CSRF token to request headers
   */
  const getHeaders = (additionalHeaders: Record<string, string> = {}) => {
    return {
      'Content-Type': 'application/json',
      'X-CSRF-Token': token || '',
      ...additionalHeaders,
    };
  };

  /**
   * Make an authenticated API request with CSRF token
   */
  const authenticatedFetch = async <T,>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> => {
    if (!token) {
      throw new Error('CSRF token not loaded');
    }

    const response = await fetch(url, {
      ...options,
      headers: getHeaders(options.headers as Record<string, string>),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  };

  return {
    token,
    loading,
    error,
    getHeaders,
    authenticatedFetch,
  };
}
