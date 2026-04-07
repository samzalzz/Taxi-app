'use client';

import { useState } from 'react';
import { AlertCircle, Loader } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ComplaintFormProps {
  bookingId?: string;
  againstId?: string;
  onSubmit: (data: any) => Promise<void>;
  onSuccess?: () => void;
}

const CATEGORIES = [
  { value: 'DRIVER_BEHAVIOR', label: 'Comportement du chauffeur' },
  { value: 'VEHICLE_CONDITION', label: 'État du véhicule' },
  { value: 'PRICING_DISPUTE', label: 'Litige tarifaire' },
  { value: 'LATE_PICKUP', label: 'Retard à la prise en charge' },
  { value: 'ROUTE_DEVIATION', label: 'Déviation de trajet' },
  { value: 'TECHNICAL_ISSUE', label: 'Problème technique' },
  { value: 'OTHER', label: 'Autre' },
];

/**
 * ComplaintForm for submitting detailed complaints about bookings or users.
 */
export function ComplaintForm({
  bookingId,
  againstId,
  onSubmit,
  onSuccess,
}: ComplaintFormProps) {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || !description.trim()) {
      setError('Veuillez remplir tous les champs requis');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        category,
        description,
        bookingId,
        againstId,
      });

      setSuccess(true);
      setCategory('');
      setDescription('');

      if (onSuccess) {
        setTimeout(onSuccess, 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la soumission');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="p-6 bg-success/10 border border-success/20 rounded-lg text-center">
        <p className="text-success font-medium mb-2">✓ Réclamation soumise avec succès</p>
        <p className="text-sm text-on-surface-dim">
          Nos équipes traiteront votre demande dans les plus brefs délais.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Category */}
      <div>
        <label className="block text-sm font-semibold text-on-surface mb-2">
          Catégorie <span className="text-error">*</span>
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={isSubmitting}
          className="w-full px-4 py-2 bg-on-surface/5 border border-on-surface/10 rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
        >
          <option value="">Sélectionner une catégorie</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-on-surface mb-2">
          Description <span className="text-error">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={5000}
          rows={6}
          placeholder="Décrivez en détail les raisons de votre réclamation..."
          disabled={isSubmitting}
          className="w-full px-4 py-2 bg-on-surface/5 border border-on-surface/10 rounded-lg text-on-surface placeholder-on-surface-dim focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 resize-none"
        />
        <p className="text-xs text-on-surface-dim mt-1">
          {description.length}/5000 caractères
        </p>
      </div>

      {/* Info Box */}
      <div className="p-4 bg-info/10 border border-info/20 rounded-lg flex gap-3">
        <AlertCircle className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
        <p className="text-sm text-on-surface-dim">
          Soyez aussi précis que possible. Fournissez des détails sur le moment, le lieu et
          les personnes impliquées. Nos équipes enquêteront sur votre réclamation.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-error/10 border border-error/20 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
          <p className="text-sm text-error">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting || !category || !description.trim()}
        isLoading={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <Loader className="w-4 h-4 mr-2 animate-spin" />
            Soumission en cours...
          </>
        ) : (
          'Soumettre la réclamation'
        )}
      </Button>
    </form>
  );
}
