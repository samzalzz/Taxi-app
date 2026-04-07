'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

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
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-serif font-bold text-on-surface mb-4">
          Oups! Une erreur s'est produite
        </h1>
        <p className="text-on-surface-dim mb-8">{error.message || 'Une erreur inattendue'}</p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => reset()}>Réessayer</Button>
          <Button variant="secondary" onClick={() => window.location.href = '/'}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
}
