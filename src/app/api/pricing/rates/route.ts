import { NextRequest, NextResponse } from 'next/server';
import { getPricingConfig, getAirportPrices } from '@/persistence/queries/pricingQueries';

export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    const config = await getPricingConfig();

    // Get both standard and CPAM airport prices
    const standardAirports = await getAirportPrices(false);
    const cpamAirports = await getAirportPrices(true);

    return NextResponse.json({
      // Base pricing
      standard: {
        pricePerKm: config.pricePerKm,
        pickupCharge: config.pickupCharge,
        minimumPrice: config.minimumPrice,
        maximumHourlyRate: config.maximumHourlyRate,
      },

      // Tiered per-km rates (applied by total distance)
      tiers: {
        tier1PricePerKm: config.tier1PricePerKm,
        tier2PricePerKm: config.tier2PricePerKm,
        tier3PricePerKm: config.tier3PricePerKm,
        tier4PricePerKm: config.tier4PricePerKm,
      },

      // Per-vehicle multipliers applied on top of tier rate
      vehicleMultipliers: {
        vehicleMultiplierBerline: config.vehicleMultiplierBerline,
        vehicleMultiplierSuv: config.vehicleMultiplierSuv,
        vehicleMultiplierVan: config.vehicleMultiplierVan,
        vehicleMultiplierPremium: config.vehicleMultiplierPremium,
      },

      // CPAM pricing
      cpam: {
        pricePerKm: config.cpamPricePerKm,
        pickupCharge: config.cpamPickupCharge,
        minimumPrice: config.cpamMinimumPrice,
      },

      // Airport rates
      airports: {
        standard: standardAirports,
        cpam: cpamAirports,
      },

      // Reservation fees
      reservationFees: {
        immediate: config.reservationImmediateFee,
        advance: config.reservationAdvanceFee,
      },
    });
  } catch (error) {
    console.error('Pricing rates GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
