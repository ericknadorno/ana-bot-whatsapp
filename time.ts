import { DateTime } from 'luxon';
import * as chrono from 'chrono-node';

const TIMEZONE = 'Europe/Lisbon';

// Configurar chrono-node para português
const customChrono = chrono.pt.casual.clone();

export function parseDateTime(text: string, refDate?: Date): DateTime | null {
  const ref = refDate || new Date();
  const parsed = customChrono.parseDate(text, ref, { timezone: TIMEZONE });
  
  if (parsed) {
    return DateTime.fromJSDate(parsed, { zone: TIMEZONE });
  }
  
  return null;
}

export function nowInLisbon(): DateTime {
  return DateTime.now().setZone(TIMEZONE);
}

export function timestampToDateTime(ts: number): DateTime {
  return DateTime.fromMillis(ts, { zone: TIMEZONE });
}

export function dateTimeToTimestamp(dt: DateTime): number {
  return dt.toMillis();
}

export function formatDateTime(dt: DateTime): string {
  return dt.toFormat('dd/MM/yyyy HH:mm');
}

export function formatDate(dt: DateTime): string {
  return dt.toFormat('dd/MM/yyyy');
}

export function formatTime(dt: DateTime): string {
  return dt.toFormat('HH:mm');
}

export function isToday(dt: DateTime): boolean {
  const now = nowInLisbon();
  return dt.hasSame(now, 'day');
}

export function isTomorrow(dt: DateTime): boolean {
  const tomorrow = nowInLisbon().plus({ days: 1 });
  return dt.hasSame(tomorrow, 'day');
}

export function startOfDay(dt: DateTime): DateTime {
  return dt.startOf('day');
}

export function endOfDay(dt: DateTime): DateTime {
  return dt.endOf('day');
}

export function startOfWeek(dt: DateTime): DateTime {
  return dt.startOf('week');
}

export function endOfWeek(dt: DateTime): DateTime {
  return dt.endOf('week');
}

export function startOfMonth(dt: DateTime): DateTime {
  return dt.startOf('month');
}

export function endOfMonth(dt: DateTime): DateTime {
  return dt.endOf('month');
}

export function addMinutes(dt: DateTime, minutes: number): DateTime {
  return dt.plus({ minutes });
}

export function getRelativeLabel(dt: DateTime): string {
  if (isToday(dt)) return 'hoje';
  if (isTomorrow(dt)) return 'amanhã';
  
  const now = nowInLisbon();
  const diff = dt.diff(now, 'days').days;
  
  if (diff < 0 && diff > -7) {
    return `há ${Math.abs(Math.floor(diff))} dias`;
  }
  
  if (diff > 0 && diff < 7) {
    return `em ${Math.floor(diff)} dias`;
  }
  
  return formatDate(dt);
}
