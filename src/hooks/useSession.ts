'use client';

import { useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface SessionData {
  userId: string;
  email: string;
  name: string;
  role: string;
}

export function useSession() {
  const [session, setSession] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setSession({
              userId: data.user.id,
              email: data.user.email,
              name: data.user.name,
              role: data.user.role,
            });
          }
        }
      } catch (error) {
        console.error('[useSession]', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, []);

  return { session, isLoading };
}
