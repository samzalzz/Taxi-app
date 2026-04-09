'use client';

import { useState, useEffect, useId } from 'react';
import { useCookieConsent } from '@/hooks/useCookieConsent';

// ---------------------------------------------------------------------------
// Toggle switch — accessible, themed
// ---------------------------------------------------------------------------
interface ToggleProps {
  id: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
  label: string;
}

function Toggle({ id, checked, disabled = false, onChange, label }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      id={id}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={[
        'relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 transition-colors duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
        disabled
          ? 'cursor-not-allowed border-primary/60 bg-primary/40'
          : checked
          ? 'cursor-pointer border-primary bg-primary'
          : 'cursor-pointer border-on-surface/30 bg-surface-light',
      ].join(' ')}
    >
      <span
        className={[
          'pointer-events-none inline-block h-4 w-4 translate-y-0 rounded-full shadow-md ring-0 transition-transform duration-200',
          'mt-px',
          checked ? 'translate-x-5 bg-background' : 'translate-x-0.5 bg-on-surface-dim',
        ].join(' ')}
      />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Category row
// ---------------------------------------------------------------------------
interface CategoryRowProps {
  title: string;
  description: string;
  examples: string;
  checked: boolean;
  disabled?: boolean;
  toggleId: string;
  onChange: (value: boolean) => void;
}

function CategoryRow({
  title,
  description,
  examples,
  checked,
  disabled = false,
  toggleId,
  onChange,
}: CategoryRowProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-on-surface/10 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="text-left flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            <span className="font-sans font-semibold text-on-surface text-sm">{title}</span>
            <svg
              className={[
                'w-3.5 h-3.5 text-on-surface-dim transition-transform duration-200 shrink-0',
                open ? 'rotate-180' : '',
              ].join(' ')}
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
            >
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {disabled && (
            <span className="text-xs font-sans text-primary border border-primary/40 rounded px-1.5 py-0.5 shrink-0">
              Requis
            </span>
          )}
        </div>
        <Toggle
          id={toggleId}
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          label={`Activer les cookies ${title.toLowerCase()}`}
        />
      </div>

      {open && (
        <div className="px-4 pb-4 border-t border-on-surface/10 bg-background/40">
          <p className="text-sm text-on-surface-dim font-sans mt-3 leading-relaxed">{description}</p>
          <p className="text-xs text-on-surface-dim/70 font-sans mt-2">
            <span className="font-semibold text-on-surface-dim">Exemples :</span> {examples}
          </p>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main modal
// ---------------------------------------------------------------------------
export function CookieConsentModal() {
  const { consentState, hasResponded, isLoading, acceptAll, rejectAll, saveCustom } =
    useCookieConsent();

  const [view, setView] = useState<'banner' | 'details'>('banner');
  const [analyticsChecked, setAnalyticsChecked] = useState(false);
  const [marketingChecked, setMarketingChecked] = useState(false);
  const [preferencesChecked, setPreferencesChecked] = useState(false);

  const modalId = useId();
  const headingId = `cookie-heading-${modalId}`;

  // Sync toggles with stored state when user reopens customisation panel
  useEffect(() => {
    if (consentState) {
      setAnalyticsChecked(consentState.analytics);
      setMarketingChecked(consentState.marketing);
      setPreferencesChecked(consentState.preferences);
    }
  }, [consentState]);

  // Trap focus inside modal when visible
  useEffect(() => {
    if (isLoading || hasResponded) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    return () => {
      previouslyFocused?.focus();
    };
  }, [isLoading, hasResponded]);

  if (isLoading || hasResponded) return null;

  const handleSaveCustom = () => {
    saveCustom({
      analytics: analyticsChecked,
      marketing: marketingChecked,
      preferences: preferencesChecked,
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4"
      >
        <div className="w-full sm:max-w-xl max-h-[95dvh] overflow-y-auto bg-surface border border-on-surface/10 sm:rounded-2xl shadow-2xl flex flex-col">

          {/* ---- Header ---- */}
          <div className="px-6 pt-6 pb-4 border-b border-on-surface/10 flex items-start gap-3">
            <div className="shrink-0 w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
              {/* Shield icon */}
              <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 3L4 7v5c0 5.25 3.4 10.14 8 11.35C16.6 22.14 20 17.25 20 12V7L12 3z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h2
                id={headingId}
                className="font-serif font-bold text-on-surface text-lg leading-snug"
              >
                Votre vie privée nous importe
              </h2>
              <p className="text-xs text-on-surface-dim font-sans mt-0.5">
                Taxi Leblanc — Conformité RGPD &amp; CNIL
              </p>
            </div>
          </div>

          {/* ---- Body ---- */}
          <div className="px-6 py-5 flex-1">

            {view === 'banner' && (
              <>
                <p className="text-sm text-on-surface-dim font-sans leading-relaxed">
                  Nous utilisons des cookies pour assurer le bon fonctionnement de ce site et, avec votre
                  accord, pour mesurer notre audience et vous proposer des contenus adaptés. Certains
                  cookies sont <span className="text-on-surface font-semibold">strictement nécessaires</span> au
                  fonctionnement du service (connexion, sécurité) et ne peuvent être désactivés.
                </p>

                <p className="text-sm text-on-surface-dim font-sans leading-relaxed mt-3">
                  En cliquant sur <span className="text-on-surface font-semibold">« Tout accepter »</span>,
                  vous consentez à l&apos;utilisation de l&apos;ensemble des cookies. En cliquant sur{' '}
                  <span className="text-on-surface font-semibold">« Tout refuser »</span>, seuls les cookies
                  essentiels seront déposés. Vous pouvez également personnaliser vos choix.
                </p>

                {/* Cookie type summary cards */}
                <div className="mt-5 grid grid-cols-2 gap-2.5">
                  {[
                    { icon: '🔒', label: 'Essentiels', note: 'Toujours actifs' },
                    { icon: '📊', label: 'Analytiques', note: 'Avec votre accord' },
                    { icon: '📣', label: 'Marketing', note: 'Avec votre accord' },
                    { icon: '⚙️', label: 'Préférences', note: 'Avec votre accord' },
                  ].map(({ icon, label, note }) => (
                    <div
                      key={label}
                      className="flex items-center gap-2.5 bg-background rounded-lg px-3 py-2.5 border border-on-surface/8"
                    >
                      <span className="text-lg leading-none" aria-hidden="true">{icon}</span>
                      <div>
                        <p className="text-xs font-semibold font-sans text-on-surface">{label}</p>
                        <p className="text-xs font-sans text-on-surface-dim">{note}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-on-surface-dim/70 font-sans mt-4 leading-relaxed">
                  Conformément à la{' '}
                  <span className="font-semibold text-on-surface-dim">Loi Informatique et Libertés</span>,
                  au <span className="font-semibold text-on-surface-dim">RGPD (UE) 2016/679</span> et aux
                  recommandations de la{' '}
                  <span className="font-semibold text-on-surface-dim">CNIL</span>. Responsable du
                  traitement&nbsp;: Taxi Leblanc, Île-de-France.
                </p>
              </>
            )}

            {view === 'details' && (
              <div className="space-y-3">
                <p className="text-sm text-on-surface-dim font-sans leading-relaxed mb-4">
                  Personnalisez vos préférences ci-dessous. Les cookies essentiels ne peuvent pas être
                  désactivés car ils sont indispensables au fonctionnement du site.
                </p>

                <CategoryRow
                  toggleId="toggle-essential"
                  title="Cookies essentiels"
                  description="Ces cookies sont indispensables au fonctionnement du site. Ils permettent la gestion de votre session de connexion, la sécurité des formulaires (protection CSRF) et le mécanisme de consentement lui-même. Ils ne collectent aucune donnée personnelle à des fins commerciales."
                  examples="Session d'authentification, jeton CSRF, préférences de consentement (ce cookie)"
                  checked={true}
                  disabled={true}
                  onChange={() => {}}
                />

                <CategoryRow
                  toggleId="toggle-analytics"
                  title="Cookies analytiques"
                  description="Ces cookies nous aident à comprendre comment les visiteurs utilisent notre site (pages consultées, durée de visite, erreurs rencontrées). Les données sont agrégées et anonymisées. Ces informations nous permettent d'améliorer la qualité du service."
                  examples="Google Analytics (anonymisé), mesure d'audience interne"
                  checked={analyticsChecked}
                  onChange={setAnalyticsChecked}
                />

                <CategoryRow
                  toggleId="toggle-marketing"
                  title="Cookies marketing"
                  description="Ces cookies permettent d'afficher des publicités personnalisées sur d'autres sites et de mesurer l'efficacité de nos campagnes publicitaires. Ils peuvent être déposés par nos partenaires publicitaires."
                  examples="Google Ads, Meta Pixel, remarketing"
                  checked={marketingChecked}
                  onChange={setMarketingChecked}
                />

                <CategoryRow
                  toggleId="toggle-preferences"
                  title="Cookies de préférences"
                  description="Ces cookies mémorisent vos préférences de navigation (langue, région, thème d'affichage) pour vous offrir une expérience plus personnalisée lors de vos prochaines visites."
                  examples="Thème d'affichage, région préférée, langue"
                  checked={preferencesChecked}
                  onChange={setPreferencesChecked}
                />
              </div>
            )}
          </div>

          {/* ---- Footer / CTA ---- */}
          <div className="px-6 pb-6 pt-4 border-t border-on-surface/10 flex flex-col gap-3">

            {/* Primary action row */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={acceptAll}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold font-sans bg-primary text-background hover:bg-primary-dark transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Tout accepter
              </button>

              <button
                onClick={rejectAll}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold font-sans border border-on-surface/20 text-on-surface hover:bg-surface-light transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M5 5l6 6M11 5l-6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                </svg>
                Tout refuser
              </button>
            </div>

            {/* Secondary actions row */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              {view === 'banner' ? (
                <button
                  onClick={() => setView('details')}
                  className="text-xs font-sans text-primary hover:text-primary-light underline underline-offset-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                >
                  Personnaliser mes choix
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setView('banner')}
                    className="text-xs font-sans text-on-surface-dim hover:text-on-surface underline underline-offset-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                  >
                    ← Retour
                  </button>
                  <button
                    onClick={handleSaveCustom}
                    className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-xs font-semibold font-sans bg-surface-light text-on-surface hover:bg-on-surface/10 border border-on-surface/15 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    Enregistrer mes préférences
                  </button>
                </div>
              )}

              <div className="flex items-center gap-3 ml-auto">
                <a
                  href="/legal/confidentialite"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-sans text-on-surface-dim/70 hover:text-on-surface-dim underline underline-offset-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                >
                  Politique de confidentialité
                </a>
                <a
                  href="/legal/conditions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-sans text-on-surface-dim/70 hover:text-on-surface-dim underline underline-offset-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                >
                  CGU
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default CookieConsentModal;
