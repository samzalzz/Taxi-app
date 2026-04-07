'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function AdminSetupPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminSecret: '',
  });

  async function handleCreateAdmin(e: React.FormEvent) {
    e.preventDefault();

    // Validate
    if (!formData.name || !formData.email || !formData.password) {
      toast({
        type: 'error',
        message: 'Tous les champs sont requis',
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        type: 'error',
        message: 'Les mots de passe ne correspondent pas',
      });
      return;
    }

    if (formData.password.length < 8) {
      toast({
        type: 'error',
        message: 'Le mot de passe doit contenir au moins 8 caractères',
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/admin/create-first', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          adminSecret: formData.adminSecret,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          type: 'success',
          message: 'Admin créé avec succès!',
        });
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          adminSecret: '',
        });
        // Redirect to login after success
        setTimeout(() => {
          window.location.href = '/connexion';
        }, 2000);
      } else {
        toast({
          type: 'error',
          message: data.error || 'Erreur lors de la création',
        });
      }
    } catch (error) {
      toast({
        type: 'error',
        message: 'Erreur lors de la création de l\'admin',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Configuration Admin</h1>
            <p className="text-gray-400">
              Créez le premier administrateur de Taxi Leblanc
            </p>
          </div>

          <form onSubmit={handleCreateAdmin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Nom complet
              </label>
              <Input
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Email
              </label>
              <Input
                type="email"
                placeholder="admin@taxileblanc.fr"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Mot de passe (min 8 caractères)
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Confirmer le mot de passe
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                disabled={loading}
              />
            </div>

            <div className="bg-blue-900/20 border border-blue-700/30 rounded p-4">
              <p className="text-sm text-blue-300 mb-2">
                <strong>Admin Secret:</strong> Demandez la clé secrète d'administration à votre responsable système
              </p>
              <Input
                type="password"
                placeholder="Entrez la clé secrète"
                value={formData.adminSecret}
                onChange={(e) =>
                  setFormData({ ...formData, adminSecret: e.target.value })
                }
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Création...' : 'Créer l\'administrateur'}
            </Button>
          </form>

          <div className="bg-gray-900 rounded p-4 text-sm text-gray-400">
            <p className="font-medium text-gray-300 mb-2">Instructions:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Demandez le ADMIN_SECRET à votre administrateur système</li>
              <li>Remplissez tous les champs du formulaire</li>
              <li>Cliquez sur "Créer l'administrateur"</li>
              <li>Connectez-vous avec vos identifiants</li>
              <li>Allez dans Admin → Utilisateurs pour créer d'autres admins</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
