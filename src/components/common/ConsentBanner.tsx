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
      {/* Backdrop overlay — covers everything (navbar included) for RGPD compliance */}
      <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md" aria-hidden="true" />

      {/* Modal Dialog centered on viewport, above the navbar */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center overflow-y-auto p-4">
        <div
          className="w-full max-w-2xl bg-surface rounded-3xl shadow-2xl border-2 border-primary overflow-hidden animate-in fade-in zoom-in-95 duration-300 my-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="consent-title"
        >
          {/* Header Section */}
          <div className="bg-gradient-to-r from-primary/10 to-background px-6 md:px-8 py-8 md:py-10 flex items-start justify-between gap-6 border-b border-primary/30">
            <div className="flex-1">
              <div className="flex items-start gap-4">
                <div className="flex gap-2 mt-1">
                  <Shield className="w-7 h-7 text-primary flex-shrink-0" />
                  <FileText className="w-7 h-7 text-primary flex-shrink-0" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 id="consent-title" className="text-2xl md:text-3xl font-bold text-on-surface mb-3">
                    Votre consentement est requis
                  </h2>
                  <p className="text-sm md:text-base text-on-surface-dim leading-relaxed">
                    Avant de continuer, veuillez accepter nos Conditions d&apos;Utilisation et nos politiques de cookies.
                  </p>
                </div>
              </div>
            </div>

            {/* Expand Toggle */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex-shrink-0 p-2 hover:bg-surface-light rounded-lg transition-colors duration-200"
              aria-label={expanded ? 'Réduire' : 'Développer'}
              aria-expanded={expanded}
            >
              {expanded ? (
                <ChevronDown className="w-6 h-6 text-primary" />
              ) : (
                <ChevronUp className="w-6 h-6 text-primary" />
              )}
            </button>
          </div>

          {/* Expandable Content Section */}
          {expanded && (
            <div className="px-6 md:px-8 py-8 border-b border-on-surface/10 space-y-5 max-h-72 overflow-y-auto">
              {/* CGU Card */}
              {!cguResponded && (
                <div className="bg-background/50 rounded-xl p-5 border-2 border-primary/40 hover:border-primary/60 transition-colors">
                  <div className="flex gap-4">
                    <FileText className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-bold text-on-surface mb-2 text-lg">📋 Conditions Générales d&apos;Utilisation</h3>
                      <p className="text-sm text-on-surface-dim mb-3 leading-relaxed">
                        Vous devez accepter nos CGU pour utiliser notre service. Elles définissent les règles d&apos;utilisation et vos droits.
                      </p>
                      <Link href="/legal/conditions" className="text-primary hover:text-primary-light font-semibold underline text-sm inline-flex items-center gap-1" target="_blank">
                        Consulter les CGU complètes →
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Cookies Card */}
              {!cookiesResponded && (
                <div className="bg-background/50 rounded-xl p-5 border-2 border-primary/40 hover:border-primary/60 transition-colors">
                  <div className="flex gap-4">
                    <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-bold text-on-surface mb-2 text-lg">🔒 Cookies & Confidentialité</h3>
                      <p className="text-sm text-on-surface-dim mb-3 leading-relaxed">
                        Nous utilisons des cookies pour améliorer votre expérience. Les essentiels sont obligatoires, les autres nécessitent votre accord.
                      </p>
                      <Link href="/legal/confidentialite" className="text-primary hover:text-primary-light font-semibold underline text-sm inline-flex items-center gap-1" target="_blank">
                        Politique de confidentialité →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer / Action Buttons */}
          <div className="px-6 md:px-8 py-6 md:py-8 bg-background/80 border-t border-primary/20 flex flex-col sm:flex-row gap-4 justify-end items-stretch sm:items-center">
            {cookiesResponded && !cguResponded ? (
              <button
                onClick={acceptCGU}
                className="px-8 py-3.5 bg-primary text-background font-bold rounded-xl hover:bg-primary-dark transition-all duration-200 hover:shadow-xl text-base"
              >
                J&apos;accepte les CGU
              </button>
            ) : cguResponded && !cookiesResponded ? (
              <>
                <button
                  onClick={rejectCookies}
                  className="px-6 py-3.5 text-on-surface border-2 border-on-surface/40 rounded-xl hover:bg-surface-light transition-all duration-200 font-semibold text-base"
                >
                  Refuser
                </button>
                <button
                  onClick={acceptCookies}
                  className="px-8 py-3.5 bg-primary text-background font-bold rounded-xl hover:bg-primary-dark transition-all duration-200 hover:shadow-xl text-base"
                >
                  Accepter
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={rejectCookies}
                  className="px-6 py-3.5 text-on-surface border-2 border-on-surface/40 rounded-xl hover:bg-surface-light transition-all duration-200 font-semibold text-base"
                >
                  Refuser tout
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-8 py-3.5 bg-primary text-background font-bold rounded-xl hover:bg-primary-dark transition-all duration-200 hover:shadow-xl text-base"
                >
                  J&apos;accepte tout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
