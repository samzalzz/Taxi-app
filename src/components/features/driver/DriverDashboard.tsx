'use client';

import { useEffect, useState } from 'react';
import { DriverStatusToggle } from './DriverStatusToggle';
import { TripCard } from './TripCard';
import { UpcomingCoursesSection } from './UpcomingCoursesSection';
import { DriverReservationsSection } from './DriverReservationsSection';
import { DriverCpamSettings } from './DriverCpamSettings';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { StatCardSkeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';

interface DriverStats {
  totalTrips: number;
  totalEarnings: number;
  completedToday: number;
  rating: number;
}

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
  guestName?: string | null;
  guestEmail?: string | null;
  guestPhone?: string | null;
  clientNotes?: string | null;
  driverNotes?: string | null;
}

interface DriverDashboardProps {
  userId: string;
}

export function DriverDashboard({ userId: _userId }: DriverDashboardProps) {
  // const router = useRouter();
  const [stats, setStats] = useState<DriverStats | null>(null);
  const [activeTrip, setActiveTrip] = useState<Booking | null>(null);
  const [driverStatus, setDriverStatus] = useState<'OFFLINE' | 'AVAILABLE' | 'ON_BREAK'>('OFFLINE');
  const [isLoading, setIsLoading] = useState(true);
  const { error: showError } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [statsRes, bookingsRes] = await Promise.all([
          fetch('/api/driver/stats'),
          fetch('/api/driver/bookings?type=assigned'),
        ]);

        if (!statsRes.ok || !bookingsRes.ok) {
          throw new Error('Erreur lors du chargement des données');
        }

        const statsData = await statsRes.json();
        const bookingsData = await bookingsRes.json();

        setStats(statsData);

        // Find active trip (not COMPLETED or CANCELLED)
        const active = bookingsData.bookings?.find(
          (b: Booking) => !['COMPLETED', 'CANCELLED'].includes(b.status)
        );
        setActiveTrip(active || null);

        // Infer driver status from active trip or settings
        if (active) {
          setDriverStatus('AVAILABLE');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur inconnue';
        showError(message, 'Erreur de chargement');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [showError]);

  const handleStatusChange = (status: 'OFFLINE' | 'AVAILABLE' | 'ON_BREAK') => {
    setDriverStatus(status);
  };

  const handleTripAction = async (_bookingId: string) => {
    // Refresh data after trip action
    try {
      const res = await fetch('/api/driver/bookings?type=assigned');
      if (res.ok) {
        const data = await res.json();
        const active = data.bookings?.find(
          (b: Booking) => !['COMPLETED', 'CANCELLED'].includes(b.status)
        );
        setActiveTrip(active || null);

        // Also refresh stats
        const statsRes = await fetch('/api/driver/stats');
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
      }
    } catch (err) {
      console.error('Error refreshing data:', err);
    }
  };

  const StatCard = ({
    label,
    value
  }: {
    label: string;
    value: string | number;
  }) => (
    <Card variant="stat" className="card-stat-glow">
      <p className="text-sm text-on-surface-dim uppercase font-semibold mb-2">
        {label}
      </p>
      <p className="text-3xl font-bold text-primary">{value}</p>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Card>
          <div className="h-16 bg-on-surface-dim/20 animate-shimmer rounded"></div>
        </Card>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Status Section */}
      <Card>
        <DriverStatusToggle initialStatus={driverStatus} onStatusChange={handleStatusChange} />
      </Card>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Courses aujourd'hui"
            value={stats.completedToday}
          />
          <StatCard
            label="Courses totales"
            value={stats.totalTrips}
          />
          <StatCard
            label="Revenus"
            value={`${stats.totalEarnings.toFixed(2)}€`}
          />
          <StatCard
            label="Note"
            value={`${stats.rating.toFixed(1)}★`}
          />
        </div>
      )}

      {/* Active Trip Section */}
      {activeTrip ? (
        <div>
          <h2 className="text-2xl font-bold text-on-surface mb-4">Course active</h2>
          <TripCard booking={activeTrip} mode="active" onAction={handleTripAction} />
        </div>
      ) : (
        <Card className="text-center">
          {driverStatus === 'AVAILABLE' ? (
            <>
              <p className="text-on-surface mb-4">Aucune course active pour le moment</p>
              <Link
                href="/dashboard/chauffeur/courses"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-background rounded-lg hover:bg-primary-dark transition-colors"
              >
                Voir les courses disponibles
                <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          ) : (
            <>
              <p className="text-on-surface-dim mb-4">
                {driverStatus === 'OFFLINE' && 'Vous êtes hors ligne. Activez votre service pour voir les courses disponibles.'}
                {driverStatus === 'ON_BREAK' && 'Vous êtes en pause. Reprenez votre service pour voir les courses disponibles.'}
              </p>
              <p className="text-sm text-on-surface-dim">
                Utilisez le sélecteur d'état ci-dessus pour vous mettre disponible.
              </p>
            </>
          )}
        </Card>
      )}

      {/* Upcoming Courses Section */}
      <UpcomingCoursesSection />

      {/* Driver Reservations Section */}
      <DriverReservationsSection />

      {/* CPAM Settings Section */}
      <DriverCpamSettings />

      {/* Create Trip Section */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-on-surface mb-1">Créer une course</h3>
            <p className="text-sm text-on-surface-dim">Créez une nouvelle course pour un client</p>
          </div>
          <Link
            href="/dashboard/chauffeur/nouvelle-course"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-background rounded-lg hover:bg-primary-dark transition-colors whitespace-nowrap"
          >
            Créer une course
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Card>
    </div>
  );
}
