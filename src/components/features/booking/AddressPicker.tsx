'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, MapPin, Star, Trash2 } from 'lucide-react';
import { useFavoriteAddresses } from '@/lib/hooks/useFavoriteAddresses';

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
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveLabel, setSaveLabel] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Use the favorite addresses hook
  const { addresses: savedAddresses, saveAddress, deleteAddress } = useFavoriteAddresses();

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

  const handleSelectSavedAddress = (saved: any) => {
    onSelect({
      address: saved.address,
      city: saved.city,
      lat: saved.lat,
      lng: saved.lng,
    });
    setQuery(saved.address);
    setShowSuggestions(false);
  };

  const handleSaveAddress = async () => {
    if (!value || !saveLabel.trim()) return;

    setIsSaving(true);
    try {
      await saveAddress(saveLabel, value.address, value.city, value.lat, value.lng);
      setSaveLabel('');
      setShowSaveModal(false);
    } catch (err) {
      console.error('Error saving address:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSavedAddress = async (addressId: string) => {
    try {
      await deleteAddress(addressId);
    } catch (err) {
      console.error('Error deleting address:', err);
    }
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
            className="absolute top-full left-0 right-0 mt-2 bg-surface border border-on-surface/10 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
          >
            {/* Saved Addresses Section */}
            {savedAddresses.length > 0 && (
              <>
                <div className="px-4 py-2 bg-surface-light border-b border-on-surface/10">
                  <p className="text-xs font-semibold text-on-surface-dim uppercase tracking-wide">Adresses favorites</p>
                </div>
                <ul className="divide-y divide-on-surface/10">
                  {savedAddresses.map((saved) => (
                    <li key={saved.id} className="flex items-between hover:bg-surface-light transition-colors group">
                      <button
                        type="button"
                        onClick={() => handleSelectSavedAddress(saved)}
                        className="flex-1 text-left px-4 py-3 flex items-start gap-3"
                      >
                        <Star className="w-4 h-4 text-primary flex-shrink-0 mt-0.5 fill-primary" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-on-surface">{saved.label}</p>
                          <p className="text-xs text-on-surface-dim truncate">{saved.address}</p>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSavedAddress(saved.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center justify-center px-3 py-3 text-on-surface-dim hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Search Results Section */}
            {(isSearching || suggestions.length > 0 || query.length >= 3) && (
              <>
                {savedAddresses.length > 0 && (
                  <div className="border-t border-on-surface/10"></div>
                )}
                {isSearching ? (
                  <div className="p-4 text-center text-on-surface-dim">
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                    <p className="text-sm mt-2">Recherche en cours...</p>
                  </div>
                ) : suggestions.length > 0 ? (
                  <>
                    <div className="px-4 py-2 bg-surface-light border-b border-on-surface/10">
                      <p className="text-xs font-semibold text-on-surface-dim uppercase tracking-wide">Résultats de recherche</p>
                    </div>
                    <ul className="divide-y divide-on-surface/10">
                      {suggestions.map((result, idx) => (
                        <li key={idx} className="flex items-between">
                          <button
                            type="button"
                            onClick={() => handleSelectSuggestion(result)}
                            className="flex-1 text-left px-4 py-3 hover:bg-surface-light transition-colors flex items-start gap-3"
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
                          {value && result.display_name === value.address && (
                            <button
                              type="button"
                              onClick={() => setShowSaveModal(true)}
                              className="inline-flex items-center justify-center px-3 py-3 text-primary hover:bg-surface-light transition-colors"
                              title="Ajouter aux favoris"
                            >
                              <Star className="w-4 h-4" />
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : query.length >= 3 ? (
                  <div className="p-4 text-center text-on-surface-dim">
                    <p className="text-sm">Aucune adresse trouvée</p>
                  </div>
                ) : null}
              </>
            )}
          </div>
        )}

        {/* Save Address Modal */}
        {showSaveModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-surface rounded-lg p-6 max-w-sm mx-4">
              <h3 className="text-lg font-semibold text-on-surface mb-4">Ajouter aux adresses favorites</h3>
              <input
                type="text"
                placeholder="Ex: Domicile, Travail, Gym..."
                value={saveLabel}
                onChange={e => setSaveLabel(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-on-surface/10 bg-surface-light text-on-surface placeholder-on-surface-dim focus:outline-none focus:border-primary mb-4"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowSaveModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-on-surface/10 text-on-surface hover:bg-surface-light transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleSaveAddress}
                  disabled={!saveLabel.trim() || isSaving}
                  className="flex-1 px-4 py-2 rounded-lg bg-primary text-background font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
