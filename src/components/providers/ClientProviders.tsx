'use client';

import { ReactNode } from 'react';
import { ToastProvider } from '@/components/ui/Toast';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { ConsentBanner } from '@/components/common/ConsentBanner';

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <AuthProvider>
          <ToastProvider>
            {children}
            {/* Unified consent banner (cookies + CGU) renders at bottom of page globally */}
            <ConsentBanner />
          </ToastProvider>
        </AuthProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
