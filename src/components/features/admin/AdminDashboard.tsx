'use client';

import { useEffect, useState } from 'react';
import { Users, Zap, CheckCircle, TrendingUp, DollarSign, Settings } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface AdminStats {
  totalUsers: number;
  newUsers: number;
  totalBookings: number;
  completedBookings: number;
  totalRevenue: number;
  averagePrice: number;
}

interface PricingConfig {
  pricePerKm: number;
  pickupCharge: number;
  minimumPrice: number;
  maximumHourlyRate: number;
  reservationImmediateFee: number;
  reservationAdvanceFee: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pricing, setPricing] = useState<PricingConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, pricingRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/pricing'),
        ]);

        if (!statsRes.ok || !pricingRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [statsData, pricingData] = await Promise.all([
          statsRes.json(),
          pricingRes.json(),
        ]);

        setStats(statsData);
        setPricing(pricingData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error/10 border border-error rounded-lg p-4 text-error">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Main Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Total Users */}
          <div className="bg-surface border border-on-surface/10 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold uppercase text-on-surface-dim mb-2">
                  Utilisateurs
                </p>
                <p className="text-3xl font-bold text-on-surface">
                  {stats.totalUsers.toLocaleString('fr-FR')}
                </p>
              </div>
              <Users className="w-8 h-8 text-primary opacity-20" />
            </div>
          </div>

          {/* New Users (Last 30 days) */}
          <div className="bg-surface border border-on-surface/10 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold uppercase text-on-surface-dim mb-2">
                  Nouveaux
                </p>
                <p className="text-3xl font-bold text-on-surface">
                  {stats.newUsers.toLocaleString('fr-FR')}
                </p>
                <p className="text-xs text-on-surface-dim mt-1">
                  (30 derniers jours)
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500 opacity-20" />
            </div>
          </div>

          {/* Total Bookings */}
          <div className="bg-surface border border-on-surface/10 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold uppercase text-on-surface-dim mb-2">
                  Courses
                </p>
                <p className="text-3xl font-bold text-on-surface">
                  {stats.totalBookings.toLocaleString('fr-FR')}
                </p>
              </div>
              <Zap className="w-8 h-8 text-primary opacity-20" />
            </div>
          </div>

          {/* Completed Bookings */}
          <div className="bg-surface border border-on-surface/10 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold uppercase text-on-surface-dim mb-2">
                  Terminées
                </p>
                <p className="text-3xl font-bold text-on-surface">
                  {stats.completedBookings.toLocaleString('fr-FR')}
                </p>
                <p className="text-xs text-on-surface-dim mt-1">
                  {stats.totalBookings > 0
                    ? `${((stats.completedBookings / stats.totalBookings) * 100).toFixed(1)}%`
                    : '0%'}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-primary opacity-20" />
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-surface border border-on-surface/10 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold uppercase text-on-surface-dim mb-2">
                  Revenu total
                </p>
                <p className="text-3xl font-bold text-on-surface">
                  {formatPrice(stats.totalRevenue)}
                </p>
                <p className="text-xs text-on-surface-dim mt-1">
                  Moyenne: {formatPrice(stats.averagePrice)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-primary opacity-20" />
            </div>
          </div>
        </div>
      )}

      {/* Pricing Configuration Widget */}
      {pricing && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Pricing */}
          <div className="bg-surface border border-on-surface/10 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-on-surface">
                Tarifs actuels
              </h3>
              <Settings className="w-5 h-5 text-on-surface-dim" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-on-surface-dim uppercase font-semibold">
                  €/km
                </p>
                <p className="text-2xl font-bold text-on-surface">
                  {pricing.pricePerKm.toFixed(2)}€
                </p>
              </div>

              <div>
                <p className="text-xs text-on-surface-dim uppercase font-semibold">
                  Prise en charge
                </p>
                <p className="text-2xl font-bold text-on-surface">
                  {pricing.pickupCharge.toFixed(2)}€
                </p>
              </div>

              <div>
                <p className="text-xs text-on-surface-dim uppercase font-semibold">
                  Prix minimum
                </p>
                <p className="text-2xl font-bold text-on-surface">
                  {pricing.minimumPrice.toFixed(2)}€
                </p>
              </div>

              <div>
                <p className="text-xs text-on-surface-dim uppercase font-semibold">
                  Max horaire
                </p>
                <p className="text-2xl font-bold text-on-surface">
                  {pricing.maximumHourlyRate.toFixed(2)}€
                </p>
              </div>
            </div>

            <Link href="/admin/tarifs" className="block mt-4">
              <Button fullWidth variant="outline">
                Modifier les tarifs
              </Button>
            </Link>
          </div>

          {/* Reservation Fees */}
          <div className="bg-surface border border-on-surface/10 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-on-surface mb-4">
              Frais de réservation
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-surface-light rounded-lg">
                <span className="text-sm text-on-surface-dim">
                  Réservation immédiate
                </span>
                <span className="font-semibold text-on-surface">
                  {pricing.reservationImmediateFee.toFixed(2)}€
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-surface-light rounded-lg">
                <span className="text-sm text-on-surface-dim">
                  Réservation à l'avance
                </span>
                <span className="font-semibold text-on-surface">
                  {pricing.reservationAdvanceFee.toFixed(2)}€
                </span>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 text-xs text-on-surface-dim mt-4">
              <p className="font-semibold text-on-surface mb-2">
                💡 Exemple de calcul
              </p>
              <p>
                Course de 5 km: {pricing.pickupCharge.toFixed(2)}€ + (5 ×{' '}
                {pricing.pricePerKm.toFixed(2)}€) ={' '}
                {(
                  pricing.pickupCharge +
                  5 * pricing.pricePerKm
                ).toFixed(2)}€
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
