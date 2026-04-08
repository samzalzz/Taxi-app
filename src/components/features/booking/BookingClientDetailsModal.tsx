'use client';

import { useEffect, useState } from 'react';
import { X, Mail, Phone, Calendar, Star, AlertCircle, MapPin } from 'lucide-react';

interface ClientDetails {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  createdAt: string;
  completedTrips?: number;
  rating?: number;
  avatar?: string;
  cpamByDefault?: boolean;
}

interface Booking {
  id: string;
  clientId: string | null;
  guestName?: string | null;
  guestEmail?: string | null;
  guestPhone?: string | null;
  clientNotes?: string | null;
  driverNotes?: string | null;
}

interface BookingClientDetailsModalProps {
  booking: Booking;
  isOpen: boolean;
  isAdmin: boolean;
  onClose: () => void;
}

export function BookingClientDetailsModal({
  booking,
  isOpen,
  isAdmin,
  onClose,
}: BookingClientDetailsModalProps) {
  const [clientDetails, setClientDetails] = useState<ClientDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && booking.clientId) {
      setIsLoading(true);
      setError(null);
      fetch(`/api/admin/clients/${booking.clientId}`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch client details');
          return res.json();
        })
        .then((data) => setClientDetails(data))
        .catch((err) => setError(err.message))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, booking.clientId]);

  if (!isOpen) return null;

  const isGuest = !booking.clientId;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg max-w-2xl w-full border border-on-surface/10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-on-surface/10">
          <h2 className="text-2xl font-bold text-on-surface">
            {isGuest ? 'Détails du client invité' : 'Détails du client'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-light rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-on-surface" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
          {isLoading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
              <p className="text-on-surface-dim mt-2">Chargement...</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-error/10 border border-error/20 rounded-lg flex gap-2">
              <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
              <p className="text-sm text-error">{error}</p>
            </div>
          )}

          {isGuest ? (
            // Guest Booking Details
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase text-on-surface-dim">Nom</label>
                <p className="text-on-surface font-semibold">{booking.guestName || 'Non spécifié'}</p>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-on-surface-dim">Email</label>
                <p className="text-on-surface flex items-center gap-2">
                  <Mail className="w-4 h-4 text-on-surface-dim" />
                  {booking.guestEmail || 'Non spécifié'}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-on-surface-dim">Téléphone</label>
                <p className="text-on-surface flex items-center gap-2">
                  <Phone className="w-4 h-4 text-on-surface-dim" />
                  {booking.guestPhone || 'Non spécifié'}
                </p>
              </div>
            </div>
          ) : clientDetails ? (
            // Registered Client Details
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="text-xs font-semibold uppercase text-on-surface-dim">Nom</label>
                <p className="text-on-surface font-semibold">{clientDetails.name}</p>
              </div>

              {/* Contact Info - Always shown */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase text-on-surface-dim">Email</label>
                  <p className="text-on-surface flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-on-surface-dim flex-shrink-0" />
                    {clientDetails.email}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-on-surface-dim">Téléphone</label>
                  <p className="text-on-surface flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-on-surface-dim flex-shrink-0" />
                    {clientDetails.phone || 'Non renseigné'}
                  </p>
                </div>
              </div>

              {/* Admin Only Details */}
              {isAdmin && (
                <>
                  {/* Role & Account Info */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-on-surface/10">
                    <div>
                      <label className="text-xs font-semibold uppercase text-on-surface-dim">Rôle</label>
                      <p className="text-on-surface font-medium capitalize">{clientDetails.role.toLowerCase()}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase text-on-surface-dim">
                        Membre depuis
                      </label>
                      <p className="text-on-surface text-sm flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-on-surface-dim flex-shrink-0" />
                        {new Intl.DateTimeFormat('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        }).format(new Date(clientDetails.createdAt))}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-on-surface/10">
                    <div>
                      <label className="text-xs font-semibold uppercase text-on-surface-dim">Voyages complétés</label>
                      <p className="text-on-surface font-semibold text-lg">{clientDetails.completedTrips || 0}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase text-on-surface-dim">Note moyenne</label>
                      <p className="text-on-surface flex items-center gap-2 font-semibold">
                        <Star className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                        {clientDetails.rating ? clientDetails.rating.toFixed(1) : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Special Tags */}
                  {clientDetails.cpamByDefault && (
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <p className="text-sm text-blue-600 font-medium">✓ Client CPAM par défaut</p>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <p className="text-on-surface-dim">Aucune donnée disponible</p>
          )}

          {/* Booking Notes - Always shown when available */}
          {booking.clientNotes && (
            <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg space-y-2">
              <label className="text-xs font-semibold uppercase text-on-surface-dim block">
                Notes du client
              </label>
              <p className="text-on-surface text-sm">{booking.clientNotes}</p>
            </div>
          )}

          {/* Driver Notes - Admin only */}
          {isAdmin && booking.driverNotes && (
            <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-lg space-y-2">
              <label className="text-xs font-semibold uppercase text-orange-600 block">
                Notes du chauffeur
              </label>
              <p className="text-on-surface text-sm">{booking.driverNotes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-on-surface/10 bg-surface-light">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 rounded-lg bg-primary text-background font-semibold hover:bg-primary/90 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
