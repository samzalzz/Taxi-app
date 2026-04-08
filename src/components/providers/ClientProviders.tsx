'use client';

import { ReactNode } from 'react';
import { ToastProvider } from '@/components/ui/Toast';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
