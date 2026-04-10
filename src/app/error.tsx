'use client';

import { useEffect } from 'react';
import { Logo } from '@/components/ui/Logo';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {/* Logo */}
        <div className="mb-12">
          <Logo href="/" className="h-16 w-auto mx-auto" />
        </div>

        {/* Error Content */}
        <div className="space-y-6">
          <div>
            <h1 className="text-5xl font-bold text-primary mb-4">⚠️</h1>
            <p className="text-4xl font-bold text-on-surface mb-4">
              Une erreur s&apos;est produite
            </p>
            <p className="text-lg text-on-surface-dim mb-8">
              {error.message || 'Une erreur inattendue. Veuillez réessayer.'}
            </p>
          </div>

          {/* Illustration */}
          <div className="py-8">
            <div className="text-6xl">🚗</div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <button
              onClick={() => reset()}
              className="px-8 py-3 bg-primary text-background rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              Réessayer
            </button>
            <Link href="/">
              <button className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition-colors">
                Retour à l&apos;accueil
              </button>
            </Link>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-16 pt-8 border-t border-on-surface/10">
          <p className="text-sm text-on-surface-dim mb-4">
            Le problème persiste ? Contactez-nous
          </p>
          <a
            href="mailto:TaxiLeblanc@gmail.com"
            className="text-primary hover:text-primary-light transition-colors font-semibold"
          >
            TaxiLeblanc@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
