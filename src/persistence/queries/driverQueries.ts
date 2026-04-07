import { prisma } from '@/persistence/client';
import { Driver, DriverStatus, Vehicle, VehicleType } from '@prisma/client';

/**
 * Get a driver by their user ID
 */
export async function getDriverByUserId(userId: string): Promise<Driver | null> {
  return prisma.driver.findUnique({
    where: { userId },
  });
}

export interface CreateDriverInput {
  licenseNumber: string;
  licenseExpiryDate: Date;
}

/**
 * Create a driver record for a user
 */
export async function createDriver(
  userId: string,
  data: CreateDriverInput
): Promise<Driver> {
  return prisma.driver.create({
    data: {
      userId,
      licenseNumber: data.licenseNumber,
      licenseExpiryDate: data.licenseExpiryDate,
      status: 'OFFLINE',
    },
  });
}

export interface CreateVehicleInput {
  type: VehicleType;
  brand: string;
  model: string;
  year: number;
  color: string;
  plateNumber: string;
  capacity?: number;
}

/**
 * Create a vehicle for a driver
 */
export async function createVehicle(
  driverId: string,
  data: CreateVehicleInput
): Promise<Vehicle> {
  return prisma.vehicle.create({
    data: {
      driverId,
      type: data.type,
      brand: data.brand,
      model: data.model,
      year: data.year,
      color: data.color,
      plateNumber: data.plateNumber,
      capacity: data.capacity || 4,
    },
  });
}

/**
 * Update driver status
 */
export async function updateDriverStatus(
  driverId: string,
  status: DriverStatus
): Promise<Driver> {
  return prisma.driver.update({
    where: { id: driverId },
    data: { status },
  });
}

/**
 * Update driver location
 */
export async function updateDriverLocation(
  driverId: string,
  lat: number,
  lng: number
): Promise<Driver> {
  return prisma.driver.update({
    where: { id: driverId },
    data: {
      currentLat: lat,
      currentLng: lng,
      lastLocationUpdate: new Date(),
    },
  });
}

export interface DriverStats {
  totalTrips: number;
  totalEarnings: number;
  rating: number;
  completedToday: number;
}

/**
 * Get driver statistics
 */
export async function getDriverStats(driverId: string): Promise<DriverStats> {
  const driver = await prisma.driver.findUnique({
    where: { id: driverId },
    select: {
      totalTrips: true,
      totalEarnings: true,
      rating: true,
    },
  });

  if (!driver) {
    throw new Error('Driver not found');
  }

  // Count completed trips today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const completedToday = await prisma.booking.count({
    where: {
      driverId,
      status: 'COMPLETED',
      dropoffAt: {
        gte: today,
        lt: tomorrow,
      },
    },
  });

  return {
    totalTrips: driver.totalTrips,
    totalEarnings: driver.totalEarnings,
    rating: driver.rating,
    completedToday,
  };
}
