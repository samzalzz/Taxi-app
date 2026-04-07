'use client';

import { ReactNode } from 'react';
import { ToastProvider } from '@/components/ui/Toast';

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  );
}
