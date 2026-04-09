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
    <>
      {/* Backdrop overlay — blocks interaction with content, but navbar stays above */}
      <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm" aria-hidden="true" />

      {/* Centered modal dialog — navbar (z-50) stays above this (z-40) */}
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
        <div
          className="w-full max-w-2xl bg-surface rounded-2xl shadow-2xl border-2 border-primary overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="consent-title"
        >
          {/* Header / Summary */}
          <div className="px-6 md:px-8 py-6 md:py-8 flex items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-start gap-4">
                <div className="flex gap-3 mt-1">
                  <Shield className="w-6 h-6 text-primary flex-shrink-0" />
                  <FileText className="w-6 h-6 text-primary flex-shrink-0" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 id="consent-title" className="text-xl md:text-2xl font-bold text-on-surface mb-2">
                    Votre consentement est requis
                  </h3>
                  <p className="text-sm md:text-base text-on-surface-dim">
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
              aria-expanded={expanded}
            >
              {expanded ? (
                <ChevronDown className="w-6 h-6 text-on-surface-dim" />
              ) : (
                <ChevronUp className="w-6 h-6 text-on-surface-dim" />
              )}
            </button>
          </div>

          {/* Expandable details section */}
          {expanded && (
            <div className="px-6 md:px-8 pb-6 md:pb-8 border-t border-on-surface/10 pt-6 space-y-6 max-h-64 overflow-y-auto">
              {/* CGU Section */}
              {!cguResponded && (
                <div className="bg-background/40 rounded-lg p-4 border border-primary/20">
                  <div className="flex gap-3">
                    <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-on-surface mb-2">📋 Conditions Générales d'Utilisation</h4>
                      <p className="text-sm text-on-surface-dim mb-2">
                        Vous devez accepter nos CGU pour utiliser notre service.
                      </p>
                      <Link href="/legal/conditions" className="text-primary hover:text-primary-light underline text-sm inline-block" target="_blank">
                        → Consulter les CGU complètes
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Cookies Section */}
              {!cookiesResponded && (
                <div className="bg-background/40 rounded-lg p-4 border border-primary/20">
                  <div className="flex gap-3">
                    <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-on-surface mb-2">🔒 Cookies & Confidentialité</h4>
                      <p className="text-sm text-on-surface-dim mb-2">
                        Nous utilisons des cookies pour améliorer votre expérience. Les cookies essentiels sont obligatoires, les autres nécessitent votre accord.
                      </p>
                      <Link href="/legal/confidentialite" className="text-primary hover:text-primary-light underline text-sm inline-block" target="_blank">
                        → Politique de confidentialité
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="px-6 md:px-8 py-6 md:py-7 border-t border-on-surface/10 bg-background/20 flex flex-col sm:flex-row gap-3 justify-end">
            {cookiesResponded && !cguResponded ? (
              // Only CGU needs response
              <button
                onClick={acceptCGU}
                className="w-full sm:w-auto px-8 py-3 bg-primary text-background font-bold rounded-lg hover:bg-primary-dark transition-all hover:shadow-lg"
              >
                J'accepte les CGU
              </button>
            ) : cguResponded && !cookiesResponded ? (
              // Only cookies need response
              <>
                <button
                  onClick={rejectCookies}
                  className="w-full sm:w-auto px-6 py-3 text-on-surface border-2 border-on-surface/30 rounded-lg hover:bg-surface-light transition-colors font-semibold"
                >
                  Refuser
                </button>
                <button
                  onClick={acceptCookies}
                  className="w-full sm:w-auto px-8 py-3 bg-primary text-background font-bold rounded-lg hover:bg-primary-dark transition-all hover:shadow-lg"
                >
                  Accepter
                </button>
              </>
            ) : (
              // Both need response
              <>
                <button
                  onClick={rejectCookies}
                  className="w-full sm:w-auto px-6 py-3 text-on-surface border-2 border-on-surface/30 rounded-lg hover:bg-surface-light transition-colors font-semibold"
                >
                  Refuser tout
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="w-full sm:w-auto px-8 py-3 bg-primary text-background font-bold rounded-lg hover:bg-primary-dark transition-all hover:shadow-lg"
                >
                  J'accepte tout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
