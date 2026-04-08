'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { MapPin, Users, Clock, Info } from 'lucide-react';

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
  isCpam?: boolean;
  guestName?: string | null;
  guestEmail?: string | null;
  guestPhone?: string | null;
  clientNotes?: string | null;
  driverNotes?: string | null;
}

interface TripCardProps {
  booking: Booking;
  mode: 'pending' | 'active';
  onAction?: (bookingId: string, action: string) => Promise<void>;
  onShowDetails?: (booking: Booking) => void;
}

export function TripCard({ booking, mode, onAction, onShowDetails }: TripCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async (action: string) => {
    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'pending' && action === 'accept') {
        const response = await fetch(`/api/driver/bookings/${booking.id}/accept`, {
          method: 'POST',
        });

        if (!response.ok) {
          throw new Error('Impossible d\'accepter cette course');
        }

        await onAction?.(booking.id, action);
      } else if (mode === 'active' && action !== 'accept') {
        // Status transition actions
        const newStatus = getNextStatus(booking.status, action);
        const response = await fetch(`/api/driver/bookings/${booking.id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        });

        if (!response.ok) {
          throw new Error('Impossible de mettre à jour le statut');
        }

        await onAction?.(booking.id, action);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  };

  const getNextStatus = (current: string, action: string) => {
    const transitions: Record<string, Record<string, string>> = {
      CONFIRMED: { arrive: 'DRIVER_ARRIVED' },
      DRIVER_ARRIVED: { start: 'IN_PROGRESS' },
      IN_PROGRESS: { complete: 'COMPLETED' },
    };

    return transitions[current]?.[action] || current;
  };

  const getActionLabel = (status: string): string => {
    switch (status) {
      case 'CONFIRMED':
        return 'Je suis arrivé';
      case 'DRIVER_ARRIVED':
        return 'Démarrer le trajet';
      case 'IN_PROGRESS':
        return 'Terminer le trajet';
      default:
        return 'Action';
    }
  };

  const getActionType = (status: string): string => {
    switch (status) {
      case 'CONFIRMED':
        return 'arrive';
      case 'DRIVER_ARRIVED':
        return 'start';
      case 'IN_PROGRESS':
        return 'complete';
      default:
        return 'default';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-warning/20 text-warning';
      case 'CONFIRMED':
        return 'bg-info/20 text-info';
      case 'DRIVER_ARRIVED':
        return 'bg-success/20 text-success';
      case 'IN_PROGRESS':
        return 'bg-primary/20 text-primary';
      case 'COMPLETED':
        return 'bg-success/20 text-success';
      default:
        return 'bg-on-surface/10 text-on-surface';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: 'En attente',
      CONFIRMED: 'Confirmée',
      DRIVER_ARRIVED: 'Arrivé à la prise en charge',
      IN_PROGRESS: 'En cours',
      COMPLETED: 'Terminée',
    };
    return labels[status] || status;
  };

  const pickupTime = new Date(booking.createdAt).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-surface border border-on-surface/10 rounded-lg p-6 space-y-4 hover:border-primary/30 transition-colors">
      {/* Header with status */}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-on-surface mb-2">
            {booking.requestedVehicleType}
          </h3>
          <div className="flex items-center gap-2">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(booking.status)}`}>
              {getStatusLabel(booking.status)}
            </span>
            {booking.isCpam && (
              <span className="px-2 py-1 text-xs bg-blue-500/10 text-blue-400 rounded-full font-semibold border border-blue-500/20">
                CPAM
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">{(booking.fare ?? 0).toFixed(2)}€</p>
          <p className="text-xs text-on-surface-dim">{(booking.distance ?? 0).toFixed(1)} km</p>
        </div>
      </div>

      {/* Addresses */}
      <div className="space-y-3 border-t border-on-surface/10 pt-4">
        <div className="flex gap-3">
          <MapPin className="w-5 h-5 text-on-surface-dim flex-shrink-0 mt-1" />
          <div>
            <p className="text-xs text-on-surface-dim uppercase">Prise en charge</p>
            <p className="text-on-surface text-sm line-clamp-2">{booking.pickupAddress}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <MapPin className="w-5 h-5 text-success flex-shrink-0 mt-1" />
          <div>
            <p className="text-xs text-on-surface-dim uppercase">Destination</p>
            <p className="text-on-surface text-sm line-clamp-2">{booking.dropoffAddress}</p>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-3 gap-4 border-t border-on-surface/10 pt-4">
        <div className="text-center">
          <Clock className="w-4 h-4 text-on-surface-dim mx-auto mb-1" />
          <p className="text-xs text-on-surface-dim">Horaire</p>
          <p className="text-sm font-medium text-on-surface">{pickupTime}</p>
        </div>
        <div className="text-center">
          <Clock className="w-4 h-4 text-on-surface-dim mx-auto mb-1" />
          <p className="text-xs text-on-surface-dim">Durée</p>
          <p className="text-sm font-medium text-on-surface">{booking.estimatedDuration}m</p>
        </div>
        <div className="text-center">
          <Users className="w-4 h-4 text-on-surface-dim mx-auto mb-1" />
          <p className="text-xs text-on-surface-dim">Passagers</p>
          <p className="text-sm font-medium text-on-surface">{booking.passengerCount}</p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-3 rounded-lg bg-error/10 text-error text-sm">
          {error}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col gap-2 pt-4 border-t border-on-surface/10">
        {/* Info Button */}
        <button
          onClick={() => onShowDetails?.(booking)}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-purple-500/10 text-purple-600 border border-purple-500/20 hover:bg-purple-500/20 transition-colors"
        >
          <Info className="w-4 h-4" />
          Plus d'infos
        </button>

        {/* Main Action Buttons */}
        <div className="flex gap-2">
          {mode === 'pending' && booking.status === 'PENDING' && (
            <Button
              onClick={() => handleAction('accept')}
              disabled={isLoading}
              isLoading={isLoading}
              className="flex-1"
              variant="primary"
            >
              Accepter la course
            </Button>
          )}

        {mode === 'active' && ['CONFIRMED', 'DRIVER_ARRIVED', 'IN_PROGRESS'].includes(booking.status) && (
          <>
            <Button
              onClick={() => handleAction(getActionType(booking.status))}
              disabled={isLoading}
              isLoading={isLoading}
              className="flex-1"
              variant="primary"
            >
              {getActionLabel(booking.status)}
            </Button>
            {booking.status === 'CONFIRMED' && (
              <Button
                onClick={() => handleAction('cancel')}
                disabled={isLoading}
                className="flex-1"
                variant="secondary"
              >
                Annuler
              </Button>
            )}
          </>
        )}

          {mode === 'active' && booking.status === 'COMPLETED' && (
            <div className="w-full text-center py-2 text-success font-medium">
              ✓ Course terminée
            </div>
          )}
        </div>
        </div>
    </div>
  );
}
