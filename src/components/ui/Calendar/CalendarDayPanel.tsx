'use client';

import { CalendarBooking } from '@/lib/hooks/useCalendarData';
import { X } from 'lucide-react';
import { Button } from '../Button';

interface CalendarDayPanelProps {
  date: Date | null;
  bookings: CalendarBooking[];
  onClose: () => void;
  renderStatusBadge: (status: string) => React.ReactNode;
  isAdmin?: boolean;
}

export function CalendarDayPanel({
  date,
  bookings,
  onClose,
  renderStatusBadge,
  isAdmin = false,
}: CalendarDayPanelProps) {
  if (!date) return null;

  const dayBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.scheduledAt || booking.createdAt);
    return (
      bookingDate.getDate() === date.getDate() &&
      bookingDate.getMonth() === date.getMonth() &&
      bookingDate.getFullYear() === date.getFullYear()
    );
  });

  const dateStr = date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed bottom-0 left-0 right-0 lg:absolute lg:bottom-auto lg:left-auto lg:right-0 lg:top-0 bg-surface border border-on-surface/10 rounded-t-lg lg:rounded-lg lg:rounded-r-none max-h-[70vh] lg:max-h-full lg:w-80 overflow-y-auto z-50 lg:z-auto">
        {/* Header */}
        <div className="sticky top-0 bg-surface border-b border-on-surface/10 px-6 py-4 flex items-center justify-between">
          <h3 className="font-semibold text-on-surface capitalize">{dateStr}</h3>
          <button
            onClick={onClose}
            className="text-on-surface-dim hover:text-on-surface transition-colors lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bookings list */}
        <div className="divide-y divide-on-surface/10">
          {dayBookings.length === 0 ? (
            <div className="px-6 py-8 text-center text-on-surface-dim">
              Aucune course pour ce jour
            </div>
          ) : (
            dayBookings.map((booking) => {
              const bookingTime = new Date(
                booking.scheduledAt || booking.createdAt
              ).toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div key={booking.id} className="px-6 py-4 space-y-3">
                  {/* Time and status */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-on-surface">
                      {bookingTime}
                    </span>
                    {renderStatusBadge(booking.status)}
                  </div>

                  {/* Route */}
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-on-surface-dim uppercase mb-1">
                        Départ
                      </p>
                      <p className="text-sm text-on-surface">
                        {booking.pickupAddress}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-on-surface-dim uppercase mb-1">
                        Arrivée
                      </p>
                      <p className="text-sm text-on-surface">
                        {booking.dropoffAddress}
                      </p>
                    </div>
                  </div>

                  {/* Price and distance */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-on-surface-dim">
                      {booking.distance.toFixed(1)} km
                    </span>
                    <span className="font-semibold text-on-surface">
                      {booking.price.toFixed(2)}€
                    </span>
                  </div>

                  {/* Admin-specific info */}
                  {isAdmin && booking.clientId && (
                    <div className="pt-3 border-t border-on-surface/10 text-xs text-on-surface-dim">
                      <p>Client ID: {booking.clientId}</p>
                    </div>
                  )}

                  {/* Driver-specific info */}
                  {!isAdmin && (
                    <div className="pt-3 border-t border-on-surface/10">
                      {booking.createdByDriverId && (
                        <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                          Conducteur
                        </span>
                      )}
                      {!booking.createdByDriverId && (
                        <span className="inline-block px-2 py-1 bg-on-surface/10 text-on-surface-dim rounded text-xs font-medium">
                          Publique
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
