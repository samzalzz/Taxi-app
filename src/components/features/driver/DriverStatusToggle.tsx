'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

type DriverStatus = 'OFFLINE' | 'AVAILABLE' | 'ON_BREAK';

interface DriverStatusToggleProps {
  initialStatus: DriverStatus;
  onStatusChange?: (status: DriverStatus) => void;
}

export function DriverStatusToggle({
  initialStatus,
  onStatusChange,
}: DriverStatusToggleProps) {
  const [status, setStatus] = useState<DriverStatus>(initialStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: DriverStatus) => {
    if (newStatus === status) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/driver/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Erreur lors de la mise à jour du statut');
      }

      setStatus(newStatus);
      onStatusChange?.(newStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (s: DriverStatus) => {
    switch (s) {
      case 'OFFLINE':
        return 'bg-on-surface/20 text-on-surface';
      case 'AVAILABLE':
        return 'bg-success/20 text-success';
      case 'ON_BREAK':
        return 'bg-warning/20 text-warning';
      default:
        return 'bg-on-surface/10';
    }
  };

  const getStatusLabel = (s: DriverStatus) => {
    switch (s) {
      case 'OFFLINE':
        return 'Hors ligne';
      case 'AVAILABLE':
        return 'Disponible';
      case 'ON_BREAK':
        return 'Pause';
      default:
        return s;
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-sm text-on-surface-dim">État du service</p>
      <div className="flex gap-3">
        {(['OFFLINE', 'AVAILABLE', 'ON_BREAK'] as const).map((s) => (
          <Button
            key={s}
            onClick={() => handleStatusChange(s)}
            disabled={isLoading}
            className={`flex-1 transition-all ${
              status === s ? `${getStatusColor(s)} ring-2 ring-offset-2 ring-primary` : 'bg-on-surface/10 text-on-surface hover:bg-on-surface/20'
            }`}
            variant={status === s ? 'default' : 'secondary'}
          >
            <div className={`inline-block w-2 h-2 rounded-full mr-2 ${status === s ? getStatusColor(s).split(' ')[0] : 'bg-on-surface/50'}`} />
            {getStatusLabel(s)}
          </Button>
        ))}
      </div>
      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  );
}
