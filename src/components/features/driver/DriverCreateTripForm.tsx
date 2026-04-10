'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDriverCreateBooking } from '@/lib/hooks/useDriverCreateBooking';
import { AddressPicker } from '@/components/features/booking/AddressPicker';
import { VehicleSelector } from '@/components/features/booking/VehicleSelector';
import { PriceEstimate } from '@/components/features/booking/PriceEstimate';
import { Button } from '@/components/ui/Button';
import { MapPin, Phone, User } from 'lucide-react';

export function DriverCreateTripForm() {
  const router = useRouter();
  const [_showAssignModal, setShowAssignModal] = useState(false);
  const {
    formState,
    priceEstimate,
    isSubmitting,
    error,
    bookingResult,
    setClientName,
    setClientPhone,
    setPickup,
    setDropoff,
    setVehicleType,
    setPassengers,
    setLuggage,
    setScheduledAt: _setScheduledAt,
    setClientNotes,
    setIsCpam,
    setIsPublic,
    submitBooking,
    reset,
  } = useDriverCreateBooking();

  // Redirect to available courses when booking is created (if public)
  // For private bookings, stay on page to allow assignment
  useEffect(() => {
    if (bookingResult && formState.isPublic) {
      setTimeout(() => {
        router.push('/dashboard/chauffeur/courses');
      }, 1500);
    }
  }, [bookingResult, formState.isPublic, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitBooking();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-on-surface mb-2">
          Créer une course
        </h1>
        <p className="text-on-surface-dim">
          Créez une nouvelle course pour un client
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-surface rounded-lg p-8 border border-on-surface/10">
        {/* Client Information */}
        <div className="space-y-4 pb-6 border-b border-on-surface/10">
          <h2 className="text-lg font-semibold text-on-surface">Informations client</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">
                <User className="inline-block w-4 h-4 mr-2" />
                Nom du client
              </label>
              <input
                type="text"
                value={formState.clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Jean Dupont"
                className="w-full px-4 py-2 rounded-lg border border-on-surface/10 bg-surface hover:border-on-surface/20 focus:border-primary focus:outline-none text-on-surface"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">
                <Phone className="inline-block w-4 h-4 mr-2" />
                Téléphone du client
              </label>
              <input
                type="tel"
                value={formState.clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="06 12 34 56 78"
                autoComplete="tel"
                className="w-full px-4 py-2 rounded-lg border border-on-surface/10 bg-surface hover:border-on-surface/20 focus:border-primary focus:outline-none text-on-surface"
              />
            </div>
          </div>
        </div>

        {/* Address Selection */}
        <div className="space-y-4 pb-6 border-b border-on-surface/10">
          <h2 className="text-lg font-semibold text-on-surface">Adresses</h2>

          <AddressPicker
            label="Point de départ"
            placeholder="Saisissez l'adresse de départ..."
            value={formState.pickup}
            onSelect={setPickup}
            icon={<MapPin className="w-4 h-4" />}
          />

          <AddressPicker
            label="Point d'arrivée"
            placeholder="Saisissez l'adresse de destination..."
            value={formState.dropoff}
            onSelect={setDropoff}
            icon={<MapPin className="w-4 h-4" />}
          />
        </div>

        {/* Vehicle Selection */}
        {formState.pickup && formState.dropoff && (
          <div className="space-y-4 pb-6 border-b border-on-surface/10">
            <VehicleSelector
              selected={formState.vehicleType}
              onSelect={setVehicleType}
              priceEstimate={priceEstimate}
            />
          </div>
        )}

        {/* Trip Options */}
        {formState.vehicleType && (
          <div className="space-y-4 pb-6 border-b border-on-surface/10">
            <h2 className="text-lg font-semibold text-on-surface">Options de la course</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">
                  Nombre de passagers
                </label>
                <select
                  value={formState.passengers}
                  onChange={(e) => setPassengers(parseInt(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg border border-on-surface/10 bg-surface hover:border-on-surface/20 focus:border-primary focus:outline-none text-on-surface"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                    <option key={n} value={n}>{n} passager{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end pb-1">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formState.luggage}
                    onChange={(e) => setLuggage(e.target.checked)}
                    className="rounded border-on-surface/20"
                  />
                  <span className="text-sm font-medium text-on-surface">
                    Bagages supplémentaires
                  </span>
                </label>
              </div>
            </div>

            <div className="flex items-center pb-1">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formState.isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="rounded border-on-surface/20"
                />
                <span className="text-sm font-medium text-on-surface">
                  Rendre cette course disponible à tous les conducteurs
                </span>
              </label>
            </div>

            <div className="flex items-center pb-1">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formState.isCpam}
                  onChange={(e) => setIsCpam(e.target.checked)}
                  className="rounded border-on-surface/20"
                />
                <span className="text-sm font-medium text-on-surface">
                  Transport CPAM (remboursé par l&apos;Assurance Maladie)
                </span>
                <span className="px-2 py-0.5 text-xs bg-blue-500/10 text-blue-400 rounded-full font-semibold border border-blue-500/20">
                  CPAM
                </span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">
                Notes pour le client
              </label>
              <textarea
                value={formState.clientNotes}
                onChange={(e) => setClientNotes(e.target.value)}
                placeholder="Instructions spéciales pour la course..."
                maxLength={500}
                className="w-full px-4 py-2 rounded-lg border border-on-surface/10 bg-surface hover:border-on-surface/20 focus:border-primary focus:outline-none text-on-surface h-24 resize-none"
              />
              <p className="text-xs text-on-surface-dim mt-1">
                {formState.clientNotes.length}/500
              </p>
            </div>
          </div>
        )}

        {/* Price Estimate */}
        {priceEstimate && (
          <div className="pb-6 border-b border-on-surface/10">
            <PriceEstimate estimate={priceEstimate} />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {bookingResult && (
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 space-y-3">
            <p className="text-sm font-semibold">✓ Course créée avec succès !</p>
            {formState.isPublic ? (
              <>
                <p className="text-sm">La course est <strong>publique</strong> et visible par tous les conducteurs.</p>
                <p className="text-xs text-green-700 mt-2">Redirection vers les courses disponibles...</p>
              </>
            ) : (
              <>
                <p className="text-sm">La course est <strong>privée</strong>. Vous pouvez l&apos;assigner à un conducteur.</p>
                <button
                  type="button"
                  onClick={() => setShowAssignModal(true)}
                  className="text-sm mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Attribuer à un conducteur
                </button>
              </>
            )}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isSubmitting || !formState.pickup || !formState.dropoff || !formState.vehicleType}
            className="flex-1 bg-primary text-background hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Création en cours...' : 'Créer la course'}
          </Button>

          <Button
            type="button"
            onClick={() => {
              reset();
              router.back();
            }}
            variant="secondary"
          >
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
}
