'use client';

import { ReactNode } from 'react';
import { ToastProvider } from '@/components/ui/Toast';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { CookieConsentBanner } from '@/components/common/CookieConsentBanner';
import { CGUConsentBanner } from '@/components/common/CGUConsentBanner';

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <AuthProvider>
          <ToastProvider>
            {children}
            {/* Consent banners render at bottom of page globally (stacked) */}
            <CGUConsentBanner />
            <CookieConsentBanner />
          </ToastProvider>
        </AuthProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
