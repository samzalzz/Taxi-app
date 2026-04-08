'use client';

import { useState, useMemo } from 'react';
import { CalendarMonth } from '@/components/ui/Calendar/CalendarMonth';
import { CalendarWeek } from '@/components/ui/Calendar/CalendarWeek';
import { CalendarDayPanel } from '@/components/ui/Calendar/CalendarDayPanel';
import { useCalendarData } from '@/lib/hooks/useCalendarData';

type ViewMode = 'month' | 'week';

const STATUS_COLORS: Record<string, { dot: string; badge: string; label: string }> = {
  PENDING: {
    dot: '🟡',
    badge: 'bg-yellow-100 text-yellow-800',
    label: 'En attente',
  },
  CONFIRMED: {
    dot: '🟢',
    badge: 'bg-green-100 text-green-800',
    label: 'Confirmée',
  },
  DRIVER_ARRIVED: {
    dot: '🟢',
    badge: 'bg-green-100 text-green-800',
    label: 'Arrivé',
  },
  IN_PROGRESS: {
    dot: '🔵',
    badge: 'bg-blue-100 text-blue-800',
    label: 'En cours',
  },
  COMPLETED: {
    dot: '⚫',
    badge: 'bg-gray-100 text-gray-800',
    label: 'Terminée',
  },
  CANCELLED: {
    dot: '⚫',
    badge: 'bg-gray-100 text-gray-800',
    label: 'Annulée',
  },
};

export function DriverCalendarView() {
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  // Calculate date range based on view mode
  const dateRange = useMemo(() => {
    if (viewMode === 'month') {
      const from = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const to = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      return { from, to };
    } else {
      // Week view: Monday to Sunday
      const weekStart = new Date(currentDate);
      const day = currentDate.getDay();
      const diff = currentDate.getDate() - (day === 0 ? 6 : day - 1);
      weekStart.setDate(diff);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      return { from: weekStart, to: weekEnd };
    }
  }, [currentDate, viewMode]);

  // Fetch bookings
  const { bookings, isLoading, error } = useCalendarData(
    '/api/driver/calendar',
    dateRange
  );

  // Handle month navigation
  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
    setSelectedDay(null);
  };

  // Handle week navigation
  const handlePrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
    setSelectedDay(null);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
    setSelectedDay(null);
  };

  const renderStatusDot = (status: string) => {
    return <span className="text-lg">{STATUS_COLORS[status]?.dot || '⚪'}</span>;
  };

  const renderStatusBadge = (status: string) => {
    const config = STATUS_COLORS[status];
    if (!config) return null;

    return (
      <span className={`text-xs font-medium px-2 py-1 rounded ${config.badge}`}>
        {config.label}
      </span>
    );
  };

  if (error) {
    return (
      <div className="bg-error/10 border border-error rounded-lg p-4 text-error">
        Erreur lors du chargement du calendrier: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* View toggle */}
        <div className="flex gap-2 bg-surface border border-on-surface/10 rounded-lg p-1">
          <button
            onClick={() => { setViewMode('month'); setSelectedDay(null); }}
            className={`px-4 py-2 rounded transition-colors text-sm font-medium ${
              viewMode === 'month'
                ? 'bg-primary text-primary-foreground'
                : 'text-on-surface hover:bg-surface-light'
            }`}
          >
            Mois
          </button>
          <button
            onClick={() => { setViewMode('week'); setSelectedDay(null); }}
            className={`px-4 py-2 rounded transition-colors text-sm font-medium ${
              viewMode === 'week'
                ? 'bg-primary text-primary-foreground'
                : 'text-on-surface hover:bg-surface-light'
            }`}
          >
            Semaine
          </button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 text-sm">
          {[
            { dot: '🟡', label: 'En attente' },
            { dot: '🟢', label: 'Confirmée' },
            { dot: '🔵', label: 'En cours' },
            { dot: '⚫', label: 'Terminée' },
          ].map(({ dot, label }) => (
            <div key={label} className="flex items-center gap-1">
              <span className="text-lg">{dot}</span>
              <span className="text-on-surface-dim">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
        </div>
      )}

      {!isLoading && (
        <div className="relative">
          {/* Calendar view */}
          {viewMode === 'month' ? (
            <CalendarMonth
              bookings={bookings}
              currentDate={currentDate}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onDaySelect={setSelectedDay}
              renderStatusDot={renderStatusDot}
            />
          ) : (
            <CalendarWeek
              bookings={bookings}
              currentDate={currentDate}
              onPrevWeek={handlePrevWeek}
              onNextWeek={handleNextWeek}
              onDaySelect={setSelectedDay}
              renderStatusDot={renderStatusDot}
            />
          )}

          {/* Day panel */}
          {selectedDay && (
            <CalendarDayPanel
              date={selectedDay}
              bookings={bookings}
              onClose={() => setSelectedDay(null)}
              renderStatusBadge={renderStatusBadge}
              isAdmin={false}
            />
          )}
        </div>
      )}
    </div>
  );
}
