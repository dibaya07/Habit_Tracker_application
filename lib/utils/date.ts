export const DEFAULT_DATE_FALLBACK = '2026-11-13';

const MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

const WEEKDAYS_NARROW = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;
const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

export function getLocalTodayYmd(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseUtcDate(dateStr?: string): Date {
  const target = dateStr && /^\d{4}-\d{2}-\d{2}/.test(dateStr) ? dateStr.slice(0, 10) : DEFAULT_DATE_FALLBACK;
  const [yStr, mStr, dStr] = target.split('-');
  const y = Number(yStr) || 2026;
  const m = Number(mStr) || 11;
  const d = Number(dStr) || 13;
  return new Date(Date.UTC(y, m - 1, d));
}

export function addUtcDays(baseDate: Date, offsetDays: number): Date {
  return new Date(
    Date.UTC(
      baseDate.getUTCFullYear(),
      baseDate.getUTCMonth(),
      baseDate.getUTCDate() + offsetDays
    )
  );
}

export function formatUtcShortDate(date: Date): string {
  const month = MONTHS_SHORT[date.getUTCMonth()];
  const day = date.getUTCDate();
  return `${month} ${day}`;
}

export function formatUtcFullDate(date: Date): string {
  const month = MONTHS_SHORT[date.getUTCMonth()];
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  return `${month} ${day}, ${year}`;
}

export function getUtcDayNumber(date: Date): number {
  return date.getUTCDate();
}

export function getUtcWeekdayNarrow(date: Date): string {
  return WEEKDAYS_NARROW[date.getUTCDay()];
}

export function getUtcWeekdayShort(date: Date): string {
  return WEEKDAYS_SHORT[date.getUTCDay()];
}

export function getUtcMonthShort(date: Date): string {
  return MONTHS_SHORT[date.getUTCMonth()];
}
