'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { useCookieConsent } from '@/hooks/useCookieConsent';

interface CookieConsentGateProps {
  children: ReactNode;
  /**
   * Optional override message shown above the default explanation.
   * Useful for pages with specific context (e.g. login vs. signup).
   */
  pageLabel?: string;
}

/**
 * Wraps any page/content that requires cookie consent before access.
 * If the user has not yet responded to the consent banner, this renders
 * a blocking placeholder instead of the protected content.
 *
 * The banner itself (CookieConsentModal) is rendered globally in the root
 * layout, so once the user accepts/rejects it, this gate automatically
 * reveals the children without a page reload.
 */
export function CookieConsentGate({ children, pageLabel }: CookieConsentGateProps) {
  const { hasResponded, isLoading } = useCookieConsent();

  // During SSR / hydration do not flash the gate — render nothing
  if (isLoading) {
    return (
      <div className="min-h-[320px] flex items-center justify-center" aria-busy="true" aria-label="Chargement">
        <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }

  if (hasResponded) {
    return <>{children}</>;
  }

  // User has not yet responded — show a friendly blocking state
  return (
    <div
      role="region"
      aria-label="Accès conditionnel au consentement des cookies"
      className="w-full flex flex-col items-center justify-center text-center px-4 py-10 gap-5"
    >
      {/* Lock icon */}
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-primary"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.75" />
          <path
            d="M7 11V7a5 5 0 0110 0v4"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          <circle cx="12" cy="16" r="1.25" fill="currentColor" />
        </svg>
      </div>

      <div className="max-w-xs">
        {pageLabel && (
          <p className="text-xs font-sans text-primary font-semibold uppercase tracking-widest mb-2">
            {pageLabel}
          </p>
        )}
        <h3 className="font-serif font-bold text-on-surface text-lg leading-snug mb-2">
          Consentement requis
        </h3>
        <p className="text-sm text-on-surface-dim font-sans leading-relaxed">
          Pour accéder à cette page, veuillez d&apos;abord indiquer vos préférences de cookies via
          la fenêtre qui s&apos;affiche en bas de l&apos;écran. Cela ne prend que quelques secondes.
        </p>
      </div>

      <div className="flex items-center gap-3 text-xs font-sans text-on-surface-dim/60">
        <a
          href="/legal/confidentialite"
          className="underline underline-offset-2 hover:text-on-surface-dim transition-colors"
        >
          Politique de confidentialité
        </a>
        <span aria-hidden="true">·</span>
        <Link
          href="/"
          className="underline underline-offset-2 hover:text-on-surface-dim transition-colors"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}

export default CookieConsentGate;
