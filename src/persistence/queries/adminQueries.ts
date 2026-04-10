import { prisma } from '@/persistence/client';
import { BookingStatus } from '@/generated/prisma/client';

export interface AdminStats {
  totalUsers: number;
  newUsers: number;
  totalBookings: number;
  completedBookings: number;
  totalRevenue: number;
  averagePrice: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  // Calculate 30 days ago
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [userCount, newUserCount, bookingCount, bookingStats] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    }),
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
    newUsers: newUserCount,
    totalBookings: bookingCount,
    completedBookings,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    averagePrice: Math.round(averagePrice * 100) / 100,
  };
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  role: string;
  createdAt: string;
}

export async function getAllUsers(
  limit: number = 50,
  offset: number = 0
): Promise<AdminUser[]> {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  });

  return users.map(u => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
  }));
}

export interface AdminBooking {
  id: string;
  clientId: string | null;
  pickupAddress: string;
  dropoffAddress: string;
  distance: number;
  price: number;
  status: BookingStatus;
  isPublic: boolean;
  createdByDriverId?: string | null;
  createdAt: string;
  scheduledAt: string | null;
}

export async function getAllBookings(
  filters?: {
    status?: BookingStatus;
    limit?: number;
    offset?: number;
    from?: Date;
    to?: Date;
  }
): Promise<AdminBooking[]> {
  const limit = filters?.limit || 50;
  const offset = filters?.offset || 0;

  const where: any = filters?.status ? { status: filters.status } : {};

  // Add date range filter if provided
  if (filters?.from || filters?.to) {
    where.OR = [
      {
        scheduledAt: {
          gte: filters?.from,
          lte: filters?.to,
        },
      },
      {
        createdAt: {
          gte: filters?.from,
          lte: filters?.to,
        },
      },
    ];
  }

  const bookings = await prisma.booking.findMany({
    where,
    select: {
      id: true,
      clientId: true,
      pickupAddress: true,
      dropoffAddress: true,
      distance: true,
      price: true,
      status: true,
      isPublic: true,
      createdByDriverId: true,
      createdAt: true,
      scheduledAt: true,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  });

  return bookings.map(b => ({
    ...b,
    createdAt: b.createdAt.toISOString(),
    scheduledAt: b.scheduledAt ? b.scheduledAt.toISOString() : null,
  }));
}
