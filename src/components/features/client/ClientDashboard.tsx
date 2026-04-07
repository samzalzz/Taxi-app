'use client';

import { useEffect, useState } from 'react';
import { MapPin, Euro, TrendingUp, Star } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatCardSkeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';

interface ClientStats {
  completedTrips: number;
  totalDistance: number;
  totalSpent: number;
  rating: number;
}

export function ClientDashboard() {
  const [stats, setStats] = useState<ClientStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { error: showError } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/users/me/stats');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des statistiques');
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur inconnue';
        showError(message, 'Erreur de chargement');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [showError]);

  const StatCard = ({
    icon: Icon,
    label,
    value,
    unit
  }: {
    icon: any;
    label: string;
    value: string | number;
    unit?: string;
  }) => (
    <Card variant="stat" className="card-stat-glow">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-on-surface-dim uppercase font-semibold">
          {label}
        </p>
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <p className="text-3xl font-bold text-primary">{value}</p>
      {unit && <p className="text-xs text-on-surface-dim">{unit}</p>}
    </Card>
  );

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={TrendingUp}
            label="Trajets complétés"
            value={stats.completedTrips}
          />
          <StatCard
            icon={MapPin}
            label="Distance totale"
            value={stats.totalDistance.toFixed(1)}
            unit="km"
          />
          <StatCard
            icon={Euro}
            label="Dépensé"
            value={stats.totalSpent.toFixed(2)}
            unit="€"
          />
          <StatCard
            icon={Star}
            label="Évaluation"
            value={stats.rating.toFixed(1)}
            unit="★"
          />
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/dashboard/reserver">
          <Button className="w-full">Réserver un trajet</Button>
        </Link>
        <Link href="/dashboard/reservations">
          <Button className="w-full" variant="secondary">
            Mes réservations
          </Button>
        </Link>
      </div>
    </div>
  );
}
