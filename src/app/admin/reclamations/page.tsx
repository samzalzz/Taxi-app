'use client';

import { useEffect, useState } from 'react';
import { Loader, AlertCircle, Trash2 } from 'lucide-react';
import { ComplaintCard } from '@/components/features/complaints/ComplaintCard';
import { BulkActionsToolbar } from '@/components/features/admin/BulkActionsToolbar';
import { PaginationControls } from '@/components/features/admin/PaginationControls';

interface Complaint {
  id: string;
  category: string;
  description: string;
  status: string;
  createdAt: string;
  complainant: { name: string; email: string };
  against?: { name: string };
  replies: Array<{
    id: string;
    content: string;
    author: { name: string };
    createdAt: string;
  }>;
}

/**
 * Admin page for managing complaints.
 * Allows filtering by status and category.
 */
export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('OPEN');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkLoading, setIsBulkLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const params = new URLSearchParams();
        if (statusFilter) params.append('status', statusFilter);
        if (categoryFilter) params.append('category', categoryFilter);
        params.append('limit', itemsPerPage.toString());
        params.append('offset', ((currentPage - 1) * itemsPerPage).toString());

        const response = await fetch(`/api/admin/complaints?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch complaints');

        const data = await response.json();
        setComplaints(data.complaints);
        setTotal(data.total);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load complaints');
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplaints();
  }, [statusFilter, categoryFilter, currentPage, itemsPerPage]);

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
    if (selectedIds.size === complaints.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(complaints.map((c) => c.id)));
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
      if (statusFilter) params.append('status', statusFilter);
      if (categoryFilter) params.append('category', categoryFilter);
      params.append('limit', itemsPerPage.toString());
      params.append('offset', '0');

      const data = await fetch(`/api/admin/complaints?${params.toString()}`);
      const result = await data.json();
      setComplaints(result.complaints);
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
        <h1 className="text-3xl font-bold text-on-surface mb-2">Réclamations</h1>
        <p className="text-on-surface-dim">Gérez les plaintes et réclamations des utilisateurs</p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-on-surface mb-2">
            Statut
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 bg-surface border border-on-surface/10 rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Tous les statuts</option>
            <option value="OPEN">Ouvert</option>
            <option value="UNDER_REVIEW">En examen</option>
            <option value="RESOLVED">Résolu</option>
            <option value="DISMISSED">Rejeté</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-on-surface mb-2">
            Catégorie
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-4 py-2 bg-surface border border-on-surface/10 rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Toutes les catégories</option>
            <option value="DRIVER_BEHAVIOR">Comportement du chauffeur</option>
            <option value="VEHICLE_CONDITION">État du véhicule</option>
            <option value="PRICING_DISPUTE">Litige tarifaire</option>
            <option value="LATE_PICKUP">Retard à la prise en charge</option>
            <option value="ROUTE_DEVIATION">Déviation de trajet</option>
            <option value="TECHNICAL_ISSUE">Problème technique</option>
            <option value="OTHER">Autre</option>
          </select>
        </div>
      </div>

      {/* Pagination Controls */}
      {!isLoading && !error && complaints.length > 0 && (
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
      ) : complaints.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-on-surface-dim">Aucune réclamation trouvée</p>
        </div>
      ) : (
        <div className="space-y-3 pb-20">
          <div className="flex items-center justify-between">
            <p className="text-sm text-on-surface-dim">
              {complaints.length} réclamation{complaints.length > 1 ? 's' : ''}
            </p>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedIds.size === complaints.length && complaints.length > 0}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-on-surface-dim">Sélectionner tout</span>
            </label>
          </div>

          {complaints.map((complaint) => (
            <div
              key={complaint.id}
              className={`border rounded-lg p-4 bg-surface ${
                selectedIds.has(complaint.id) ? 'ring-2 ring-primary border-primary/30' : 'border-on-surface/10'
              }`}
            >
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  checked={selectedIds.has(complaint.id)}
                  onChange={() => toggleSelect(complaint.id)}
                  className="w-4 h-4 rounded mt-1 cursor-pointer flex-shrink-0"
                />
                <div className="flex-1">
                  <ComplaintCard
                    complaint={complaint}
                    canReply={true}
                    onReply={async (complaintId, content) => {
                      const response = await fetch(`/api/complaints/${complaintId}/reply`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ content }),
                      });
                      if (!response.ok) throw new Error('Failed to submit reply');

                      // Refresh complaints
                      const params = new URLSearchParams();
                      if (statusFilter) params.append('status', statusFilter);
                      if (categoryFilter) params.append('category', categoryFilter);

                      const data = await fetch(`/api/admin/complaints?${params.toString()}`);
                      const result = await data.json();
                      setComplaints(result.complaints);
                    }}
                  />
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
                action: 'delete-complaints',
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
