'use client';

import { useState } from 'react';
import { useGuestBooking } from '@/lib/hooks/useGuestBooking';
import { AddressPicker } from './AddressPicker';
import { VehicleSelector } from './VehicleSelector';
import { PriceEstimate } from './PriceEstimate';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MapPin, Flag, CheckCircle, Copy, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export function GuestBookingForm() {
  const {
    formState,
    priceEstimate,
    isSubmitting,
    error,
    bookingResult,
    setGuestName,
    setGuestEmail,
    setGuestPhone,
    setPickup,
    setDropoff,
    setVehicleType,
    setPassengers,
    setLuggage,
    setScheduledAt,
    setClientNotes,
    setIsCpam,
    submitBooking,
    reset,
  } = useGuestBooking();

  const [codeCopied, setCodeCopied] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showTooSoonModal, setShowTooSoonModal] = useState(false);

  // Generate min datetime (now + 2 hours)
  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 2);
    return now.toISOString().slice(0, 16);
  };

  // Check if a date is too soon (less than 2 hours from now)
  const isTooSoon = (date: string | null): boolean => {
    if (!date) return false; // If no date, it's an immediate booking (which is too soon)

    const selectedDate = new Date(date);
    const now = new Date();
    const diffHours = (selectedDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    return diffHours < 2;
  };

  const copyCodeToClipboard = () => {
    if (bookingResult?.reservationCode) {
      navigator.clipboard.writeText(bookingResult.reservationCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  if (bookingResult) {
    const trackingUrl = `/suivi?code=${bookingResult.reservationCode}&email=${encodeURIComponent(formState.guestEmail)}`;

    return (
      <div className="space-y-6">
        <div className="p-8 rounded-lg bg-primary/10 border-2 border-primary/30 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-on-surface mb-2">
            Réservation enregistrée !
          </h2>
          <p className="text-on-surface-dim mb-6">
            Voici votre code de réservation
          </p>

          {/* Reservation Code Block */}
          <div className="mb-6 flex flex-col items-center">
            <div className="relative mb-4">
              <div
                className="border-2 border-primary rounded-lg px-8 py-6 bg-surface"
                style={{ borderColor: '#f5c518' }}
              >
                <p
                  className="text-4xl font-mono font-bold tracking-widest"
                  style={{ color: '#f5c518' }}
                >
                  {bookingResult.reservationCode}
                </p>
              </div>
              <button
                onClick={copyCodeToClipboard}
                className="absolute top-2 right-2 p-2 rounded-lg bg-surface-light hover:bg-surface border border-on-surface/10 transition-colors"
                title="Copier le code"
              >
                <Copy className="w-4 h-4 text-on-surface" />
              </button>
            </div>
            <p className="text-sm text-on-surface-dim">
              {codeCopied ? '✓ Copié !' : 'Cliquez pour copier'}
            </p>
          </div>

          <p className="text-sm text-on-surface-dim mb-6">
            Un email a été envoyé à{' '}
            <span className="font-medium text-on-surface">{formState.guestEmail}</span>
          </p>

          {/* Trip Summary */}
          <div className="bg-surface rounded-lg p-4 mb-6 text-left space-y-3 border border-on-surface/10">
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-dim">De:</span>
              <span className="text-on-surface font-medium">
                {bookingResult.pickupAddress}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-dim">Vers:</span>
              <span className="text-on-surface font-medium">
                {bookingResult.dropoffAddress}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-dim">Distance:</span>
              <span className="text-on-surface font-medium">
                {bookingResult.distance.toFixed(1)} km
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-dim">Prix:</span>
              <span className="text-on-surface font-bold text-primary">
                {new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                }).format(bookingResult.price)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-dim">Statut:</span>
              <span className="text-on-surface-dim italic">En attente de chauffeur</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <a href={trackingUrl} className="w-full">
              <Button variant="primary" className="w-full">
                Suivre ma réservation →
              </Button>
            </a>
            <Button variant="secondary" onClick={reset} className="w-full">
              Nouvelle réservation
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  return (
    <>
      {/* Too Soon Modal - Less than 2 hours */}
      {showTooSoonModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-lg p-8 max-w-md w-full border border-on-surface/10 space-y-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-warning flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-on-surface mb-2">
                  Délai trop court
                </h3>
                <p className="text-sm text-on-surface-dim">
                  Les réservations doivent être faites au minimum <strong>2 heures à l&apos;avance</strong>. Pour une réservation immédiate, nous vous conseillons d&apos;appeler directement.
                </p>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/30 p-4 rounded-lg">
              <p className="text-sm text-on-surface-dim mb-2">Appelez notre centrale:</p>
              <a
                href="tel:+33608550315"
                className="text-lg font-bold text-primary hover:text-primary-light transition-colors block text-center"
              >
                +33 6 08 55 03 15
              </a>
              <p className="text-xs text-on-surface-dim text-center mt-2">24h/24 - 7j/7</p>
            </div>

            <p className="text-xs text-on-surface-dim text-center">
              Disponible pour les réservations à partir de <strong>2 heures</strong>
            </p>

            <Button
              onClick={() => setShowTooSoonModal(false)}
              variant="primary"
              className="w-full"
            >
              Fermer
            </Button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-lg p-8 max-w-md w-full border border-on-surface/10 space-y-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-on-surface mb-2">
                  Continuer en tant qu&apos;invité?
                </h3>
                <p className="text-sm text-on-surface-dim">
                  Vous pouvez créer un compte maintenant pour faciliter le suivi de vos réservations et bénéficier d&apos;avantages exclusifs.
                </p>
              </div>
            </div>

            <div className="bg-surface-light p-4 rounded-lg space-y-2">
              <p className="text-sm font-medium text-on-surface">Avantages d&apos;un compte:</p>
              <ul className="text-sm text-on-surface-dim space-y-1">
                <li>✓ Historique de vos réservations</li>
                <li>✓ Suivi en temps réel</li>
                <li>✓ Adresses enregistrées</li>
                <li>✓ Paiement simplifié</li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <Link href="/inscription" className="w-full">
                <Button className="w-full" variant="primary">
                  ✓ Créer un compte
                </Button>
              </Link>
              <Button
                onClick={async () => {
                  setShowConfirmModal(false);
                  await submitBooking();
                }}
                variant="secondary"
                className="w-full"
              >
                Continuer en tant qu&apos;invité
              </Button>
              <Button
                onClick={() => setShowConfirmModal(false)}
                variant="outline"
                className="w-full text-on-surface-dim"
              >
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="space-y-8">
      {/* Guest Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-on-surface">Vos coordonnées</h3>

        <Input
          type="text"
          label="Nom complet"
          placeholder="Jean Dupont"
          value={formState.guestName}
          onChange={e => setGuestName(e.target.value)}
          required
        />

        <Input
          type="email"
          label="Email"
          placeholder="jean@example.com"
          value={formState.guestEmail}
          onChange={e => setGuestEmail(e.target.value)}
          autoComplete="email"
          required
        />

        <Input
          type="tel"
          label="Téléphone"
          placeholder="+33 6 12 34 56 78"
          value={formState.guestPhone}
          onChange={e => setGuestPhone(e.target.value)}
          autoComplete="tel"
          required
        />
      </div>

      {/* Addresses Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-on-surface">Votre trajet</h3>
        <div className="relative">
          <AddressPicker
            label="Point de départ"
            placeholder="Entrez votre adresse de départ"
            value={formState.pickup}
            onSelect={setPickup}
            icon={<MapPin className="w-4 h-4" />}
          />
          <div className="absolute left-4 top-12 w-0.5 h-16 bg-gradient-to-b from-primary/50 to-primary/0" />
        </div>

        <AddressPicker
          label="Destination"
          placeholder="Où allez-vous ?"
          value={formState.dropoff}
          onSelect={setDropoff}
          icon={<Flag className="w-4 h-4" />}
        />
      </div>

      {/* Scheduling Section - NOW MANDATORY & PLACED AFTER ADDRESSES */}
      {formState.pickup && formState.dropoff && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-on-surface">Date et heure de départ</h3>
          <p className="text-sm text-on-surface-dim">
            Minimum <strong>2 heures à l&apos;avance</strong>. Pour une prise en charge immédiate, appelez-nous au <a href="tel:+33608550315" className="text-primary font-semibold">+33 6 08 55 03 15</a>
          </p>
          <input
            type="datetime-local"
            value={formState.scheduledAt || ''}
            onChange={e => setScheduledAt(e.target.value || null)}
            min={getMinDateTime()}
            required
            className="w-full px-4 py-3 rounded-lg bg-surface-light text-on-surface border border-on-surface/10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {isTooSoon(formState.scheduledAt) && (
            <p className="text-sm text-error">⚠ Veuillez choisir au minimum 2 heures à l&apos;avance</p>
          )}
        </div>
      )}

      {/* Vehicle Section - AFTER SCHEDULING */}
      {formState.pickup && formState.dropoff && formState.scheduledAt && !isTooSoon(formState.scheduledAt) && (
        <VehicleSelector
          selected={formState.vehicleType}
          onSelect={setVehicleType}
          priceEstimate={priceEstimate}
        />
      )}

      {/* Options Section */}
      {formState.vehicleType && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-on-surface">Options</h3>

          {/* Passengers */}
          <div>
            <label className="block text-sm font-medium text-on-surface mb-3">
              Nombre de passagers
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setPassengers(Math.max(1, formState.passengers - 1))}
                disabled={formState.passengers <= 1}
                className="w-10 h-10 rounded-lg bg-surface border border-on-surface/10 hover:border-on-surface/30 disabled:opacity-50 flex items-center justify-center text-on-surface"
              >
                −
              </button>
              <span className="text-center font-semibold text-on-surface w-12">
                {formState.passengers}
              </span>
              <button
                type="button"
                onClick={() => setPassengers(Math.min(8, formState.passengers + 1))}
                disabled={formState.passengers >= 8}
                className="w-10 h-10 rounded-lg bg-surface border border-on-surface/10 hover:border-on-surface/30 disabled:opacity-50 flex items-center justify-center text-on-surface"
              >
                +
              </button>
            </div>
          </div>

          {/* Luggage */}
          <div>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formState.luggage}
                onChange={e => setLuggage(e.target.checked)}
                className="w-4 h-4 rounded border-on-surface/20 accent-primary"
              />
              <span className="text-sm font-medium text-on-surface">
                Bagages volumineux
              </span>
            </label>
          </div>

          {/* CPAM Transport */}
          <div>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formState.isCpam}
                onChange={e => setIsCpam(e.target.checked)}
                className="w-4 h-4 rounded border-on-surface/20 accent-primary"
              />
              <span className="text-sm font-medium text-on-surface">
                Transport CPAM (remboursé par l&apos;Assurance Maladie)
              </span>
              <span className="px-2 py-0.5 text-xs bg-blue-500/10 text-blue-400 rounded-full font-semibold border border-blue-500/20">
                CPAM
              </span>
            </label>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-on-surface mb-2">
              Remarques (optionnel)
            </label>
            <textarea
              value={formState.clientNotes}
              onChange={e => setClientNotes(e.target.value)}
              placeholder="Ex: Arrêt prévu en chemin, allergies, etc."
              maxLength={500}
              rows={3}
              className="w-full px-4 py-2 rounded-lg bg-surface-light text-on-surface placeholder-on-surface-dim border border-on-surface/10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
            <p className="text-xs text-on-surface-dim mt-1">
              {formState.clientNotes.length}/500 caractères
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
          <p className="text-sm text-error">{error}</p>
        </div>
      )}

      {/* Price Estimate & Submit */}
      {formState.vehicleType && formState.scheduledAt && !isTooSoon(formState.scheduledAt) && priceEstimate && (
        <>
          <PriceEstimate estimate={priceEstimate} />
        </>
      )}

      {/* Submit Button - Always visible */}
      <div className="sticky bottom-0 bg-surface pt-4 border-t border-on-surface/10 -mx-8 -mb-8 px-8 py-4">
        {!formState.guestName || !formState.guestEmail || !formState.guestPhone ? (
          <Button
            type="button"
            disabled={true}
            className="w-full"
            variant="secondary"
          >
            ⚠ Complétez vos coordonnées
          </Button>
        ) : !formState.pickup ? (
          <Button
            type="button"
            disabled={true}
            className="w-full"
            variant="secondary"
          >
            ⚠ Sélectionnez votre point de départ
          </Button>
        ) : !formState.dropoff ? (
          <Button
            type="button"
            disabled={true}
            className="w-full"
            variant="secondary"
          >
            ⚠ Sélectionnez votre destination
          </Button>
        ) : !formState.scheduledAt ? (
          <Button
            type="button"
            disabled={true}
            className="w-full"
            variant="secondary"
          >
            ⚠ Sélectionnez la date et l&apos;heure
          </Button>
        ) : isTooSoon(formState.scheduledAt) ? (
          <Button
            type="button"
            disabled={true}
            className="w-full"
            variant="secondary"
          >
            ⚠ Minimum 2 heures à l&apos;avance requis
          </Button>
        ) : !formState.vehicleType ? (
          <Button
            type="button"
            disabled={true}
            className="w-full"
            variant="secondary"
          >
            ⚠ Choisissez un type de véhicule
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={isSubmitting}
            isLoading={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Création en cours...' : '✓ Réserver'}
          </Button>
        )}
      </div>
    </form>
    </>
  );
}
