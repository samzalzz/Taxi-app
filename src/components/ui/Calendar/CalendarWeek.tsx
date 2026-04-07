'use client';

import { ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../Button';
import { CalendarBooking } from '@/lib/hooks/useCalendarData';

interface CalendarWeekProps {
  bookings: CalendarBooking[];
  currentDate: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onDaySelect: (date: Date) => void;
  renderStatusDot: (status: string) => ReactNode;
}

const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 06:00 to 23:00
const DAYS_OF_WEEK = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - (day === 0 ? 6 : day - 1);
  return new Date(d.setDate(diff));
}

function getWeekDays(weekStart: Date): Date[] {
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    days.push(date);
  }
  return days;
}

function getBookingsForHour(
  bookings: CalendarBooking[],
  date: Date,
  hour: number
): CalendarBooking[] {
  return bookings.filter((booking) => {
    if (!booking.scheduledAt) return false;

    const bookingDate = new Date(booking.scheduledAt);
    return (
      bookingDate.getDate() === date.getDate() &&
      bookingDate.getMonth() === date.getMonth() &&
      bookingDate.getFullYear() === date.getFullYear() &&
      bookingDate.getHours() === hour
    );
  });
}

function getUnscheduledBookings(bookings: CalendarBooking[]): CalendarBooking[] {
  return bookings.filter((booking) => !booking.scheduledAt);
}

export function CalendarWeek({
  bookings,
  currentDate,
  onPrevWeek,
  onNextWeek,
  onDaySelect,
  renderStatusDot,
}: CalendarWeekProps) {
  const weekStart = getWeekStart(currentDate);
  const weekDays = getWeekDays(weekStart);
  const unscheduledBookings = getUnscheduledBookings(bookings);

  const weekLabel = `${weekStart.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  })} - ${weekDays[6].toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })}`;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-on-surface">{weekLabel}</h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onPrevWeek}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onNextWeek}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Unscheduled bookings section */}
      {unscheduledBookings.length > 0 && (
        <div className="bg-surface border border-on-surface/10 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-on-surface-dim uppercase mb-3">
            Non planifiées
          </h3>
          <div className="space-y-2">
            {unscheduledBookings.map((booking) => {
              const bookingDate = new Date(booking.createdAt);
              return (
                <div
                  key={booking.id}
                  onClick={() => onDaySelect(bookingDate)}
                  className="flex items-start gap-2 p-2 bg-surface-light rounded cursor-pointer hover:bg-surface-light/70 transition-colors"
                >
                  {renderStatusDot(booking.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-on-surface truncate">
                      {booking.pickupAddress.split(',')[0]}
                    </p>
                    <p className="text-xs text-on-surface-dim">
                      {booking.price.toFixed(2)}€
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Hourly grid */}
      <div className="bg-surface border border-on-surface/10 rounded-lg overflow-hidden">
        {/* Days of week header */}
        <div className="grid grid-cols-8 gap-0 border-b border-on-surface/10 bg-surface-light sticky top-0 z-10">
          <div className="col-span-1 px-3 py-3 border-r border-on-surface/10 text-xs font-semibold text-on-surface-dim">
            Heure
          </div>
          {weekDays.map((date, idx) => {
            const isToday = date.toDateString() === new Date().toDateString();
            return (
              <div
                key={idx}
                className={`
                  col-span-1 px-2 py-3 text-center border-r border-on-surface/10
                  ${isToday ? 'bg-primary/10' : ''}
                `}
              >
                <p className="text-xs font-semibold text-on-surface">
                  {DAYS_OF_WEEK[idx]}
                </p>
                <p className={`text-xs ${isToday ? 'text-primary font-bold' : 'text-on-surface-dim'}`}>
                  {date.getDate()}
                </p>
              </div>
            );
          })}
        </div>

        {/* Hours rows */}
        {HOURS.map((hour) => (
          <div key={hour} className="grid grid-cols-8 gap-0 border-b border-on-surface/10">
            {/* Hour label */}
            <div className="col-span-1 px-3 py-4 border-r border-on-surface/10 text-xs font-semibold text-on-surface-dim bg-surface-light">
              {String(hour).padStart(2, '0')}:00
            </div>

            {/* Day cells */}
            {weekDays.map((date, dayIdx) => {
              const dayBookings = getBookingsForHour(bookings, date, hour);
              return (
                <div
                  key={dayIdx}
                  className="col-span-1 px-2 py-4 border-r border-on-surface/10 min-h-[80px] bg-surface-light/30 hover:bg-surface-light/50 transition-colors"
                >
                  <div className="space-y-1">
                    {dayBookings.map((booking) => (
                      <div
                        key={booking.id}
                        onClick={() => onDaySelect(date)}
                        className="text-xs bg-surface rounded px-2 py-1 cursor-pointer hover:bg-surface/80 transition-colors truncate"
                        title={booking.pickupAddress}
                      >
                        {renderStatusDot(booking.status)}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
