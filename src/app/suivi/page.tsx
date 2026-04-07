'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ReservationLookupForm } from '@/components/features/booking/ReservationLookupForm';
import { Button } from '@/components/ui/Button';
import { LogIn } from 'lucide-react';

function SuiviContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code') || '';
  const email = searchParams.get('email') || '';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-on-surface/10 bg-surface sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            Taxi Leblanc
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/connexion">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                Connexion
              </Button>
            </Link>
            <Link href="/inscription">
              <Button variant="primary" size="sm">
                S'inscrire
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-on-surface mb-3">
            Suivre votre réservation
          </h1>
          <p className="text-lg text-on-surface-dim">
            Entrez votre code de réservation et email pour retrouver votre course
          </p>
        </div>

        {/* Lookup Form */}
        <div className="rounded-lg border border-on-surface/10 bg-surface p-8">
          <ReservationLookupForm defaultCode={code} defaultEmail={email} />
        </div>

        {/* Info Section */}
        <div className="mt-12 space-y-6">
          <div className="rounded-lg border border-on-surface/10 bg-surface p-6">
            <h3 className="text-lg font-semibold text-on-surface mb-2">
              🆔 Où trouver mon code ?
            </h3>
            <p className="text-on-surface-dim">
              Vous avez reçu votre code de réservation par email après votre
              réservation. Il se présente sous la forme de 6 caractères (exemple: AB3K9X).
            </p>
          </div>

          <div className="rounded-lg border border-on-surface/10 bg-surface p-6">
            <h3 className="text-lg font-semibold text-on-surface mb-2">
              ✓ Statuts possibles
            </h3>
            <ul className="space-y-2 text-on-surface-dim">
              <li>
                <span className="font-semibold text-gray-500">En attente</span> — En attente
                d'un chauffeur
              </li>
              <li>
                <span className="font-semibold text-blue-500">Confirmée</span> — Un chauffeur
                a accepté votre course
              </li>
              <li>
                <span className="font-semibold text-yellow-500">Chauffeur arrivé</span> —
                Le chauffeur est à votre lieu de départ
              </li>
              <li>
                <span className="font-semibold text-green-500">En cours</span> — Le trajet
                est en cours
              </li>
              <li>
                <span className="font-semibold text-green-500">Terminé</span> — Votre course
                est terminée
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-on-surface/10 bg-surface p-6">
            <h3 className="text-lg font-semibold text-on-surface mb-2">
              ❓ Besoin d'aide ?
            </h3>
            <p className="text-on-surface-dim mb-4">
              Si vous avez des questions ou des problèmes avec votre réservation, contactez
              notre support.
            </p>
            <Link href="/">
              <Button variant="secondary" className="w-full">
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SuiviPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <SuiviContent />
    </Suspense>
  );
}
