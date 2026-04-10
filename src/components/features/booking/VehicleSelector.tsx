'use client';

import { Car, Truck, Users, Crown } from 'lucide-react';
import { PRICING_RATES, VehicleType } from '@/lib/utils/pricing';
import { PriceEstimate } from '@/lib/hooks/useBooking';
import { formatPrice } from '@/lib/utils/format';

interface VehicleSelectorProps {
  selected: VehicleType | null;
  onSelect: (type: VehicleType) => void;
  priceEstimate: PriceEstimate | null;
}

const ICONS: Record<VehicleType, React.ReactNode> = {
  BERLINE: <Car className="w-8 h-8" />,
  SUV: <Truck className="w-8 h-8" />,
  VAN: <Users className="w-8 h-8" />,
  PREMIUM: <Crown className="w-8 h-8" />,
};

export function VehicleSelector({
  selected,
  onSelect,
  priceEstimate,
}: VehicleSelectorProps) {
  const vehicles: VehicleType[] = ['BERLINE', 'SUV', 'VAN', 'PREMIUM'];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-on-surface">Choisissez votre véhicule</h3>
      <div className="grid grid-cols-2 gap-4">
        {vehicles.map(type => {
          const rate = PRICING_RATES[type];
          const isSelected = selected === type;
          const totalPrice = priceEstimate
            ? (rate.basePrice + priceEstimate.distance * rate.pricePerKm)
            : null;

          return (
            <button
              key={type}
              onClick={() => onSelect(type)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                isSelected
                  ? 'border-primary bg-primary/10'
                  : 'border-on-surface/10 hover:border-on-surface/30'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-primary">{ICONS[type]}</div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <div className="w-2 h-2 bg-background rounded-full" />
                  </div>
                )}
              </div>

              <h4 className="font-semibold text-on-surface mb-1">{rate.label}</h4>
              <p className="text-xs text-on-surface-dim mb-3">{rate.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-on-surface-dim">
                  <Users className="w-3 h-3" />
                  {rate.capacity}
                </div>
                <div className="text-right">
                  <div className="text-xs text-on-surface-dim">
                    {rate.pricePerKm.toFixed(2)} €/km
                  </div>
                  {totalPrice !== null && (
                    <div className="text-sm font-semibold text-primary">
                      {formatPrice(totalPrice)}
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
