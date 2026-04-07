'use client';

import { useEffect, useState } from 'react';
import { ProfileForm } from '@/components/features/profile/ProfileForm';
import { PasswordForm } from '@/components/features/profile/PasswordForm';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
}

export default function ProfilPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/users/me');
        if (!res.ok) {
          throw new Error('Failed to load profile');
        }
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin text-4xl mb-4">⟳</div>
        <p className="text-on-surface-dim">Chargement du profil...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-6 rounded-lg bg-red-500/10 border border-red-500/20">
        <p className="text-red-500">{error || 'Failed to load profile'}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-on-surface mb-2">
          Mon profil
        </h1>
        <p className="text-lg text-on-surface-dim">
          Gérez vos informations personnelles et votre sécurité
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Edit Profile Section */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-serif font-bold text-on-surface mb-2">
              Informations personnelles
            </h2>
            <p className="text-on-surface-dim">
              Mettez à jour votre nom et numéro de téléphone
            </p>
          </div>
          <div className="glass p-6 rounded-xl">
            <ProfileForm user={user} />
          </div>
        </div>

        {/* Change Password Section */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-serif font-bold text-on-surface mb-2">
              Sécurité
            </h2>
            <p className="text-on-surface-dim">
              Changez votre mot de passe pour sécuriser votre compte
            </p>
          </div>
          <div className="glass p-6 rounded-xl">
            <PasswordForm />
          </div>
        </div>
      </div>

      {/* User Info Display */}
      <div className="mt-12 p-6 bg-surface rounded-lg border border-on-surface/10">
        <h3 className="text-lg font-semibold text-on-surface mb-4">Informations du compte</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-on-surface-dim">Email:</span>
            <span className="text-on-surface font-mono">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-dim">Rôle:</span>
            <span className="text-on-surface font-semibold capitalize">{user.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
