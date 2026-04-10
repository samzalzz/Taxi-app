'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TripCard } from './TripCard';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BookingClientDetailsModal } from '../booking/BookingClientDetailsModal';

interface Booking {
  id: string;
  clientId: string | null;
  pickupAddress: string;
  dropoffAddress: string;
  distance: number;
  estimatedDuration: number;
  fare: number;
  passengerCount: number;
  status: string;
  requestedVehicleType: string;
  createdAt: string;
  guestName?: string | null;
  guestEmail?: string | null;
  guestPhone?: string | null;
  clientNotes?: string | null;
  driverNotes?: string | null;
}

export function AvailableCoursesView() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [driverStatus, setDriverStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [refreshCounter, setRefreshCounter] = useState<string>('');
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState<Booking | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/driver/bookings?type=pending');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des courses');
        }

        const data = await response.json();
        setBookings(Array.isArray(data) ? data : (data.bookings || []));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchDriverStatus = async () => {
      try {
        // Default to AVAILABLE - would be fetched from /api/driver/status in production
        setDriverStatus('AVAILABLE');
      } catch (err) {
        console.error('Error fetching driver status:', err);
      }
    };

    fetchBookings();
    fetchDriverStatus();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchBookings();
      setLastRefresh(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Update refresh counter every second
  useEffect(() => {
    const counter = setInterval(() => {
      const seconds = Math.floor((Date.now() - lastRefresh.getTime()) / 1000);
      if (seconds < 60) {
        setRefreshCounter(`Actualisé il y a ${seconds}s`);
      } else {
        const minutes = Math.floor(seconds / 60);
        setRefreshCounter(`Actualisé il y a ${minutes}m`);
      }
    }, 1000);

    return () => clearInterval(counter);
  }, [lastRefresh]);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/driver/bookings?type=pending');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des courses');
      }

      const data = await response.json();
      setBookings(Array.isArray(data) ? data : (data.bookings || []));
      setLastRefresh(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTripAccepted = async (bookingId: string) => {
    // Remove accepted booking from list and redirect to dashboard
    setBookings(bookings.filter(b => b.id !== bookingId));

    // Small delay before redirect for better UX
    setTimeout(() => {
      router.push('/dashboard/chauffeur');
    }, 500);
  };

  if (isLoading && bookings.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Warning banner if driver is not available */}
      {driverStatus !== 'AVAILABLE' && (
        <div className="bg-warning/10 border border-warning rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-warning mb-1">Vous n&apos;êtes pas disponible</p>
            <p className="text-sm text-on-surface-dim">
              Activez votre statut &quot;Disponible&quot; dans le tableau de bord pour accepter des courses.
            </p>
          </div>
        </div>
      )}

      {/* Refresh control */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button
            onClick={handleRefresh}
            disabled={isLoading}
            variant="secondary"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <p className="text-xs text-on-surface-dim">{refreshCounter}</p>
        </div>
        <p className="text-sm font-medium text-on-surface">
          {bookings.length} course{bookings.length !== 1 ? 's' : ''} disponible{bookings.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 rounded-lg bg-error/10 text-error">
          {error}
        </div>
      )}

      {/* Bookings list */}
      {bookings.length > 0 ? (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <TripCard
              key={booking.id}
              booking={booking}
              mode="pending"
              onAction={handleTripAccepted}
              onShowDetails={setSelectedBookingForDetails}
            />
          ))}
        </div>
      ) : (
        <div className="bg-surface border border-on-surface/10 rounded-lg p-12 text-center">
          <p className="text-on-surface-dim mb-4">Aucune course disponible pour le moment</p>
          <p className="text-sm text-on-surface-dim">
            Les courses apparaîtront ici une fois que des clients placeront des réservations.
          </p>
        </div>
      )}

      {/* Client Details Modal - Show only useful info for drivers */}
      {selectedBookingForDetails && (
        <BookingClientDetailsModal
          booking={selectedBookingForDetails}
          isOpen={!!selectedBookingForDetails}
          isAdmin={false}
          onClose={() => setSelectedBookingForDetails(null)}
        />
      )}
    </div>
  );
}
