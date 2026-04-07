'use client';

import { useEffect, useState } from 'react';
import { MapPin, Euro, Calendar, Clock } from 'lucide-react';

interface CompletedTrip {
  id: string;
  pickupAddress: string;
  dropoffAddress: string;
  distance: number;
  price: number;
  estimatedDuration: number;
  completedAt: string;
  requestedVehicleType: string;
}

export function TripHistoryView() {
  const [trips, setTrips] = useState<CompletedTrip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totals, setTotals] = useState({
    count: 0,
    distance: 0,
    earnings: 0,
  });

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch('/api/driver/bookings?status=COMPLETED');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement de l\'historique');
        }

        const data = await response.json();
        const completedTrips = Array.isArray(data) ? data : (data.bookings || []);

        setTrips(completedTrips);

        // Calculate totals
        const totals = {
          count: completedTrips.length,
          distance: completedTrips.reduce((sum: number, trip: CompletedTrip) => sum + trip.distance, 0),
          earnings: completedTrips.reduce((sum: number, trip: CompletedTrip) => sum + trip.price, 0),
        };

        setTotals(totals);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-surface border border-on-surface/10 rounded-lg p-6 text-center">
          <p className="text-sm text-on-surface-dim uppercase font-semibold mb-2">
            Courses complétées
          </p>
          <p className="text-3xl font-bold text-primary">{totals.count}</p>
        </div>
        <div className="bg-surface border border-on-surface/10 rounded-lg p-6 text-center">
          <p className="text-sm text-on-surface-dim uppercase font-semibold mb-2">
            Distance totale
          </p>
          <p className="text-3xl font-bold text-primary">{totals.distance.toFixed(1)} km</p>
        </div>
        <div className="bg-surface border border-on-surface/10 rounded-lg p-6 text-center">
          <p className="text-sm text-on-surface-dim uppercase font-semibold mb-2">
            Revenus
          </p>
          <p className="text-3xl font-bold text-primary">{totals.earnings.toFixed(2)}€</p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 rounded-lg bg-error/10 text-error">
          {error}
        </div>
      )}

      {/* Trips list */}
      {trips.length > 0 ? (
        <div className="space-y-3">
          {trips.map((trip) => {
            const completedDate = new Date(trip.completedAt);
            const formattedDate = completedDate.toLocaleDateString('fr-FR', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });
            const formattedTime = completedDate.toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={trip.id}
                className="bg-surface border border-on-surface/10 rounded-lg p-4 hover:border-primary/30 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-on-surface">{trip.requestedVehicleType}</h3>
                    <p className="text-xs text-on-surface-dim">
                      {formattedDate} à {formattedTime}
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-primary">{trip.price.toFixed(2)}€</p>
                </div>

                <div className="space-y-2 border-t border-on-surface/10 pt-3">
                  <div className="flex gap-3">
                    <MapPin className="w-4 h-4 text-on-surface-dim flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-on-surface-dim">De:</p>
                      <p className="text-on-surface line-clamp-1">{trip.pickupAddress}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <MapPin className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-on-surface-dim">À:</p>
                      <p className="text-on-surface line-clamp-1">{trip.dropoffAddress}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-3 pt-3 border-t border-on-surface/10 text-sm text-on-surface-dim">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {trip.estimatedDuration}m
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {trip.distance.toFixed(1)} km
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-surface border border-on-surface/10 rounded-lg p-12 text-center">
          <p className="text-on-surface-dim">Vous n'avez pas encore de courses complétées</p>
        </div>
      )}
    </div>
  );
}
