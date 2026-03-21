// utils/timezone/helper.ts
export const getUtcOffset = (timeZone: string, date = new Date()): string => {
  try {
    const dtf = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    const parts = dtf.formatToParts(date);
    const get = (type: string) => parts.find(p => p.type === type)?.value ?? '00';

    const year = get('year');
    const month = get('month');
    const day = get('day');
    const hour = get('hour');
    const minute = get('minute');
    const second = get('second');

    const makeLocalDate = (y: string, m: string, d: string, h: string, min: string, s: string) =>
      new Date(`${y}-${m}-${d}T${h}:${min}:${s}`);

    const tzDate = makeLocalDate(year, month, day, hour, minute, second);

    const utcParts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).formatToParts(date);

    const getUtc = (type: string) => utcParts.find(p => p.type === type)?.value ?? '00';

    const utcYear = getUtc('year');
    const utcMonth = getUtc('month');
    const utcDay = getUtc('day');
    const utcHour = getUtc('hour');
    const utcMinute = getUtc('minute');
    const utcSecond = getUtc('second');

    const utcDate = makeLocalDate(utcYear, utcMonth, utcDay, utcHour, utcMinute, utcSecond);

    const diffMinutes = Math.round((tzDate.getTime() - utcDate.getTime()) / 60000);

    const sign = diffMinutes >= 0 ? '+' : '-';
    const abs = Math.abs(diffMinutes);
    const hh = String(Math.floor(abs / 60)).padStart(2, '0');
    const mm = String(abs % 60).padStart(2, '0');

    return `UTC${sign}${hh}:${mm}`;
  } catch {
    return 'UTC±00:00';
  }
};
export const getCurrentOffset = () => {
  const date = new Date();
  const minutes = date.getTimezoneOffset() * -1; // JS gives reverse sign

  const sign = minutes >= 0 ? '+' : '-';
  const abs = Math.abs(minutes);
  const hh = String(Math.floor(abs / 60)).padStart(2, '0');
  const mm = String(abs % 60).padStart(2, '0');

  return `UTC${sign}${hh}:${mm}`;
};