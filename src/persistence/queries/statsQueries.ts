import { prisma } from '@/persistence/client';

export interface ClientStats {
  completedTrips: number;
  totalDistance: number;
  totalSpent: number;
  rating: number;
}

/**
 * Get statistics for a client: completed trips count, total distance, total spent, rating
 */
export async function getClientStats(clientId: string): Promise<ClientStats> {
  const bookings = await prisma.booking.findMany({
    where: {
      clientId,
      status: 'COMPLETED',
    },
    select: {
      distance: true,
      price: true,
    },
  });

  const completedTrips = bookings.length;
  const totalDistance = bookings.reduce((sum, b) => sum + b.distance, 0);
  const totalSpent = bookings.reduce((sum, b) => sum + b.price, 0);

  // Default rating (5.0) - can be enhanced with review system later
  const rating = 5.0;

  return {
    completedTrips,
    totalDistance: Math.round(totalDistance * 100) / 100,
    totalSpent: Math.round(totalSpent * 100) / 100,
    rating,
  };
}

export interface AdminStats {
  totalUsers: number;
  totalBookings: number;
  completedBookings: number;
  totalRevenue: number;
  averagePrice: number;
}

/**
 * Get overall admin statistics
 */
export async function getAdminStats(): Promise<AdminStats> {
  const [userCount, bookingCount, bookingStats] = await Promise.all([
    prisma.user.count(),
    prisma.booking.count(),
    prisma.booking.aggregate({
      where: { status: 'COMPLETED' },
      _count: true,
      _sum: { price: true },
      _avg: { price: true },
    }),
  ]);

  const completedBookings = bookingStats._count || 0;
  const totalRevenue = bookingStats._sum?.price || 0;
  const averagePrice = bookingStats._avg?.price || 0;

  return {
    totalUsers: userCount,
    totalBookings: bookingCount,
    completedBookings,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    averagePrice: Math.round(averagePrice * 100) / 100,
  };
}
