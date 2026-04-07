import { prisma } from '@/persistence/client';
import { PricingConfig } from '@prisma/client';

export interface UpdatePricingInput {
  pricePerKm?: number;
  pickupCharge?: number;
  minimumPrice?: number;
  maximumHourlyRate?: number;
  reservationImmediateFee?: number;
  reservationAdvanceFee?: number;
}

/**
 * Get current pricing configuration
 * Returns the singleton pricing config record
 */
export async function getPricingConfig(): Promise<PricingConfig> {
  let config = await prisma.pricingConfig.findFirst();

  // Create default config if it doesn't exist
  if (!config) {
    config = await prisma.pricingConfig.create({
      data: {
        pricePerKm: 1.30,
        pickupCharge: 4.48,
        minimumPrice: 8.00,
        maximumHourlyRate: 42.15,
        reservationImmediateFee: 4.0,
        reservationAdvanceFee: 7.0,
      },
    });
  }

  return config;
}

/**
 * Update pricing configuration
 */
export async function updatePricingConfig(
  data: UpdatePricingInput
): Promise<PricingConfig> {
  // Get or create the config
  let config = await prisma.pricingConfig.findFirst();

  if (!config) {
    config = await prisma.pricingConfig.create({
      data: {
        pricePerKm: 1.30,
        pickupCharge: 4.48,
        minimumPrice: 8.00,
        maximumHourlyRate: 42.15,
        reservationImmediateFee: 4.0,
        reservationAdvanceFee: 7.0,
      },
    });
  }

  // Update only provided fields
  return prisma.pricingConfig.update({
    where: { id: config.id },
    data,
  });
}

/**
 * Calculate price for a booking
 */
export interface PriceCalculationInput {
  distance: number; // in km
  estimatedDuration: number; // in minutes
  isScheduledInAdvance?: boolean;
}

export async function calculateBookingPrice(
  input: PriceCalculationInput
): Promise<{
  basePrice: number;
  pickupCharge: number;
  kilometerCharge: number;
  reservationFee: number;
  totalPrice: number;
}> {
  const config = await getPricingConfig();

  const kilometerCharge = config.pricePerKm * input.distance;
  const pickupCharge = config.pickupCharge;
  const reservationFee = input.isScheduledInAdvance
    ? config.reservationAdvanceFee
    : 0;

  const basePrice = pickupCharge + kilometerCharge + reservationFee;
  const totalPrice = Math.max(basePrice, config.minimumPrice);

  return {
    basePrice,
    pickupCharge,
    kilometerCharge,
    reservationFee,
    totalPrice,
  };
}
