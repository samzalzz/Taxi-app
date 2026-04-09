'use client';

import { useCGUConsent } from '@/hooks/useCGUConsent';
import { FileText } from 'lucide-react';
import Link from 'next/link';

export function CGUConsentBanner() {
  const { hasResponded, accept, resetConsent } = useCGUConsent();

  // Full banner when user hasn't responded yet
  if (!hasResponded) {
    return (
      <div className="fixed bottom-16 sm:bottom-20 md:bottom-0 left-0 right-0 z-40 bg-surface border-t border-on-surface/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Message */}
            <div className="flex items-start gap-4 flex-1">
              <FileText className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-on-surface mb-2">
                  <strong>Conditions Générales d'Utilisation</strong>
                </p>
                <p className="text-xs text-on-surface-dim">
                  Vous devez accepter nos Conditions Générales d'Utilisation avant d'utiliser notre service.
                  Consultez les{' '}
                  <Link href="/legal/conditions" className="text-primary hover:text-primary-light underline">
                    CGU complètes
                  </Link>
                  {' '}pour plus de détails.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 flex-shrink-0 w-full md:w-auto">
              <button
                onClick={accept}
                className="flex-1 md:flex-none px-6 py-2 text-sm font-medium bg-primary text-background rounded-lg hover:bg-primary-dark transition-colors"
              >
                J'accepte les CGU
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Minimal indicator once consent is given — shown above cookie banner
  return (
    <div className="fixed bottom-10 sm:bottom-14 md:bottom-0 left-0 right-0 z-40 bg-surface border-t border-on-surface/10 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-4 text-xs text-on-surface-dim">
          <p>Vous avez accepté les Conditions Générales d'Utilisation.</p>
          <button
            onClick={resetConsent}
            className="text-primary hover:text-primary-light underline underline-offset-2 transition-colors whitespace-nowrap"
          >
            Modifier
          </button>
        </div>
      </div>
    </div>
  );
}
