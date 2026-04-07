'use client';

import { ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../Button';
import { CalendarBooking } from '@/lib/hooks/useCalendarData';

interface CalendarMonthProps {
  bookings: CalendarBooking[];
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onDaySelect: (date: Date) => void;
  renderStatusDot: (status: string) => ReactNode;
}

const DAYS_OF_WEEK = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

function getBookingsForDay(bookings: CalendarBooking[], date: Date): CalendarBooking[] {
  return bookings.filter((booking) => {
    const bookingDate = new Date(booking.scheduledAt || booking.createdAt);
    return (
      bookingDate.getDate() === date.getDate() &&
      bookingDate.getMonth() === date.getMonth() &&
      bookingDate.getFullYear() === date.getFullYear()
    );
  });
}

function getDaysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function getFirstDayOfMonth(date: Date): number {
  // Returns 0 for Monday, 6 for Sunday (Intl.DateTimeFormat locale)
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  return firstDay === 0 ? 6 : firstDay - 1;
}

export function CalendarMonth({
  bookings,
  currentDate,
  onPrevMonth,
  onNextMonth,
  onDaySelect,
  renderStatusDot,
}: CalendarMonthProps) {
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const days: (number | null)[] = Array(firstDayOfMonth).fill(null);

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const monthName = currentDate.toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-4">
      {/* Header with month and navigation */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-on-surface capitalize">{monthName}</h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onPrevMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onNextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="bg-surface border border-on-surface/10 rounded-lg overflow-hidden">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-0 border-b border-on-surface/10 bg-surface-light">
          {DAYS_OF_WEEK.map((day) => (
            <div
              key={day}
              className="px-4 py-3 text-center font-semibold text-sm text-on-surface-dim"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-0">
          {days.map((day, idx) => {
            const isCurrentMonth = day !== null;
            const date = isCurrentMonth
              ? new Date(currentDate.getFullYear(), currentDate.getMonth(), day as number)
              : null;
            const dayBookings = date ? getBookingsForDay(bookings, date) : [];
            const isToday =
              date &&
              date.toDateString() === new Date().toDateString();

            return (
              <div
                key={idx}
                onClick={() => {
                  if (date) onDaySelect(date);
                }}
                className={`
                  min-h-[120px] p-3 border-r border-b border-on-surface/10 cursor-pointer transition-colors
                  ${!isCurrentMonth ? 'bg-surface-light' : 'hover:bg-surface-light/50'}
                  ${isToday ? 'bg-primary/5' : ''}
                `}
              >
                {isCurrentMonth && (
                  <>
                    <div
                      className={`text-sm font-semibold mb-2 ${
                        isToday ? 'text-primary' : 'text-on-surface'
                      }`}
                    >
                      {day}
                    </div>
                    {/* Status dots */}
                    <div className="space-y-1">
                      {dayBookings.slice(0, 3).map((booking) => (
                        <div key={booking.id} className="flex items-center gap-1">
                          {renderStatusDot(booking.status)}
                          <span className="text-xs text-on-surface-dim truncate">
                            {booking.pickupAddress.split(',')[0]}
                          </span>
                        </div>
                      ))}
                      {dayBookings.length > 3 && (
                        <div className="text-xs text-on-surface-dim font-semibold">
                          +{dayBookings.length - 3} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
