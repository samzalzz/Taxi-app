'use client';

import { useState } from 'react';
import { Star, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface RatingModalProps {
  bookingId: string;
  isOpen: boolean;
  onClose: () => void;
  targetName: string;
  role: 'client' | 'driver'; // who is submitting the rating
  onSubmitSuccess?: () => void;
}

export function RatingModal({
  bookingId,
  isOpen,
  onClose,
  targetName,
  role,
  onSubmitSuccess,
}: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/bookings/${bookingId}/rating`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          ratingValue: rating,
          review: review.trim() || null,
        }),
        credentials: 'include',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit rating');
      }

      onClose();
      onSubmitSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-surface rounded-2xl shadow-xl max-w-md w-full mx-4 p-6 animate-in fade-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif font-bold text-on-surface">
            Évaluer le trajet
          </h2>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center p-1 hover:bg-on-surface/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Text */}
          <div className="text-center">
            <p className="text-on-surface-dim mb-4">
              Comment avez-vous trouvé votre expérience avec{' '}
              <span className="font-semibold text-on-surface">{targetName}</span>
              ?
            </p>
          </div>

          {/* Star Rating */}
          <div className="flex justify-center gap-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoverRating || rating)
                      ? 'fill-primary text-primary'
                      : 'text-on-surface/20'
                  } transition-colors`}
                />
              </button>
            ))}
          </div>

          {/* Rating Label */}
          {rating > 0 && (
            <p className="text-center text-sm text-on-surface-dim">
              {rating === 5 && 'Excellent! 🎉'}
              {rating === 4 && 'Très bien!'}
              {rating === 3 && 'Correct'}
              {rating === 2 && 'Peut être mieux'}
              {rating === 1 && 'Pas satisfait'}
            </p>
          )}

          {/* Review Text */}
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Partager votre expérience (optionnel)..."
            className="w-full px-4 py-3 border border-on-surface/10 rounded-lg bg-surface-light text-on-surface placeholder:text-on-surface-dim focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
            rows={3}
            maxLength={500}
          />

          <p className="text-xs text-on-surface-dim text-right">
            {review.length}/500
          </p>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              variant="secondary"
              className="flex-1"
            >
              Passer
            </Button>
            <Button
              type="submit"
              disabled={isLoading || rating === 0}
              isLoading={isLoading}
              className="flex-1"
            >
              Envoyer
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
