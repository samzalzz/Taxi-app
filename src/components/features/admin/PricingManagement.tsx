'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AlertCircle, Check } from 'lucide-react';

interface PricingConfig {
  id: string;
  // Base pricing
  pricePerKm: number;
  pickupCharge: number;
  minimumPrice: number;
  maximumHourlyRate: number;

  // Tiered per-km rates
  tier1PricePerKm: number;
  tier2PricePerKm: number;
  tier3PricePerKm: number;
  tier4PricePerKm: number;

  // Vehicle multipliers
  vehicleMultiplierBerline: number;
  vehicleMultiplierSuv: number;
  vehicleMultiplierVan: number;
  vehicleMultiplierPremium: number;

  // CPAM pricing
  cpamPricePerKm: number;
  cpamPickupCharge: number;
  cpamMinimumPrice: number;

  // Airport rates
  airportCdgPrice: number;
  airportOrlyPrice: number;
  airportBeauvaisPrice: number;

  // CPAM airport rates
  cpamAirportCdgPrice: number;
  cpamAirportOrlyPrice: number;
  cpamAirportBeauvaisPrice: number;

  // Reservation fees
  reservationImmediateFee: number;
  reservationAdvanceFee: number;
}

export function PricingManagement() {
  const [pricing, setPricing] = useState<PricingConfig | null>(null);
  const [formData, setFormData] = useState<Partial<PricingConfig>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch pricing config
  useEffect(() => {
    const fetchPricing = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/admin/pricing');
        if (!res.ok) {
          throw new Error('Failed to fetch pricing');
        }
        const data = await res.json();
        setPricing(data);
        setFormData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading pricing');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPricing();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData((prev) => ({
      ...prev,
      [field]: numValue,
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSuccess(false);
      setError(null);

      const res = await fetch('/api/admin/pricing', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to update pricing');
      }

      const updated = await res.json();
      setPricing(updated);
      setSuccess(true);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving pricing');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alerts */}
      {error && (
        <div className="flex gap-3 p-4 bg-error/10 border border-error rounded-lg">
          <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
          <p className="text-error">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex gap-3 p-4 bg-green-500/10 border border-green-500 rounded-lg">
          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <p className="text-green-600">Tarifs mis à jour avec succès</p>
        </div>
      )}

      {/* Pricing Grid - Three columns for better organization */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Base Pricing Section */}
        <div className="bg-surface border border-on-surface/10 rounded-lg p-6 space-y-4">
          <h3 className="font-semibold text-lg text-on-surface">
            Tarifs de base
          </h3>

          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              Prix au kilomètre (€/km)
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.01"
                value={formData.pricePerKm || ''}
                onChange={(e) => handleInputChange('pricePerKm', e.target.value)}
                placeholder="1.30"
              />
              <span className="text-on-surface-dim">€</span>
            </div>
            <p className="text-xs text-on-surface-dim mt-1">
              Tarif actuel: {pricing?.pricePerKm.toFixed(2)}€
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              Prise en charge (€)
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.01"
                value={formData.pickupCharge || ''}
                onChange={(e) => handleInputChange('pickupCharge', e.target.value)}
                placeholder="4.48"
              />
              <span className="text-on-surface-dim">€</span>
            </div>
            <p className="text-xs text-on-surface-dim mt-1">
              Tarif actuel: {pricing?.pickupCharge.toFixed(2)}€
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              Prix minimum (€)
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.01"
                value={formData.minimumPrice || ''}
                onChange={(e) => handleInputChange('minimumPrice', e.target.value)}
                placeholder="8.00"
              />
              <span className="text-on-surface-dim">€</span>
            </div>
            <p className="text-xs text-on-surface-dim mt-1">
              Tarif actuel: {pricing?.minimumPrice.toFixed(2)}€
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              Tarif horaire maximum (€/h)
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.01"
                value={formData.maximumHourlyRate || ''}
                onChange={(e) =>
                  handleInputChange('maximumHourlyRate', e.target.value)
                }
                placeholder="42.15"
              />
              <span className="text-on-surface-dim">€</span>
            </div>
            <p className="text-xs text-on-surface-dim mt-1">
              Tarif actuel: {pricing?.maximumHourlyRate.toFixed(2)}€
            </p>
          </div>
        </div>

        {/* Tiered Pricing Section */}
        <div className="bg-surface border border-on-surface/10 rounded-lg p-6 space-y-4">
          <h3 className="font-semibold text-lg text-on-surface">
            Tarifs par paliers (€/km)
          </h3>
          <p className="text-xs text-on-surface-dim -mt-2">
            Tarif au km appliqué selon la distance totale du trajet.
          </p>

          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              0 – 20 km
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.01"
                value={formData.tier1PricePerKm ?? ''}
                onChange={(e) => handleInputChange('tier1PricePerKm', e.target.value)}
                placeholder="2.00"
              />
              <span className="text-on-surface-dim">€/km</span>
            </div>
            <p className="text-xs text-on-surface-dim mt-1">
              Tarif actuel: {pricing?.tier1PricePerKm.toFixed(2)}€
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              20 – 50 km
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.01"
                value={formData.tier2PricePerKm ?? ''}
                onChange={(e) => handleInputChange('tier2PricePerKm', e.target.value)}
                placeholder="1.60"
              />
              <span className="text-on-surface-dim">€/km</span>
            </div>
            <p className="text-xs text-on-surface-dim mt-1">
              Tarif actuel: {pricing?.tier2PricePerKm.toFixed(2)}€
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              50 – 100 km
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.01"
                value={formData.tier3PricePerKm ?? ''}
                onChange={(e) => handleInputChange('tier3PricePerKm', e.target.value)}
                placeholder="1.30"
              />
              <span className="text-on-surface-dim">€/km</span>
            </div>
            <p className="text-xs text-on-surface-dim mt-1">
              Tarif actuel: {pricing?.tier3PricePerKm.toFixed(2)}€
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              100 km et plus
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.01"
                value={formData.tier4PricePerKm ?? ''}
                onChange={(e) => handleInputChange('tier4PricePerKm', e.target.value)}
                placeholder="1.00"
              />
              <span className="text-on-surface-dim">€/km</span>
            </div>
            <p className="text-xs text-on-surface-dim mt-1">
              Tarif actuel: {pricing?.tier4PricePerKm.toFixed(2)}€
            </p>
          </div>
        </div>

        {/* Vehicle Multipliers Section */}
        <div className="bg-surface border border-on-surface/10 rounded-lg p-6 space-y-4">
          <h3 className="font-semibold text-lg text-on-surface">
            Multiplicateurs par véhicule
          </h3>
          <p className="text-xs text-on-surface-dim -mt-2">
            Coefficient appliqué au tarif du palier selon le véhicule choisi.
          </p>

          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              Berline
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.01"
                value={formData.vehicleMultiplierBerline ?? ''}
                onChange={(e) => handleInputChange('vehicleMultiplierBerline', e.target.value)}
                placeholder="1.00"
              />
              <span className="text-on-surface-dim">×</span>
            </div>
            <p className="text-xs text-on-surface-dim mt-1">
              Coefficient actuel: {pricing?.vehicleMultiplierBerline.toFixed(2)}×
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              SUV
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.01"
                value={formData.vehicleMultiplierSuv ?? ''}
                onChange={(e) => handleInputChange('vehicleMultiplierSuv', e.target.value)}
                placeholder="1.30"
              />
              <span className="text-on-surface-dim">×</span>
            </div>
            <p className="text-xs text-on-surface-dim mt-1">
              Coefficient actuel: {pricing?.vehicleMultiplierSuv.toFixed(2)}×
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              Van
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.01"
                value={formData.vehicleMultiplierVan ?? ''}
                onChange={(e) => handleInputChange('vehicleMultiplierVan', e.target.value)}
                placeholder="1.60"
              />
              <span className="text-on-surface-dim">×</span>
            </div>
            <p className="text-xs text-on-surface-dim mt-1">
              Coefficient actuel: {pricing?.vehicleMultiplierVan.toFixed(2)}×
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              Premium
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.01"
                value={formData.vehicleMultiplierPremium ?? ''}
                onChange={(e) => handleInputChange('vehicleMultiplierPremium', e.target.value)}
                placeholder="2.30"
              />
              <span className="text-on-surface-dim">×</span>
            </div>
            <p className="text-xs text-on-surface-dim mt-1">
              Coefficient actuel: {pricing?.vehicleMultiplierPremium.toFixed(2)}×
            </p>
          </div>
        </div>

        {/* CPAM Pricing Section */}
        <div className="bg-surface border border-on-surface/10 rounded-lg p-6 space-y-4">
          <h3 className="font-semibold text-lg text-on-surface">
            Tarifs CPAM (Conventionnels)
          </h3>

          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              Prix CPAM au kilomètre (€/km)
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.01"
                value={formData.cpamPricePerKm || ''}
                onChange={(e) => handleInputChange('cpamPricePerKm', e.target.value)}
                placeholder="0.91"
              />
              <span className="text-on-surface-dim">€</span>
            </div>
            <p className="text-xs text-on-surface-dim mt-1">
              Tarif actuel: {pricing?.cpamPricePerKm.toFixed(2)}€
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              Prise en charge CPAM (€)
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.01"
                value={formData.cpamPickupCharge || ''}
                onChange={(e) => handleInputChange('cpamPickupCharge', e.target.value)}
                placeholder="3.10"
              />
              <span className="text-on-surface-dim">€</span>
            </div>
            <p className="text-xs text-on-surface-dim mt-1">
              Tarif actuel: {pricing?.cpamPickupCharge.toFixed(2)}€
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              Prix minimum CPAM (€)
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.01"
                value={formData.cpamMinimumPrice || ''}
                onChange={(e) => handleInputChange('cpamMinimumPrice', e.target.value)}
                placeholder="6.00"
              />
              <span className="text-on-surface-dim">€</span>
            </div>
            <p className="text-xs text-on-surface-dim mt-1">
              Tarif actuel: {pricing?.cpamMinimumPrice.toFixed(2)}€
            </p>
          </div>
        </div>

        {/* Airport Rates Section */}
        <div className="bg-surface border border-on-surface/10 rounded-lg p-6 space-y-4">
          <h3 className="font-semibold text-lg text-on-surface">
            Tarifs Aéroport Standard
          </h3>

          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              CDG (€)
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.01"
                value={formData.airportCdgPrice || ''}
                onChange={(e) => handleInputChange('airportCdgPrice', e.target.value)}
                placeholder="50.00"
              />
              <span className="text-on-surface-dim">€</span>
            </div>
            <p className="text-xs text-on-surface-dim mt-1">
              Tarif actuel: {pricing?.airportCdgPrice.toFixed(2)}€
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              Orly (€)
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.01"
                value={formData.airportOrlyPrice || ''}
                onChange={(e) => handleInputChange('airportOrlyPrice', e.target.value)}
                placeholder="36.00"
              />
              <span className="text-on-surface-dim">€</span>
            </div>
            <p className="text-xs text-on-surface-dim mt-1">
              Tarif actuel: {pricing?.airportOrlyPrice.toFixed(2)}€
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              Beauvais (€)
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.01"
                value={formData.airportBeauvaisPrice || ''}
                onChange={(e) => handleInputChange('airportBeauvaisPrice', e.target.value)}
                placeholder="65.00"
              />
              <span className="text-on-surface-dim">€</span>
            </div>
            <p className="text-xs text-on-surface-dim mt-1">
              Tarif actuel: {pricing?.airportBeauvaisPrice.toFixed(2)}€
            </p>
          </div>
        </div>

        {/* CPAM Airport Rates Section */}
        <div className="bg-surface border border-on-surface/10 rounded-lg p-6 space-y-4">
          <h3 className="font-semibold text-lg text-on-surface">
            Tarifs CPAM Aéroport
          </h3>

          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              CDG CPAM (€)
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.01"
                value={formData.cpamAirportCdgPrice || ''}
                onChange={(e) => handleInputChange('cpamAirportCdgPrice', e.target.value)}
                placeholder="35.00"
              />
              <span className="text-on-surface-dim">€</span>
            </div>
            <p className="text-xs text-on-surface-dim mt-1">
              Tarif actuel: {pricing?.cpamAirportCdgPrice.toFixed(2)}€
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              Orly CPAM (€)
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.01"
                value={formData.cpamAirportOrlyPrice || ''}
                onChange={(e) => handleInputChange('cpamAirportOrlyPrice', e.target.value)}
                placeholder="25.00"
              />
              <span className="text-on-surface-dim">€</span>
            </div>
            <p className="text-xs text-on-surface-dim mt-1">
              Tarif actuel: {pricing?.cpamAirportOrlyPrice.toFixed(2)}€
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              Beauvais CPAM (€)
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.01"
                value={formData.cpamAirportBeauvaisPrice || ''}
                onChange={(e) => handleInputChange('cpamAirportBeauvaisPrice', e.target.value)}
                placeholder="45.00"
              />
              <span className="text-on-surface-dim">€</span>
            </div>
            <p className="text-xs text-on-surface-dim mt-1">
              Tarif actuel: {pricing?.cpamAirportBeauvaisPrice.toFixed(2)}€
            </p>
          </div>
        </div>

        {/* Reservation Fees Section */}
        <div className="bg-surface border border-on-surface/10 rounded-lg p-6 space-y-4">
          <h3 className="font-semibold text-lg text-on-surface">
            Frais de réservation
          </h3>

          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              Réservation immédiate (€)
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.01"
                value={formData.reservationImmediateFee || ''}
                onChange={(e) =>
                  handleInputChange('reservationImmediateFee', e.target.value)
                }
                placeholder="4.00"
              />
              <span className="text-on-surface-dim">€</span>
            </div>
            <p className="text-xs text-on-surface-dim mt-1">
              Frais actuels: {pricing?.reservationImmediateFee.toFixed(2)}€
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              Réservation à l&apos;avance (€)
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.01"
                value={formData.reservationAdvanceFee || ''}
                onChange={(e) =>
                  handleInputChange('reservationAdvanceFee', e.target.value)
                }
                placeholder="7.00"
              />
              <span className="text-on-surface-dim">€</span>
            </div>
            <p className="text-xs text-on-surface-dim mt-1">
              Frais actuels: {pricing?.reservationAdvanceFee.toFixed(2)}€
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 text-sm">
            <p className="text-on-surface font-semibold mb-2">
              ℹ️ Calcul du prix
            </p>
            <div className="text-on-surface-dim text-xs space-y-1">
              <div>
                Standard: Distance × €/km du palier × multiplicateur véhicule
              </div>
              <div>
                CPAM: Tarifs réduits + (Distance × €/km CPAM)
              </div>
              <div>
                Aéroports: Forfait fixe (standard ou CPAM)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          isLoading={isSaving}
          size="lg"
        >
          Enregistrer les tarifs
        </Button>
      </div>

      {/* Disclaimer */}
      <div className="bg-on-surface/5 border border-on-surface/10 rounded-lg p-4">
        <p className="text-xs text-on-surface-dim">
          <strong>Note:</strong> Ces tarifs seront utilisés pour calculer les estimations de prix
          affichées aux clients. Les prix finaux restent des estimations et peuvent varier selon
          les conditions de circulation et d&apos;autres facteurs.
        </p>
      </div>
    </div>
  );
}
