export type VehicleType = 'BERLINE' | 'SUV' | 'VAN' | 'PREMIUM';

export interface VehicleMeta {
  label: string;
  description: string;
  capacity: number;
}

export const VEHICLE_META: Record<VehicleType, VehicleMeta> = {
  BERLINE: {
    label: 'Berline',
    description: 'Confort standard, 4 passagers',
    capacity: 4,
  },
  SUV: {
    label: 'SUV',
    description: 'Grand gabarit, 5 passagers',
    capacity: 5,
  },
  VAN: {
    label: 'Van',
    description: "Groupe jusqu'à 7 personnes",
    capacity: 7,
  },
  PREMIUM: {
    label: 'Premium',
    description: 'Véhicule de luxe, 4 passagers',
    capacity: 4,
  },
};

export interface TieredPricingInput {
  tier1PricePerKm: number;
  tier2PricePerKm: number;
  tier3PricePerKm: number;
  tier4PricePerKm: number;
  vehicleMultiplierBerline: number;
  vehicleMultiplierSuv: number;
  vehicleMultiplierVan: number;
  vehicleMultiplierPremium: number;
}

/**
 * Pick the flat per-km rate for the entire trip based on total distance.
 * Tiers: 0-20, 20-50, 50-100, 100+.
 */
export function pickTierRate(distanceKm: number, config: TieredPricingInput): number {
  if (distanceKm < 20) return config.tier1PricePerKm;
  if (distanceKm < 50) return config.tier2PricePerKm;
  if (distanceKm < 100) return config.tier3PricePerKm;
  return config.tier4PricePerKm;
}

export function getVehicleMultiplier(vehicleType: VehicleType, config: TieredPricingInput): number {
  switch (vehicleType) {
    case 'BERLINE': return config.vehicleMultiplierBerline;
    case 'SUV': return config.vehicleMultiplierSuv;
    case 'VAN': return config.vehicleMultiplierVan;
    case 'PREMIUM': return config.vehicleMultiplierPremium;
  }
}

/**
 * Compute trip price from tiered config + vehicle multiplier.
 * effectiveRate = tierRate(distance) × vehicleMultiplier
 * price = effectiveRate × distance
 * basePrice is kept in the return for schema compatibility but set to 0 (no flat base fee in tiered mode).
 */
export function calculateTieredPrice(
  vehicleType: VehicleType,
  distanceKm: number,
  config: TieredPricingInput
): { basePrice: number; price: number; pricePerKm: number } {
  const tierRate = pickTierRate(distanceKm, config);
  const multiplier = getVehicleMultiplier(vehicleType, config);
  const pricePerKm = Math.round(tierRate * multiplier * 100) / 100;
  const price = Math.round(pricePerKm * distanceKm * 100) / 100;
  return { basePrice: 0, price, pricePerKm };
}

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

