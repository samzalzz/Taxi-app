'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/Toast';
import { Input } from '@/components/ui/Input';

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'CLIENT' | 'DRIVER' | 'ADMIN';
  createdAt: string;
}

export default function UsersManagement() {
  const { error: showError, success: showSuccess } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [roleFilter, setRoleFilter] = useState<'CLIENT' | 'DRIVER' | 'ADMIN' | 'ALL'>('ALL');
  const [searchEmail, setSearchEmail] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const limit = 20;

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter]);

  async function fetchUsers() {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      query.append('page', page.toString());
      query.append('limit', limit.toString());

      if (roleFilter !== 'ALL') {
        query.append('role', roleFilter);
      }

      const response = await fetch(`/api/admin/users?${query}`);
      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
        setTotal(data.total);
      } else {
        showError(data.error || 'Failed to fetch users');
      }
    } catch (error) {
      showError('Error fetching users');
    } finally {
      setLoading(false);
    }
  }

  async function updateUserRole(userId: string, newRole: 'CLIENT' | 'DRIVER' | 'ADMIN') {
    try {
      setUpdatingId(userId);
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await response.json();

      if (response.ok) {
        showSuccess(`User role updated to ${newRole}`);
        fetchUsers();
      } else {
        showError(data.error || 'Failed to update role');
      }
    } catch (error) {
      showError('Error updating user role');
    } finally {
      setUpdatingId(null);
    }
  }

  const filteredUsers = users.filter(user =>
    searchEmail ? user.email.toLowerCase().includes(searchEmail.toLowerCase()) : true
  );

  if (loading && users.length === 0) {
    return <div className="text-center py-8">Chargement des utilisateurs...</div>;
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Gestion des Utilisateurs</h2>
          <p className="text-gray-400 mt-1">Total: {total} utilisateurs</p>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Rechercher par email..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {(['ALL', 'CLIENT', 'DRIVER', 'ADMIN'] as const).map((role) => (
              <button
                key={role}
                onClick={() => {
                  setRoleFilter(role);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded font-medium transition ${
                  roleFilter === role
                    ? 'bg-[#d4af37] text-black'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                {role === 'ALL' ? 'Tous' : role}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
        <table className="w-full">
          <thead className="bg-gray-800 border-b border-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Nom</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Rôle</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-800 transition">
                <td className="px-6 py-4 text-sm text-gray-300">{user.email}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{user.name}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === 'ADMIN'
                        ? 'bg-red-900/30 text-red-400'
                        : user.role === 'DRIVER'
                          ? 'bg-blue-900/30 text-blue-400'
                          : 'bg-gray-700 text-gray-200'
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">
                  {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-2">
                    {user.role !== 'ADMIN' && (
                      <button
                        onClick={() => updateUserRole(user.id, 'ADMIN')}
                        disabled={updatingId === user.id}
                        className="px-3 py-1 bg-[#d4af37] text-black text-xs font-medium rounded hover:bg-yellow-500 disabled:opacity-50 transition"
                      >
                        {updatingId === user.id ? 'Mise à jour...' : 'Promouvoir'}
                      </button>
                    )}
                    {user.role === 'ADMIN' && (
                      <button
                        onClick={() => updateUserRole(user.id, 'CLIENT')}
                        disabled={updatingId === user.id}
                        className="px-3 py-1 bg-gray-600 text-white text-xs font-medium rounded hover:bg-gray-500 disabled:opacity-50 transition"
                      >
                        {updatingId === user.id ? 'Mise à jour...' : 'Rétrograder'}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
        >
          ← Précédent
        </button>

        <div className="text-gray-400">
          Page {page} sur {totalPages}
        </div>

        <button
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
        >
          Suivant →
        </button>
      </div>
    </div>
  );
}
