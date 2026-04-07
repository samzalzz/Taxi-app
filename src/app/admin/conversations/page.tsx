'use client';

import { useEffect, useState } from 'react';
import { Loader, MessageSquare, AlertCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { BulkActionsToolbar } from '@/components/features/admin/BulkActionsToolbar';
import { PaginationControls } from '@/components/features/admin/PaginationControls';

interface Conversation {
  id: string;
  type: string;
  participants: Array<{ user: { id: string; name: string; email: string } }>;
  messages: Array<{ content: string; sender: { name: string }; createdAt: string }>;
  booking?: { id: string; pickupAddress: string; dropoffAddress: string; status: string };
  unreadCount: number;
  totalMessages: number;
  updatedAt: string;
}

/**
 * Admin conversations management page.
 * View all conversations, monitor unread messages, oversee chat activity.
 */
export default function AdminConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkLoading, setIsBulkLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const params = new URLSearchParams();
        if (typeFilter) params.append('type', typeFilter);
        params.append('limit', itemsPerPage.toString());
        params.append('offset', ((currentPage - 1) * itemsPerPage).toString());

        const response = await fetch(`/api/admin/conversations?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch conversations');

        const data = await response.json();
        setConversations(data.conversations);
        setTotal(data.total);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load conversations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [typeFilter, currentPage, itemsPerPage]);

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

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
    if (selectedIds.size === conversations.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(conversations.map((c) => c.id)));
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
      if (typeFilter) params.append('type', typeFilter);
      params.append('limit', itemsPerPage.toString());
      params.append('offset', '0');

      const data = await fetch(`/api/admin/conversations?${params.toString()}`);
      const result = await data.json();
      setConversations(result.conversations);
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
        <h1 className="text-3xl font-bold text-on-surface mb-2">Conversations</h1>
        <p className="text-on-surface-dim">Supervisez les discussions entre utilisateurs</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface border border-on-surface/10 rounded-lg p-4">
          <p className="text-sm text-on-surface-dim uppercase font-semibold mb-1">
            Total
          </p>
          <p className="text-2xl font-bold text-on-surface">
            {conversations.length}
          </p>
        </div>
        <div className="bg-surface border border-on-surface/10 rounded-lg p-4">
          <p className="text-sm text-on-surface-dim uppercase font-semibold mb-1">
            Messages non lus
          </p>
          <p className="text-2xl font-bold text-warning">{totalUnread}</p>
        </div>
        <div className="bg-surface border border-on-surface/10 rounded-lg p-4">
          <p className="text-sm text-on-surface-dim uppercase font-semibold mb-1">
            Conversations actives
          </p>
          <p className="text-2xl font-bold text-primary">
            {conversations.filter((c) => c.totalMessages > 0).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div>
        <label className="block text-sm font-medium text-on-surface mb-2">
          Type
        </label>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-full px-4 py-2 bg-surface border border-on-surface/10 rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Tous les types</option>
          <option value="RIDE">Course (RIDE)</option>
          <option value="SUPPORT">Support (SUPPORT)</option>
        </select>
      </div>

      {/* Pagination Controls */}
      {!isLoading && !error && conversations.length > 0 && (
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
      ) : conversations.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-on-surface-dim opacity-30 mx-auto mb-4" />
          <p className="text-on-surface-dim">Aucune conversation trouvée</p>
        </div>
      ) : (
        <div className="space-y-3 pb-20">
          <div className="flex items-center justify-between">
            <p className="text-sm text-on-surface-dim">
              {conversations.length} conversation{conversations.length > 1 ? 's' : ''}
            </p>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedIds.size === conversations.length && conversations.length > 0}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-on-surface-dim">Sélectionner tout</span>
            </label>
          </div>

          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`border rounded-lg p-4 bg-surface hover:border-primary/30 transition-colors ${
                selectedIds.has(conv.id) ? 'ring-2 ring-primary border-primary/30' : 'border-on-surface/10'
              }`}
            >
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  checked={selectedIds.has(conv.id)}
                  onChange={() => toggleSelect(conv.id)}
                  className="w-4 h-4 rounded mt-1 cursor-pointer flex-shrink-0"
                />
                <div className="flex-1 flex justify-between gap-4 items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-semibold text-on-surface">
                      {conv.type === 'RIDE' ? '🚗 Course' : '💬 Support'}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-warning text-on-surface rounded-full">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>

                  {/* Participants */}
                  <p className="text-sm text-on-surface-dim mb-2">
                    <strong>Participants:</strong>{' '}
                    {conv.participants.map((p) => p.user.name).join(', ')}
                  </p>

                  {/* Last Message */}
                  {conv.messages[0] && (
                    <p className="text-sm text-on-surface-dim mb-2 line-clamp-1">
                      <strong>{conv.messages[0].sender.name}:</strong>{' '}
                      {conv.messages[0].content}
                    </p>
                  )}

                  {/* Booking Info */}
                  {conv.booking && (
                    <p className="text-xs text-on-surface-dim mb-2">
                      <strong>Course:</strong> {conv.booking.pickupAddress} →{' '}
                      {conv.booking.dropoffAddress} ({conv.booking.status})
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-on-surface-dim">
                    <span>
                      <strong>Messages:</strong> {conv.totalMessages}
                    </span>
                    <span>
                      Mise à jour:{' '}
                      {new Date(conv.updatedAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <Link
                    href={`/admin/conversations/${conv.id}`}
                    className="px-3 py-1 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors"
                  >
                    Voir
                  </Link>
                </div>
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
                action: 'delete-conversations',
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
