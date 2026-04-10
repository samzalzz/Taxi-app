'use client';

import { BookingStatus } from '@/generated/prisma/client';
import { Button } from '@/components/ui/Button';
import { MapPin, Flag, Calendar, Users, Euro, AlertCircle, Star } from 'lucide-react';
import { useState } from 'react';
import { RatingModal } from './RatingModal';
import { CpamVoucherButton } from '@/components/features/cpam/CpamVoucherButton';

interface BookingCardProps {
  id: string;
  pickupAddress: string;
  dropoffAddress: string;
  distance: number;
  estimatedDuration: number;
  price: number;
  passengers: number;
  status: BookingStatus;
  scheduledAt?: string | null;
  createdAt: string;
  driverName?: string;
  clientName?: string;
  driverRating?: number | null;
  clientRating?: number | null;
  isCpam?: boolean;
  userRole?: 'client' | 'driver'; // User's role
  onCancel?: (id: string) => Promise<void>;
  onRatingSubmitted?: () => void;
  onVoucherClick?: () => void;
}

const statusConfig: Record<BookingStatus, { label: string; color: string; bgColor: string }> = {
  PENDING: { label: 'En attente', color: 'text-yellow-400', bgColor: 'bg-yellow-500/10' },
  CONFIRMED: { label: 'Confirmée', color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
  DRIVER_ARRIVED: { label: 'Chauffeur arrivé', color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
  IN_PROGRESS: { label: 'En cours', color: 'text-orange-400', bgColor: 'bg-orange-500/10' },
  COMPLETED: { label: 'Terminée', color: 'text-green-400', bgColor: 'bg-green-500/10' },
  CANCELLED: { label: 'Annulée', color: 'text-red-400', bgColor: 'bg-red-500/10' },
};

export function BookingCard({
  id,
  pickupAddress,
  dropoffAddress,
  distance,
  estimatedDuration,
  price,
  passengers,
  status,
  scheduledAt,
  createdAt,
  driverName,
  clientName,
  driverRating,
  clientRating,
  isCpam,
  userRole = 'client',
  onCancel,
  onRatingSubmitted,
  onVoucherClick,
}: BookingCardProps) {
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  const config = statusConfig[status];

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

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const canCancel = ['PENDING', 'CONFIRMED'].includes(status);

  const handleCancel = async () => {
    if (!onCancel) return;
    setIsCancelling(true);
    setCancelError(null);
    try {
      await onCancel(id);
    } catch (err) {
      setCancelError(err instanceof Error ? err.message : 'Erreur lors de l\'annulation');
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="border border-on-surface/10 rounded-lg p-6 hover:border-on-surface/20 transition-colors">
      {/* Header with status */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs text-on-surface-dim mb-1">Réservation #{id.slice(-8)}</p>
          <p className="text-sm text-on-surface-dim">{formatDate(createdAt)}</p>
        </div>
        <div className="flex gap-2 items-center">
          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${config.color} ${config.bgColor}`}>
            {config.label}
          </div>
          {isCpam && (
            <span className="px-2 py-1 text-xs bg-blue-500/10 text-blue-400 rounded-full font-semibold border border-blue-500/20">
              CPAM
            </span>
          )}
        </div>
      </div>

      {/* Route */}
      <div className="mb-4 p-4 bg-surface rounded-lg">
        <div className="flex gap-3 mb-3">
          <div className="flex-shrink-0">
            <MapPin className="w-5 h-5 text-primary mt-1" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-on-surface-dim uppercase mb-1">Départ</p>
            <p className="text-on-surface">{pickupAddress}</p>
          </div>
        </div>

        <div className="border-l-2 border-primary/30 ml-2.5 h-4" />

        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <Flag className="w-5 h-5 text-primary mt-1" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-on-surface-dim uppercase mb-1">Destination</p>
            <p className="text-on-surface">{dropoffAddress}</p>
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 py-4 border-y border-on-surface/10">
        <div>
          <p className="text-xs text-on-surface-dim uppercase mb-1">Distance</p>
          <p className="font-semibold text-on-surface">{distance.toFixed(1)} km</p>
        </div>
        <div>
          <p className="text-xs text-on-surface-dim uppercase mb-1">Durée</p>
          <p className="font-semibold text-on-surface">{formatDuration(estimatedDuration)}</p>
        </div>
        <div>
          <p className="text-xs text-on-surface-dim uppercase mb-1">Passagers</p>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-on-surface-dim" />
            <span className="font-semibold text-on-surface">{passengers}</span>
          </div>
        </div>
        <div>
          <p className="text-xs text-on-surface-dim uppercase mb-1">Prix</p>
          <div className="flex items-center gap-1">
            <Euro className="w-4 h-4 text-primary" />
            <span className="font-semibold text-primary">{formatPrice(price)}</span>
          </div>
        </div>
      </div>

      {/* Scheduled info */}
      {scheduledAt && (
        <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex gap-2">
          <Calendar className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-400">
            Prévu pour: {formatDate(scheduledAt)}
          </p>
        </div>
      )}

      {/* Cancel error */}
      {cancelError && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-400">{cancelError}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 flex-wrap">
        {canCancel && (
          <Button
            variant="danger"
            size="sm"
            onClick={handleCancel}
            isLoading={isCancelling}
            disabled={isCancelling}
          >
            Annuler la réservation
          </Button>
        )}

        {/* Rating button for completed trips */}
        {status === 'COMPLETED' && userRole === 'client' && !driverRating && (
          <Button
            size="sm"
            onClick={() => setIsRatingModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Star className="w-4 h-4" />
            Noter le chauffeur
          </Button>
        )}

        {status === 'COMPLETED' && userRole === 'driver' && !clientRating && (
          <Button
            size="sm"
            onClick={() => setIsRatingModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Star className="w-4 h-4" />
            Noter le client
          </Button>
        )}

        {/* CPAM Voucher Button */}
        {isCpam && onVoucherClick && (
          <CpamVoucherButton
            bookingId={id}
            isCpam={isCpam}
            status={status}
            onClick={onVoucherClick}
          />
        )}

        {/* Already rated badge */}
        {status === 'COMPLETED' && userRole === 'client' && driverRating && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span className="text-sm font-medium text-primary">
              Vous avez noté: {driverRating} ★
            </span>
          </div>
        )}

        {status === 'COMPLETED' && userRole === 'driver' && clientRating && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span className="text-sm font-medium text-primary">
              Noté: {clientRating} ★
            </span>
          </div>
        )}
      </div>

      {/* Rating Modal */}
      <RatingModal
        bookingId={id}
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        targetName={userRole === 'client' ? driverName || 'Chauffeur' : clientName || 'Client'}
        role={userRole}
        onSubmitSuccess={() => {
          setIsRatingModalOpen(false);
          onRatingSubmitted?.();
        }}
      />
    </div>
  );
}
