import { useEffect, useState } from 'react';

export interface CalendarBooking {
  id: string;
  pickupAddress: string;
  dropoffAddress: string;
  distance: number;
  price: number;
  status: string;
  createdAt: string;
  scheduledAt: string | null;
  // Admin-specific fields
  clientId?: string;
  // Driver-specific fields
  driverId?: string;
  clientName?: string;
  createdByDriverId?: string;
}

interface UseCalendarDataOptions {
  from?: Date;
  to?: Date;
}

export function useCalendarData(
  apiUrl: string,
  options?: UseCalendarDataOptions
) {
  const [bookings, setBookings] = useState<CalendarBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const url = new URL(apiUrl, window.location.origin);

        if (options?.from) {
          url.searchParams.append('from', options.from.toISOString());
        }
        if (options?.to) {
          url.searchParams.append('to', options.to.toISOString());
        }

        const response = await fetch(url.toString());
        if (!response.ok) {
          throw new Error('Failed to fetch calendar data');
        }

        const data = await response.json();
        setBookings(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [apiUrl, options?.from, options?.to]);

  return { bookings, isLoading, error };
}
