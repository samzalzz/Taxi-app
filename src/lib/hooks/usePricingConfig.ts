'use client';

import { useEffect, useState } from 'react';
import { TieredPricingInput } from '@/lib/utils/pricing';

interface PricingRatesResponse {
  tiers: {
    tier1PricePerKm: number;
    tier2PricePerKm: number;
    tier3PricePerKm: number;
    tier4PricePerKm: number;
  };
  vehicleMultipliers: {
    vehicleMultiplierBerline: number;
    vehicleMultiplierSuv: number;
    vehicleMultiplierVan: number;
    vehicleMultiplierPremium: number;
  };
}

let cached: TieredPricingInput | null = null;
let inflight: Promise<TieredPricingInput> | null = null;

async function fetchTieredConfig(): Promise<TieredPricingInput> {
  if (cached) return cached;
  if (inflight) return inflight;

  inflight = fetch('/api/pricing/rates')
    .then((res) => {
      if (!res.ok) throw new Error(`pricing/rates ${res.status}`);
      return res.json() as Promise<PricingRatesResponse>;
    })
    .then((data) => {
      cached = { ...data.tiers, ...data.vehicleMultipliers };
      return cached;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

export function usePricingConfig(): TieredPricingInput | null {
  const [config, setConfig] = useState<TieredPricingInput | null>(cached);

  useEffect(() => {
    if (config) return;
    let active = true;
    fetchTieredConfig()
      .then((c) => {
        if (active) setConfig(c);
      })
      .catch((err) => {
        console.error('Failed to load pricing config:', err);
      });
    return () => {
      active = false;
    };
  }, [config]);

  return config;
}
