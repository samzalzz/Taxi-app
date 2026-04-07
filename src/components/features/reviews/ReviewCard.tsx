'use client';

import { useState } from 'react';
import { Star, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ReviewCardProps {
  review: {
    id: string;
    overallRating: number;
    punctualityRating?: number;
    cleanlinessRating?: number;
    politenessRating?: number;
    safetyRating?: number;
    comment?: string;
    response?: string;
    respondedAt?: string;
    reviewer: { name: string; avatar?: string };
    createdAt: string;
  };
  isOwn?: boolean;
  onRespond?: (reviewId: string, response: string) => Promise<void>;
}

/**
 * ReviewCard displays a single review with overall + sub-criteria ratings.
 * Allows responding if it's your review.
 */
export function ReviewCard({ review, isOwn = false, onRespond }: ReviewCardProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [responseText, setResponseText] = useState(review.response || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitResponse = async () => {
    if (!responseText.trim() || !onRespond) return;

    setIsSubmitting(true);
    try {
      await onRespond(review.id, responseText);
      setIsReplying(false);
    } catch (error) {
      console.error('Failed to submit response:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const createdDate = new Date(review.createdAt).toLocaleDateString('fr-FR');

  const StarRating = ({ value, label }: { value?: number; label: string }) => {
    if (!value) return null;
    return (
      <div className="flex items-center gap-2">
        <p className="text-sm text-on-surface-dim flex-1">{label}</p>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${
                star <= value
                  ? 'fill-warning text-warning'
                  : 'text-on-surface-dim'
              }`}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="border border-on-surface/10 rounded-lg p-4 bg-surface space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {review.reviewer.avatar && (
            <img
              src={review.reviewer.avatar}
              alt={review.reviewer.name}
              className="w-10 h-10 rounded-full"
            />
          )}
          <div>
            <p className="font-semibold text-on-surface">{review.reviewer.name}</p>
            <p className="text-xs text-on-surface-dim">{createdDate}</p>
          </div>
        </div>

        {/* Overall Rating */}
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-5 h-5 ${
                star <= review.overallRating
                  ? 'fill-warning text-warning'
                  : 'text-on-surface-dim'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Sub-criteria */}
      {(review.punctualityRating ||
        review.cleanlinessRating ||
        review.politenessRating ||
        review.safetyRating) && (
        <div className="space-y-2 p-3 bg-on-surface/5 rounded-lg">
          <StarRating value={review.punctualityRating} label="Ponctualité" />
          <StarRating value={review.cleanlinessRating} label="Propreté" />
          <StarRating value={review.politenessRating} label="Politesse" />
          <StarRating value={review.safetyRating} label="Sécurité" />
        </div>
      )}

      {/* Comment */}
      {review.comment && (
        <p className="text-sm text-on-surface">{review.comment}</p>
      )}

      {/* Response */}
      {review.response && (
        <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
          <p className="text-xs font-semibold text-primary mb-1">Votre réponse</p>
          <p className="text-sm text-on-surface">{review.response}</p>
          {review.respondedAt && (
            <p className="text-xs text-on-surface-dim mt-1">
              {new Date(review.respondedAt).toLocaleDateString('fr-FR')}
            </p>
          )}
        </div>
      )}

      {/* Reply Button */}
      {isOwn && !review.response && onRespond && (
        <>
          {!isReplying ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsReplying(true)}
              className="w-full"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Répondre
            </Button>
          ) : (
            <div className="space-y-2">
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                maxLength={1000}
                rows={3}
                placeholder="Écrivez votre réponse..."
                className="w-full px-3 py-2 bg-on-surface/5 border border-on-surface/10 rounded-lg text-on-surface placeholder-on-surface-dim focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsReplying(false)}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmitResponse}
                  disabled={isSubmitting || !responseText.trim()}
                  isLoading={isSubmitting}
                  className="flex-1"
                >
                  Envoyer
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
