'use client';

import { useEffect, useState } from 'react';
import { Loader, Bell, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';
import { BulkActionsToolbar } from '@/components/features/admin/BulkActionsToolbar';
import { PaginationControls } from '@/components/features/admin/PaginationControls';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  user: { id: string; name: string; email: string };
}

/**
 * Admin notifications management page.
 * View all system notifications, filter by type/read status.
 */
export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [readFilter, setReadFilter] = useState<string>('');
  const [stats, setStats] = useState<any>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkLoading, setIsBulkLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const params = new URLSearchParams();
        if (typeFilter) params.append('type', typeFilter);
        if (readFilter) params.append('read', readFilter);
        params.append('limit', itemsPerPage.toString());
        params.append('offset', ((currentPage - 1) * itemsPerPage).toString());

        const response = await fetch(`/api/admin/notifications?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch notifications');

        const data = await response.json();
        setNotifications(data.notifications);
        setStats(data);
        setTotal(data.total);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load notifications');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [typeFilter, readFilter, currentPage, itemsPerPage]);

  const NOTIFICATION_TYPES = [
    'BOOKING_CONFIRMED',
    'BOOKING_CANCELLED',
    'DRIVER_ASSIGNED',
    'DRIVER_ARRIVED',
    'TRIP_STARTED',
    'TRIP_COMPLETED',
    'NEW_MESSAGE',
    'NEW_RATING',
    'SUPPORT_REPLY',
    'SYSTEM',
  ];

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
    if (selectedIds.size === notifications.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(notifications.map((n) => n.id)));
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
      if (readFilter) params.append('read', readFilter);
      params.append('limit', itemsPerPage.toString());
      params.append('offset', '0');

      const data = await fetch(`/api/admin/notifications?${params.toString()}`);
      const result = await data.json();
      setNotifications(result.notifications);
      setStats(result);
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
        <h1 className="text-3xl font-bold text-on-surface mb-2">Notifications</h1>
        <p className="text-on-surface-dim">Gérez toutes les notifications du système</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface border border-on-surface/10 rounded-lg p-4">
            <p className="text-sm text-on-surface-dim uppercase font-semibold mb-1">
              Total
            </p>
            <p className="text-2xl font-bold text-on-surface">{stats.total}</p>
          </div>
          <div className="bg-surface border border-on-surface/10 rounded-lg p-4">
            <p className="text-sm text-on-surface-dim uppercase font-semibold mb-1">
              Non lues
            </p>
            <p className="text-2xl font-bold text-warning">{stats.unreadCount}</p>
          </div>
          <div className="bg-surface border border-on-surface/10 rounded-lg p-4">
            <p className="text-sm text-on-surface-dim uppercase font-semibold mb-1">
              Types
            </p>
            <p className="text-2xl font-bold text-primary">{stats.stats?.length || 0}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            {NOTIFICATION_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-on-surface mb-2">
            Statut de lecture
          </label>
          <select
            value={readFilter}
            onChange={(e) => setReadFilter(e.target.value)}
            className="w-full px-4 py-2 bg-surface border border-on-surface/10 rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Tous</option>
            <option value="true">Lues</option>
            <option value="false">Non lues</option>
          </select>
        </div>
      </div>

      {/* Pagination Controls */}
      {!isLoading && !error && notifications.length > 0 && (
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
      ) : notifications.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="w-12 h-12 text-on-surface-dim opacity-30 mx-auto mb-4" />
          <p className="text-on-surface-dim">Aucune notification trouvée</p>
        </div>
      ) : (
        <div className="space-y-3 pb-20">
          <div className="flex items-center justify-between">
            <p className="text-sm text-on-surface-dim">
              {notifications.length} notification{notifications.length > 1 ? 's' : ''}
            </p>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedIds.size === notifications.length && notifications.length > 0}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-on-surface-dim">Sélectionner tout</span>
            </label>
          </div>

          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`border rounded-lg p-4 ${
                notif.read
                  ? 'border-on-surface/10 bg-surface'
                  : 'border-primary/30 bg-primary/5'
              } ${selectedIds.has(notif.id) ? 'ring-2 ring-primary' : ''}`}
            >
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  checked={selectedIds.has(notif.id)}
                  onChange={() => toggleSelect(notif.id)}
                  className="w-4 h-4 rounded mt-1 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-on-surface">{notif.title}</p>
                    {!notif.read && (
                      <span className="inline-block w-2 h-2 bg-primary rounded-full"></span>
                    )}
                  </div>
                  <p className="text-sm text-on-surface-dim mb-2">{notif.message}</p>
                  <div className="flex items-center gap-4 text-xs text-on-surface-dim">
                    <span>
                      <strong>Utilisateur:</strong> {notif.user.name} ({notif.user.email})
                    </span>
                    <span>
                      <strong>Type:</strong> {notif.type}
                    </span>
                    <span>
                      {new Date(notif.createdAt).toLocaleString('fr-FR')}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      notif.read
                        ? 'bg-on-surface/10 text-on-surface-dim'
                        : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    {notif.read ? 'Lue' : 'Non lue'}
                  </span>
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
                label: 'Marquer comme lues',
                action: 'mark-notifications-read',
                icon: <CheckCircle className="w-4 h-4" />,
              },
              {
                label: 'Supprimer',
                action: 'delete-notifications',
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
