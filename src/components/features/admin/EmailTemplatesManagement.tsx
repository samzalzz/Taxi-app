'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { interpolateTemplate } from '@/lib/email/templateUtils';

interface EmailTemplateSettings {
  bookingConfirmationSubject: string;
  bookingConfirmationBody: string;
  bookingEmailSignature: string;
}

const TEMPLATE_VARIABLES = [
  'clientName',
  'pickupAddress',
  'dropoffAddress',
  'price',
  'bookingId',
  'date',
  'distance',
  'signature',
];

const EXAMPLE_VALUES = {
  clientName: 'Jean Dupont',
  pickupAddress: '5 rue de la Paix, 75000 Paris',
  dropoffAddress: 'Aéroport CDG Terminal 2, 95700 Roissy',
  price: '45.50',
  bookingId: 'AB12CD34',
  date: 'lundi 7 avril 2026 à 14:30',
  distance: '28.3',
  signature: '— Taxi Leblanc\nnoreply@taxileblanc.fr',
};

export function EmailTemplatesManagement() {
  const [formData, setFormData] = useState<EmailTemplateSettings>({
    bookingConfirmationSubject: '',
    bookingConfirmationBody: '',
    bookingEmailSignature: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/admin/settings');
        if (!res.ok) throw new Error('Failed to fetch settings');
        const data = await res.json();
        setFormData({
          bookingConfirmationSubject: data.bookingConfirmationSubject,
          bookingConfirmationBody: data.bookingConfirmationBody,
          bookingEmailSignature: data.bookingEmailSignature,
        });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSuccess(false);
    setError(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error ?? 'Erreur lors de la sauvegarde');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-on-surface-dim text-sm">Chargement...</div>;
  }

  const previewSubject = interpolateTemplate(formData.bookingConfirmationSubject, EXAMPLE_VALUES);
  const previewBody = interpolateTemplate(formData.bookingConfirmationBody, EXAMPLE_VALUES);

  return (
    <div className="space-y-6 rounded-lg border border-on-surface/10 p-6 bg-surface">
      <div>
        <h2 className="text-xl font-semibold text-on-surface mb-2">Emails de notification</h2>
        <p className="text-sm text-on-surface-dim">
          Personnalisez les emails de confirmation de réservation envoyés à vos clients
        </p>
      </div>

      {error && (
        <div className="flex gap-3 p-4 bg-error/10 border border-error/20 rounded-lg">
          <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
          <p className="text-error text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex gap-3 p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-primary text-sm">Paramètres sauvegardés avec succès</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-on-surface mb-2">
            Objet de l'email
          </label>
          <input
            type="text"
            value={formData.bookingConfirmationSubject}
            onChange={(e) =>
              setFormData({ ...formData, bookingConfirmationSubject: e.target.value })
            }
            className="w-full px-4 py-2 rounded-lg bg-surface-light text-on-surface placeholder-on-surface-dim border border-on-surface/10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Confirmation de votre réservation"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-on-surface mb-2">
            Corps de l'email
          </label>
          <textarea
            value={formData.bookingConfirmationBody}
            onChange={(e) =>
              setFormData({ ...formData, bookingConfirmationBody: e.target.value })
            }
            className="w-full px-4 py-2 rounded-lg bg-surface-light text-on-surface placeholder-on-surface-dim border border-on-surface/10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
            rows={12}
            placeholder="Bonjour {{clientName}}..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-on-surface mb-2">
            Signature
          </label>
          <textarea
            value={formData.bookingEmailSignature}
            onChange={(e) =>
              setFormData({ ...formData, bookingEmailSignature: e.target.value })
            }
            className="w-full px-4 py-2 rounded-lg bg-surface-light text-on-surface placeholder-on-surface-dim border border-on-surface/10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
            rows={3}
            placeholder="— Taxi Leblanc"
          />
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-on-surface mb-3">Variables disponibles :</p>
        <div className="flex flex-wrap gap-2">
          {TEMPLATE_VARIABLES.map((variable) => (
            <span
              key={variable}
              className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono cursor-help"
              title={`Remplacer par: ${EXAMPLE_VALUES[variable as keyof typeof EXAMPLE_VALUES]}`}
            >
              {`{{${variable}}}`}
            </span>
          ))}
        </div>
      </div>

      {showPreview && (
        <div className="rounded-lg bg-surface-light border border-on-surface/10 p-4 space-y-4">
          <div>
            <p className="text-xs font-semibold text-on-surface-dim uppercase mb-2">Aperçu - Objet</p>
            <p className="text-sm text-on-surface p-3 bg-surface rounded whitespace-pre-wrap break-words">
              {previewSubject}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-on-surface-dim uppercase mb-2">Aperçu - Corps</p>
            <p className="text-sm text-on-surface p-3 bg-surface rounded font-mono whitespace-pre-wrap break-words">
              {previewBody}
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? 'Masquer' : 'Aperçu'}
        </Button>
        <Button
          type="button"
          onClick={handleSave}
          isLoading={isSaving}
        >
          Enregistrer
        </Button>
      </div>
    </div>
  );
}
