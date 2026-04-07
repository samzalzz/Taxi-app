'use client';

import { useState } from 'react';
import { useBooking } from '@/lib/hooks/useBooking';
import { AddressPicker } from './AddressPicker';
import { VehicleSelector } from './VehicleSelector';
import { PriceEstimate } from './PriceEstimate';
import { Button } from '@/components/ui/Button';
import { MapPin, Flag, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface BookingFormProps {
  onSuccess?: (bookingId: string) => void;
}

export function BookingForm({ onSuccess }: BookingFormProps) {
  const {
    formState,
    priceEstimate,
    isSubmitting,
    error,
    bookingResult,
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
  } = useBooking();

  const [isScheduled, setIsScheduled] = useState(false);

  // Generate min datetime (now + 30 minutes)
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    return now.toISOString().slice(0, 16);
  };

  if (bookingResult) {
    return (
      <div className="space-y-6">
        <div className="p-8 rounded-lg bg-green-500/10 border-2 border-green-500/30 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-on-surface mb-2">
            Réservation confirmée !
          </h2>
          <p className="text-on-surface-dim mb-6">
            Numéro de réservation: <span className="font-mono text-primary">{bookingResult.id.slice(-8)}</span>
          </p>

          <div className="bg-surface rounded-lg p-4 mb-6 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-dim">De:</span>
              <span className="text-on-surface font-medium">{bookingResult.pickupAddress}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-dim">Vers:</span>
              <span className="text-on-surface font-medium">{bookingResult.dropoffAddress}</span>
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
          </div>

          <div className="flex gap-4">
            <Button variant="secondary" onClick={reset} className="flex-1">
              Nouvelle réservation
            </Button>
            <Link href="/dashboard/reservations" className="flex-1">
              <Button variant="primary" className="w-full">
                Voir mes réservations
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={async e => {
        e.preventDefault();
        await submitBooking();
        onSuccess?.(bookingResult?.id);
      }}
      className="space-y-8"
    >
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

      {/* Vehicle Section */}
      {formState.pickup && formState.dropoff && (
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
              <span className="text-xl font-semibold text-on-surface min-w-12 text-center">
                {formState.passengers}
              </span>
              <button
                type="button"
                onClick={() =>
                  setPassengers(
                    Math.min(
                      8,
                      Math.min(
                        formState.passengers + 1,
                        formState.vehicleType
                          ? { BERLINE: 4, SUV: 5, VAN: 7, PREMIUM: 4 }[
                              formState.vehicleType
                            ]
                          : 8
                      )
                    )
                  )
                }
                disabled={
                  formState.vehicleType &&
                  formState.passengers >=
                    { BERLINE: 4, SUV: 5, VAN: 7, PREMIUM: 4 }[formState.vehicleType]
                }
                className="w-10 h-10 rounded-lg bg-surface border border-on-surface/10 hover:border-on-surface/30 disabled:opacity-50 flex items-center justify-center text-on-surface"
              >
                +
              </button>
            </div>
          </div>

          {/* Luggage */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formState.luggage}
              onChange={e => setLuggage(e.target.checked)}
              className="w-5 h-5 rounded accent-primary"
            />
            <span className="text-on-surface">Bagages en soute</span>
          </label>

          {/* CPAM Transport */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formState.isCpam}
              onChange={e => setIsCpam(e.target.checked)}
              className="w-5 h-5 rounded accent-primary"
            />
            <span className="text-on-surface">Transport CPAM (remboursé par l'Assurance Maladie)</span>
            <span className="px-2 py-0.5 text-xs bg-blue-500/10 text-blue-400 rounded-full font-semibold border border-blue-500/20">
              CPAM
            </span>
          </label>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-on-surface mb-2">
              Notes (optionnel)
            </label>
            <textarea
              value={formState.clientNotes}
              onChange={e => setClientNotes(e.target.value)}
              placeholder="Ex: Arrêt à la pharmacie avant de partir..."
              className="w-full px-4 py-3 rounded-lg border border-on-surface/10 bg-surface text-on-surface placeholder-on-surface-dim focus:border-primary focus:outline-none transition-colors resize-none"
              rows={3}
            />
          </div>
        </div>
      )}

      {/* Schedule Section */}
      {formState.vehicleType && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer flex-1">
              <input
                type="checkbox"
                checked={isScheduled}
                onChange={e => {
                  setIsScheduled(e.target.checked);
                  if (!e.target.checked) setScheduledAt(null);
                }}
                className="w-5 h-5 rounded accent-primary"
              />
              <span className="text-on-surface font-medium">Planifier pour plus tard</span>
            </label>
          </div>

          {isScheduled && (
            <div className="pl-8">
              <label className="block text-sm font-medium text-on-surface-dim mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Date et heure
              </label>
              <input
                type="datetime-local"
                value={formState.scheduledAt || ''}
                onChange={e => setScheduledAt(e.target.value || null)}
                min={getMinDateTime()}
                className="w-full px-4 py-3 rounded-lg border border-on-surface/10 bg-surface text-on-surface focus:border-primary focus:outline-none transition-colors"
              />
              <p className="text-xs text-on-surface-dim mt-1">
                Minimum 30 minutes à l'avance
              </p>
            </div>
          )}
        </div>
      )}

      {/* Price Estimate & Submit */}
      {formState.pickup && formState.dropoff && formState.vehicleType && (
        <div className="space-y-6">
          <PriceEstimate estimate={priceEstimate} />

          {error && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="xl"
            fullWidth
            isLoading={isSubmitting}
            disabled={!priceEstimate || isSubmitting}
          >
            {isScheduled ? 'Planifier la course' : 'Réserver maintenant'}
          </Button>
        </div>
      )}
    </form>
  );
}
