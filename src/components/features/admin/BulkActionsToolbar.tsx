'use client';

import { Loader, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface BulkAction {
  label: string;
  action: string;
  icon?: React.ReactNode;
  color?: 'primary' | 'warning' | 'error';
  requiresConfirm?: boolean;
  getData?: () => Record<string, any>;
}

interface BulkActionsToolbarProps {
  selectedCount: number;
  isLoading: boolean;
  actions: BulkAction[];
  onAction: (action: string, data?: Record<string, any>) => Promise<void>;
  onClear: () => void;
}

/**
 * Reusable bulk actions toolbar for admin pages.
 * Displays selected count and action buttons.
 */
export function BulkActionsToolbar({
  selectedCount,
  isLoading,
  actions,
  onAction,
  onClear,
}: BulkActionsToolbarProps) {
  const handleAction = async (action: BulkAction) => {
    if (action.requiresConfirm) {
      const confirmed = window.confirm(
        `Êtes-vous sûr de vouloir "${action.label}" ces ${selectedCount} élément(s)?`
      );
      if (!confirmed) return;
    }

    const data = action.getData?.();
    await onAction(action.action, data);
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg space-y-3 z-40">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span className="font-semibold">
            {selectedCount} sélectionné{selectedCount > 1 ? '(s)' : ''}
          </span>
        </div>
        <button
          onClick={onClear}
          className="text-sm opacity-75 hover:opacity-100 transition-opacity"
        >
          Désélectionner tout
        </button>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <Button
            key={action.action}
            onClick={() => handleAction(action)}
            disabled={isLoading}
            size="sm"
            variant={
              action.color === 'error'
                ? 'danger'
                : action.color === 'warning'
                  ? 'secondary'
                  : 'primary'
            }
            className={
              action.color === 'error'
                ? 'bg-error hover:bg-error/90 text-error-foreground'
                : action.color === 'warning'
                  ? 'bg-warning hover:bg-warning/90 text-warning-foreground'
                  : ''
            }
          >
            {isLoading ? (
              <Loader className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              action.icon && <span className="mr-2">{action.icon}</span>
            )}
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
