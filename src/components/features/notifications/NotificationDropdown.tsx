'use client';

import { useState } from 'react';
import { CheckCircle, Loader, MessageSquare, MapPin, Star, AlertCircle, Clock } from 'lucide-react';
import Link from 'next/link';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: Record<string, any>;
}

interface NotificationDropdownProps {
  notifications: Notification[];
  isLoading: boolean;
  onClose: () => void;
}

/**
 * Dropdown showing list of notifications with icons and links.
 * Allows marking individual notifications as read or all as read.
 */
export function NotificationDropdown({
  notifications,
  isLoading,
  onClose,
}: NotificationDropdownProps) {
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'BOOKING_CONFIRMED':
      case 'DRIVER_ASSIGNED':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'DRIVER_ARRIVED':
      case 'TRIP_STARTED':
        return <MapPin className="w-4 h-4 text-info" />;
      case 'TRIP_COMPLETED':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'NEW_MESSAGE':
        return <MessageSquare className="w-4 h-4 text-primary" />;
      case 'NEW_RATING':
        return <Star className="w-4 h-4 text-warning" />;
      case 'BOOKING_CANCELLED':
        return <AlertCircle className="w-4 h-4 text-error" />;
      default:
        return <Clock className="w-4 h-4 text-on-surface-dim" />;
    }
  };

  const getNotificationLink = (notification: Notification): string => {
    const bookingId = notification.data?.bookingId;
    switch (notification.type) {
      case 'BOOKING_CONFIRMED':
      case 'BOOKING_CANCELLED':
      case 'TRIP_STARTED':
      case 'TRIP_COMPLETED':
        return bookingId ? `/dashboard/courses/${bookingId}` : '/dashboard/courses';
      case 'DRIVER_ASSIGNED':
      case 'DRIVER_ARRIVED':
        return bookingId ? `/dashboard/chauffeur/courses/${bookingId}` : '/dashboard/chauffeur/courses';
      case 'NEW_MESSAGE':
        return `/dashboard/messages`;
      case 'NEW_RATING':
        return `/dashboard/avis`;
      default:
        return '/dashboard';
    }
  };

  const handleMarkAllRead = async () => {
    setIsMarkingAll(true);
    try {
      const response = await fetch('/api/notifications/read-all', {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to mark all as read');
    } catch (error) {
      console.error('[NotificationDropdown] Failed to mark all as read:', error);
    } finally {
      setIsMarkingAll(false);
    }
  };

  const handleMarkRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to mark as read');
    } catch (error) {
      console.error('[NotificationDropdown] Failed to mark as read:', error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="absolute right-0 mt-2 w-96 bg-surface border border-on-surface/10 rounded-lg shadow-lg z-50">
      {/* Header */}
      <div className="p-4 border-b border-on-surface/10 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-on-surface">
          Notifications {unreadCount > 0 && `(${unreadCount})`}
        </h3>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={isMarkingAll}
            className="text-xs text-primary hover:text-primary/80 disabled:opacity-50"
          >
            {isMarkingAll ? 'Marquage...' : 'Tout marquer comme lu'}
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="p-8 flex items-center justify-center">
            <Loader className="w-5 h-5 animate-spin text-primary" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-on-surface-dim">
              Aucune notification pour le moment
            </p>
          </div>
        ) : (
          <div className="divide-y divide-on-surface/10">
            {notifications.map((notification) => (
              <Link
                key={notification.id}
                href={getNotificationLink(notification)}
                onClick={() => {
                  handleMarkRead(notification.id);
                  onClose();
                }}
                className={`p-3 hover:bg-on-surface/5 transition-colors flex gap-3 items-start group ${
                  !notification.read ? 'bg-primary/5' : ''
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-on-surface line-clamp-1">
                    {notification.title}
                  </p>
                  <p className="text-xs text-on-surface-dim line-clamp-2 mt-0.5">
                    {notification.message}
                  </p>
                  <p className="text-xs text-on-surface-dim mt-1">
                    {new Intl.RelativeTimeFormat('fr-FR', {
                      numeric: 'auto',
                    }).format(
                      Math.round(
                        (new Date(notification.createdAt).getTime() -
                          new Date().getTime()) /
                          1000 /
                          60
                      ),
                      'minute'
                    )}
                  </p>
                </div>
                {!notification.read && (
                  <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-1.5" />
                )}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-on-surface/10 text-center">
          <Link
            href="/dashboard/notifications"
            className="text-xs text-primary hover:text-primary/80"
            onClick={onClose}
          >
            Voir toutes les notifications
          </Link>
        </div>
      )}
    </div>
  );
}
