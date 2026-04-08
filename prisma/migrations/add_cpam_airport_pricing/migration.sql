-- AddColumn: cpamPricePerKm
ALTER TABLE "PricingConfig" ADD COLUMN "cpamPricePerKm" DOUBLE PRECISION NOT NULL DEFAULT 0.91;

-- AddColumn: cpamPickupCharge
ALTER TABLE "PricingConfig" ADD COLUMN "cpamPickupCharge" DOUBLE PRECISION NOT NULL DEFAULT 3.10;

-- AddColumn: cpamMinimumPrice
ALTER TABLE "PricingConfig" ADD COLUMN "cpamMinimumPrice" DOUBLE PRECISION NOT NULL DEFAULT 6.00;

-- AddColumn: airportCdgPrice
ALTER TABLE "PricingConfig" ADD COLUMN "airportCdgPrice" DOUBLE PRECISION NOT NULL DEFAULT 50.0;

-- AddColumn: airportOrlyPrice
ALTER TABLE "PricingConfig" ADD COLUMN "airportOrlyPrice" DOUBLE PRECISION NOT NULL DEFAULT 36.0;

-- AddColumn: airportBeauvaisPrice
ALTER TABLE "PricingConfig" ADD COLUMN "airportBeauvaisPrice" DOUBLE PRECISION NOT NULL DEFAULT 65.0;

-- AddColumn: cpamAirportCdgPrice
ALTER TABLE "PricingConfig" ADD COLUMN "cpamAirportCdgPrice" DOUBLE PRECISION NOT NULL DEFAULT 35.0;

-- AddColumn: cpamAirportOrlyPrice
ALTER TABLE "PricingConfig" ADD COLUMN "cpamAirportOrlyPrice" DOUBLE PRECISION NOT NULL DEFAULT 25.0;

-- AddColumn: cpamAirportBeauvaisPrice
ALTER TABLE "PricingConfig" ADD COLUMN "cpamAirportBeauvaisPrice" DOUBLE PRECISION NOT NULL DEFAULT 45.0;
