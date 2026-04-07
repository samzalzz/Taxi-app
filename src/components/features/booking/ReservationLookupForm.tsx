'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AlertCircle, CheckCircle, Clock, MapPin, Flag, Loader } from 'lucide-react';

interface ReservationLookupFormProps {
  defaultCode?: string;
  defaultEmail?: string;
}

interface BookingData {
  id: string;
  reservationCode: string;
  pickupAddress: string;
  pickupCity: string;
  dropoffAddress: string;
  dropoffCity: string;
  status: string;
  price: number;
  currency: string;
  distance: number;
  estimatedDuration: number;
  passengers: number;
  luggage: boolean;
  scheduledAt: string | null;
  driverName: string | null;
  createdAt: string;
  pickupAt: string | null;
  dropoffAt: string | null;
  isCpam?: boolean;
}

export function ReservationLookupForm({
  defaultCode = '',
  defaultEmail = '',
}: ReservationLookupFormProps) {
  const [code, setCode] = useState(defaultCode.toUpperCase());
  const [email, setEmail] = useState(defaultEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<BookingData | null>(null);

  // Auto-submit if defaults provided
  useEffect(() => {
    if (defaultCode && defaultEmail) {
      handleSearch();
    }
  }, []);

  const handleSearch = async () => {
    if (!code || !email) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    setError(null);
    setBooking(null);

    try {
      const params = new URLSearchParams({
        code: code.toUpperCase(),
        email,
      });

      const response = await fetch(`/api/bookings/guest/lookup?${params}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Réservation introuvable');
        return;
      }

      const data = await response.json();
      setBooking(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { label: string; bgColor: string; textColor: string; icon: React.ReactNode }
    > = {
      PENDING: {
        label: 'En attente de chauffeur',
        bgColor: 'bg-gray-500/10',
        textColor: 'text-gray-500',
        icon: <Clock className="w-4 h-4" />,
      },
      CONFIRMED: {
        label: 'Confirmée',
        bgColor: 'bg-blue-500/10',
        textColor: 'text-blue-500',
        icon: <CheckCircle className="w-4 h-4" />,
      },
      DRIVER_ARRIVED: {
        label: 'Chauffeur arrivé',
        bgColor: 'bg-yellow-500/10',
        textColor: 'text-yellow-500',
        icon: <MapPin className="w-4 h-4" />,
      },
      IN_PROGRESS: {
        label: 'Trajet en cours',
        bgColor: 'bg-green-500/10',
        textColor: 'text-green-500',
        icon: <CheckCircle className="w-4 h-4" />,
      },
      COMPLETED: {
        label: 'Terminé',
        bgColor: 'bg-green-500/10',
        textColor: 'text-green-500',
        icon: <CheckCircle className="w-4 h-4" />,
      },
      CANCELLED: {
        label: 'Annulé',
        bgColor: 'bg-red-500/10',
        textColor: 'text-red-500',
        icon: <AlertCircle className="w-4 h-4" />,
      },
    };

    const config = statusConfig[status] || statusConfig.PENDING;

    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${config.bgColor} ${config.textColor}`}>
        {config.icon}
        <span className="text-sm font-medium">{config.label}</span>
      </div>
    );
  };

  if (booking) {
    const bookingDate = booking.scheduledAt
      ? new Date(booking.scheduledAt)
      : new Date(booking.createdAt);
    const formattedDate = new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(bookingDate);

    return (
      <div className="space-y-6">
        {/* Booking Details Card */}
        <div className="rounded-lg border border-on-surface/10 bg-surface p-6 space-y-6">
          {/* Header with Code and Status */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-on-surface/10">
            <div>
              <p className="text-xs text-on-surface-dim uppercase tracking-wide mb-1">
                Code de réservation
              </p>
              <p className="text-2xl font-mono font-bold text-primary">{booking.reservationCode}</p>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge(booking.status)}
              {booking.isCpam && (
                <span className="px-2 py-1 text-xs bg-blue-500/10 text-blue-400 rounded-full font-semibold border border-blue-500/20">
                  CPAM
                </span>
              )}
            </div>
          </div>

          {/* Trip Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-on-surface">Trajet</h3>

            <div className="space-y-3">
              {/* Pickup */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-1">
                  <MapPin className="w-5 h-5 text-on-surface-dim" />
                </div>
                <div>
                  <p className="text-xs text-on-surface-dim uppercase">Départ</p>
                  <p className="text-on-surface font-medium">{booking.pickupAddress}</p>
                  <p className="text-sm text-on-surface-dim">{booking.pickupCity}</p>
                </div>
              </div>

              {/* Distance Line */}
              <div className="flex gap-3 pl-2.5">
                <div className="w-0.5 h-8 bg-primary/30" />
              </div>

              {/* Dropoff */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-1">
                  <Flag className="w-5 h-5 text-on-surface-dim" />
                </div>
                <div>
                  <p className="text-xs text-on-surface-dim uppercase">Arrivée</p>
                  <p className="text-on-surface font-medium">{booking.dropoffAddress}</p>
                  <p className="text-sm text-on-surface-dim">{booking.dropoffCity}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trip Info Grid */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-on-surface/10">
            <div>
              <p className="text-xs text-on-surface-dim uppercase mb-1">Distance</p>
              <p className="text-lg font-semibold text-on-surface">
                {booking.distance.toFixed(1)} km
              </p>
            </div>
            <div>
              <p className="text-xs text-on-surface-dim uppercase mb-1">Durée estimée</p>
              <p className="text-lg font-semibold text-on-surface">
                {Math.round(booking.estimatedDuration)} min
              </p>
            </div>
            <div>
              <p className="text-xs text-on-surface-dim uppercase mb-1">Passagers</p>
              <p className="text-lg font-semibold text-on-surface">
                {booking.passengers} personne{booking.passengers > 1 ? 's' : ''}
              </p>
            </div>
            <div>
              <p className="text-xs text-on-surface-dim uppercase mb-1">Bagages</p>
              <p className="text-lg font-semibold text-on-surface">
                {booking.luggage ? 'Oui' : 'Non'}
              </p>
            </div>
          </div>

          {/* Price */}
          <div className="pt-4 border-t border-on-surface/10">
            <p className="text-xs text-on-surface-dim uppercase mb-2">Tarif</p>
            <p className="text-3xl font-bold text-primary">
              {new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: booking.currency,
              }).format(booking.price)}
            </p>
          </div>

          {/* Date */}
          <div className="pt-4 border-t border-on-surface/10">
            <p className="text-xs text-on-surface-dim uppercase mb-1">Date</p>
            <p className="text-on-surface font-medium">{formattedDate}</p>
          </div>

          {/* Driver Info (if assigned) */}
          {booking.driverName && (
            <div className="pt-4 border-t border-on-surface/10 bg-primary/5 p-4 rounded-lg">
              <p className="text-xs text-on-surface-dim uppercase mb-2">Chauffeur assigné</p>
              <p className="text-on-surface font-semibold">{booking.driverName}</p>
            </div>
          )}
        </div>

        {/* New Search Button */}
        <Button
          variant="secondary"
          onClick={() => {
            setBooking(null);
            setCode('');
            setEmail('');
            setError(null);
          }}
          className="w-full"
        >
          Nouvelle recherche
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-on-surface/10 bg-surface p-6 space-y-4">
        <h3 className="text-lg font-semibold text-on-surface">Retrouver votre réservation</h3>

        {error && (
          <div className="flex gap-3 p-4 bg-error/10 border border-error/20 rounded-lg">
            <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
            <p className="text-error text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <Input
            type="email"
            label="Adresse email"
            placeholder="jean@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
          />

          <Input
            type="text"
            label="Code de réservation"
            placeholder="AB3K9X"
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            maxLength={6}
            className="font-mono text-center text-lg tracking-widest"
          />
        </div>

        <Button
          onClick={handleSearch}
          disabled={isLoading || !code || !email}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader className="w-4 h-4 animate-spin mr-2" />
              Recherche en cours...
            </>
          ) : (
            'Rechercher'
          )}
        </Button>
      </div>
    </div>
  );
}
