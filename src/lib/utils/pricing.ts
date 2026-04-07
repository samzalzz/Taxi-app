export type VehicleType = 'BERLINE' | 'SUV' | 'VAN' | 'PREMIUM';

export interface PricingRate {
  basePrice: number;
  pricePerKm: number;
  label: string;
  description: string;
  capacity: number;
}

export const PRICING_RATES: Record<VehicleType, PricingRate> = {
  BERLINE: {
    basePrice: 5,
    pricePerKm: 1.5,
    label: 'Berline',
    description: 'Confort standard, 4 passagers',
    capacity: 4,
  },
  SUV: {
    basePrice: 8,
    pricePerKm: 2.0,
    label: 'SUV',
    description: 'Grand gabarit, 5 passagers',
    capacity: 5,
  },
  VAN: {
    basePrice: 10,
    pricePerKm: 2.5,
    label: 'Van',
    description: "Groupe jusqu'à 7 personnes",
    capacity: 7,
  },
  PREMIUM: {
    basePrice: 15,
    pricePerKm: 3.5,
    label: 'Premium',
    description: 'Véhicule de luxe, 4 passagers',
    capacity: 4,
  },
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 - Latitude of point 1
 * @param lng1 - Longitude of point 1
 * @param lat2 - Latitude of point 2
 * @param lng2 - Longitude of point 2
 * @returns Distance in kilometers (rounded to 2 decimals)
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 100) / 100;
}

/**
 * Estimate trip duration based on distance
 * Simple heuristic: 5 min base + 2 min per km (urban average)
 */
export function estimateDuration(distanceKm: number): number {
  return Math.round(5 + distanceKm * 2);
}

/**
 * Calculate final price for a booking
 */
export function calculatePrice(
  vehicleType: VehicleType,
  distanceKm: number
): {
  basePrice: number;
  price: number;
  pricePerKm: number;
} {
  const rate = PRICING_RATES[vehicleType];
  const price = Math.round((rate.basePrice + rate.pricePerKm * distanceKm) * 100) / 100;

  return {
    basePrice: rate.basePrice,
    price,
    pricePerKm: rate.pricePerKm,
  };
}

/**
 * Calculate price using dynamic pricing configuration
 * @param distanceKm - Distance in kilometers
 * @param pricePerKm - Dynamic price per kilometer
 * @param pickupCharge - Dynamic pickup charge
 * @param minimumPrice - Minimum price threshold
 * @param isScheduledInAdvance - Whether booking is scheduled in advance
 * @param reservationAdvanceFee - Fee for advance reservations
 * @returns Calculated price breakdown
 */
export function calculateDynamicPrice(
  distanceKm: number,
  pricePerKm: number,
  pickupCharge: number,
  minimumPrice: number,
  isScheduledInAdvance: boolean = false,
  reservationAdvanceFee: number = 0
): {
  pickupCharge: number;
  kilometerCharge: number;
  reservationFee: number;
  subtotal: number;
  totalPrice: number;
} {
  const kilometerCharge = Math.round(pricePerKm * distanceKm * 100) / 100;
  const reservationFee = isScheduledInAdvance ? reservationAdvanceFee : 0;
  const subtotal = Math.round((pickupCharge + kilometerCharge + reservationFee) * 100) / 100;
  const totalPrice = Math.max(subtotal, minimumPrice);

  return {
    pickupCharge,
    kilometerCharge,
    reservationFee,
    subtotal,
    totalPrice,
  };
}
