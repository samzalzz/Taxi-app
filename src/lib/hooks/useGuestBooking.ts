'use client';

import { useEffect, useState } from 'react';
import { calculateDistance, calculateTieredPrice, estimateDuration, VehicleType } from '@/lib/utils/pricing';
import { usePricingConfig } from './usePricingConfig';

export interface AddressResult {
  address: string;
  city: string;
  lat: number;
  lng: number;
}

export interface GuestBookingFormState {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  pickup: AddressResult | null;
  dropoff: AddressResult | null;
  vehicleType: VehicleType | null;
  passengers: number;
  luggage: boolean;
  scheduledAt: string | null;
  clientNotes: string;
  isCpam: boolean;
}

export interface PriceEstimate {
  distance: number;
  estimatedDuration: number;
  basePrice: number;
  price: number;
  pricePerKm: number;
  currency: string;
}

export interface GuestBookingResult {
  id: string;
  reservationCode: string;
  pickupAddress: string;
  dropoffAddress: string;
  price: number;
  currency: string;
  distance: number;
  estimatedDuration: number;
  status: string;
  scheduledAt: string | null;
  createdAt: string;
}

export interface UseGuestBookingReturn {
  formState: GuestBookingFormState;
  priceEstimate: PriceEstimate | null;
  isSubmitting: boolean;
  error: string | null;
  bookingResult: GuestBookingResult | null;

  setGuestName: (s: string) => void;
  setGuestEmail: (s: string) => void;
  setGuestPhone: (s: string) => void;
  setPickup: (result: AddressResult | null) => void;
  setDropoff: (result: AddressResult | null) => void;
  setVehicleType: (type: VehicleType) => void;
  setPassengers: (n: number) => void;
  setLuggage: (v: boolean) => void;
  setScheduledAt: (iso: string | null) => void;
  setClientNotes: (s: string) => void;
  setIsCpam: (v: boolean) => void;
  submitBooking: () => Promise<void>;
  reset: () => void;
}

const initialFormState: GuestBookingFormState = {
  guestName: '',
  guestEmail: '',
  guestPhone: '',
  pickup: null,
  dropoff: null,
  vehicleType: null,
  passengers: 1,
  luggage: false,
  scheduledAt: null,
  clientNotes: '',
  isCpam: false,
};

export function useGuestBooking(): UseGuestBookingReturn {
  const [formState, setFormState] = useState<GuestBookingFormState>(initialFormState);
  const [priceEstimate, setPriceEstimate] = useState<PriceEstimate | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<GuestBookingResult | null>(null);
  const pricingConfig = usePricingConfig();

  // Calculate price estimate whenever pickup, dropoff, or vehicleType changes
  useEffect(() => {
    if (!formState.pickup || !formState.dropoff || !formState.vehicleType || !pricingConfig) {
      setPriceEstimate(null);
      return;
    }

    const distance = calculateDistance(
      formState.pickup.lat,
      formState.pickup.lng,
      formState.dropoff.lat,
      formState.dropoff.lng
    );

    const estimatedDuration = estimateDuration(distance);
    const { basePrice, price, pricePerKm } = calculateTieredPrice(
      formState.vehicleType,
      distance,
      pricingConfig
    );

    setPriceEstimate({
      distance,
      estimatedDuration,
      basePrice,
      price,
      pricePerKm,
      currency: 'EUR',
    });
  }, [formState.pickup, formState.dropoff, formState.vehicleType, pricingConfig]);

  const submitBooking = async () => {
    if (
      !formState.guestName ||
      !formState.guestEmail ||
      !formState.guestPhone ||
      !formState.pickup ||
      !formState.dropoff ||
      !formState.vehicleType ||
      !priceEstimate
    ) {
      setError('Veuillez remplir tous les champs requis');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/bookings/guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: formState.guestName,
          guestEmail: formState.guestEmail,
          guestPhone: formState.guestPhone,
          pickupAddress: formState.pickup.address,
          pickupCity: formState.pickup.city,
          pickupLat: formState.pickup.lat,
          pickupLng: formState.pickup.lng,
          dropoffAddress: formState.dropoff.address,
          dropoffCity: formState.dropoff.city,
          dropoffLat: formState.dropoff.lat,
          dropoffLng: formState.dropoff.lng,
          passengers: formState.passengers,
          luggage: formState.luggage,
          vehicleType: formState.vehicleType,
          scheduledAt: formState.scheduledAt,
          clientNotes: formState.clientNotes,
          isCpam: formState.isCpam,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.details) {
          const details = Array.isArray(data.details)
            ? data.details.map((e: any) => e.message).join(', ')
            : JSON.stringify(data.details);
          setError(`Erreur: ${details}`);
        } else {
          setError(data.error || 'Erreur lors de la création de la réservation');
        }
        return;
      }

      const booking = await response.json();
      setBookingResult(booking);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setFormState(initialFormState);
    setPriceEstimate(null);
    setError(null);
    setBookingResult(null);
  };

  return {
    formState,
    priceEstimate,
    isSubmitting,
    error,
    bookingResult,

    setGuestName: (s) => setFormState(prev => ({ ...prev, guestName: s })),
    setGuestEmail: (s) => setFormState(prev => ({ ...prev, guestEmail: s })),
    setGuestPhone: (s) => setFormState(prev => ({ ...prev, guestPhone: s })),
    setPickup: (result) => setFormState(prev => ({ ...prev, pickup: result })),
    setDropoff: (result) => setFormState(prev => ({ ...prev, dropoff: result })),
    setVehicleType: (type) => setFormState(prev => ({ ...prev, vehicleType: type })),
    setPassengers: (n) => setFormState(prev => ({ ...prev, passengers: n })),
    setLuggage: (v) => setFormState(prev => ({ ...prev, luggage: v })),
    setScheduledAt: (iso) => setFormState(prev => ({ ...prev, scheduledAt: iso })),
    setClientNotes: (s) => setFormState(prev => ({ ...prev, clientNotes: s })),
    setIsCpam: (v) => setFormState(prev => ({ ...prev, isCpam: v })),
    submitBooking,
    reset,
  };
}
