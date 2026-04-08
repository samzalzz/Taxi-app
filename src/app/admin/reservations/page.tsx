'use client';

import { useEffect, useState } from 'react';
import { MapPin, Flag, Euro, Eye, EyeOff, Check } from 'lucide-react';
import { BookingStatus } from '@prisma/client';

interface Booking {
  id: string;
  clientId: string | null;
  guestName?: string | null;
  guestEmail?: string | null;
  pickupAddress: string;
  dropoffAddress: string;
  distance: number;
  price: number;
  status: BookingStatus;
  isPublic: boolean;
  isCpam?: boolean;
  createdByDriverId?: string | null;
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

const statusOptions: BookingStatus[] = ['PENDING', 'CONFIRMED', 'DRIVER_ARRIVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

export default function AdminReservationsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [statusChangeId, setStatusChangeId] = useState<string | null>(null);
  const [statusChangeError, setStatusChangeError] = useState<string | null>(null);
  const [assignModalBookingId, setAssignModalBookingId] = useState<string | null>(null);
  const [availableDrivers, setAvailableDrivers] = useState<any[]>([]);
  const [loadingDrivers, setLoadingDrivers] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedStatus) {
          params.append('status', selectedStatus);
        }
        const res = await fetch(`/api/admin/bookings?${params.toString()}`);
        if (!res.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    fetchBookings();
  }, [selectedStatus]);

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

  const changeBookingStatus = async (bookingId: string, newStatus: BookingStatus) => {
    try {
      setStatusChangeId(bookingId);
      setStatusChangeError(null);

      const res = await fetch(`/api/admin/bookings/${bookingId}/confirm`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update booking status');
      }

      const updatedBooking = await res.json();

      // Update local state
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: updatedBooking.status } : b
        )
      );

      setSuccess(bookingId);
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setStatusChangeError(err instanceof Error ? err.message : 'Error updating status');
    } finally {
      setStatusChangeId(null);
    }
  };

  const openAssignModal = async (bookingId: string) => {
    setAssignModalBookingId(bookingId);
    setLoadingDrivers(true);
    try {
      const res = await fetch('/api/admin/drivers/available');
      if (!res.ok) throw new Error('Failed to load drivers');
      const drivers = await res.json();
      setAvailableDrivers(drivers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading drivers');
    } finally {
      setLoadingDrivers(false);
    }
  };

  const assignDriverToBooking = async (bookingId: string, driverId: string) => {
    try {
      setUpdatingId(bookingId);
      const res = await fetch(`/api/admin/bookings/${bookingId}/assign-driver`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driverId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to assign driver');
      }

      const updatedBooking = await res.json();
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: updatedBooking.status, driverId: updatedBooking.driverId } : b
        )
      );

      setAssignModalBookingId(null);
      setSuccess(bookingId);
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error assigning driver');
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-on-surface mb-2">
          Réservations
        </h1>
        <p className="text-lg text-on-surface-dim">
          Toutes les réservations de la plateforme
        </p>
      </div>

      {/* Status Filter */}
      <div className="mb-6 flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedStatus(null)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedStatus === null
              ? 'bg-primary text-background'
              : 'bg-surface border border-on-surface/10 text-on-surface hover:border-on-surface/20'
          }`}
        >
          Tous ({bookings.length})
        </button>
        {statusOptions.map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === status
                  ? `${statusConfig[status].bgColor} ${statusConfig[status].color}`
                  : 'bg-surface border border-on-surface/10 text-on-surface hover:border-on-surface/20'
              }`}
            >
              {statusConfig[status].label}
            </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin text-4xl mb-4">⟳</div>
          <p className="text-on-surface-dim">Chargement des réservations...</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-red-500">{error}</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-on-surface-dim">Aucune réservation trouvée</p>
        </div>
      ) : (
        <>
          {/* Assign Driver Modal */}
          {assignModalBookingId && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-surface rounded-lg p-6 max-w-2xl w-full border border-on-surface/10 space-y-4">
                <h3 className="text-lg font-bold text-on-surface">Attribuer un chauffeur</h3>

                {loadingDrivers ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
                  </div>
                ) : availableDrivers.length > 0 ? (
                  <div className="max-h-96 overflow-y-auto space-y-2">
                    {availableDrivers.map((driver) => (
                      <button
                        key={driver.id}
                        onClick={() => assignDriverToBooking(assignModalBookingId, driver.id)}
                        disabled={updatingId === assignModalBookingId}
                        className="w-full text-left p-4 rounded-lg border border-on-surface/10 hover:bg-surface-light hover:border-primary transition-colors disabled:opacity-50"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-on-surface">{driver.user.name}</p>
                            <p className="text-sm text-on-surface-dim">{driver.user.phone}</p>
                            {driver.vehicle && (
                              <p className="text-sm text-on-surface-dim">
                                {driver.vehicle.brand} {driver.vehicle.model} ({driver.vehicle.type})
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                              driver.status === 'AVAILABLE'
                                ? 'bg-green-500/20 text-green-600'
                                : driver.status === 'BUSY'
                                ? 'bg-yellow-500/20 text-yellow-600'
                                : 'bg-gray-500/20 text-gray-600'
                            }`}>
                              {driver.status === 'AVAILABLE' ? 'Disponible' : driver.status === 'BUSY' ? 'Occupé' : 'Hors ligne'}
                            </span>
                            <p className="text-sm text-on-surface-dim mt-2">⭐ {driver.rating.toFixed(1)}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-on-surface-dim text-center py-8">Aucun chauffeur disponible</p>
                )}

                <button
                  onClick={() => setAssignModalBookingId(null)}
                  className="w-full px-4 py-2 rounded-lg border border-on-surface/10 text-on-surface hover:bg-surface-light"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
          {bookings.map(booking => {
            const config = statusConfig[booking.status];
            return (
              <div
                key={booking.id}
                className="border border-on-surface/10 rounded-lg p-6 hover:border-on-surface/20 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-on-surface">
                      Réservation #{booking.id.slice(-8)}
                    </h3>
                    {booking.clientId ? (
                      <p className="text-xs text-on-surface-dim">
                        Client: {booking.clientId.slice(0, 8)}...
                      </p>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-semibold">
                            Invité
                          </span>
                        </div>
                        <p className="text-xs text-on-surface-dim">
                          {booking.guestName || 'Invité'}
                        </p>
                        {booking.guestEmail && (
                          <p className="text-xs text-on-surface-dim">
                            {booking.guestEmail}
                          </p>
                        )}
                      </>
                    )}
                    {booking.createdByDriverId && (
                      <p className="text-xs text-on-surface-dim">
                        Chauffeur: {booking.createdByDriverId.slice(0, 8)}...
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${config.color} ${config.bgColor}`}>
                      {config.label}
                    </div>
                    {booking.isCpam && (
                      <span className="px-2 py-1 text-xs bg-blue-500/10 text-blue-400 rounded-full font-semibold border border-blue-500/20">
                        CPAM
                      </span>
                    )}
                    <button
                      onClick={() => toggleVisibility(booking.id, booking.isPublic)}
                      disabled={updatingId === booking.id}
                      className={`flex items-center gap-2 px-3 py-1 rounded-lg font-medium transition-all text-sm ${
                        booking.isPublic
                          ? 'bg-green-500/10 text-green-600 border border-green-500/20 hover:bg-green-500/20'
                          : 'bg-on-surface/5 text-on-surface-dim border border-on-surface/10 hover:bg-on-surface/10'
                      } ${updatingId === booking.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {booking.isPublic ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                      <span>{booking.isPublic ? 'Publique' : 'Privée'}</span>
                      {success === booking.id && (
                        <Check className="w-4 h-4 text-green-600" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-surface rounded-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-on-surface-dim" />
                    <div>
                      <p className="text-xs text-on-surface-dim">Départ</p>
                      <p className="text-sm text-on-surface">{booking.pickupAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flag className="w-4 h-4 text-on-surface-dim" />
                    <div>
                      <p className="text-xs text-on-surface-dim">Destination</p>
                      <p className="text-sm text-on-surface">{booking.dropoffAddress}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 pt-4 border-t border-on-surface/10">
                  {/* Details Row */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex gap-6">
                      <div>
                        <p className="text-on-surface-dim">Distance</p>
                        <p className="font-semibold text-on-surface">{booking.distance.toFixed(1)} km</p>
                      </div>
                      <div>
                        <p className="text-on-surface-dim">Date</p>
                        <p className="font-semibold text-on-surface">{formatDate(booking.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Euro className="w-4 h-4 text-primary" />
                      <span className="font-bold text-primary">{formatPrice(booking.price)}</span>
                    </div>
                  </div>

                  {/* Status Change Error */}
                  {statusChangeError && booking.id === statusChangeId && (
                    <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
                      <p className="text-sm text-error">{statusChangeError}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {booking.status === 'PENDING' && (
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => openAssignModal(booking.id)}
                        disabled={updatingId === booking.id || loadingDrivers}
                        className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-500/10 text-blue-600 border border-blue-500/20 hover:bg-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        👤 Attribuer chauffeur
                      </button>
                      <button
                        onClick={() => changeBookingStatus(booking.id, 'CONFIRMED')}
                        disabled={statusChangeId === booking.id}
                        className="px-4 py-2 rounded-lg text-sm font-semibold bg-green-500/10 text-green-600 border border-green-500/20 hover:bg-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {statusChangeId === booking.id ? 'Confirmation...' : '✓ Confirmer'}
                      </button>
                      <button
                        onClick={() => changeBookingStatus(booking.id, 'CANCELLED')}
                        disabled={statusChangeId === booking.id}
                        className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-500/10 text-red-600 border border-red-500/20 hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        ✕ Annuler
                      </button>
                    </div>
                  )}

                  {booking.status === 'CONFIRMED' && (
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => changeBookingStatus(booking.id, 'DRIVER_ARRIVED')}
                        disabled={statusChangeId === booking.id}
                        className="px-4 py-2 rounded-lg text-sm font-semibold bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 hover:bg-yellow-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Chauffeur arrivé
                      </button>
                      <button
                        onClick={() => changeBookingStatus(booking.id, 'CANCELLED')}
                        disabled={statusChangeId === booking.id}
                        className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-500/10 text-red-600 border border-red-500/20 hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        ✕ Annuler
                      </button>
                    </div>
                  )}

                  {booking.status === 'DRIVER_ARRIVED' && (
                    <button
                      onClick={() => changeBookingStatus(booking.id, 'IN_PROGRESS')}
                      disabled={statusChangeId === booking.id}
                      className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-500/10 text-blue-600 border border-blue-500/20 hover:bg-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full"
                    >
                      {statusChangeId === booking.id ? 'Démarrage...' : '▶ Démarrer le trajet'}
                    </button>
                  )}

                  {booking.status === 'IN_PROGRESS' && (
                    <button
                      onClick={() => changeBookingStatus(booking.id, 'COMPLETED')}
                      disabled={statusChangeId === booking.id}
                      className="px-4 py-2 rounded-lg text-sm font-semibold bg-green-500/10 text-green-600 border border-green-500/20 hover:bg-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full"
                    >
                      {statusChangeId === booking.id ? 'Finalisation...' : '✓ Terminer le trajet'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        </>
      )}
    </div>
  );
}
