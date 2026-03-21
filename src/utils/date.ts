import { AppConfig } from '../app.config';

const LOCALE = AppConfig.locale ?? 'en-US';

export const date = {
  // Format a Date or ISO string to "Jan 5, 2025"
  formatShort(d: Date | string) {
    const dt = typeof d === 'string' ? new Date(d) : d;
    return new Intl.DateTimeFormat(LOCALE, { year: 'numeric', month: 'short', day: 'numeric' }).format(dt);
  },

  // "January 5, 2025, 3:45 PM"
  formatLong(d: Date | string) {
    const dt = typeof d === 'string' ? new Date(d) : d;
    return new Intl.DateTimeFormat(LOCALE, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(dt);
  },

  // "3:45 PM"
  formatTime(d: Date | string) {
    const dt = typeof d === 'string' ? new Date(d) : d;
    return new Intl.DateTimeFormat(LOCALE, { hour: 'numeric', minute: '2-digit' }).format(dt);
  },

  // Add days without mutating
  addDays(d: Date | string, days: number) {
    const dt = typeof d === 'string' ? new Date(d) : new Date(d.getTime());
    dt.setDate(dt.getDate() + days);
    return dt;
  },

  // Compare only Y/M/D (ignore time)
  isSameDay(a: Date | string, b: Date | string) {
    const da = typeof a === 'string' ? new Date(a) : a;
    const db = typeof b === 'string' ? new Date(b) : b;
    return (
      da.getFullYear() === db.getFullYear() &&
      da.getMonth() === db.getMonth() &&
      da.getDate() === db.getDate()
    );
  },

  // ISO helpers
  toISO(d: Date | string) {
    const dt = typeof d === 'string' ? new Date(d) : d;
    return dt.toISOString();
  },
};
