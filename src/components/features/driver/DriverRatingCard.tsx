'use client';

import { useEffect, useState } from 'react';
import { Star, MessageCircle } from 'lucide-react';

interface Review {
  bookingId: string;
  rating: number;
  review: string | null;
  clientName: string;
  clientAvatar: string | null;
  createdAt: string;
}

interface DriverRatings {
  driverId: string;
  overallRating: number;
  totalTrips: number;
  totalRatings: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  recentReviews: Review[];
}

interface DriverRatingCardProps {
  driverId: string;
}

export function DriverRatingCard({ driverId }: DriverRatingCardProps) {
  const [ratings, setRatings] = useState<DriverRatings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const res = await fetch(`/api/drivers/${driverId}/ratings`);
        if (!res.ok) throw new Error('Failed to load ratings');
        const data = await res.json();
        setRatings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading ratings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRatings();
  }, [driverId]);

  if (isLoading) {
    return (
      <div className="glass p-6 rounded-xl">
        <p className="text-on-surface-dim text-sm">Chargement des avis...</p>
      </div>
    );
  }

  if (error || !ratings) {
    return (
      <div className="glass p-6 rounded-xl">
        <p className="text-on-surface-dim text-sm">{error || 'Erreur'}</p>
      </div>
    );
  }

  const getPercentage = (count: number) => {
    return ratings.totalRatings > 0
      ? Math.round((count / ratings.totalRatings) * 100)
      : 0;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="glass p-6 rounded-xl space-y-6">
      {/* Overall Rating */}
      <div className="border-b border-on-surface/10 pb-6">
        <h3 className="text-lg font-semibold text-on-surface mb-4">
          Avis et notes
        </h3>

        <div className="flex items-start gap-6">
          {/* Rating Summary */}
          <div className="flex-shrink-0">
            <div className="text-4xl font-serif font-bold text-primary mb-2">
              {ratings.overallRating.toFixed(1)}
            </div>
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(ratings.overallRating)
                      ? 'fill-primary text-primary'
                      : 'text-on-surface/20'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-on-surface-dim">
              {ratings.totalRatings} avis
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-xs text-on-surface-dim w-4">
                  {star}★
                </span>
                <div className="h-2 bg-on-surface/10 rounded-full flex-1 overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{
                      width: `${getPercentage(ratings.ratingDistribution[star as keyof typeof ratings.ratingDistribution])}%`,
                    }}
                  />
                </div>
                <span className="text-xs text-on-surface-dim w-6 text-right">
                  {getPercentage(ratings.ratingDistribution[star as keyof typeof ratings.ratingDistribution])}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Reviews */}
      {ratings.recentReviews.length > 0 && (
        <div>
          <h4 className="font-semibold text-on-surface mb-4">Avis récents</h4>
          <div className="space-y-4">
            {ratings.recentReviews.map((review) => (
              <div
                key={review.bookingId}
                className="border border-on-surface/10 rounded-lg p-4"
              >
                {/* Reviewer Info */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {review.clientAvatar && (
                      <img
                        src={review.clientAvatar}
                        alt={review.clientName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium text-on-surface text-sm">
                        {review.clientName}
                      </p>
                      <p className="text-xs text-on-surface-dim">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${
                          star <= review.rating
                            ? 'fill-primary text-primary'
                            : 'text-on-surface/20'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                {review.review && (
                  <p className="text-sm text-on-surface-dim leading-relaxed">
                    {review.review}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Reviews */}
      {ratings.recentReviews.length === 0 && (
        <div className="text-center py-8">
          <MessageCircle className="w-8 h-8 text-on-surface/20 mx-auto mb-2" />
          <p className="text-sm text-on-surface-dim">
            Aucun avis pour le moment
          </p>
        </div>
      )}
    </div>
  );
}
