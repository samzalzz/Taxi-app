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
      {/* Backdrop overlay — blocks interaction with content behind */}
      <div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm" aria-hidden="true" />

      {/* Modal panel — anchored to bottom, always visible (below navbar) */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 bg-surface shadow-2xl border-t-2 border-primary"
        role="dialog"
        aria-modal="true"
        aria-labelledby="consent-title"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header / Summary */}
          <div className="px-6 py-6 md:py-8 flex items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-start gap-4">
                <div className="flex gap-3 mt-1">
                  <Shield className="w-6 h-6 text-primary flex-shrink-0" />
                  <FileText className="w-6 h-6 text-primary flex-shrink-0" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 id="consent-title" className="text-lg md:text-xl font-bold text-on-surface mb-2">
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
            <div className="px-6 pb-6 md:pb-8 border-t border-on-surface/10 pt-6 space-y-6">
              {/* CGU Section */}
              {!cguResponded && (
                <div className="bg-background/40 rounded-lg p-4 border border-primary/20">
                  <div className="flex gap-3 mb-3">
                    <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-on-surface mb-2">📋 Conditions Générales d'Utilisation</h4>
                      <p className="text-sm text-on-surface-dim">
                        Vous devez accepter nos CGU pour utiliser notre service.
                      </p>
                      <Link href="/legal/conditions" className="text-primary hover:text-primary-light underline text-sm mt-2 inline-block" target="_blank">
                        → Consulter les CGU complètes
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Cookies Section */}
              {!cookiesResponded && (
                <div className="bg-background/40 rounded-lg p-4 border border-primary/20">
                  <div className="flex gap-3 mb-3">
                    <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-on-surface mb-2">🔒 Cookies & Confidentialité</h4>
                      <p className="text-sm text-on-surface-dim">
                        Nous utilisons des cookies pour améliorer votre expérience. Les cookies essentiels sont obligatoires, les autres nécessitent votre accord.
                      </p>
                      <Link href="/legal/confidentialite" className="text-primary hover:text-primary-light underline text-sm mt-2 inline-block" target="_blank">
                        → Politique de confidentialité
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="px-6 py-5 md:py-6 border-t border-on-surface/10 flex flex-col sm:flex-row gap-3 justify-end">
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
                  Refuser les cookies
                </button>
                <button
                  onClick={acceptCookies}
                  className="w-full sm:w-auto px-8 py-3 bg-primary text-background font-bold rounded-lg hover:bg-primary-dark transition-all hover:shadow-lg"
                >
                  Accepter les cookies
                </button>
              </>
            ) : (
              // Both need response
              <>
                <button
                  onClick={rejectCookies}
                  className="w-full sm:w-auto px-6 py-3 text-on-surface border-2 border-on-surface/30 rounded-lg hover:bg-surface-light transition-colors font-semibold"
                >
                  Refuser
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
