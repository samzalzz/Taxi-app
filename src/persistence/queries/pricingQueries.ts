import { prisma } from '@/persistence/client';
import { PricingConfig } from '@prisma/client';

export interface UpdatePricingInput {
  // Base pricing
  pricePerKm?: number;
  pickupCharge?: number;
  minimumPrice?: number;
  maximumHourlyRate?: number;

  // CPAM pricing
  cpamPricePerKm?: number;
  cpamPickupCharge?: number;
  cpamMinimumPrice?: number;

  // Airport rates
  airportCdgPrice?: number;
  airportOrlyPrice?: number;
  airportBeauvaisPrice?: number;

  // CPAM airport rates
  cpamAirportCdgPrice?: number;
  cpamAirportOrlyPrice?: number;
  cpamAirportBeauvaisPrice?: number;

  // Reservation fees
  reservationImmediateFee?: number;
  reservationAdvanceFee?: number;
}

/**
 * Get current pricing configuration
 * Returns the singleton pricing config record
 * Falls back to defaults if database columns are missing
 */
export async function getPricingConfig(): Promise<PricingConfig> {
  try {
    let config = await prisma.pricingConfig.findFirst();

    // Create default config if it doesn't exist
    if (!config) {
      config = await prisma.pricingConfig.create({
        data: {
          // Base pricing
          pricePerKm: 1.30,
          pickupCharge: 4.48,
          minimumPrice: 8.00,
          maximumHourlyRate: 42.15,

          // CPAM pricing (tarifs conventionnels)
          cpamPricePerKm: 0.91,
          cpamPickupCharge: 3.10,
          cpamMinimumPrice: 6.00,

          // Airport rates
          airportCdgPrice: 50.0,
          airportOrlyPrice: 36.0,
          airportBeauvaisPrice: 65.0,

          // CPAM airport rates
          cpamAirportCdgPrice: 35.0,
          cpamAirportOrlyPrice: 25.0,
          cpamAirportBeauvaisPrice: 45.0,

          // Reservation fees
          reservationImmediateFee: 4.0,
          reservationAdvanceFee: 7.0,
        },
      });
    }

    return config;
  } catch (error: any) {
    // If database columns are missing (P2022 error), return default config
    if (error?.code === 'P2022') {
      console.warn('Database schema incomplete, using default pricing config');
      return {
        id: 'default',
        createdAt: new Date(),
        updatedAt: new Date(),
        pricePerKm: 1.30,
        pickupCharge: 4.48,
        minimumPrice: 8.00,
        maximumHourlyRate: 42.15,
        cpamPricePerKm: 0.91,
        cpamPickupCharge: 3.10,
        cpamMinimumPrice: 6.00,
        airportCdgPrice: 50.0,
        airportOrlyPrice: 36.0,
        airportBeauvaisPrice: 65.0,
        cpamAirportCdgPrice: 35.0,
        cpamAirportOrlyPrice: 25.0,
        cpamAirportBeauvaisPrice: 45.0,
        reservationImmediateFee: 4.0,
        reservationAdvanceFee: 7.0,
      } as PricingConfig;
    }
    throw error;
  }
}

/**
 * Update pricing configuration
 */
export async function updatePricingConfig(
  data: UpdatePricingInput
): Promise<PricingConfig> {
  try {
    // Get or create the config
    let config = await prisma.pricingConfig.findFirst();

    if (!config) {
      config = await prisma.pricingConfig.create({
        data: {
          // Base pricing
          pricePerKm: 1.30,
          pickupCharge: 4.48,
          minimumPrice: 8.00,
          maximumHourlyRate: 42.15,

          // CPAM pricing
          cpamPricePerKm: 0.91,
          cpamPickupCharge: 3.10,
          cpamMinimumPrice: 6.00,

          // Airport rates
          airportCdgPrice: 50.0,
          airportOrlyPrice: 36.0,
          airportBeauvaisPrice: 65.0,

          // CPAM airport rates
          cpamAirportCdgPrice: 35.0,
          cpamAirportOrlyPrice: 25.0,
          cpamAirportBeauvaisPrice: 45.0,

          // Reservation fees
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
  } catch (error: any) {
    // If database columns are missing, return default with updates applied
    if (error?.code === 'P2022') {
      console.warn('Database schema incomplete, using fallback pricing config');
      const config = await getPricingConfig();
      return { ...config, ...data };
    }
    throw error;
  }
}

/**
 * Calculate price for a booking
 */
export interface PriceCalculationInput {
  distance: number; // in km
  estimatedDuration: number; // in minutes
  isScheduledInAdvance?: boolean;
  isCpam?: boolean; // Use CPAM rates if true
}

export async function calculateBookingPrice(
  input: PriceCalculationInput
): Promise<{
  basePrice: number;
  pickupCharge: number;
  kilometerCharge: number;
  reservationFee: number;
  totalPrice: number;
  isCpam: boolean;
}> {
  const config = await getPricingConfig();

  // Select pricing tier based on isCpam flag
  const pricePerKm = input.isCpam ? config.cpamPricePerKm : config.pricePerKm;
  const pickupCharge = input.isCpam ? config.cpamPickupCharge : config.pickupCharge;
  const minimumPrice = input.isCpam ? config.cpamMinimumPrice : config.minimumPrice;

  const kilometerCharge = pricePerKm * input.distance;
  const reservationFee = input.isScheduledInAdvance
    ? config.reservationAdvanceFee
    : 0;

  const basePrice = pickupCharge + kilometerCharge + reservationFee;
  const totalPrice = Math.max(basePrice, minimumPrice);

  return {
    basePrice,
    pickupCharge,
    kilometerCharge,
    reservationFee,
    totalPrice,
    isCpam: input.isCpam || false,
  };
}

/**
 * Get airport fixed rates
 */
export async function getAirportPrices(isCpam: boolean = false) {
  const config = await getPricingConfig();

  if (isCpam) {
    return {
      cdg: config.cpamAirportCdgPrice,
      orly: config.cpamAirportOrlyPrice,
      beauvais: config.cpamAirportBeauvaisPrice,
    };
  }

  return {
    cdg: config.airportCdgPrice,
    orly: config.airportOrlyPrice,
    beauvais: config.airportBeauvaisPrice,
  };
}
