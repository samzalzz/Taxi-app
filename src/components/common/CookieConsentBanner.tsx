'use client';

import { useCookieConsent } from '@/hooks/useCookieConsent';
import { Shield } from 'lucide-react';
import Link from 'next/link';

export function CookieConsentBanner() {
  const { hasResponded, acceptAll, rejectAll } = useCookieConsent();

  if (hasResponded) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-on-surface/10 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Message */}
          <div className="flex items-start gap-4 flex-1">
            <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-on-surface mb-2">
                <strong>Respect de votre vie privée</strong>
              </p>
              <p className="text-xs text-on-surface-dim">
                Nous utilisons des cookies pour améliorer votre expérience et analyser notre trafic.
                Consultez notre{' '}
                <Link href="/legal/confidentialite" className="text-primary hover:text-primary-light underline">
                  politique de confidentialité
                </Link>
                {' '}pour plus d'informations.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 flex-shrink-0 w-full md:w-auto">
            <button
              onClick={rejectAll}
              className="flex-1 md:flex-none px-4 py-2 text-sm font-medium text-on-surface border border-on-surface/20 rounded-lg hover:bg-surface-light transition-colors"
            >
              Refuser tout
            </button>
            <button
              onClick={acceptAll}
              className="flex-1 md:flex-none px-6 py-2 text-sm font-medium bg-primary text-background rounded-lg hover:bg-primary-dark transition-colors"
            >
              Accepter tout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
