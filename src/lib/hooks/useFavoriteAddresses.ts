'use client';

import { useState, useEffect } from 'react';

export interface SavedAddress {
  id: string;
  label: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  createdAt: string;
}

export function useFavoriteAddresses() {
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all saved addresses
  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/user/addresses', {
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Not authenticated
          setAddresses([]);
          return;
        }
        throw new Error('Failed to fetch addresses');
      }

      const data = await response.json();
      setAddresses(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  // Save a new address
  const saveAddress = async (
    label: string,
    address: string,
    city: string,
    lat: number,
    lng: number
  ) => {
    try {
      setError(null);
      const response = await fetch('/api/user/addresses', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label, address, city, lat, lng }),
      });

      if (!response.ok) {
        throw new Error('Failed to save address');
      }

      const newAddress = await response.json();
      setAddresses([newAddress, ...addresses]);
      return newAddress;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      throw err;
    }
  };

  // Delete a saved address
  const deleteAddress = async (addressId: string) => {
    try {
      setError(null);
      const response = await fetch(`/api/user/addresses/${addressId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete address');
      }

      setAddresses(addresses.filter(a => a.id !== addressId));
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      throw err;
    }
  };

  // Load addresses on mount
  useEffect(() => {
    fetchAddresses();
  }, []);

  return {
    addresses,
    isLoading,
    error,
    saveAddress,
    deleteAddress,
    refetch: fetchAddresses,
  };
}
