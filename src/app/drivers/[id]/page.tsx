'use client';

import { useEffect, useState, use } from 'react';
import { DriverRatingCard } from '@/components/features/driver/DriverRatingCard';
import { Phone, Award } from 'lucide-react';

interface Driver {
  id: string;
  user: {
    name: string;
    phone?: string;
  };
  rating: number;
  totalTrips: number;
  vehicle?: {
    type: string;
    brand: string;
    model: string;
  };
}

export default function DriverProfilePage(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = use(props.params);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const res = await fetch(`/api/drivers/${params.id}`);
        if (!res.ok) throw new Error('Driver not found');
        const data = await res.json();
        setDriver(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading driver');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDriver();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin text-4xl">⟳</div>
      </div>
    );
  }

  if (error || !driver) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="p-6 rounded-lg bg-red-500/10 text-red-500">
          {error || 'Driver not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Driver Header */}
      <div className="glass p-8 rounded-xl">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center">
            <Award className="w-12 h-12 text-primary" />
          </div>

          <div className="flex-1">
            <h1 className="text-4xl font-serif font-bold text-on-surface mb-4">
              {driver.user.name}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Rating */}
              <div>
                <p className="text-sm text-on-surface-dim mb-1">Note moyenne</p>
                <p className="text-2xl font-bold text-primary">
                  {driver.rating.toFixed(1)} ★
                </p>
              </div>

              {/* Trips */}
              <div>
                <p className="text-sm text-on-surface-dim mb-1">Trajets complétés</p>
                <p className="text-2xl font-bold text-on-surface">
                  {driver.totalTrips}
                </p>
              </div>

              {/* Vehicle */}
              {driver.vehicle && (
                <div>
                  <p className="text-sm text-on-surface-dim mb-1">Véhicule</p>
                  <p className="text-sm text-on-surface">
                    {driver.vehicle.brand} {driver.vehicle.model}
                  </p>
                  <p className="text-xs text-on-surface-dim">
                    {driver.vehicle.type}
                  </p>
                </div>
              )}
            </div>

            {/* Contact */}
            {driver.user.phone && (
              <div className="mt-4 flex items-center gap-2 text-on-surface-dim">
                <Phone className="w-4 h-4" />
                <span className="text-sm">{driver.user.phone}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ratings & Reviews */}
      <DriverRatingCard driverId={params.id} />
    </div>
  );
}
