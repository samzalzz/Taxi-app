'use client';

import { useEffect, useState } from 'react';
import { Loader, Star, AlertCircle, Trash2 } from 'lucide-react';
import { ReviewCard } from '@/components/features/reviews/ReviewCard';
import { BulkActionsToolbar } from '@/components/features/admin/BulkActionsToolbar';
import { PaginationControls } from '@/components/features/admin/PaginationControls';

interface Review {
  id: string;
  overallRating: number;
  punctualityRating?: number;
  cleanlinessRating?: number;
  politenessRating?: number;
  safetyRating?: number;
  comment?: string;
  response?: string;
  respondedAt?: string;
  reviewer: { name: string; email: string; avatar?: string };
  reviewee: { name: string; email: string };
  booking: { id: string; pickupAddress: string; dropoffAddress: string };
  role: string;
  createdAt: string;
}

/**
 * Admin reviews management page.
 * Monitor all reviews, track responses, manage ratings.
 */
export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [responseFilter, setResponseFilter] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkLoading, setIsBulkLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const params = new URLSearchParams();
        if (roleFilter) params.append('role', roleFilter);
        if (responseFilter) params.append('hasResponse', responseFilter);
        params.append('limit', itemsPerPage.toString());
        params.append('offset', ((currentPage - 1) * itemsPerPage).toString());

        const response = await fetch(`/api/admin/reviews?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch reviews');

        const data = await response.json();
        setReviews(data.reviews);
        setTotal(data.total);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load reviews');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [roleFilter, responseFilter, currentPage, itemsPerPage]);

  const avgOverallRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.overallRating, 0) / reviews.length).toFixed(1)
      : 0;

  const responseRate =
    reviews.length > 0
      ? (
          (reviews.filter((r) => r.response).length / reviews.length) *
          100
        ).toFixed(0)
      : 0;

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === reviews.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(reviews.map((r) => r.id)));
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedIds.size === 0) return;

    setIsBulkLoading(true);
    try {
      const response = await fetch('/api/admin/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          ids: Array.from(selectedIds),
        }),
      });

      if (!response.ok) throw new Error('Bulk action failed');

      setSelectedIds(new Set());
      setCurrentPage(1);
      // Refresh the list
      const params = new URLSearchParams();
      if (roleFilter) params.append('role', roleFilter);
      if (responseFilter) params.append('hasResponse', responseFilter);
      params.append('limit', itemsPerPage.toString());
      params.append('offset', '0');

      const data = await fetch(`/api/admin/reviews?${params.toString()}`);
      const result = await data.json();
      setReviews(result.reviews);
      setTotal(result.total);
    } catch (err) {
      console.error('Bulk action error:', err);
    } finally {
      setIsBulkLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-on-surface mb-2">Avis & Évaluations</h1>
        <p className="text-on-surface-dim">Supervisez les avis clients et chauffeurs</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface border border-on-surface/10 rounded-lg p-4">
          <p className="text-sm text-on-surface-dim uppercase font-semibold mb-1">
            Total
          </p>
          <p className="text-2xl font-bold text-on-surface">{reviews.length}</p>
        </div>
        <div className="bg-surface border border-on-surface/10 rounded-lg p-4">
          <p className="text-sm text-on-surface-dim uppercase font-semibold mb-1">
            Note moyenne
          </p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-warning">{avgOverallRating}</p>
            <Star className="w-5 h-5 fill-warning text-warning" />
          </div>
        </div>
        <div className="bg-surface border border-on-surface/10 rounded-lg p-4">
          <p className="text-sm text-on-surface-dim uppercase font-semibold mb-1">
            Avec réponse
          </p>
          <p className="text-2xl font-bold text-primary">{responseRate}%</p>
        </div>
        <div className="bg-surface border border-on-surface/10 rounded-lg p-4">
          <p className="text-sm text-on-surface-dim uppercase font-semibold mb-1">
            Sans réponse
          </p>
          <p className="text-2xl font-bold text-warning">
            {reviews.filter((r) => !r.response).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-on-surface mb-2">
            Rôle
          </label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-4 py-2 bg-surface border border-on-surface/10 rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Tous les rôles</option>
            <option value="client">Client</option>
            <option value="driver">Chauffeur</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-on-surface mb-2">
            Réponse
          </label>
          <select
            value={responseFilter}
            onChange={(e) => setResponseFilter(e.target.value)}
            className="w-full px-4 py-2 bg-surface border border-on-surface/10 rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Tous</option>
            <option value="true">Avec réponse</option>
            <option value="false">Sans réponse</option>
          </select>
        </div>
      </div>

      {/* Pagination Controls */}
      {!isLoading && !error && reviews.length > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={Math.ceil(total / itemsPerPage)}
          itemsPerPage={itemsPerPage}
          total={total}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(newItemsPerPage) => {
            setItemsPerPage(newItemsPerPage);
            setCurrentPage(1);
          }}
        />
      )}

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="p-4 bg-error/10 border border-error/20 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-error flex-shrink-0" />
          <p className="text-error">{error}</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12">
          <Star className="w-12 h-12 text-on-surface-dim opacity-30 mx-auto mb-4" />
          <p className="text-on-surface-dim">Aucun avis trouvé</p>
        </div>
      ) : (
        <div className="space-y-3 pb-20">
          <div className="flex items-center justify-between">
            <p className="text-sm text-on-surface-dim">
              {reviews.length} avis{reviews.length > 1 ? 's' : ''}
            </p>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedIds.size === reviews.length && reviews.length > 0}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-on-surface-dim">Sélectionner tout</span>
            </label>
          </div>

          {reviews.map((review) => (
            <div
              key={review.id}
              className={`border rounded-lg p-4 bg-surface ${
                selectedIds.has(review.id) ? 'ring-2 ring-primary border-primary/30' : 'border-on-surface/10'
              }`}
            >
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  checked={selectedIds.has(review.id)}
                  onChange={() => toggleSelect(review.id)}
                  className="w-4 h-4 rounded mt-1 cursor-pointer flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="text-xs text-on-surface-dim mb-2">
                    <strong>{review.reviewer.name}</strong> → <strong>{review.reviewee.name}</strong>
                    <span className="mx-2">•</span>
                    {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                    <span className="mx-2">•</span>
                    <strong>Rôle:</strong> {review.role}
                    {review.booking && (
                      <>
                        <span className="mx-2">•</span>
                        <strong>Course:</strong> {review.booking.pickupAddress} →{' '}
                        {review.booking.dropoffAddress}
                      </>
                    )}
                  </div>
                  <ReviewCard review={review} />
                </div>
              </div>
            </div>
          ))}

          {/* Bulk Actions Toolbar */}
          <BulkActionsToolbar
            selectedCount={selectedIds.size}
            isLoading={isBulkLoading}
            actions={[
              {
                label: 'Supprimer',
                action: 'delete-reviews',
                icon: <Trash2 className="w-4 h-4" />,
                color: 'error',
                requiresConfirm: true,
              },
            ]}
            onAction={handleBulkAction}
            onClear={() => setSelectedIds(new Set())}
          />
        </div>
      )}
    </div>
  );
}
