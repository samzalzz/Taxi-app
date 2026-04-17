'use client';

import { PriceEstimate as PriceEstimateType } from '@/lib/hooks/useBooking';
import { formatPrice } from '@/lib/utils/format';

interface PriceEstimateProps {
  estimate: PriceEstimateType | null;
  isLoading?: boolean;
}

export function PriceEstimate({
  estimate,
  isLoading,
}: PriceEstimateProps) {
  const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (isLoading) {
    return (
      <div className="p-6 rounded-lg bg-surface border border-on-surface/10 space-y-3">
        <div className="h-5 bg-on-surface/10 rounded w-20 animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 bg-on-surface/10 rounded w-full animate-pulse" />
          <div className="h-4 bg-on-surface/10 rounded w-3/4 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!estimate) {
    return (
      <div className="p-6 rounded-lg bg-surface border border-on-surface/10">
        <p className="text-sm text-on-surface-dim text-center">
          Sélectionnez une destination et un véhicule pour voir le prix estimé
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg bg-surface border border-on-surface/10 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-on-surface-dim uppercase mb-1">Distance</p>
          <p className="text-lg font-semibold text-on-surface">
            {estimate.distance.toFixed(1)} km
          </p>
        </div>
        <div>
          <p className="text-xs text-on-surface-dim uppercase mb-1">Durée estimée</p>
          <p className="text-lg font-semibold text-on-surface">
            {formatDuration(estimate.estimatedDuration)}
          </p>
        </div>
      </div>

      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex justify-between items-center">
        <span className="font-semibold text-on-surface">Total estimé</span>
        <span className="text-2xl font-bold text-primary">
          {formatPrice(estimate.price)}
        </span>
      </div>

      <p className="text-xs text-on-surface-dim text-center">
        ℹ️ Ceci est une estimation. Le prix final peut varier selon les conditions de circulation et les frais supplémentaires.
      </p>
    </div>
  );
}
