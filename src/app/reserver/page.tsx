import Link from 'next/link';
import { GuestBookingForm } from '@/components/features/booking/GuestBookingForm';
import { Button } from '@/components/ui/Button';
import { LogIn, Phone } from 'lucide-react';

export default function ReserverPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-on-surface/10 bg-surface sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            Taxi Leblanc
          </Link>

          <div className="flex items-center gap-4">
            <a href="tel:+33608550315">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Appeler
              </Button>
            </a>
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
            Réserver sans compte
          </h1>
          <p className="text-lg text-on-surface-dim">
            Réservez une course en 2 minutes. Pas besoin de créer un compte.
          </p>
        </div>

        {/* Booking Form */}
        <div className="rounded-lg border border-on-surface/10 bg-surface p-8">
          <GuestBookingForm />
        </div>

        {/* Info Section */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-on-surface/10 bg-surface p-6">
            <h3 className="text-lg font-semibold text-on-surface mb-2">📱 Code de réservation</h3>
            <p className="text-on-surface-dim">
              Après votre réservation, vous recevrez un code unique par email pour suivre
              votre course en temps réel.
            </p>
          </div>

          <div className="rounded-lg border border-on-surface/10 bg-surface p-6">
            <h3 className="text-lg font-semibold text-on-surface mb-2">✓ Confirmation immédiate</h3>
            <p className="text-on-surface-dim">
              Votre réservation est confirmée dès la création. Un chauffeur acceptera
              votre course rapidement.
            </p>
          </div>

          <div className="rounded-lg border border-on-surface/10 bg-surface p-6">
            <h3 className="text-lg font-semibold text-on-surface mb-2">🔒 Sécurisé</h3>
            <p className="text-on-surface-dim">
              Vos données sont protégées. Seul votre code + email permettent de retrouver
              votre réservation.
            </p>
          </div>

          <div className="rounded-lg border border-on-surface/10 bg-surface p-6">
            <h3 className="text-lg font-semibold text-on-surface mb-2">🎯 Suivi simplifié</h3>
            <p className="text-on-surface-dim">
              Retrouvez votre réservation sur la page de suivi avec votre code et email.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <p className="text-on-surface-dim mb-4">
            Vous avez un compte ?{' '}
            <Link href="/connexion" className="text-primary font-semibold hover:underline">
              Connectez-vous
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
