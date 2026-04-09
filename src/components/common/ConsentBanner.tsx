'use client';

import { useState } from 'react';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { useCGUConsent } from '@/hooks/useCGUConsent';
import { Shield, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

export function ConsentBanner() {
  const { hasResponded: cookiesResponded, acceptAll: acceptCookies, rejectAll: rejectCookies } = useCookieConsent();
  const { hasResponded: cguResponded, accept: acceptCGU } = useCGUConsent();
  const [expanded, setExpanded] = useState(false);

  // Hide banner only when BOTH cookies AND CGU have been accepted
  const bothAccepted = cookiesResponded && cguResponded;

  if (bothAccepted) {
    return null;
  }

  const handleAcceptAll = () => {
    acceptCookies();
    acceptCGU();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t-2 border-primary shadow-2xl">
      <div className="max-w-7xl mx-auto">
        {/* Header / Summary */}
        <div className="px-6 py-6 flex items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-start gap-4">
              <div className="flex gap-3 mt-1">
                <Shield className="w-5 h-5 text-primary flex-shrink-0" />
                <FileText className="w-5 h-5 text-primary flex-shrink-0" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-on-surface mb-2">
                  Votre consentement est requis
                </h3>
                <p className="text-sm text-on-surface-dim">
                  Avant de continuer, veuillez accepter nos Conditions d'Utilisation et nos politiques de cookies.
                </p>
              </div>
            </div>
          </div>

          {/* Toggle expand button */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex-shrink-0 p-2 hover:bg-surface-light rounded-lg transition-colors"
            aria-label={expanded ? 'Réduire' : 'Développer'}
          >
            {expanded ? (
              <ChevronDown className="w-5 h-5 text-on-surface-dim" />
            ) : (
              <ChevronUp className="w-5 h-5 text-on-surface-dim" />
            )}
          </button>
        </div>

        {/* Expandable details section */}
        {expanded && (
          <div className="px-6 pb-6 border-t border-on-surface/10 pt-6 space-y-6">
            {/* CGU Section */}
            {!cguResponded && (
              <div className="bg-background/40 rounded-lg p-4 border border-on-surface/10">
                <div className="flex gap-3 mb-3">
                  <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-on-surface mb-1">Conditions Générales d'Utilisation</h4>
                    <p className="text-sm text-on-surface-dim">
                      Vous devez accepter nos CGU pour utiliser notre service.
                      <Link href="/legal/conditions" className="text-primary hover:text-primary-light underline ml-1" target="_blank">
                        Consulter les CGU complètes
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Cookies Section */}
            {!cookiesResponded && (
              <div className="bg-background/40 rounded-lg p-4 border border-on-surface/10">
                <div className="flex gap-3 mb-3">
                  <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-on-surface mb-1">Cookies & Confidentialité</h4>
                    <p className="text-sm text-on-surface-dim">
                      Nous utilisons des cookies pour améliorer votre expérience. Les cookies essentiels sont obligatoires.
                      <Link href="/legal/confidentialite" className="text-primary hover:text-primary-light underline ml-1" target="_blank">
                        Politique de confidentialité
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="px-6 py-5 border-t border-on-surface/10 flex flex-col sm:flex-row gap-3 justify-end">
          {cookiesResponded && !cguResponded ? (
            // Only CGU needs response
            <button
              onClick={acceptCGU}
              className="px-6 py-2.5 bg-primary text-background font-semibold rounded-lg hover:bg-primary-dark transition-colors"
            >
              J'accepte les CGU
            </button>
          ) : cguResponded && !cookiesResponded ? (
            // Only cookies need response
            <>
              <button
                onClick={rejectCookies}
                className="flex-1 sm:flex-none px-4 py-2.5 text-sm font-medium text-on-surface border border-on-surface/20 rounded-lg hover:bg-surface-light transition-colors"
              >
                Refuser les cookies
              </button>
              <button
                onClick={acceptCookies}
                className="flex-1 sm:flex-none px-6 py-2.5 bg-primary text-background font-semibold rounded-lg hover:bg-primary-dark transition-colors"
              >
                Accepter les cookies
              </button>
            </>
          ) : (
            // Both need response
            <>
              <button
                onClick={rejectCookies}
                className="flex-1 sm:flex-none px-4 py-2.5 text-sm font-medium text-on-surface border border-on-surface/20 rounded-lg hover:bg-surface-light transition-colors"
              >
                Refuser
              </button>
              <button
                onClick={handleAcceptAll}
                className="flex-1 sm:flex-none px-6 py-2.5 bg-primary text-background font-semibold rounded-lg hover:bg-primary-dark transition-colors"
              >
                J'accepte tout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
