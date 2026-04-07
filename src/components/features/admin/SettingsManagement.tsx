'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AlertCircle, Check, Eye, EyeOff } from 'lucide-react';

interface AppSettings {
  id: string;
  appName: string;
  googleMapsApiKey: string | null;
  stripePublishableKey: string | null;
  maintenanceMode: boolean;
  maintenanceMessage: string | null;
}

export function SettingsManagement() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [formData, setFormData] = useState<Partial<AppSettings>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings');
        if (!res.ok) {
          throw new Error('Failed to fetch settings');
        }
        const data = await res.json();
        setSettings(data);
        setFormData({
          appName: data.appName,
          googleMapsApiKey: '',
          maintenanceMode: data.maintenanceMode,
          maintenanceMessage: data.maintenanceMessage,
        });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading settings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSuccess(false);
      setError(null);

      const payload: any = {
        appName: formData.appName,
        maintenanceMode: formData.maintenanceMode,
        maintenanceMessage: formData.maintenanceMessage,
      };

      // Only send API key if it was changed (not empty string)
      if (formData.googleMapsApiKey && formData.googleMapsApiKey !== '') {
        payload.googleMapsApiKey = formData.googleMapsApiKey;
      }

      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to update settings');
      }

      await res.json();
      setSuccess(true);

      // Reset API key input
      setFormData((prev) => ({
        ...prev,
        googleMapsApiKey: '',
      }));

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alerts */}
      {error && (
        <div className="flex gap-3 p-4 bg-error/10 border border-error rounded-lg">
          <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
          <p className="text-error">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex gap-3 p-4 bg-green-500/10 border border-green-500 rounded-lg">
          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <p className="text-green-600">Paramètres mis à jour avec succès</p>
        </div>
      )}

      {/* API Keys Section */}
      <div className="bg-surface border border-on-surface/10 rounded-lg p-6 space-y-4">
        <h3 className="font-semibold text-lg text-on-surface">Clés API</h3>

        {/* Google Maps API Key */}
        <div>
          <label className="block text-sm font-semibold text-on-surface mb-2">
            Google Maps API Key
          </label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                placeholder="AIzaSy... (laisser vide pour ne pas changer)"
                value={formData.googleMapsApiKey || ''}
                onChange={(e) =>
                  handleInputChange('googleMapsApiKey', e.target.value)
                }
                className="w-full px-4 py-2 rounded-lg bg-surface-light text-on-surface placeholder-on-surface-dim border border-on-surface/10 transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-dim hover:text-on-surface"
              >
                {showApiKey ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          {settings?.googleMapsApiKey && (
            <p className="text-xs text-green-600 mt-1">
              ✓ Clé actuellement configurée
            </p>
          )}
          <p className="text-xs text-on-surface-dim mt-2">
            Laissez vide pour conserver la clé actuelle
          </p>
        </div>
      </div>

      {/* App Settings Section */}
      <div className="bg-surface border border-on-surface/10 rounded-lg p-6 space-y-4">
        <h3 className="font-semibold text-lg text-on-surface">
          Paramètres de l'application
        </h3>

        <div>
          <label className="block text-sm font-semibold text-on-surface mb-2">
            Nom de l'application
          </label>
          <Input
            type="text"
            value={formData.appName || ''}
            onChange={(e) => handleInputChange('appName', e.target.value)}
            placeholder="Taxi Leblanc"
          />
        </div>

        {/* Maintenance Mode */}
        <div className="border-t border-on-surface/10 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1">
                Mode maintenance
              </label>
              <p className="text-xs text-on-surface-dim">
                Désactiver l'application pour la maintenance
              </p>
            </div>
            <button
              onClick={() =>
                handleInputChange(
                  'maintenanceMode',
                  !formData.maintenanceMode
                )
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.maintenanceMode
                  ? 'bg-error'
                  : 'bg-on-surface/20'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.maintenanceMode
                    ? 'translate-x-6'
                    : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Maintenance Message */}
        {formData.maintenanceMode && (
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              Message de maintenance
            </label>
            <textarea
              value={formData.maintenanceMessage || ''}
              onChange={(e) =>
                handleInputChange('maintenanceMessage', e.target.value)
              }
              placeholder="Message affiché aux utilisateurs pendant la maintenance"
              rows={4}
              className="w-full px-4 py-2 rounded-lg bg-surface-light text-on-surface placeholder-on-surface-dim border border-on-surface/10 transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          isLoading={isSaving}
          size="lg"
        >
          Enregistrer les paramètres
        </Button>
      </div>

      {/* Info Box */}
      <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
        <p className="text-sm text-on-surface-dim">
          <strong>Note:</strong> Les clés API ne sont pas affichées pour des raisons de sécurité.
          Laissez le champ vide si vous ne souhaitez pas modifier la clé actuelle.
        </p>
      </div>
    </div>
  );
}
