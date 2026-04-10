'use client';

import { useEffect, useState } from 'react';
import { BookingStatus } from '@/generated/prisma/client';
import { BookingCard } from '@/components/features/booking/BookingCard';
import { CpamVoucherModal } from '@/components/features/cpam/CpamVoucherModal';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface Booking {
  id: string;
  pickupAddress: string;
  dropoffAddress: string;
  distance: number;
  estimatedDuration: number;
  price: number;
  passengers: number;
  status: BookingStatus;
  scheduledAt: string | null;
  createdAt: string;
  driverRating: number | null;
  clientRating: number | null;
  isCpam?: boolean;
  driver?: {
    user: {
      name: string;
    };
  } | null;
}

export default function ReservationsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVoucherBookingId, setSelectedVoucherBookingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch('/api/bookings');
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

    fetchBookings();
  }, []);

  const handleCancel = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'POST',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to cancel booking');
      }

      const updated = await res.json();
      setBookings(bookings.map(b => (b.id === bookingId ? updated : b)));
    } catch (err) {
      throw err;
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-serif font-bold text-on-surface mb-2">
            Mes réservations
          </h1>
          <p className="text-lg text-on-surface-dim">
            Historique de vos trajets et statuts
          </p>
        </div>
        <Link href="/dashboard/reserver">
          <Button variant="primary">
            Réserver un trajet →
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin text-4xl mb-4">⟳</div>
          <p className="text-on-surface-dim">Chargement de vos réservations...</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-red-500">{error}</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-on-surface-dim mb-4">Vous n'avez pas encore de réservation</p>
          <Link href="/dashboard/reserver">
            <Button>Réserver maintenant</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => (
            <BookingCard
              key={booking.id}
              id={booking.id}
              pickupAddress={booking.pickupAddress}
              dropoffAddress={booking.dropoffAddress}
              distance={booking.distance}
              estimatedDuration={booking.estimatedDuration}
              price={booking.price}
              passengers={booking.passengers}
              status={booking.status}
              scheduledAt={booking.scheduledAt}
              createdAt={booking.createdAt}
              driverName={booking.driver?.user.name}
              driverRating={booking.driverRating}
              clientRating={booking.clientRating}
              isCpam={booking.isCpam}
              userRole="client"
              onCancel={handleCancel}
              onVoucherClick={() => setSelectedVoucherBookingId(booking.id)}
              onRatingSubmitted={() => {
                // Refetch bookings to update rating status
                const res = fetch('/api/bookings', {
                  credentials: 'include',
                });
                res.then((r) => r.json()).then((data) => setBookings(data));
              }}
            />
          ))}
        </div>
      )}

      {/* CPAM Voucher Modal */}
      <CpamVoucherModal
        bookingId={selectedVoucherBookingId || ''}
        isOpen={!!selectedVoucherBookingId}
        onClose={() => setSelectedVoucherBookingId(null)}
        voucherExists={false}
      />
    </div>
  );
}
