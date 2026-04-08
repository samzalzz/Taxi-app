'use client';

import { useEffect, useState } from 'react';
import { calculateDistance, calculatePrice, estimateDuration, VehicleType } from '@/lib/utils/pricing';

export interface AddressResult {
  address: string;
  city: string;
  lat: number;
  lng: number;
}

export interface DriverBookingFormState {
  clientName: string;
  clientPhone: string;
  pickup: AddressResult | null;
  dropoff: AddressResult | null;
  vehicleType: VehicleType | null;
  passengers: number;
  luggage: boolean;
  scheduledAt: string | null;
  clientNotes: string;
  isPublic: boolean;
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

export interface UseDriverCreateBookingReturn {
  formState: DriverBookingFormState;
  priceEstimate: PriceEstimate | null;
  isSubmitting: boolean;
  error: string | null;
  bookingResult: any | null;

  setClientName: (name: string) => void;
  setClientPhone: (phone: string) => void;
  setPickup: (result: AddressResult | null) => void;
  setDropoff: (result: AddressResult | null) => void;
  setVehicleType: (type: VehicleType) => void;
  setPassengers: (n: number) => void;
  setLuggage: (v: boolean) => void;
  setScheduledAt: (iso: string | null) => void;
  setClientNotes: (s: string) => void;
  setIsPublic: (v: boolean) => void;
  setIsCpam: (v: boolean) => void;
  submitBooking: () => Promise<void>;
  reset: () => void;
}

const initialFormState: DriverBookingFormState = {
  clientName: '',
  clientPhone: '',
  pickup: null,
  dropoff: null,
  vehicleType: null,
  passengers: 1,
  luggage: false,
  scheduledAt: null,
  clientNotes: '',
  isPublic: false,
  isCpam: false,
};

export function useDriverCreateBooking(): UseDriverCreateBookingReturn {
  const [formState, setFormState] = useState<DriverBookingFormState>(initialFormState);
  const [priceEstimate, setPriceEstimate] = useState<PriceEstimate | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<any | null>(null);

  // Calculate price estimate whenever pickup, dropoff, or vehicleType changes
  useEffect(() => {
    if (!formState.pickup || !formState.dropoff || !formState.vehicleType) {
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
    const { basePrice, price, pricePerKm } = calculatePrice(
      formState.vehicleType,
      distance
    );

    setPriceEstimate({
      distance,
      estimatedDuration,
      basePrice,
      price,
      pricePerKm,
      currency: 'EUR',
    });
  }, [formState.pickup, formState.dropoff, formState.vehicleType]);

  const submitBooking = async () => {
    if (!formState.clientName || !formState.clientPhone) {
      setError('Veuillez entrer le nom et le téléphone du client');
      return;
    }

    if (!formState.pickup || !formState.dropoff || !formState.vehicleType || !priceEstimate) {
      setError('Veuillez remplir tous les champs requis');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/driver/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          clientName: formState.clientName,
          clientPhone: formState.clientPhone,
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
          isPublic: formState.isPublic,
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
          setError(data.error || 'Erreur lors de la création de la course');
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

    setClientName: (name) => setFormState(prev => ({ ...prev, clientName: name })),
    setClientPhone: (phone) => setFormState(prev => ({ ...prev, clientPhone: phone })),
    setPickup: (result) => setFormState(prev => ({ ...prev, pickup: result })),
    setDropoff: (result) => setFormState(prev => ({ ...prev, dropoff: result })),
    setVehicleType: (type) => setFormState(prev => ({ ...prev, vehicleType: type })),
    setPassengers: (n) => setFormState(prev => ({ ...prev, passengers: n })),
    setLuggage: (v) => setFormState(prev => ({ ...prev, luggage: v })),
    setScheduledAt: (iso) => setFormState(prev => ({ ...prev, scheduledAt: iso })),
    setClientNotes: (s) => setFormState(prev => ({ ...prev, clientNotes: s })),
    setIsPublic: (v) => setFormState(prev => ({ ...prev, isPublic: v })),
    setIsCpam: (v) => setFormState(prev => ({ ...prev, isCpam: v })),
    submitBooking,
    reset,
  };
}
