'use client';

import { ReactNode } from 'react';
import { ToastProvider } from '@/components/ui/Toast';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { AuthProvider } from '@/components/providers/AuthProvider';

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
