-- Add tiered pricing columns (flat per-tier rate by total distance)
ALTER TABLE "PricingConfig" ADD COLUMN "tier1PricePerKm" DOUBLE PRECISION NOT NULL DEFAULT 2.00;
ALTER TABLE "PricingConfig" ADD COLUMN "tier2PricePerKm" DOUBLE PRECISION NOT NULL DEFAULT 1.60;
ALTER TABLE "PricingConfig" ADD COLUMN "tier3PricePerKm" DOUBLE PRECISION NOT NULL DEFAULT 1.30;
ALTER TABLE "PricingConfig" ADD COLUMN "tier4PricePerKm" DOUBLE PRECISION NOT NULL DEFAULT 1.00;

-- Add vehicle multipliers
ALTER TABLE "PricingConfig" ADD COLUMN "vehicleMultiplierBerline" DOUBLE PRECISION NOT NULL DEFAULT 1.00;
ALTER TABLE "PricingConfig" ADD COLUMN "vehicleMultiplierSuv" DOUBLE PRECISION NOT NULL DEFAULT 1.30;
ALTER TABLE "PricingConfig" ADD COLUMN "vehicleMultiplierVan" DOUBLE PRECISION NOT NULL DEFAULT 1.60;
ALTER TABLE "PricingConfig" ADD COLUMN "vehicleMultiplierPremium" DOUBLE PRECISION NOT NULL DEFAULT 2.30;
