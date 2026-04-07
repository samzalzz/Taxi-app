'use client';

import { useState } from 'react';
import { Star, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface DetailedRatingModalProps {
  bookingId: string;
  revieweeId: string;
  revieweeName: string;
  role: 'client' | 'driver';
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

/**
 * Modal for detailed rating with sub-criteria:
 * - Overall rating (required)
 * - Punctuality, Cleanliness, Politeness, Safety (optional)
 * - Comment (optional)
 */
export function DetailedRatingModal({
  bookingId,
  revieweeId,
  revieweeName,
  role,
  onClose,
  onSubmit,
}: DetailedRatingModalProps) {
  const [overallRating, setOverallRating] = useState(5);
  const [punctualityRating, setPunctualityRating] = useState<number | null>(null);
  const [cleanlinessRating, setCleanlinessRating] = useState<number | null>(null);
  const [politenessRating, setPolitenessRating] = useState<number | null>(null);
  const [safetyRating, setSafetyRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        bookingId,
        revieweeId,
        role,
        overallRating,
        punctualityRating,
        cleanlinessRating,
        politenessRating,
        safetyRating,
        comment: comment || undefined,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const RatingStars = ({
    value,
    onChange,
    label,
  }: {
    value: number | null;
    onChange: (v: number) => void;
    label: string;
  }) => (
    <div>
      <p className="text-sm font-medium text-on-surface mb-2">{label}</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onChange(star)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <Star
              className={`w-6 h-6 ${
                value && star <= value
                  ? 'fill-warning text-warning'
                  : 'text-on-surface-dim'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-surface rounded-lg max-w-md w-full mx-4 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-on-surface">
            Évaluer {revieweeName}
          </h3>
          <button
            onClick={onClose}
            className="text-on-surface-dim hover:text-on-surface"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overall Rating (Required) */}
        <RatingStars
          value={overallRating}
          onChange={setOverallRating}
          label="Note générale"
        />

        {/* Sub-criteria (Optional) */}
        <div className="space-y-4 p-4 bg-on-surface/5 rounded-lg">
          <p className="text-xs font-semibold text-on-surface-dim uppercase">
            Critères optionnels
          </p>

          <RatingStars
            value={punctualityRating}
            onChange={setPunctualityRating}
            label="Ponctualité"
          />

          {role === 'driver' && (
            <RatingStars
              value={cleanlinessRating}
              onChange={setCleanlinessRating}
              label="Propreté du véhicule"
            />
          )}

          <RatingStars
            value={politenessRating}
            onChange={setPolitenessRating}
            label="Politesse"
          />

          {role === 'driver' && (
            <RatingStars
              value={safetyRating}
              onChange={setSafetyRating}
              label="Sécurité"
            />
          )}
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-on-surface mb-2">
            Commentaire (optionnel)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={1000}
            rows={4}
            placeholder="Partagez votre expérience..."
            className="w-full px-3 py-2 bg-on-surface/5 border border-on-surface/10 rounded-lg text-on-surface placeholder-on-surface-dim focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
          <p className="text-xs text-on-surface-dim mt-1">
            {comment.length}/1000 caractères
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 bg-error/10 text-error text-sm rounded-lg">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1"
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            isLoading={isSubmitting}
            className="flex-1"
          >
            Soumettre
          </Button>
        </div>
      </div>
    </div>
  );
}
