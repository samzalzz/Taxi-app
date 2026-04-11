'use client';

import { useEffect, useState } from 'react';
import { X, Loader } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Driver {
  id: string;
  name: string;
  avatar?: string;
}

interface NewConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConversationCreated: (conversationId: string, driver: Driver) => void;
}

/**
 * Modal to create a new driver-to-driver conversation.
 * Fetches list of drivers and allows selecting one to message.
 */
export function NewConversationModal({
  isOpen,
  onClose,
  onConversationCreated,
}: NewConversationModalProps) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchDrivers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/driver/list');
        if (!response.ok) throw new Error('Failed to fetch drivers');
        const data = await response.json();
        setDrivers(data.drivers);
      } catch (err) {
        console.error('[NewConversationModal]', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch drivers');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDrivers();
  }, [isOpen]);

  const handleSelectDriver = async (driver: Driver) => {
    try {
      setIsCreating(true);
      setError(null);

      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantId: driver.id }),
      });

      if (!response.ok) throw new Error('Failed to create conversation');

      const data = await response.json();
      onConversationCreated(data.conversation.id, driver);
      onClose();
    } catch (err) {
      console.error('[NewConversationModal] Create error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create conversation');
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-surface rounded-lg p-6 max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-on-surface">
            Nouveau message
          </h2>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center p-1 rounded-lg text-on-surface-dim hover:text-on-surface hover:bg-on-surface/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="w-5 h-5 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-on-surface-dim text-sm py-4">
              {error}
            </div>
          ) : drivers.length === 0 ? (
            <div className="text-on-surface-dim text-sm py-4">
              Aucun chauffeur disponible
            </div>
          ) : (
            drivers.map((driver) => (
              <button
                key={driver.id}
                onClick={() => handleSelectDriver(driver)}
                disabled={isCreating}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-on-surface/5 transition-colors disabled:opacity-50"
              >
                {driver.avatar && (
                  <img
                    src={driver.avatar}
                    alt={driver.name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className="text-on-surface font-medium text-left">
                  {driver.name}
                </span>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-on-surface/10">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isCreating}
            className="flex-1"
          >
            Annuler
          </Button>
        </div>
      </div>
    </div>
  );
}
