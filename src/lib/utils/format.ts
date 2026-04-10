const EUR = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
});

export function formatPrice(amount: number): string {
  return EUR.format(amount);
}

const DATE_TIME_LONG = new Intl.DateTimeFormat('fr-FR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

const DATE_SHORT = new Intl.DateTimeFormat('fr-FR', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

const DATE_TIME_COMPACT = new Intl.DateTimeFormat('fr-FR', {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

const DATE_TIME_WEEKDAY = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

export function formatDateTime(date: string | Date): string {
  return DATE_TIME_LONG.format(typeof date === 'string' ? new Date(date) : date);
}

export function formatDateShort(date: string | Date): string {
  return DATE_SHORT.format(typeof date === 'string' ? new Date(date) : date);
}

export function formatDateCompact(date: string | Date): string {
  return DATE_TIME_COMPACT.format(typeof date === 'string' ? new Date(date) : date);
}

export function formatDateWeekday(date: string | Date): string {
  return DATE_TIME_WEEKDAY.format(typeof date === 'string' ? new Date(date) : date);
}
