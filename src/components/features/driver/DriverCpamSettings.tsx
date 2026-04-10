'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function DriverCpamSettings() {
  const [isCpamApproved, setIsCpamApproved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Load initial state
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/driver/profile');
        if (!response.ok) {
          throw new Error('Failed to fetch driver profile');
        }
        const data = await response.json();
        setIsCpamApproved(data.isCpamApproved ?? false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleToggle = async (newValue: boolean) => {
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/driver/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCpamApproved: newValue }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update profile');
      }

      setIsCpamApproved(newValue);
      setSuccess(true);

      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 rounded-lg bg-surface border border-on-surface/10">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-6 rounded-lg bg-surface border border-on-surface/10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-on-surface mb-2">
              Transport CPAM
            </h3>
            <p className="text-sm text-on-surface-dim mb-4">
              Activez cette option si vous êtes agréé CPAM (Caisse Primaire d&apos;Assurance Maladie) et acceptez les transports médicaux conventionnés.
            </p>

            {isCpamApproved && (
              <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-600">
                  ✓ Vous êtes agréé CPAM
                </span>
              </div>
            )}
          </div>

          <Button
            type="button"
            onClick={() => handleToggle(!isCpamApproved)}
            disabled={isSaving}
            variant={isCpamApproved ? 'primary' : 'outline'}
            className="ml-4 whitespace-nowrap"
          >
            {isSaving ? 'Mise à jour...' : isCpamApproved ? 'Désactiver CPAM' : 'Activer CPAM'}
          </Button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <p className="text-sm text-green-600">✓ Paramètres mise à jour avec succès</p>
          </div>
        )}
      </div>

      <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
        <p className="text-xs text-on-surface-dim">
          💡 <strong>Note:</strong> Vous recevrez les courses CPAM marquées par les clients et les administrateurs sur votre tableau de bord.
        </p>
      </div>
    </div>
  );
}
