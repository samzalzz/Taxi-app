'use client';

import { useEffect, useState } from 'react';

interface ApiUsageRecord {
  endpoint: string;
  method: string;
  count: number;
  updatedAt: string;
}

export function ApiUsageManagement() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState<ApiUsageRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data when month/year changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/admin/api-usage?month=${month}&year=${year}`,
          { credentials: 'include' }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch API usage data');
        }

        const result = await response.json();
        setData(result.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [month, year]);

  const totalCalls = data.reduce((sum, record) => sum + record.count, 0);

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
  ];

  const handlePreviousMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const handleToday = () => {
    const now = new Date();
    setMonth(now.getMonth() + 1);
    setYear(now.getFullYear());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-on-surface mb-2">
          Utilisation des APIs
        </h1>
        <p className="text-on-surface-dim">
          Suivi du nombre d&apos;appels aux différents endpoints API par mois
        </p>
      </div>

      {/* Month/Year Selector */}
      <div className="bg-surface border border-on-surface/10 rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handlePreviousMonth}
              className="px-4 py-2 text-on-surface hover:bg-surface-light rounded-lg transition-colors"
            >
              ← Mois précédent
            </button>

            <div className="text-center min-w-[200px]">
              <p className="text-sm text-on-surface-dim">Période sélectionnée</p>
              <p className="text-xl font-semibold text-on-surface">
                {monthNames[month - 1]} {year}
              </p>
            </div>

            <button
              onClick={handleNextMonth}
              className="px-4 py-2 text-on-surface hover:bg-surface-light rounded-lg transition-colors"
            >
              Mois suivant →
            </button>
          </div>

          <button
            onClick={handleToday}
            className="px-4 py-2 bg-primary text-background rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            Aujourd&apos;hui
          </button>
        </div>
      </div>

      {/* Total Calls Card */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
        <p className="text-sm text-on-surface-dim uppercase font-semibold mb-2">
          Total appels API
        </p>
        <p className="text-4xl font-bold text-primary">
          {isLoading ? '...' : totalCalls.toLocaleString('fr-FR')}
        </p>
        <p className="text-xs text-on-surface-dim mt-2">
          pour {monthNames[month - 1]} {year}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-600">
          <p className="font-semibold">Erreur</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Data Table */}
      {isLoading ? (
        <div className="bg-surface border border-on-surface/10 rounded-lg p-8 text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
          </div>
          <p className="text-on-surface-dim mt-4">Chargement des données...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="bg-surface border border-on-surface/10 rounded-lg p-8 text-center">
          <p className="text-on-surface-dim">
            Aucune donnée disponible pour cette période
          </p>
        </div>
      ) : (
        <div className="bg-surface border border-on-surface/10 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-on-surface/10 bg-surface-light">
                <th className="px-6 py-4 text-left text-sm font-semibold text-on-surface">
                  Endpoint
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-on-surface">
                  Méthode
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-on-surface">
                  Appels
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-on-surface">
                  Dernière mise à jour
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-on-surface/10">
              {data.map((record, index) => (
                <tr
                  key={`${record.endpoint}-${record.method}`}
                  className={index % 2 === 0 ? '' : 'bg-surface-light/50'}
                >
                  <td className="px-6 py-4 text-on-surface font-mono text-sm">
                    {record.endpoint}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded text-sm font-semibold">
                      {record.method}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-on-surface">
                    {record.count.toLocaleString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 text-on-surface-dim text-sm">
                    {new Date(record.updatedAt).toLocaleString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
