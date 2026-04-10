'use client';

import { useEffect, useState } from 'react';
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react';
import { BookingStatus } from '@/generated/prisma/client';

interface Booking {
  id: string;
  clientId: string;
  pickupAddress: string;
  dropoffAddress: string;
  distance: number;
  price: number;
  status: BookingStatus;
  isPublic: boolean;
  createdAt: string;
}

const statusConfig: Record<BookingStatus, { label: string; color: string; bgColor: string }> = {
  PENDING: { label: 'En attente', color: 'text-yellow-400', bgColor: 'bg-yellow-500/10' },
  CONFIRMED: { label: 'Confirmée', color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
  DRIVER_ARRIVED: { label: 'Chauffeur arrivé', color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
  IN_PROGRESS: { label: 'En cours', color: 'text-orange-400', bgColor: 'bg-orange-500/10' },
  COMPLETED: { label: 'Terminée', color: 'text-green-400', bgColor: 'bg-green-500/10' },
  CANCELLED: { label: 'Annulée', color: 'text-red-400', bgColor: 'bg-red-500/10' },
};

export function BookingsVisibilityManager() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch('/api/admin/bookings?limit=100');
        if (!res.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const data = await res.json();
        setBookings(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading bookings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const toggleVisibility = async (bookingId: string, currentPublic: boolean) => {
    try {
      setUpdatingId(bookingId);
      setSuccess(null);

      const res = await fetch('/api/admin/bookings/visibility', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          isPublic: !currentPublic,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update visibility');
      }

      const result = await res.json();

      // Update local state
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, isPublic: result.isPublic } : b
        )
      );

      setSuccess(bookingId);
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating visibility');
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex gap-3 p-4 bg-error/10 border border-error rounded-lg">
          <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
          <p className="text-error text-sm">{error}</p>
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="text-center py-12 text-on-surface-dim">
          Aucune course trouvée
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => {
            const config = statusConfig[booking.status];
            const isUpdating = updatingId === booking.id;
            const justUpdated = success === booking.id;

            return (
              <div
                key={booking.id}
                className="bg-surface border border-on-surface/10 rounded-lg p-4 hover:border-on-surface/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left section - Booking info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-on-surface">
                        #{booking.id.slice(-8)}
                      </h3>
                      <div className={`px-2 py-1 rounded text-xs font-semibold ${config.color} ${config.bgColor}`}>
                        {config.label}
                      </div>
                    </div>
                    <p className="text-sm text-on-surface-dim mb-2">
                      {booking.pickupAddress.split(',')[0]} → {booking.dropoffAddress.split(',')[0]}
                    </p>
                    <div className="flex gap-4 text-xs text-on-surface-dim">
                      <span>{booking.distance.toFixed(1)} km</span>
                      <span>{booking.price.toFixed(2)}€</span>
                      <span>{new Date(booking.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>

                  {/* Right section - Visibility toggle */}
                  <div className="flex flex-col items-end gap-2">
                    {justUpdated && (
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <Check className="w-3 h-3" />
                        Mis à jour
                      </div>
                    )}
                    <button
                      onClick={() => toggleVisibility(booking.id, booking.isPublic)}
                      disabled={isUpdating}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        booking.isPublic
                          ? 'bg-green-500/10 text-green-600 border border-green-500/20 hover:bg-green-500/20'
                          : 'bg-on-surface/5 text-on-surface-dim border border-on-surface/10 hover:bg-on-surface/10'
                      } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {booking.isPublic ? (
                        <>
                          <Eye className="w-4 h-4" />
                          <span className="text-sm">Publique</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-4 h-4" />
                          <span className="text-sm">Privée</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info box */}
      <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 mt-6">
        <p className="text-sm text-on-surface-dim">
          <strong>📌 Publique:</strong> La course est visible à tous les chauffeurs et peut être acceptée<br/>
          <strong>🔒 Privée:</strong> La course n&apos;est visible qu&apos;au chauffeur qui l&apos;a créée
        </p>
      </div>
    </div>
  );
}
