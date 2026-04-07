'use client';

import { useState, useEffect } from 'react';
import { FileText, Download, X, Loader } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CpamVoucherModalProps {
  bookingId: string;
  isOpen: boolean;
  onClose: () => void;
  voucherExists: boolean;
}

/**
 * Modal for managing CPAM transport vouchers
 */
export function CpamVoucherModal({
  bookingId,
  isOpen,
  onClose,
  voucherExists,
}: CpamVoucherModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voucher, setVoucher] = useState<any>(null);
  const [prescriptionRef, setPrescriptionRef] = useState('');
  const [patientName, setPatientName] = useState('');
  const [cpamOrganism, setCpamOrganism] = useState('');

  const loadVoucher = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/bookings/${bookingId}/cpam-voucher`);
      if (!response.ok) throw new Error('Failed to load voucher');
      const data = await response.json();
      setVoucher(data.voucher);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading voucher');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && voucherExists) {
      loadVoucher();
    }
  }, [isOpen, voucherExists, bookingId]);

  const createVoucher = async () => {
    try {
      setIsGenerating(true);
      setError(null);
      const response = await fetch(`/api/bookings/${bookingId}/cpam-voucher`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prescriptionRef,
          patientName,
          cpamOrganism,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create voucher');
      }

      const data = await response.json();
      setVoucher(data.voucher);
      setPrescriptionRef('');
      setPatientName('');
      setCpamOrganism('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating voucher');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadVoucher = async () => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/cpam-voucher/download`);
      if (!response.ok) throw new Error('Failed to download voucher');

      const html = await response.text();
      const blob = new Blob([html], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bon-transport-${voucher.voucherNumber}.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error downloading voucher');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-on-surface/10">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-on-surface">
              Bon de Transport CPAM
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-dim hover:text-on-surface"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="w-5 h-5 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          ) : voucher ? (
            <div className="space-y-4">
              <div className="p-4 bg-surface-light rounded-lg space-y-3">
                <div>
                  <p className="text-xs text-on-surface-dim uppercase">
                    Numéro de Bon
                  </p>
                  <p className="text-lg font-semibold text-on-surface">
                    {voucher.voucherNumber}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-on-surface-dim uppercase">
                    Statut
                  </p>
                  <p className="text-sm text-on-surface capitalize">
                    {voucher.status}
                  </p>
                </div>
                {voucher.generatedAt && (
                  <div>
                    <p className="text-xs text-on-surface-dim uppercase">
                      Généré
                    </p>
                    <p className="text-sm text-on-surface">
                      {new Date(voucher.generatedAt).toLocaleDateString(
                        'fr-FR'
                      )}
                    </p>
                  </div>
                )}
              </div>

              <Button
                onClick={downloadVoucher}
                className="w-full flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Télécharger le bon
              </Button>
            </div>
          ) : voucherExists ? (
            <div className="text-center py-8">
              <Loader className="w-5 h-5 animate-spin text-primary mx-auto mb-4" />
              <p className="text-on-surface-dim">
                Chargement du bon de transport...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-on-surface-dim">
                Créez un bon de transport pour cette course CPAM
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">
                    Référence Ordonnance (optionnel)
                  </label>
                  <input
                    type="text"
                    value={prescriptionRef}
                    onChange={(e) => setPrescriptionRef(e.target.value)}
                    placeholder="Ex: CPAM-XXXXX-XXXXX"
                    className="w-full px-3 py-2 bg-on-surface/5 border border-on-surface/10 rounded-lg text-on-surface placeholder-on-surface-dim focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">
                    Nom du Patient (optionnel)
                  </label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Ex: Jean Dupont"
                    className="w-full px-3 py-2 bg-on-surface/5 border border-on-surface/10 rounded-lg text-on-surface placeholder-on-surface-dim focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">
                    Code Organisme CPAM (optionnel)
                  </label>
                  <input
                    type="text"
                    value={cpamOrganism}
                    onChange={(e) => setCpamOrganism(e.target.value)}
                    placeholder="Ex: 75056"
                    className="w-full px-3 py-2 bg-on-surface/5 border border-on-surface/10 rounded-lg text-on-surface placeholder-on-surface-dim focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <Button
                onClick={createVoucher}
                isLoading={isGenerating}
                disabled={isGenerating}
                className="w-full"
              >
                Générer le bon
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-on-surface/10 flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
}
