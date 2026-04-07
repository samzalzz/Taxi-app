import UsersManagement from '@/components/features/admin/UsersManagement';

export default function UtilisateursPage() {
  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-white mb-2">
          Gestion des Utilisateurs
        </h1>
        <p className="text-lg text-gray-400">
          Créer et gérer les administrateurs, afficher tous les utilisateurs
        </p>
      </div>

      <UsersManagement />
    </div>
  );
}
