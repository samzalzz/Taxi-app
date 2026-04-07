'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  cpamByDefault?: boolean;
}

interface ProfileFormProps {
  user: User;
  onSuccess?: () => void;
}

export function ProfileForm({ user, onSuccess }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    phone: user.phone || '',
    cpamByDefault: user.cpamByDefault ?? false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update profile');
      }

      setSuccess(true);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nom complet"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <Input
        label="Email"
        type="email"
        value={user.email}
        disabled
        helpText="L'email ne peut pas être modifié"
      />

      <Input
        label="Téléphone"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        placeholder="+33 6 12 34 56 78"
        autoComplete="tel"
      />

      <div className="flex items-center justify-between p-4 border border-on-surface/10 rounded-lg bg-surface-light">
        <div>
          <p className="text-sm font-medium text-on-surface">Transport CPAM par défaut</p>
          <p className="text-xs text-on-surface-dim">Toutes mes réservations seront marquées comme transport CPAM</p>
        </div>
        <input
          type="checkbox"
          name="cpamByDefault"
          checked={formData.cpamByDefault}
          onChange={handleChange}
          className="w-5 h-5 rounded accent-primary cursor-pointer"
        />
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
          <p className="text-sm text-green-500">✓ Profil mis à jour avec succès</p>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        isLoading={isSubmitting}
        disabled={isSubmitting}
        fullWidth
      >
        Enregistrer les modifications
      </Button>
    </form>
  );
}
