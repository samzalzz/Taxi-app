'use client';

import { ReactNode } from 'react';
import { ToastProvider } from '@/components/ui/Toast';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { ConsentBanner } from '@/components/common/ConsentBanner';
import { ServiceWorkerRegister } from '@/components/common/ServiceWorkerRegister';

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <AuthProvider>
          <ToastProvider>
            {children}
            {/* Wrapper isolates ConsentBanner from `.bg-cloth > *` rule
                which would otherwise override its `position: fixed`. */}
            <div>
              <ConsentBanner />
            </div>
            <ServiceWorkerRegister />
          </ToastProvider>
        </AuthProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
