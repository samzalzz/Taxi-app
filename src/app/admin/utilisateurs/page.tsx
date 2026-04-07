'use client';

import { useEffect, useState } from 'react';
import { Mail, Phone, Calendar } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  role: string;
  createdAt: string;
}

export default function UtilisateursPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const limit = 50;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/admin/users?limit=${limit}`);
        if (!res.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [limit]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-500/10 text-red-400';
      case 'DRIVER':
        return 'bg-blue-500/10 text-blue-400';
      default:
        return 'bg-green-500/10 text-green-400';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-on-surface mb-2">
          Utilisateurs
        </h1>
        <p className="text-lg text-on-surface-dim">
          Gestion complète des comptes utilisateurs
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin text-4xl mb-4">⟳</div>
          <p className="text-on-surface-dim">Chargement des utilisateurs...</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-red-500">{error}</p>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-on-surface-dim">Aucun utilisateur trouvé</p>
        </div>
      ) : (
        <div className="space-y-4">
          {users.map(user => (
            <div
              key={user.id}
              className="border border-on-surface/10 rounded-lg p-6 hover:border-on-surface/20 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-on-surface">{user.name}</h3>
                  <p className="text-xs text-on-surface-dim">ID: {user.id.slice(0, 8)}...</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRoleBadgeColor(user.role)}`}>
                  {user.role}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-on-surface-dim" />
                  <span className="text-on-surface-dim">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-on-surface-dim" />
                    <span className="text-on-surface-dim">{user.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-on-surface-dim" />
                  <span className="text-on-surface-dim">{formatDate(user.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
