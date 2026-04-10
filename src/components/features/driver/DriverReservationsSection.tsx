'use client';

import { useEffect, useState } from 'react';
import { MapPin, Flag, Filter, ArrowUpDown } from 'lucide-react';
import { BookingStatus } from '@/generated/prisma/client';

interface Booking {
  id: string;
  pickupAddress: string;
  dropoffAddress: string;
  distance: number;
  estimatedDuration: number;
  fare: number;
  passengerCount: number;
  status: BookingStatus;
  requestedVehicleType: string;
  createdAt: string;
}

interface Driver {
  id: string;
  user: { name: string };
  status: string;
  rating: number;
  vehicle?: {
    type: string;
    brand: string;
    model: string;
    plateNumber: string;
  };
}

type SortBy = 'date' | 'distance' | 'fare' | 'duration';
type SortOrder = 'asc' | 'desc';

const statusConfig: Record<BookingStatus, { label: string; color: string; bgColor: string }> = {
  PENDING: { label: 'En attente', color: 'text-yellow-400', bgColor: 'bg-yellow-500/10' },
  CONFIRMED: { label: 'Confirmée', color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
  DRIVER_ARRIVED: { label: 'Arrivé', color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
  IN_PROGRESS: { label: 'En cours', color: 'text-orange-400', bgColor: 'bg-orange-500/10' },
  COMPLETED: { label: 'Terminée', color: 'text-green-400', bgColor: 'bg-green-500/10' },
  CANCELLED: { label: 'Annulée', color: 'text-red-400', bgColor: 'bg-red-500/10' },
};

const statusOptions: BookingStatus[] = ['CONFIRMED', 'DRIVER_ARRIVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

export function DriverReservationsSection() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [assignModalBookingId, setAssignModalBookingId] = useState<string | null>(null);
  const [availableDrivers, setAvailableDrivers] = useState<Driver[]>([]);
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, [selectedStatus]);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (selectedStatus) {
        params.append('status', selectedStatus);
      }
      params.append('type', 'assigned');

      const res = await fetch(`/api/driver/bookings?${params.toString()}`);
      if (!res.ok) {
        throw new Error('Erreur lors du chargement des réservations');
      }

      const data = await res.json();
      setBookings(Array.isArray(data) ? data : data.bookings || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  };

  const getSortedBookings = () => {
    const sorted = [...bookings].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'distance':
          comparison = a.distance - b.distance;
          break;
        case 'fare':
          comparison = a.fare - b.fare;
          break;
        case 'duration':
          comparison = a.estimatedDuration - b.estimatedDuration;
          break;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return sorted;
  };

  const openAssignModal = async (bookingId: string) => {
    setAssignModalBookingId(bookingId);
    setLoadingDrivers(true);
    try {
      const res = await fetch('/api/admin/drivers/available');
      if (!res.ok) throw new Error('Erreur lors du chargement des chauffeurs');
      const drivers = await res.json();
      // Filter out current driver if needed, or show all for reassignment
      setAvailableDrivers(drivers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des chauffeurs');
    } finally {
      setLoadingDrivers(false);
    }
  };

  const reassignToDriver = async (bookingId: string, newDriverId: string) => {
    try {
      setUpdatingId(bookingId);
      const res = await fetch(`/api/driver/bookings/${bookingId}/reassign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newDriverId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur lors de la réassignation');
      }

      // Refresh bookings
      await fetchBookings();
      setAssignModalBookingId(null);
      setSuccess(bookingId);
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la réassignation');
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleSortOrder = (newSort: SortBy) => {
    if (sortBy === newSort) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSort);
      setSortOrder('desc');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      month: 'short',
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

  const sortedBookings = getSortedBookings();

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-on-surface mb-2">Mes réservations</h2>
        <p className="text-on-surface-dim">Gérez vos réservations confirmées et actives</p>
      </div>

      {/* Filters & Sorting */}
      <div className="mb-6 space-y-4">
        {/* Status Filter */}
        <div className="flex gap-2 flex-wrap">
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
          {statusOptions.map((status) => (
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

        {/* Sorting Controls */}
        <div className="flex gap-2 flex-wrap items-center">
          <Filter className="w-4 h-4 text-on-surface-dim" />
          <span className="text-sm text-on-surface-dim">Trier par:</span>

          <button
            onClick={() => toggleSortOrder('date')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
              sortBy === 'date'
                ? 'bg-primary/20 text-primary'
                : 'bg-surface border border-on-surface/10 text-on-surface hover:border-on-surface/20'
            }`}
          >
            Date {sortBy === 'date' && <ArrowUpDown className="w-3 h-3" />}
          </button>

          <button
            onClick={() => toggleSortOrder('distance')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
              sortBy === 'distance'
                ? 'bg-primary/20 text-primary'
                : 'bg-surface border border-on-surface/10 text-on-surface hover:border-on-surface/20'
            }`}
          >
            Distance {sortBy === 'distance' && <ArrowUpDown className="w-3 h-3" />}
          </button>

          <button
            onClick={() => toggleSortOrder('fare')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
              sortBy === 'fare'
                ? 'bg-primary/20 text-primary'
                : 'bg-surface border border-on-surface/10 text-on-surface hover:border-on-surface/20'
            }`}
          >
            Tarif {sortBy === 'fare' && <ArrowUpDown className="w-3 h-3" />}
          </button>

          <button
            onClick={() => toggleSortOrder('duration')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
              sortBy === 'duration'
                ? 'bg-primary/20 text-primary'
                : 'bg-surface border border-on-surface/10 text-on-surface hover:border-on-surface/20'
            }`}
          >
            Durée {sortBy === 'duration' && <ArrowUpDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-error/10 text-error">
          {error}
        </div>
      )}

      {/* Reassign Modal */}
      {assignModalBookingId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-lg p-6 max-w-2xl w-full border border-on-surface/10 space-y-4">
            <h3 className="text-lg font-bold text-on-surface">Réassigner cette réservation</h3>

            {loadingDrivers ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
              </div>
            ) : availableDrivers.length > 0 ? (
              <div className="max-h-96 overflow-y-auto space-y-2">
                {availableDrivers.map((driver) => (
                  <button
                    key={driver.id}
                    onClick={() => reassignToDriver(assignModalBookingId, driver.id)}
                    disabled={updatingId === assignModalBookingId}
                    className="w-full text-left p-4 rounded-lg border border-on-surface/10 hover:bg-surface-light hover:border-primary transition-colors disabled:opacity-50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-on-surface">{driver.user.name}</p>
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

      {/* Bookings List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
        </div>
      ) : sortedBookings.length === 0 ? (
        <div className="bg-surface border border-on-surface/10 rounded-lg p-12 text-center">
          <p className="text-on-surface-dim mb-4">Aucune réservation trouvée</p>
          {selectedStatus && (
            <button
              onClick={() => setSelectedStatus(null)}
              className="text-primary hover:underline text-sm"
            >
              Voir toutes les réservations
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedBookings.map((booking) => {
            const config = statusConfig[booking.status];
            return (
              <div
                key={booking.id}
                className="border border-on-surface/10 rounded-lg p-6 hover:border-on-surface/20 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-on-surface">
                      {booking.requestedVehicleType}
                    </h3>
                    <p className="text-xs text-on-surface-dim">
                      {formatDate(booking.createdAt)}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${config.color} ${config.bgColor}`}>
                    {config.label}
                  </div>
                </div>

                {/* Addresses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-surface rounded-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-on-surface-dim flex-shrink-0" />
                    <div>
                      <p className="text-xs text-on-surface-dim uppercase">Départ</p>
                      <p className="text-sm text-on-surface line-clamp-1">{booking.pickupAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flag className="w-4 h-4 text-success flex-shrink-0" />
                    <div>
                      <p className="text-xs text-on-surface-dim uppercase">Destination</p>
                      <p className="text-sm text-on-surface line-clamp-1">{booking.dropoffAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Details Row */}
                <div className="grid grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-on-surface-dim">Distance</p>
                    <p className="font-semibold text-on-surface">{booking.distance.toFixed(1)} km</p>
                  </div>
                  <div>
                    <p className="text-on-surface-dim">Durée</p>
                    <p className="font-semibold text-on-surface">{booking.estimatedDuration}m</p>
                  </div>
                  <div>
                    <p className="text-on-surface-dim">Passagers</p>
                    <p className="font-semibold text-on-surface">{booking.passengerCount}</p>
                  </div>
                  <div>
                    <p className="text-on-surface-dim">Tarif</p>
                    <p className="font-semibold text-primary">{formatPrice(booking.fare)}</p>
                  </div>
                </div>

                {/* Reassign Button - Show for CONFIRMED, DRIVER_ARRIVED only */}
                {['CONFIRMED', 'DRIVER_ARRIVED'].includes(booking.status) && (
                  <div className="flex gap-2 pt-4 border-t border-on-surface/10">
                    <button
                      onClick={() => openAssignModal(booking.id)}
                      disabled={updatingId === booking.id || loadingDrivers}
                      className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-500/10 text-blue-600 border border-blue-500/20 hover:bg-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-1"
                    >
                      🔄 Réassigner
                    </button>
                  </div>
                )}

                {success === booking.id && (
                  <div className="mt-3 p-2 rounded-lg bg-green-500/10 text-green-600 text-sm">
                    ✓ Réassignation réussie
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
