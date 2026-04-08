'use client';

import { useEffect, useState } from 'react';
import { Calendar, Lock, Globe } from 'lucide-react';

interface UpcomingBooking {
  id: string;
  pickupAddress: string;
  dropoffAddress: string;
  distance: number;
  estimatedDuration: number;
  price: number;
  scheduledAt: string;
  isPublic: boolean;
  createdByDriverId?: string | null;
  client?: {
    name: string;
  };
}

export function UpcomingCoursesSection() {
  const [bookings, setBookings] = useState<UpcomingBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUpcomingBookings = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/driver/bookings?type=upcoming');
        if (!response.ok) {
          throw new Error('Failed to fetch upcoming bookings');
        }

        const data = await response.json();
        setBookings(data || []);
      } catch (err) {
        console.error('Error fetching upcoming bookings:', err);
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUpcomingBookings();
  }, []);

  const formatDate = (isoDate: string) => {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(isoDate));
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  if (isLoading) {
    return (
      <div className="bg-surface border border-on-surface/10 rounded-lg p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto"></div>
        <p className="text-on-surface-dim mt-4">Chargement des courses à venir...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-surface border border-on-surface/10 rounded-lg p-8">
        <p className="text-red-600">Erreur: {error}</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-surface border border-on-surface/10 rounded-lg p-8 text-center">
        <Calendar className="w-12 h-12 text-on-surface-dim mx-auto mb-4 opacity-50" />
        <p className="text-on-surface mb-2">Aucune course planifiée</p>
        <p className="text-sm text-on-surface-dim">
          Vous n'avez pas de courses planifiées pour les 7 prochains jours
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-on-surface mb-4">Courses à venir</h2>
        <p className="text-sm text-on-surface-dim mb-4">
          {bookings.length} course{bookings.length > 1 ? 's' : ''} planifiée{bookings.length > 1 ? 's' : ''} pour les 7 prochains jours
        </p>
      </div>

      <div className="space-y-3">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-surface border border-on-surface/10 rounded-lg p-4 hover:border-primary/30 transition-colors"
          >
            {/* Header with date and visibility */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="font-semibold text-on-surface">
                  {formatDate(booking.scheduledAt)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {booking.isPublic ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-blue-500/10 text-blue-600 text-xs font-medium">
                    <Globe className="w-3 h-3" />
                    Publique
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-yellow-500/10 text-yellow-600 text-xs font-medium">
                    <Lock className="w-3 h-3" />
                    Privée
                  </span>
                )}
              </div>
            </div>

            {/* Routes */}
            <div className="flex items-start gap-3 mb-3">
              <div className="flex flex-col items-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <div className="w-0.5 h-12 bg-on-surface/20" />
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <p className="text-xs text-on-surface-dim uppercase font-semibold mb-1">Départ</p>
                  <p className="text-sm text-on-surface line-clamp-2">{booking.pickupAddress}</p>
                </div>
                <div>
                  <p className="text-xs text-on-surface-dim uppercase font-semibold mb-1">Arrivée</p>
                  <p className="text-sm text-on-surface line-clamp-2">{booking.dropoffAddress}</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-on-surface/10">
              <div>
                <p className="text-xs text-on-surface-dim mb-1">Distance</p>
                <p className="text-sm font-semibold text-on-surface">
                  {booking.distance.toFixed(1)} km
                </p>
              </div>
              <div>
                <p className="text-xs text-on-surface-dim mb-1">Durée estimée</p>
                <p className="text-sm font-semibold text-on-surface">
                  {formatDuration(booking.estimatedDuration)}
                </p>
              </div>
              <div>
                <p className="text-xs text-on-surface-dim mb-1">Prix</p>
                <p className="text-sm font-semibold text-primary">
                  {booking.price.toFixed(2)}€
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
