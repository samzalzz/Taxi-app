'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, MapPin } from 'lucide-react';

export interface AddressResult {
  address: string;
  city: string;
  lat: number;
  lng: number;
}

interface AddressPickerProps {
  label: string;
  placeholder: string;
  value: AddressResult | null;
  onSelect: (result: AddressResult | null) => void;
  error?: string;
  icon?: React.ReactNode;
}

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    city?: string;
    town?: string;
    municipality?: string;
  };
}

async function searchAddress(query: string): Promise<NominatimResult[]> {
  if (!query || query.length < 3) return [];

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&countrycodes=fr&limit=5`
    );

    if (!response.ok) return [];
    return await response.json();
  } catch (err) {
    console.error('Nominatim search error:', err);
    return [];
  }
}

export function AddressPicker({
  label,
  placeholder,
  value,
  onSelect,
  error,
  icon,
}: AddressPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(value?.address || '');
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length < 3) {
        setSuggestions([]);
        return;
      }

      setIsSearching(true);
      const results = await searchAddress(query);
      setSuggestions(results);
      setIsSearching(false);
      setShowSuggestions(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSuggestion = (result: NominatimResult) => {
    const city =
      result.address?.city ||
      result.address?.town ||
      result.address?.municipality ||
      '';

    onSelect({
      address: result.display_name,
      city,
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
    });

    setQuery(result.display_name);
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-on-surface">
          {icon && <span className="inline-block mr-2">{icon}</span>}
          {label}
        </label>
      )}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-3.5 w-4 h-4 text-on-surface-dim pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => query.length >= 3 && setShowSuggestions(true)}
            className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
              error
                ? 'border-red-500 bg-red-500/5'
                : 'border-on-surface/10 bg-surface hover:border-on-surface/20 focus:border-primary focus:outline-none'
            } text-on-surface placeholder-on-surface-dim`}
          />
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && (
          <div
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 mt-2 bg-surface border border-on-surface/10 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
          >
            {isSearching ? (
              <div className="p-4 text-center text-on-surface-dim">
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                <p className="text-sm mt-2">Recherche en cours...</p>
              </div>
            ) : suggestions.length > 0 ? (
              <ul className="divide-y divide-on-surface/10">
                {suggestions.map((result, idx) => (
                  <li key={idx}>
                    <button
                      type="button"
                      onClick={() => handleSelectSuggestion(result)}
                      className="w-full text-left px-4 py-3 hover:bg-surface-light transition-colors flex items-start gap-3"
                    >
                      <MapPin className="w-4 h-4 text-on-surface-dim flex-shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-on-surface truncate">
                          {result.display_name.split(',')[0]}
                        </p>
                        <p className="text-xs text-on-surface-dim truncate">
                          {result.display_name.split(',').slice(1).join(',')}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : query.length >= 3 ? (
              <div className="p-4 text-center text-on-surface-dim">
                <p className="text-sm">Aucune adresse trouvée</p>
              </div>
            ) : null}
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
